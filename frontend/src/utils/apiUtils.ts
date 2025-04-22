import { ApiRequest, ApiResponse, Header, QueryParam } from '../types';

// Function to build URL with query parameters
export const buildUrl = (request: ApiRequest): string => {
  const { url, params } = request;
  
  // If no enabled params, return the URL as is
  const enabledParams = params.filter(param => param.enabled);
  if (enabledParams.length === 0) {
    return url;
  }

  // Parse the URL to handle existing query parameters
  const urlObj = new URL(url.startsWith('http') ? url : `http://${url}`);
  
  // Add enabled params to URL
  enabledParams.forEach(param => {
    urlObj.searchParams.append(param.key, param.value);
  });

  // Return the URL with the protocol if it was originally there
  return url.startsWith('http') ? urlObj.toString() : urlObj.toString().slice(7);
};

// Function to prepare headers
export const prepareHeaders = (headers: Header[]): Record<string, string> => {
  const headerObj: Record<string, string> = {};
  
  headers.filter(header => header.enabled).forEach(header => {
    headerObj[header.key] = header.value;
  });
  
  return headerObj;
};

// Function to make API request
export const makeRequest = async (
  request: ApiRequest, 
  replaceVariables: (text: string) => string
): Promise<ApiResponse> => {
  const startTime = performance.now();
  
  try {
    // Replace environment variables in URL and other fields
    const processedUrl = replaceVariables(request.url);
    const processedHeaders = request.headers.map(header => ({
      ...header,
      value: replaceVariables(header.value)
    }));
    const processedParams = request.params.map(param => ({
      ...param,
      value: replaceVariables(param.value)
    }));
    
    // Build the URL with query parameters
    const url = buildUrl({
      ...request,
      url: processedUrl,
      params: processedParams
    });
    
    // Prepare headers
    const headers = prepareHeaders(processedHeaders);
    
    // Prepare request options
    const options: RequestInit = {
      method: request.method,
      headers: headers,
      mode: 'cors',
    };
    
    // Add body if necessary
    if (request.method !== 'GET' && request.body.mode !== 'none') {
      if (request.body.mode === 'raw' && request.body.raw) {
        options.body = replaceVariables(request.body.raw);
      } else if (request.body.mode === 'form-data' && request.body.formData) {
        const formData = new FormData();
        request.body.formData
          .filter(item => item.enabled)
          .forEach(item => {
            formData.append(item.key, replaceVariables(item.value));
          });
        options.body = formData;
      }
    }
    
    // Make the request
    const response = await fetch(url, options);
    
    // Parse the response
    const responseText = await response.text();
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    
    // Extract headers
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });
    
    return {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      body: responseText,
      time: responseTime,
      size: new Blob([responseText]).size
    };
  } catch (error) {
    const endTime = performance.now();
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return {
      status: 0,
      statusText: 'Error',
      headers: {},
      body: `Error: ${errorMessage}`,
      time: endTime - startTime,
      size: 0
    };
  }
};

// Function to format JSON for display
export const formatJson = (jsonString: string): string => {
  try {
    const obj = JSON.parse(jsonString);
    return JSON.stringify(obj, null, 2);
  } catch (e) {
    return jsonString; // Return as-is if not valid JSON
  }
}; 