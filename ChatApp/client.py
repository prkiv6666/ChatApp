from flask import Flask, render_template
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('message')
def handle_message(data):
    print('Received message:', data)
    socketio.emit('message', data)

if __name__ == '__main__':
    socketio.run(app, debug=True, allow_unsafe_werkzeug=True)