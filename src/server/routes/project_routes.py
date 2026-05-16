from flask import Blueprint, jsonify, request

from controllers.project_controller import ProjectController

project_bp = Blueprint('projects', __name__, url_prefix='/api/projects')


@project_bp.route('', methods=['GET'])
def get_projects():
    response, status_code = ProjectController.get_projects()
    return jsonify(response), status_code


@project_bp.route('', methods=['POST'])
def create_project():
    response, status_code = ProjectController.create_project(request.get_json(silent=True) or {})
    return jsonify(response), status_code