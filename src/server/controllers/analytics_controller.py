from sqlalchemy import func

from config.database import db
from models.subtask import Subtask
from models.task import Task


def _to_number(value):
    if value is None:
        return 0
    return int(value)


class AnalyticsController:
    @staticmethod
    def get_overview():
        try:
            total_tasks = db.session.query(func.count(Task.id)).scalar() or 0
            completed_tasks = (
                db.session.query(func.count(Task.id))
                .filter(func.lower(Task.status).in_(['done', 'completed']))
                .scalar()
                or 0
            )
            total_subtasks = db.session.query(func.count(Subtask.id)).scalar() or 0
            completed_subtasks = (
                db.session.query(func.count(Subtask.id))
                .filter(Subtask.completed.is_(True))
                .scalar()
                or 0
            )

            pending_tasks = max(total_tasks - completed_tasks, 0)
            task_completion_rate = round((completed_tasks / total_tasks) * 100) if total_tasks else 0
            subtask_completion_rate = round((completed_subtasks / total_subtasks) * 100) if total_subtasks else 0
            productivity_rate = (
                round((task_completion_rate + subtask_completion_rate) / 2)
                if total_subtasks
                else task_completion_rate
            )

            user_label = func.coalesce(func.nullif(func.trim(Task.assignee_name), ''), 'Unassigned')
            status_label = func.coalesce(func.nullif(func.trim(Task.status), ''), 'To Do')

            user_rows = (
                db.session.query(user_label.label('label'), func.count(Task.id).label('value'))
                .group_by(user_label)
                .order_by(func.count(Task.id).desc(), user_label.asc())
                .all()
            )

            status_rows = (
                db.session.query(status_label.label('label'), func.count(Task.id).label('value'))
                .group_by(status_label)
                .order_by(func.count(Task.id).desc(), status_label.asc())
                .all()
            )

            return {
                'success': True,
                'data': {
                    'summary': {
                        'totalTasks': _to_number(total_tasks),
                        'completedTasks': _to_number(completed_tasks),
                        'pendingTasks': _to_number(pending_tasks),
                        'totalSubtasks': _to_number(total_subtasks),
                        'completedSubtasks': _to_number(completed_subtasks),
                        'taskCompletionRate': task_completion_rate,
                        'subtaskCompletionRate': subtask_completion_rate,
                        'productivityRate': productivity_rate,
                    },
                    'tasksPerUser': [
                        {'label': row.label or 'Unassigned', 'value': _to_number(row.value)}
                        for row in user_rows
                    ],
                    'tasksPerStatus': [
                        {'label': row.label or 'To Do', 'value': _to_number(row.value)}
                        for row in status_rows
                    ],
                    'completedVsPending': [
                        {'label': 'Completed', 'value': _to_number(completed_tasks)},
                        {'label': 'Pending', 'value': _to_number(pending_tasks)},
                    ],
                },
            }, 200
        except Exception as error:
            print('Error loading analytics overview:', error)
            return {'success': False, 'message': 'Failed to load analytics overview'}, 500