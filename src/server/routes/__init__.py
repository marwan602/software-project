# src/server/routes/__init__.py
# Routes module for API endpoints

from .analytics_routes import analytics_bp
from .auth_routes import auth_bp
from .comment_routes import comment_bp
from .health_routes import health_bp
from .project_routes import project_bp
from .subtask_routes import subtask_bp
from .task_routes import task_bp

__all__ = ['analytics_bp', 'auth_bp', 'comment_bp', 'health_bp', 'project_bp', 'subtask_bp', 'task_bp']
