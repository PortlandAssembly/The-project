from flask import request, render_template, jsonify, url_for, redirect, g
from .models import User, Message, Tag
from index import app, db
from sqlalchemy.exc import IntegrityError
from .utils.auth import generate_token, requires_auth, verify_token
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
def get_users():
    users = User.query.all()
    if users:
        return jsonify([user.as_dict() for user in users])
    else:
        return jsonify({ error: 'No Users found' })


@app.route("/api/create_user", methods=["POST"])
def create_user():
    incoming = request.get_json()
    user = User(
        email=incoming["email"],
        password=incoming["password"],
        phone=None
    )
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
def update_user( user_id ):
    user = db.session.query(User).get(user_id)
    incoming = request.get_json()
    user = user.update(values=incoming["user"])
    return get_users() if user else jsonify({"error": "Error updating user record"})

@app.route("/api/get_token", methods=["POST"])
def get_token():
    incoming = request.get_json()
    user = User.get_user_with_email_and_password(incoming["email"], incoming["password"])
    if user:
        return jsonify(token=generate_token(user))

    return jsonify(error=True), 403


@app.route("/api/is_token_valid", methods=["POST"])
def is_token_valid():
    incoming = request.get_json()
    is_valid = verify_token(incoming["token"])

    if is_valid:
        return jsonify(token_is_valid=True)
    else:
        return jsonify(token_is_valid=False), 403

@app.route("/api/messages", methods=['GET'])
def get_messages():
    messages = Message.query.order_by(Message.timestamp)
    if messages:
        return jsonify([message.as_dict() for message in messages])
    else:
        return jsonify({ error: 'No Messages yet' })

@app.route("/api/message", methods=['POST'])
def incoming_message():
    from_number = request.values.get('From', None)
    body = request.values.get('Body', None)
    timestamp = int(time.time())
    user = User.from_number(from_number)

    message = Message(body, user.id, timestamp, 0, 0)
    db.session.add(message)
    db.session.commit()

    r = MessagingResponse()
    r.message('Thanks for the tip.')
    return str(r)

@app.route("/api/tags", methods=['GET'])
def get_tags():
    tags = Tag.query.order_by(Tag.tag_type, Tag.tag_name)
    if tags:
        return jsonify([tag.as_dict() for tag in tags])
    else:
        return jsonify({error: 'No Tags yet'})

@app.route("/api/create_tag", methods=['POST'])
def create_tag():
    incoming = request.get_json()
    tag = Tag(
        tag_type=incoming['tag_type'],
        tag_name=incoming['tag_name'],
    )
    db.session.add(tag)
    db.session.commit()

    return get_tags()

@app.route("/api/tag/<int:tag_id>", methods=['POST','DELETE'])
def delete_tag(tag_id):
    tag = Tag.query.filter_by(id=tag_id).first()

    if tag:
        db.session.delete( tag )

    db.session.commit()

    return get_tags()

@app.route("/api/outgoing", methods=['POST'])
@requires_auth
def send_message():
    incoming = request.get_json()
    to = incoming['to']
    message_text = incoming['message_text']
    in_response_to = incoming['in_response_to']

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
    except IntegrityError:
        return jsonify ({error: 'Error sending message'})

    return jsonify([ message.as_dict() ])

