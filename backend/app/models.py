from app import db
from datetime import datetime
from json import loads


class Request(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    method = db.Column(db.String(10), nullable=False)
    url = db.Column(db.String(500), nullable=False)
    headers = db.Column(db.Text)
    params = db.Column(db.Text)
    body = db.Column(db.Text)
    collection_id = db.Column(db.Integer, db.ForeignKey('collection.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'method': self.method,
            'url': self.url,
            'headers': loads(self.headers) if self.headers else None,
            'params': loads(self.params) if self.params else None,
            'body': loads(self.body) if self.body else None,
            'collection_id': self.collection_id,
            'created_at': self.created_at.isoformat()
        }


class Collection(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200))
    requests = db.relationship('Request', backref='collection', lazy=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'requests': [r.to_dict() for r in self.requests],
            'created_at': self.created_at.isoformat()
        }


class Environment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    variables = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'variables': self.variables,
            'created_at': self.created_at.isoformat()
        }


class History(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    request_data = db.Column(db.JSON)
    response_status = db.Column(db.Integer)
    response_data = db.Column(db.Text)
    response_headers = db.Column(db.JSON)
    duration = db.Column(db.Float)  # in seconds
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'request_data': self.request_data,
            'response_status': self.response_status,
            'response_data': self.response_data,
            'response_headers': self.response_headers,
            'duration': self.duration,
            'created_at': self.created_at.isoformat()
        }
