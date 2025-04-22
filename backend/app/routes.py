from flask import Blueprint, jsonify, request
from app.models import Request, Collection, Environment, History, db
from app.executor import RequestExecutor
import json
from json import dumps

api_bp = Blueprint('api', __name__, url_prefix='/api')

# Requests Endpoints
@api_bp.route('/requests', methods=['GET'])
def get_requests():
    requests = Request.query.order_by(Request.created_at.desc()).all()
    return jsonify([r.to_dict() for r in requests])

@api_bp.route('/requests', methods=['POST'])
def create_request():
    data = request.json
    if not data.get('method') or not data.get('url'):
        return jsonify({'error': 'Method and URL are required'}), 400
    
    new_request = Request(
        name=data.get('name', 'Untitled Request'),
        method=data['method'],
        url=data['url'],
        headers=dumps(data.get('headers')),
        params=dumps(data.get('parmas')),
        body=dumps(data.get('body')),
        collection_id=data.get('collection_id')
    )
    db.session.add(new_request)
    db.session.commit()
    return jsonify(new_request.to_dict()), 201

@api_bp.route('/requests/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def handle_request(id):
    req = Request.query.get_or_404(id)
    
    if request.method == 'GET':
        return jsonify(req.to_dict())
    
    elif request.method == 'PUT':
        data = request.json
        req.name = data.get('name', req.name)
        req.method = data.get('method', req.method)
        req.url = data.get('url', req.url)
        req.headers = data.get('headers', req.headers)
        req.params = data.get('params', req.params)
        req.body = data.get('body', req.body)
        req.collection_id = data.get('collection_id', req.collection_id)
        db.session.commit()
        return jsonify(req.to_dict())
    
    elif request.method == 'DELETE':
        db.session.delete(req)
        db.session.commit()
        return jsonify({'success': True})

