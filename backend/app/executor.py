import requests
import json
from datetime import datetime

class RequestExecutor:
    @staticmethod
    def execute(request_data):
        try:
            start_time = datetime.now()
            
            # Prepare headers
            headers = request_data.get('headers', {})
            if 'Content-Type' not in headers and request_data.get('body'):
                headers['Content-Type'] = 'application/json'
            
            # Make the request
            response = requests.request(
                method=request_data['method'],
                url=request_data['url'],
                headers=headers,
                params=request_data.get('params', {}),
                json=request_data.get('body'),
                timeout=10
            )
            
            duration = (datetime.now() - start_time).total_seconds()
            
            # Try to parse JSON response
            try:
                response_data = response.json()
            except ValueError:
                response_data = response.text
            
            return {
                'success': True,
                'status': response.status_code,
                'headers': dict(response.headers),
                'data': response_data,
                'duration': duration
            }
        except requests.exceptions.Timeout:
            return {'success': False, 'error': 'Request timed out'}
        except requests.exceptions.RequestException as e:
            return {'success': False, 'error': str(e)}