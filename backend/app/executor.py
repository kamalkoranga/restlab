import requests
import re
import json
from urllib.parse import urlparse
from datetime import datetime


def substitute_variables(url, variables):
    if not variables:
        return url
    """Replace {{var}} with values from environment"""
    for key, value in variables.items():
        url = url.replace(f'{{{{{key}}}}}', str(value))
    return url


def is_valid_url(url):
    """Check if the URL is properly formatted"""
    try:
        result = urlparse(url)
        return all([result.scheme in ('http', 'https'), result.netloc])
    except:
        return False


class RequestExecutor:
    @staticmethod
    def execute(request_data, environment_vars=None):
        try:
            url = substitute_variables(request_data['url'], environment_vars or {})
            
            if not is_valid_url(url):
                return {'success': False, 'error': f'Invalid URL: {url}'}

            headers = {
                substitute_variables(k, environment_vars or {}): substitute_variables(v, environment_vars or {})
                for k, v in request_data.get('headers', {}).items()
            }

            body = request_data.get('body')
            if isinstance(body, str):
                body = substitute_variables(body, environment_vars or {})
                try:
                    body = json.loads(body)  # Parse JSON if it's a string
                except:
                    pass

            start_time = datetime.now()
            
            # Make the request
            response = requests.request(
                method=request_data['method'],
                url=url,
                headers=headers,
                params=request_data.get('params', {}),
                json=body if isinstance(body, (dict, list)) else None,
                data=body if isinstance(body, str) else None,
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