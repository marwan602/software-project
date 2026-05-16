from flask import Blueprint, jsonify, request

from controllers.task_controller import TaskController

task_bp = Blueprint('tasks', __name__, url_prefix='/api/tasks')


@task_bp.route('', methods=['GET'])
def get_tasks():
    response, status_code = TaskController.get_all_tasks()
    return jsonify(response), status_code


@task_bp.route('/<int:task_id>', methods=['GET'])
def get_task(task_id):
    response, status_code = TaskController.get_task_by_id(task_id)
    return jsonify(response), status_code


@task_bp.route('', methods=['POST'])
def create_task():
    response, status_code = TaskController.create_task(request.get_json(silent=True) or {})
    return jsonify(response), status_code


@task_bp.route('/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    response, status_code = TaskController.update_task(task_id, request.get_json(silent=True) or {})
    return jsonify(response), status_code


@task_bp.route('/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    response, status_code = TaskController.delete_task(task_id)
    return jsonify(response), status_code