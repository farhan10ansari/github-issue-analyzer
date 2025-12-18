from marshmallow import Schema, fields

class ScanRequestSchema(Schema):
    repo = fields.Str(required=True, metadata={"description": "owner/repository-name"})

class ScanResponseSchema(Schema):
    repo = fields.Str()
    issues_fetched = fields.Int()
    cached_successfully = fields.Bool()

class AnalyzeRequestSchema(Schema):
    repo = fields.Str(required=True)
    prompt = fields.Str(required=True)

class AnalyzeResponseSchema(Schema):
    analysis = fields.Str()


class RepoListSchema(Schema):
    repos = fields.List(fields.String())