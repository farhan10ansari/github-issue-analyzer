import os
from flask import Flask
from flask_smorest import Api
from flask_cors import CORS
from db import db
from resources.scan import blp as ScanBlueprint
from resources.analyze import blp as AnalyzeBlueprint
from dotenv import load_dotenv

load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Config
    app.config["API_TITLE"] = "GitHub Issue Analyzer"
    app.config["API_VERSION"] = "v1"
    app.config["OPENAPI_VERSION"] = "3.0.3"
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///issues.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Extensions
    CORS(app)
    db.init_app(app)
    api = Api(app)

    # Blueprints
    api.register_blueprint(ScanBlueprint)
    api.register_blueprint(AnalyzeBlueprint)

    with app.app_context():
        db.create_all()

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)
