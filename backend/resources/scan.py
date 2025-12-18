import os
import requests
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from sqlalchemy.exc import IntegrityError
from db import db
from models import Issue
from schemas import ScanRequestSchema, ScanResponseSchema, RepoListSchema

blp = Blueprint("scan", __name__, description="Operations for scanning GitHub repos")

@blp.route("/scan")
class ScanRepo(MethodView):
    @blp.arguments(ScanRequestSchema)
    @blp.response(200, ScanResponseSchema)
    def post(self, scan_data):
        repo_name = scan_data["repo"]
        github_token = os.getenv("GITHUB_TOKEN")
        
        headers = {"Accept": "application/vnd.github.v3+json"}
        if github_token:
            headers["Authorization"] = f"token {github_token}"

        # Fetch open issues
        url = f"https://api.github.com/repos/{repo_name}/issues?state=open&per_page=100"
        response = requests.get(url, headers=headers)

        if response.status_code != 200:
            abort(response.status_code, message=f"GitHub API Error: {response.text}")

        issues_data = response.json()
        count = 0

        # Clear existing cache for this repo (optional, dependent on logic preference)
        # For this assignment, we will upsert or ignore duplicates.
        
        for item in issues_data:
            # Skip Pull Requests (GitHub API returns PRs as issues)
            if "pull_request" in item:
                continue

            new_issue = Issue(
                repo=repo_name,
                github_id=item["id"],
                title=item["title"],
                body=item["body"] or "",
                html_url=item["html_url"],
                created_at=item["created_at"]
            )

            try:
                existing = Issue.query.filter_by(repo=repo_name, github_id=item["id"]).first()
                if not existing:
                    db.session.add(new_issue)
                    count += 1
            except Exception:
                pass 
        
        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            abort(500, message="Database error while caching.")

        return {
            "repo": repo_name,
            "issues_fetched": count,
            "cached_successfully": True
        }




@blp.route("/repos")
class RepoList(MethodView):
    @blp.response(200, RepoListSchema)
    def get(self):
        """List all repositories currently in the cache."""
        # Query distinct 'repo' values from the Issue table
        # SQLAlchemy 2.0 style select
        stmt = db.select(Issue.repo).distinct()
        result = db.session.execute(stmt).scalars().all()
        return {"repos": list(result)}
