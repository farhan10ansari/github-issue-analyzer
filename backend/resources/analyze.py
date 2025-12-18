import os
from google import genai
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from models import Issue
from schemas import AnalyzeRequestSchema, AnalyzeResponseSchema

blp = Blueprint("analyze", __name__, description="Analyze cached issues with LLM")

@blp.route("/analyze")
class AnalyzeRepo(MethodView):
    @blp.arguments(AnalyzeRequestSchema)
    @blp.response(200, AnalyzeResponseSchema)
    def post(self, analyze_data):
        repo_name = analyze_data["repo"]
        user_prompt = analyze_data["prompt"]
        api_key = os.getenv("GOOGLE_API_KEY")

        if not api_key:
            abort(500, message="Google API Key not configured.")

        # 1. Fetch cached issues
        issues = Issue.query.filter_by(repo=repo_name).limit(50).all()
        
        if not issues:
            return {"analysis": "No issues found in cache for this repository. Please scan it first."}

        # 2. Prepare Context
        issues_text = ""
        for issue in issues:
            issues_text += f"ID: {issue.github_id}\nTitle: {issue.title}\nBody: {issue.body[:300]}...\n\n"

        # 3. Construct Prompt
        final_prompt = (
            f"You are a technical assistant analyzing GitHub issues for the repository '{repo_name}'.\n"
            f"Context: The following are the most recent open issues:\n\n{issues_text}\n\n"
            f"User Request: {user_prompt}\n\n"
            f"Provide a helpful, natural language response addressing the user request based on the issues provided."
        )

        # 4. Call Google Gemini (New SDK)
        try:
            client = genai.Client(api_key=api_key)
            
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=final_prompt
            )
            
            return {"analysis": response.text}
            
        except Exception as e:
            # Common error handling for the new SDK
            error_msg = str(e)
            if "403" in error_msg:
                abort(403, message="Invalid API Key or permission denied.")
            elif "429" in error_msg:
                abort(429, message="Rate limit exceeded.")
            else:
                abort(500, message=f"LLM Error: {error_msg}")
