from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session,sessionmaker,relationship
from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    ForeignKey,
    DateTime,
    Sequence,
    Float
)
from index import db, bcrypt


class User(db.Model):
    __tablename__ = "user"
    id       = db.Column(db.Integer(), primary_key = True)
    email    = db.Column(db.String(255), unique    = True)
    password = db.Column(db.String(255))

    def __init__(self, email, password):
        self.email = email
        self.active = True
        self.password = User.hashed_password(password)

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

class Message(db.Model):
    __tablename__ = "message"
    id            = db.Column(db.Integer(), primary_key = True)
    event         = db.Column(db.Integer())
    text          = db.Column(db.String(1024))
    author        = db.Column(db.Integer,ForeignKey('user.id'))
    timestamp     = db.Column(db.Integer())
    parent        = db.Column(db.Integer,ForeignKey('message.id'))

#    responses    = relationship('Message',
#                        backref=backref('parent', remote_side=[id])
#                    )

    def __init__(self, event, text, author, timestamp, parent):
        self.event = event
        self.text = text
        self.author = author
        self.timestamp = timestamp
        self.parent = parent

    def get_responses():
        return User.query.filter_by(parent=self.id)

    @staticmethod
    def get_for_event(event):
        return User.query.filter_by(event=event.id,parent=null)
