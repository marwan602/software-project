from datetime import date

from config.database import db
from config.socket import socketio
from models.project import Project
from models.task import Task


def _normalize_tags(value):
    if isinstance(value, list):
        return [str(tag).strip() for tag in value if str(tag).strip()]
    return []


def _parse_due_date(value):
    if value in (None, ''):
        return None

    if isinstance(value, date):
        return value

    if isinstance(value, str):
        try:
            return date.fromisoformat(value)
        except ValueError:
            return None

    return None


def _default_project_id():
    project = Project.query.order_by(Project.id.asc()).first()
    return project.id if project else None


class TaskController:
    @staticmethod
    def get_all_tasks():
        try:
            tasks = Task.query.order_by(Task.created_at.desc()).all()
            return {'success': True, 'data': [task.to_dict() for task in tasks]}, 200
        except Exception as error:
            print('Error fetching tasks:', error)
            return {'success': False, 'message': 'Failed to fetch tasks'}, 500

    @staticmethod
    def get_task_by_id(task_id):
        try:
            task = Task.query.get(task_id)
            if not task:
                return {'success': False, 'message': 'Task not found'}, 404

            return {'success': True, 'data': task.to_dict()}, 200
        except Exception as error:
            print('Error fetching task:', error)
            return {'success': False, 'message': 'Failed to fetch task'}, 500

    @staticmethod
    def create_task(payload):
        try:
            title = (payload.get('title') or '').strip()
            if not title:
                return {'success': False, 'message': 'Title is required'}, 400

            task = Task(
                project_id=payload.get('project_id') or _default_project_id(),
                title=title,
                description=(payload.get('description') or '').strip(),
                status=payload.get('status') or 'To Do',
                priority=payload.get('priority') or 'Medium',
                assignee_name=(payload.get('assignee_name') or '').strip(),
                assignee_avatar=(payload.get('assignee_avatar') or '').strip(),
                due_date=_parse_due_date(payload.get('due_date')),
                tags=_normalize_tags(payload.get('tags')),
            )

            db.session.add(task)
            db.session.commit()

            socketio.emit('task:created', task.to_dict())
            return {'success': True, 'data': task.to_dict()}, 201
        except Exception as error:
            db.session.rollback()
            print('Error creating task:', error)
            return {'success': False, 'message': 'Failed to create task'}, 500

    @staticmethod
    def update_task(task_id, payload):
        try:
            task = Task.query.get(task_id)
            if not task:
                return {'success': False, 'message': 'Task not found'}, 404

            if 'title' in payload and payload.get('title') is not None:
                task.title = payload.get('title').strip() if isinstance(payload.get('title'), str) else task.title
            if 'description' in payload:
                task.description = (payload.get('description') or '').strip()
            if 'project_id' in payload:
                task.project_id = payload.get('project_id') or _default_project_id()
            if 'status' in payload and payload.get('status') is not None:
                task.status = payload.get('status')
            if 'priority' in payload and payload.get('priority') is not None:
                task.priority = payload.get('priority')
            if 'assignee_name' in payload and payload.get('assignee_name') is not None:
                task.assignee_name = (payload.get('assignee_name') or '').strip()
            if 'assignee_avatar' in payload and payload.get('assignee_avatar') is not None:
                task.assignee_avatar = (payload.get('assignee_avatar') or '').strip()
            if 'due_date' in payload:
                task.due_date = _parse_due_date(payload.get('due_date'))
            if 'tags' in payload and payload.get('tags') is not None:
                task.tags = _normalize_tags(payload.get('tags'))

            db.session.commit()

            updated = task.to_dict()
            socketio.emit('task:updated', updated)
            return {'success': True, 'data': updated}, 200
        except Exception as error:
            db.session.rollback()
            print('Error updating task:', error)
            return {'success': False, 'message': 'Failed to update task'}, 500

    @staticmethod
    def delete_task(task_id):
        try:
            task = Task.query.get(task_id)
            if not task:
                return {'success': False, 'message': 'Task not found'}, 404

            db.session.delete(task)
            db.session.commit()

            socketio.emit('task:deleted', {'id': int(task_id)})
            return {'success': True, 'message': f'Task {task_id} deleted successfully'}, 200
        except Exception as error:
            db.session.rollback()
            print('Error deleting task:', error)
            return {'success': False, 'message': 'Failed to delete task'}, 500