/**
 * HTTP utility functions
 * Contains functions for making HTTP requests (GET, POST, PUT, DELETE, etc.)
 */

/**
 * Interface for HTTP request options
 */
interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
  params?: Record<string, string>;
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
  withCredentials?: boolean;
}

/**
 * Interface for HTTP response
 */
interface HttpResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

/**
 * Formats URL with query parameters
 * 
 * @param url - Base URL
 * @param params - Query parameters object
 * @returns Formatted URL with query parameters
 */
const formatUrl = (url: string, params?: Record<string, string>): string => {
  if (!params || Object.keys(params).length === 0) {
    return url;
  }

  const queryString = Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  return url.includes('?') ? `${url}&${queryString}` : `${url}?${queryString}`;
};

/**
 * Parse response headers from XMLHttpRequest
 * 
 * @param xhr - XMLHttpRequest instance
 * @returns Parsed headers as an object
 */
const parseHeaders = (xhr: XMLHttpRequest): Record<string, string> => {
  const headerString = xhr.getAllResponseHeaders();
  const headers: Record<string, string> = {};

  if (!headerString) {
    return headers;
  }

  const headerPairs = headerString.trim().split('\r\n');
  headerPairs.forEach((header) => {
    const [key, value] = header.split(': ');
    headers[key.toLowerCase()] = value;
  });

  return headers;
};

/**
 * Handles XMLHttpRequest response
 * 
 * @param xhr - XMLHttpRequest instance
 * @param resolve - Promise resolve function
 * @param reject - Promise reject function
 * @param responseType - Expected response type
 */
const handleResponse = <T>(
  xhr: XMLHttpRequest,
  resolve: (value: HttpResponse<T>) => void,
  reject: (reason: any) => void,
  responseType: 'json' | 'text' | 'blob' | 'arraybuffer' = 'json'
): void => {
  const response: HttpResponse<any> = {
    data: null,
    status: xhr.status,
    statusText: xhr.statusText,
    headers: parseHeaders(xhr),
  };

  if (xhr.status >= 200 && xhr.status < 300) {
    try {
      if (responseType === 'json' && xhr.responseText) {
        response.data = JSON.parse(xhr.responseText);
      } else if (responseType === 'text') {
        response.data = xhr.responseText;
      } else {
        response.data = xhr.response;
      }
      resolve(response as HttpResponse<T>);
    } catch (error) {
      reject({
        ...response,
        error: new Error('Error parsing response'),
      });
    }
  } else {
    reject({
      ...response,
      error: new Error(`Request failed with status code ${xhr.status}`),
    });
  }
};

/**
 * Performs an HTTP PUT request to update data on the server
 * 
 * @param url - The endpoint URL
 * @param data - The data to send in the request body
 * @param options - Additional request options
 * @returns Promise resolving to the response
 */
export function put<T = any>(
  url: string, 
  data?: any, 
  options: RequestOptions = {}
): Promise<HttpResponse<T>> {
  return new Promise((resolve, reject) => {
    const {
      headers = {},
      timeout = 30000,
      params,
      responseType = 'json',
      withCredentials = false,
    } = options;

    // Format URL with query parameters if provided
    const formattedUrl = formatUrl(url, params);

    // Create new XMLHttpRequest instance
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', formattedUrl, true);
    
    // Set request headers
    xhr.timeout = timeout;
    xhr.responseType = responseType !== 'json' ? responseType : 'text';
    xhr.withCredentials = withCredentials;
    
    // Set default headers if not provided
    if (!headers['Content-Type'] && data !== undefined) {
      headers['Content-Type'] = 'application/json';
    }
    
    // Apply headers to the request
    Object.entries(headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
    });
    
    // Handle request completion
    xhr.onload = () => {
      handleResponse<T>(xhr, resolve, reject, responseType);
    };
    
    // Handle network errors
    xhr.onerror = () => {
      reject({
        data: null,
        status: 0,
        statusText: 'Network Error',
        headers: {},
        error: new Error('Network Error'),
      });
    };
    
    // Handle timeout
    xhr.ontimeout = () => {
      reject({
        data: null,
        status: 0,
        statusText: 'Timeout Error',
        headers: {},
        error: new Error(`Request timeout of ${timeout}ms exceeded`),
      });
    };

    // Send the request with data if provided
    if (data !== undefined) {
      const requestData = typeof data === 'object' && !(data instanceof FormData)
        ? JSON.stringify(data)
        : data;
      xhr.send(requestData);
    } else {
      xhr.send();
    }
  });
}

/**
 * Example usage of the PUT function
 * 
 * @example
 * // Basic PUT request
 * put('https://api.example.com/users/1', { name: 'John Doe' })
 *   .then(response => console.log(response.data))
 *   .catch(error => console.error(error));
 * 
 * @example
 * // PUT request with custom headers and options
 * put('https://api.example.com/users/1', 
 *   { name: 'John Doe' },
 *   { 
 *     headers: { 'Authorization': 'Bearer token123' },
 *     timeout: 5000,
 *     withCredentials: true
 *   }
 * ).then(response => console.log(response.data))
 *  .catch(error => console.error(error));
 */

// Export other HTTP methods (these would be implemented similarly)
export function get<T = any>(url: string, options?: RequestOptions): Promise<HttpResponse<T>> {
  // Implementation similar to put but with GET method
  // This is just a placeholder - you would implement this similarly
  return {} as any;
}

export function post<T = any>(url: string, data?: any, options?: RequestOptions): Promise<HttpResponse<T>> {
  // Implementation similar to put but with POST method
  // This is just a placeholder - you would implement this similarly
  return {} as any;
}

export function del<T = any>(url: string, options?: RequestOptions): Promise<HttpResponse<T>> {
  // Implementation similar to put but with DELETE method
  // This is just a placeholder - you would implement this similarly
  return {} as any;
}

export function patch<T = any>(url: string, data?: any, options?: RequestOptions): Promise<HttpResponse<T>> {
  // Implementation similar to put but with PATCH method
  // This is just a placeholder - you would implement this similarly
  return {} as any;
}

// Export a default object with all methods
export default {
  get,
  post,
  put,
  delete: del,
  patch
};