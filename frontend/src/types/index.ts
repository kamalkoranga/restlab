export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';

export interface Header {
  key: string;
  value: string;
  enabled: boolean;
}

export interface QueryParam {
  key: string;
  value: string;
  enabled: boolean;
}

export interface FormDataEntry {
  key: string;
  value: string;
  type: 'text' | 'file';
  enabled: boolean;
}

export interface ApiRequest {
  id: string;
  name: string;
  url: string;
  method: HttpMethod;
  headers: Header[];
  params: QueryParam[];
  body: {
    mode: 'none' | 'raw' | 'form-data';
    raw?: string;
    formData?: FormDataEntry[];
  };
}

export interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  time: number;
  size: number;
}

export interface Collection {
  id: string;
  name: string;
  requests: ApiRequest[];
}

export interface EnvironmentVariable {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
  category?: string;
}

export interface Environment {
  id: string;
  name: string;
  description?: string;
  variables: EnvironmentVariable[];
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  request: ApiRequest;
  response?: ApiResponse;
} 
