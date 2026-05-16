from datetime import datetime

from config.database import db


class Project(db.Model):
    __tablename__ = 'projects'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)
    description = db.Column(db.Text, default='', nullable=False)
    color = db.Column(db.String(32), default='#6C3BFF', nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    tasks = db.relationship('Task', back_populates='project')

    def to_dict(self, task_count=0):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'color': self.color,
            'task_count': task_count,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }