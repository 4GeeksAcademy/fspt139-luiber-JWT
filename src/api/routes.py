"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import request, jsonify, Blueprint
from api.models import db, User
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/signup', methods=['POST'])
def signup():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"message": "Envía un correo y una contraseña."}), 400

    email = data.get('email')
    password = data.get('password')
    if not isinstance(email, str) or not isinstance(password, str):
        return jsonify({"message": "Ingresa un correo válido y una contraseña."}), 400

    email = email.strip().lower()
    if not email or '@' not in email or not password:
        return jsonify({"message": "Ingresa un correo válido y una contraseña."}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Ya existe una cuenta con ese correo."}), 409

    user = User(email=email, is_active=True)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Cuenta creada correctamente.", "user": user.serialize()}), 201


@api.route('/token', methods=['POST'])
def create_token():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"message": "Ingresa tu correo y contraseña."}), 400

    email = data.get('email')
    password = data.get('password')
    if not isinstance(email, str) or not isinstance(password, str):
        return jsonify({"message": "Ingresa tu correo y contraseña."}), 400

    email = email.strip().lower()
    user = User.query.filter_by(email=email).first() if email else None

    if not user or not user.check_password(password) or not user.is_active:
        return jsonify({"message": "Correo o contraseña incorrectos."}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify({"access_token": access_token, "user": user.serialize()}), 200


@api.route('/private', methods=['GET'])
@jwt_required()
def private():
    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))
    if not user or not user.is_active:
        return jsonify({"message": "La cuenta no está disponible."}), 401

    return jsonify({"user": user.serialize()}), 200
