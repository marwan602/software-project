from sqlalchemy import func

from config.database import db
from models.project import Project
from models.task import Task


class ProjectController:
    @staticmethod
    def get_projects():
        try:
            rows = (
                db.session.query(Project, func.count(Task.id).label('task_count'))
                .outerjoin(Task, Task.project_id == Project.id)
                .group_by(Project.id)
                .order_by(Project.created_at.asc())
                .all()
            )

            return {
                'success': True,
                'data': [project.to_dict(task_count=task_count) for project, task_count in rows],
            }, 200
        except Exception as error:
            print('Error fetching projects:', error)
            return {'success': False, 'message': 'Failed to fetch projects'}, 500

    @staticmethod
    def create_project(payload):
        try:
            name = (payload.get('name') or '').strip()
            if not name:
                return {'success': False, 'message': 'Project name is required'}, 400

            if Project.query.filter(func.lower(Project.name) == name.lower()).first():
                return {'success': False, 'message': 'Project already exists'}, 400

            project = Project(
                name=name,
                description=(payload.get('description') or '').strip(),
                color=payload.get('color') or '#6C3BFF',
            )

            db.session.add(project)
            db.session.commit()

            return {'success': True, 'data': project.to_dict(task_count=0)}, 201
        except Exception as error:
            db.session.rollback()
            print('Error creating project:', error)
            return {'success': False, 'message': 'Failed to create project'}, 500