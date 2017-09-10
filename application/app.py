from flask import request, render_template, jsonify, url_for, redirect, g
from .models import User, Message, UserTags, Tag, Event
from index import app, db
from sqlalchemy.exc import IntegrityError
from sqlalchemy.sql.expression import and_
from .utils.auth import generate_token, requires_auth, verify_token, validate_twilio_request
from twilio.rest import Client
from twilio.twiml.messaging_response import MessagingResponse
import time, json, os;

twilio_client = Client(os.environ['TWILIO_ACCOUNT_SID'], os.environ['TWILIO_AUTH_TOKEN'])

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@app.route('/<path:path>', methods=['GET'])
def any_root_path(path):
    return render_template('index.html')


@app.route("/api/user", methods=["GET"])
@requires_auth
def get_user():
    return jsonify(result=g.current_user)


@app.route("/api/users", methods=["GET"])
@requires_auth
def get_users():
    users = User.query.all()
    if users:
        return jsonify([user.as_dict() for user in users])
    else:
        return jsonify({ 'error': 'No Users found' })


@app.route("/api/create_user", methods=["POST"])
# TODO: Add @requires_auth once method is possible
def create_user():
    incoming = request.get_json()
    try:
        user = User(
            email=incoming["email"],
            password=incoming["password"],
            phone=None
        )
    except:
        return jsonify(message="Malformed request"), 400

    db.session.add(user)

    try:
        db.session.commit()
    except IntegrityError:
        return jsonify(message="User with that email already exists"), 409

    new_user = User.query.filter_by(email=incoming["email"]).first()

    return jsonify(
        id=user.id,
        token=generate_token(new_user)
    )


@app.route("/api/user/<int:user_id>", methods=["POST"])
@requires_auth
def update_user(user_id):
    user = db.session.query(User).get(user_id)
    if not user:
        return jsonify(message="Error updating user record"), 400
    incoming = request.get_json()
    try:
        user = user.update(values=incoming["user"])
    except:
        return jsonify(message="Malformed request"), 400
    
    return get_users() if user else jsonify({"error": "Error updating user record"})


@app.route("/api/get_token", methods=["POST"])
def get_token():
    incoming = request.get_json()
    try:
        user = User.get_user_with_email_and_password(incoming["email"], incoming["password"])
    except:
        return jsonify(message="Malformed request"), 400
        
    if user:
        return jsonify(token=generate_token(user))

    return jsonify(error=True), 403


@app.route("/api/is_token_valid", methods=["POST"])
def is_token_valid():
    incoming = request.get_json()
    try:
        is_valid = verify_token(incoming["token"])
    except:
        return jsonify(message="Malformed request"), 400

    if is_valid:
        return jsonify(token_is_valid=True)
    else:
        return jsonify(token_is_valid=False), 403


@app.route("/api/messages", methods=['GET'])
@requires_auth
def get_messages():
    messages = Message.query.order_by(Message.timestamp)
    if messages:
        return jsonify([message.as_dict() for message in messages])
    else:
        return jsonify({ error: 'No Messages yet' })


@app.route("/api/message", methods=['POST'])
@validate_twilio_request
def incoming_message():
    from_number = request.values.get('From', None)
    body = request.values.get('Body', None)
    if (not from_number) or (not body):
        return jsonify(message="Malformed request"), 400
    timestamp = int(time.time())
    user = User.from_number(from_number)
    event = 0
    if user.last_msg:
        last_msg = Message.query.get(user.last_msg)
        event = last_msg.event

    message = Message(
        text=body, 
        author=user.id, 
        timestamp=timestamp, 
        parent=user.last_msg, 
        event=event
        )
    db.session.add(message)
    db.session.commit()

    r = MessagingResponse()
    r.message('Thanks for the reply.' if user.last_msg else 'Thanks for the tip.')
    return str(r)

@app.route("/api/tags", methods=['GET'])
@requires_auth
def get_tags():
    tags = Tag.query.order_by(Tag.tag_type, Tag.tag_name)
    if tags:
        return jsonify([tag.as_dict() for tag in tags])
    else:
        return jsonify({error: 'No Tags yet'})


@app.route("/api/create_tag", methods=['POST'])
@requires_auth
def create_tag():
    incoming = request.get_json()
    try:
        tag = Tag(
            tag_type=incoming['tag_type'],
            tag_name=incoming['tag_name'],
        )
    except:
        return jsonify(message="Malformed request"), 400

    db.session.add(tag)
    db.session.commit()

    return get_tags()


@app.route("/api/tag/<int:tag_id>", methods=['POST','DELETE'])
@requires_auth
def delete_tag(tag_id):
    tag = Tag.query.filter_by(id=tag_id).first()

    if tag:
        db.session.delete(tag)

    db.session.commit()

    return get_tags()


@app.route("/api/outgoing", methods=['POST'])
@requires_auth
def send_message():
    incoming = request.get_json()
    try:
        to = incoming['to']
        message_text = incoming['message_text']
        in_response_to = incoming['in_response_to']
    except:
        return jsonify(message="Malformed request"), 400

    to_user = db.session.query(User).get(to)
    in_response_to_message = db.session.query(Message).get(in_response_to)

    if not to_user or not to_user.phone:
        return jsonify({error: 'User not found'})

    try:
        sent_message=twilio_client.messages.create(
            to=to_user.phone,
            from_=os.environ['TWILIO_NUMBER'],
            body=message_text
            )
        message=Message(
            text=message_text,
            outgoing_to=to,
            author=g.current_user['id'],
            timestamp=int(time.time()),
            parent=in_response_to
            )
        db.session.add(message)
        db.session.commit()
        to_user.mark_last_msg(last_msg=message.id)

    except IntegrityError:
        return jsonify ({error: 'Error sending message'})

    return jsonify([ message.as_dict() ])

@app.route("/api/broadcast", methods=['POST'])
@requires_auth
def send_broadcast():
    incoming = request.get_json()
    try:
        message_text = incoming['message_text']
        event = incoming['event']
        filters = incoming['filters']
    except:
        return jsonify(message="Malformed request"), 400

    author = g.current_user['id']
    audience = db.session.query(User) \
            .filter(User.phone != "") \
            .filter(and_(User.tags.contains(UserTags.query.get(tag_filter)) for tag_filter in filters)) \
            .all()

    if message_text and event and audience:
        message=Message(
                text=message_text,
                event=event,
                author=author,
                broadcast_to='|' + '|'.join(str(user.id) for user in audience) + '|',
                timestamp=int(time.time())
                )
        db.session.add(message)
        db.session.commit()
        for user in audience:
            sent_message=twilio_client.messages.create(
                    to=user.phone,
                    from_=os.environ['TWILIO_NUMBER'],
                    body=message_text
                    )
            user.mark_last_msg(last_msg=message.id)

        return jsonify([message.as_dict()])

    return jsonify({'error': 'No audience selected to send to'})


@app.route("/api/events", methods=['GET'])
@requires_auth
def get_events():
    events=Event.query.all()
    if events:
        return jsonify([event.as_dict() for event in events])
    else:
        return jsonify({ 'error': 'No events yet' })

@app.route("/api/event", methods=['PUT'])
@requires_auth
def create_event():
    incoming = request.get_json()

    try:
        event=Event(
            name=incoming['name'],
            description=incoming['description'] or '',
            )
        db.session.add(event)
        if incoming['message_id']:
            message=db.session.query(Message).get(incoming["message_id"])
            message.__setattr__('event', event.id)
            db.session.add(message)
            db.session.commit()

    except IntegrityError:
        return jsonify({error: 'Error creating event'})
    except KeyError:
        return jsonify(message="Malformed request"), 400

    return get_events()

