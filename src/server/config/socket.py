from flask_socketio import SocketIO

socketio = SocketIO(cors_allowed_origins='*', async_mode='threading')


def init_socketio(app):
    socketio.init_app(app, cors_allowed_origins='*')
    return socketio