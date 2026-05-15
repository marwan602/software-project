from flask import jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from config import db 
from models.user import User
import jwt 
import datetime
import os
from dotenv import load_dotenv
from functools import wraps

load_dotenv()

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'success': False, 'error': 'Token is missing!'}), 401
        try:
            if token.startswith('Bearer '):
                token = token.split(" ")[1]
            data = jwt.decode(token, os.getenv('SECRET_KEY', 'fallback_secret'), algorithms=["HS256"])
            current_user = User.query.get(data['user_id'])
            if not current_user:
                return jsonify({'success': False, 'error': 'User not found!'}), 401
        except Exception as e:
            return jsonify({'success': False, 'error': 'Token is invalid or expired!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

def register_user():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({"success": False, "error": "Missing fields"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"success": False, "error": "User already exists"}), 400

    hashed_pw

    if not username or not email or not password:
        return jsonify({"success": False, "error": "Missing fields"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"success": False, "error": "User already exists"}), 400

    token = str(uuid.uuid4())
    hashed_pw = generate_password_hash(password, method='pbkdf2:sha256')
    new_user = User(username=username, email=email, password_hash=hashed_pw, verification_token=token)
    
    db.session.add(new_user)
    db.session.commit()

    try:
        msg = Message("Verify your DevCollab Account", 
                      sender=os.getenv('MAIL_USERNAME'), 
                      recipients=[email])
        verify_link = f"http://127.0.0.1:5000/api/auth/verify/{token}"
        msg.body = f"Hello {username}, please click the link to verify your account: {verify_link}"
        mail.send(msg)
    except Exception as e:
        print(f"Email error: {e}")
        return jsonify({"success": False, "error": "User created, but email failed to send."}), 500

    return jsonify({"success": True, "message": "Please check your email to verify your account!"}), 201

def verify_email(token):
    user = User.query.filter_by(verification_token=token).first()
    if not user:
        return jsonify({"success": False, "error": "Invalid or expired token"}), 400
    user.is_verified = True
    user.verification_token = None
    db.session.commit()
    return jsonify({"success": True, "message": "Email verified! You can now log in."}), 200

def login_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password_hash, password):
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, os.getenv('SECRET_KEY', 'fallback_secret'), algorithm="HS256")
        return jsonify({"success": True, "token": token, "username": user.username}), 200
    return jsonify({"success": False, "error": "Invalid email or password"}), 401

def get_user_profile(current_user):
    return jsonify({"success": True, "user": {"id": current_user.id, "username": current_user.username, "email": current_user.email}}), 200


# --- THE SECURITY GUARD (Middleware) ---
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization') # Get token from header

        if not token:
            return jsonify({'success': False, 'error': 'Token is missing!'}), 401
        
        try:
            # Remove 'Bearer ' from the token if it exists
            if token.startswith('Bearer '):
                token = token.split(" ")[1]
            
            # Decode the token
            data = jwt.decode(token, os.getenv('SECRET_KEY', 'fallback_secret'), algorithms=["HS256"])
            current_user = User.query.get(data['user_id'])
            
            if not current_user:
                return jsonify({'success': False, 'error': 'User not found!'}), 401
        except Exception as e:
            return jsonify({'success': False, 'error': 'Token is invalid or expired!'}), 401

        return f(current_user, *args, **kwargs)
    return decorated

# --- THE "ME" ENDPOINT ---
def get_me():
    pass

def get_user_profile(current_user):
    return jsonify({
        "success": True,
        "user": {
            "id": current_user.id,
            "username": current_user.username,
            "email": current_user.email
        }
    }), 200
