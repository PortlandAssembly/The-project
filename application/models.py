from flask import jsonify
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import scoped_session,sessionmaker,relationship
from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    ForeignKey,
    DateTime,
    Sequence,
    Float,
    Enum
)
from index import db, bcrypt


class User(db.Model):
    __tablename__ = "user"
    id       = db.Column(db.Integer(), primary_key = True)
    name     = db.Column(db.String(255))
    email    = db.Column(db.String(255), unique    = True)
    active   = db.Column(db.Boolean())
    role     = db.Column(db.Enum("responder", "verifier", "admin", name='roles'))
    password = db.Column(db.String(255))
    phone    = db.Column(db.String(15))
    last_msg = db.Column(db.Integer(), ForeignKey('message.id'))

    tags = relationship('UserTags',
        primaryjoin="and_(User.id==UserTags.user_id)",
        backref="user"
        )

    def __init__(self, email="", password="", phone="", name="", role="responder"):
        self.name = name
        self.email = email
        self.role = role
        self.active = True
        self.password = User.hashed_password(password) if password else None
        self.phone = phone

    def as_dict(self):
        return {
            'id':    self.id,
            'name':  self.name,
            'phone': self.phone,
            'role':  self.role,
            'email': self.email,
            'tags': [tag.tag_id for tag in self.tags],
            'last_msg': self.last_msg,
            'active': self.active
        }

    def update(self, values):
        for key, value in values.iteritems():
            if key=='tags':
                # remove existing tags before updating
                UserTags.query.filter_by(user_id=self.id).delete()
                db.session.commit()
                # add all tags selected
                for tag_id in value:
                    tag = UserTags(user_id=self.id, tag_id=tag_id)
                    db.session.add(tag)
            else:
                self.__setattr__(key, value)
        
        try:
            db.session.add(self)
            db.session.commit()
            return self
        except IntegrityError:
            return None

    def mark_last_msg(self, last_msg):
        self.__setattr__('last_msg', last_msg)
        db.session.add(self)
        db.session.commit()

    def subscribe(self, subscribed=True):
        self.__setattr__('active', subscribed)
        db.session.add(self)
        db.session.commit()

    @staticmethod
    def hashed_password(password):
        return bcrypt.generate_password_hash(password)

    @staticmethod
    def get_user_with_email_and_password(email, password):
        user = User.query.filter_by(email=email).first()
        if user and bcrypt.check_password_hash(user.password, password):
            return user
        else:
            return None

    @staticmethod
    def get_all():
        return db.session.query(User, UserTags, Tag).join(Usertags).join(Tag)

    @staticmethod
    def from_number(lookup_number):
        user = User.query.filter_by(phone=lookup_number).first()
        if not user:
            user = User(None, None, lookup_number)
            db.session.add(user)
            db.session.commit()
        return user


class UserTags(db.Model):
    __tablename__ = "user_tag"
    id       = db.Column(db.Integer(), primary_key = True)
    user_id  = db.Column(db.Integer(), ForeignKey('user.id'))
    tag_id   = db.Column(db.Integer(), ForeignKey('tag.id'))

    tag = relationship("Tag",
            primaryjoin="and_(UserTags.tag_id==Tag.id)",
            backref="user_tags"
            )

    def __init__(self, user_id, tag_id):
        self.user_id = user_id
        self.tag_id = tag_id


class Tag(db.Model):
    __tablename__ = 'tag'
    id       = db.Column(db.Integer(), primary_key = True)
    tag_type = db.Column(db.String(255))
    tag_name = db.Column(db.String(255))

    def __init__(self, tag_type, tag_name):
        self.tag_type = tag_type
        self.tag_name = tag_name

    def as_dict(self):
        return {
            'id':       self.id,
            'tag_type': self.tag_type,
            'tag_name': self.tag_name
        }

    @staticmethod 
    def get_types():
        return db.session.query(Tag.tag_type.distinct())

class Message(db.Model):
    __tablename__ = "message"
    id            = db.Column(db.Integer(), primary_key = True)
    event         = db.Column(db.Integer(), nullable=True)
    text          = db.Column(db.String(1024))
    author        = db.Column(db.Integer,ForeignKey('user.id'), nullable=False)
    outgoing_to   = db.Column(db.Integer,ForeignKey('user.id'), nullable=True)
    broadcast_to  = db.Column(db.String(2048)) # XXX? in Postgres this would work better as an array, 
                                               #  but for now, I'm just storing it as a string, and splitting
                                               # it on output since I'm trying to get as far as possible without
                                               # requiring Postgres
    timestamp     = db.Column(db.Integer())
    parent        = db.Column(db.Integer,ForeignKey('message.id'), nullable=True)

    def __init__(self, text="", author="", outgoing_to=None, broadcast_to="", timestamp="", parent=None, event=None):
        self.text = text
        self.author = author
        self.outgoing_to = outgoing_to
        self.broadcast_to = broadcast_to
        self.timestamp = timestamp
        self.parent = parent
        self.event = event

    def as_dict(self): 
        return {
            'id':           self.id,
            'text':         self.text,
            'author':       self.author,
            'outgoing_to':  self.outgoing_to,
            'broadcast_to': filter(None, self.broadcast_to.split('|')),
            'timestamp':    self.timestamp,
            'parent':       self.parent,
            'event':        self.event,
        }

    def get_responses():
        return User.query.filter_by(parent=self.id)

    @staticmethod
    def get_new():
        return Message.query.all()

    @staticmethod
    def get_for_event(event):
        return User.query.filter_by(event=event.id,parent=null)

class Event(db.Model):
    __tablename__ = "event"
    id            = db.Column(db.Integer(), primary_key = True)
    name          = db.Column(db.String(255))
    description   = db.Column(db.Text())
    verified      = db.Column(db.Boolean)
    active        = db.Column(db.Boolean)

    def __init__(self, name="", description=""):
        self.name = name
        self.description = description
        self.verified = False
        self.active = True

    def as_dict(self):
        return {
            'id':          self.id,
            'name':        self.name,
            'description': self.description,
            'verified':    self.verified,
            'active':      self.active,
        }

    def update(self, values):
        for key, value in values.iteritems():
            self.__setattr__(key, value)
        
        try:
            db.session.add(self)
            db.session.commit()
            return self
        except IntegrityError:
            return None

