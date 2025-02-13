import eventlet
eventlet.monkey_patch()  # Must be at the very top, before other imports

from flask import Flask, render_template, request, redirect, url_for, make_response
from flask_socketio import SocketIO, join_room, leave_room
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///chat.db'  # SQLite database file
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
db = SQLAlchemy(app)

# Define User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)

# Define ChatRoom model
class ChatRoom(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)

# Define Message model
class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(500), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    username = db.Column(db.String(80), nullable=False)
    room_id = db.Column(db.Integer, db.ForeignKey('chat_room.id'), nullable=False)

# Create database tables
with app.app_context():
    db.create_all()

socketio = SocketIO(app)

# Store active users and their rooms (in-memory, for simplicity)
active_users = {}  # Format: {username: room_name}

@app.route('/', methods=['GET', 'POST'])
def index():
    username = request.cookies.get('username')
    if username:
        return redirect(url_for('chat'))

    if request.method == 'POST':
        username = request.form['username']
        if not username:
            return "Username is required!", 400

        # Check if the username already exists
        user = User.query.filter_by(username=username).first()
        if not user:
            # Add new user to the database
            new_user = User(username=username)
            db.session.add(new_user)
            db.session.commit()

        # Set username cookie
        response = make_response(redirect(url_for('chat')))
        response.set_cookie('username', username)
        return response

    return render_template('index.html')

@app.route('/chat')
def chat():
    username = request.cookies.get('username')
    if not username:
        return redirect(url_for('index'))

    # Get all chat rooms
    chat_rooms = ChatRoom.query.all()
    return render_template('chat.html', username=username, chat_rooms=chat_rooms)

@app.route('/create_room', methods=['POST'])
def create_room():
    room_name = request.form['room_name']
    if not room_name:
        return "Room name is required!", 400

    # Check if the room already exists
    room = ChatRoom.query.filter_by(name=room_name).first()
    if not room:
        # Add new room to the database
        new_room = ChatRoom(name=room_name)
        db.session.add(new_room)
        db.session.commit()

    return redirect(url_for('chat'))

@socketio.on('join')
def handle_join(data):
    username = data['username']
    room_name = data['room_name']

    # Add user to the room
    join_room(room_name)
    active_users[username] = room_name

    # Notify others in the room
    socketio.emit('user_joined', {'username': username, 'room_name': room_name}, room=room_name)

    # Send list of active users in the room
    users_in_room = [user for user, room in active_users.items() if room == room_name]
    socketio.emit('active_users', {'users': users_in_room}, room=room_name)

@socketio.on('leave')
def handle_leave(data):
    username = data['username']
    room_name = data['room_name']

    # Remove user from the room
    leave_room(room_name)
    active_users.pop(username, None)

    # Notify others in the room
    socketio.emit('user_left', {'username': username, 'room_name': room_name}, room=room_name)

    # Send updated list of active users in the room
    users_in_room = [user for user, room in active_users.items() if room == room_name]
    socketio.emit('active_users', {'users': users_in_room}, room=room_name)

@socketio.on('message')
def handle_message(data):
    username = data['username']
    room_name = data['room_name']
    message = data['message']

    # Save message to the database
    room = ChatRoom.query.filter_by(name=room_name).first()
    if room:
        new_message = Message(content=message, username=username, room_id=room.id)
        db.session.add(new_message)
        db.session.commit()

    # Broadcast the message to the room
    socketio.emit('message', {
        'username': username,
        'message': message,
        'timestamp': datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
    }, room=room_name)

if __name__ == '__main__':
    socketio.run(app, debug=True)