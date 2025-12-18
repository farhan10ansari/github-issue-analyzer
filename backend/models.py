from db import db
from datetime import datetime

class Issue(db.Model):
    __tablename__ = "issues"

    id = db.Column(db.Integer, primary_key=True)
    repo = db.Column(db.String(100), index=True, nullable=False)
    github_id = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(255), nullable=False)
    body = db.Column(db.Text, nullable=True)
    html_url = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.String(50), nullable=False)
    fetched_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Composite unique constraint to avoid duplicates per repo
    __table_args__ = (db.UniqueConstraint('repo', 'github_id', name='_repo_issue_uc'),)
