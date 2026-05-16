# src/server/config/database.py
# Database configuration and initialization for SQLAlchemy

import os
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import inspect, text

# Initialize SQLAlchemy instance
db = SQLAlchemy()


def init_db(app):
    """
    Initialize database with Flask app.
    Sets up SQLAlchemy configuration and creates all tables.
    
    Args:
        app: Flask application instance
    """
    # Configure SQLAlchemy
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
        'DATABASE_URL',
        'sqlite:///task_management.db'
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize database with app
    db.init_app(app)

    # Import models so SQLAlchemy registers every table before create_all().
    from models import Comment, Project, Subtask, Task, User  # noqa: F401
    
    # Create all tables
    with app.app_context():
        db.create_all()

        inspector = inspect(db.engine)
        table_names = set(inspector.get_table_names())

        if 'projects' not in table_names:
            db.session.execute(
                text(
                    """
                    CREATE TABLE IF NOT EXISTS projects (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name VARCHAR(120) NOT NULL UNIQUE,
                        description TEXT NOT NULL DEFAULT '',
                        color VARCHAR(32) NOT NULL DEFAULT '#6C3BFF',
                        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                    )
                    """
                )
            )
            db.session.commit()

        project_columns = {column['name'] for column in inspector.get_columns('tasks')} if 'tasks' in table_names else set()
        if 'tasks' in table_names and 'project_id' not in project_columns:
            db.session.execute(text('ALTER TABLE tasks ADD COLUMN project_id INTEGER'))
            db.session.commit()

        if not Project.query.first():
            default_projects = [
                Project(name='Operations', description='Daily execution and support work', color='#6C3BFF'),
                Project(name='Product', description='Feature work and iteration', color='#22D3EE'),
                Project(name='Design', description='Creative and visual tasks', color='#F59E0B'),
            ]
            db.session.add_all(default_projects)
            db.session.commit()

        default_project = Project.query.order_by(Project.id.asc()).first()
        if default_project:
            db.session.execute(
                text('UPDATE tasks SET project_id = :project_id WHERE project_id IS NULL'),
                {'project_id': default_project.id},
            )
            db.session.commit()
