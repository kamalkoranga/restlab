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


# Collections Endpoints (similar structure)
@api_bp.route('/collections', methods=['GET', 'POST'])
def handle_collections():
    if request.method == 'GET':
        collections = Collection.query.order_by(Collection.created_at.desc()).all()
        return jsonify([c.to_dict() for c in collections])
    data = request.json
    new_collection = Collection(
        name=data['name'],
        description=data.get('description')
    )
    db.session.add(new_collection)
    db.session.commit()
    return jsonify(new_collection.to_dict()), 201


# Environments Endpoints
@api_bp.route('/environments', methods=['GET', 'POST'])
def handle_environments():
    if request.method == 'GET':
        envs = Environment.query.order_by(Environment.created_at.desc()).all()
        return jsonify([e.to_dict() for e in envs])
    data = request.json
    new_env = Environment(
        name=data['name'],
        variables=data.get('variables', {})
    )
    db.session.add(new_env)
    db.session.commit()
    return jsonify(new_env.to_dict()), 201


@api_bp.route('/environments/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def handle_environment(id: int):
    env = Environment.query.get_or_404(id)
    
    if request.method == 'GET':
        return jsonify(env.to_dict())
    
    elif request.method == 'PUT':
        data = request.json
        env.name = data.get('name', env.name)
        env.variables = data.get('variables', env.variables)
        db.session.commit()
        return jsonify(env.to_dict())
    
    elif request.method == 'DELETE':
        db.session.delete(env)
        db.session.commit()
        return jsonify({'success': True})

# Execution Endpoint
@api_bp.route('/execute', methods=['POST'])
def execute_request():
    request_data = request.json
    
    # Get active environment variables (example implementation)
    active_env_id = request_data.get('environment_id')  # Pass this from frontend
    environment_vars = {}
    if active_env_id:
        env = Environment.query.get(active_env_id)
        if env:
            environment_vars = env.variables or {}

    
    # Execute with variable substitution
    result = RequestExecutor.execute(request_data, environment_vars)

    # Save to history (existing code)
    if result['success']:
        history = History(
            request_data=request_data,
            response_status=result['status'],
            response_data=json.dumps(result['data']) if isinstance(result['data'], (dict, list)) else result['data'],
            response_headers=result['headers'],
            duration=result['duration']
        )
        db.session.add(history)
        db.session.commit()
    
    return jsonify(result)


# History Endpoints
@api_bp.route('/history', methods=['GET'])
def get_history():
    history = History.query.order_by(History.created_at.desc()).all()
    return jsonify([h.to_dict() for h in history])


@api_bp.route('/history/<int:id>', methods=['GET', 'DELETE'])
def handle_history_item(id):
    item = History.query.get_or_404(id)
    
    if request.method == 'GET':
        return jsonify(item.to_dict())
    else:
        db.session.delete(item)
        db.session.commit()
        return jsonify({'success': True})
