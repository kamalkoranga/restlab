import React, { useState, useEffect, useRef } from 'react';
import { KeyValueEditor, KeyValueItem } from './KeyValueEditor';
import { useAppContext } from '../contexts/AppContext';
import { ApiRequest, ApiResponse, HttpMethod, Header, QueryParam, FormDataEntry } from '../types';
import { makeRequest, formatJson } from '../utils/apiUtils';
import { v4 as uuidv4 } from 'uuid';
import { SendButton } from './SendButton';
import { MethodDropdown } from './MethodDropdown'; // Import the new MethodDropdown component

// Import the CSS file for styling
import './AdvancedStyles.css';

// RequestBuilder component for handling API requests
export const RequestBuilder: React.FC = () => {
  const { collections, activeEnvironment, replaceVariables, addToHistory, saveRequest } = useAppContext();
  
  const [request, setRequest] = useState<ApiRequest>({
    id: uuidv4(),
    name: 'New Request',
    url: '',
    method: 'GET',
    headers: [],
    params: [],
    body: {
      mode: 'none',
    }
  });
  
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'params' | 'headers' | 'body'>('params');
  const [bodyType, setBodyType] = useState<'none' | 'raw' | 'form-data'>('none');
  const [rawBody, setRawBody] = useState('');
  const [formData, setFormData] = useState<FormDataEntry[]>([]);
  const [viewMode, setViewMode] = useState<'pretty' | 'raw'>('pretty');
  const [saveToCollection, setSaveToCollection] = useState('');
  const [requestName, setRequestName] = useState('New Request');
  const [saveError, setSaveError] = useState('');
  const [activeResponseTab, setActiveResponseTab] = useState<'body' | 'headers'>('body');
  const [jsonFormatError, setJsonFormatError] = useState('');
  
  const urlInputRef = useRef<HTMLInputElement>(null);
  const responseRef = useRef<HTMLDivElement>(null);
  // Focus URL input on component mount
  useEffect(() => {
    if (urlInputRef.current) {
      urlInputRef.current.focus();
    }
  }, []);

  // Scroll to response when it appears
  useEffect(() => {
    if (response && responseRef.current) {
      responseRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [response]);

  // Update request body when body type changes
  useEffect(() => {
    setRequest(prev => ({
      ...prev,
      body: {
        mode: bodyType,
        raw: bodyType === 'raw' ? rawBody : undefined,
        formData: bodyType === 'form-data' ? formData : undefined
      }
    }));
  }, [bodyType, rawBody, formData]);


  const handleSendRequest = async () => {
    // Validate body if JSON is selected
    if (bodyType === 'raw' && rawBody.trim() !== '') {
      try {
        JSON.parse(rawBody);
        setJsonFormatError('');
      } catch (e) {
        setJsonFormatError('Invalid JSON format');
        return;
      }
    }
    
    setIsLoading(true);
    setResponse(null);
    
    try {
      const apiResponse = await makeRequest(request, replaceVariables);
      setResponse(apiResponse);
      
      // Add to history
      const historyEntry = {
        id: uuidv4(),
        timestamp: Date.now(),
        request: { ...request },
        response: apiResponse
      };
      
      addToHistory(historyEntry);
    } catch (error) {
      console.error('Error sending request:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveRequest = () => {
    if (!saveToCollection) {
      setSaveError('Please select a collection');
      return;
    }
    
    if (!requestName.trim()) {
      setSaveError('Please enter a request name');
      return;
    }
    
    setSaveError('');
    
    const requestToSave: ApiRequest = {
      ...request,
      name: requestName
    };
    
    // Use the saveRequest function from context
    saveRequest(requestToSave, saveToCollection);
  };
  
  const handleMethodChange = (method: HttpMethod) => {
    setRequest(prev => ({ ...prev, method }));
  };
  
  const handleUrlChange = (url: string) => {
    setRequest(prev => ({ ...prev, url }));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendRequest();
    }
  };
  
  const handleHeadersChange = (headers: Header[]) => {
    setRequest(prev => ({ ...prev, headers }));
  };
  
  const handleParamsChange = (params: QueryParam[]) => {
    setRequest(prev => ({ ...prev, params }));
  };
  
  const handleFormDataChange = (items: FormDataEntry[]) => {
    setFormData(items);
  };

  const formatRawBody = () => {
    if (rawBody.trim() === '') return;
    
    try {
      const formatted = formatJson(rawBody);
      setRawBody(formatted);
      setJsonFormatError('');
    } catch (e) {
      setJsonFormatError('Invalid JSON format');
    }
  };
  
  const renderResponseBody = () => {
    if (!response) return null;
    
    try {
      // Try to parse as JSON
      const isJson = response.headers['content-type']?.includes('application/json') || 
                    (response.body.trim().startsWith('{') && response.body.trim().endsWith('}')) ||
                    (response.body.trim().startsWith('[') && response.body.trim().endsWith(']'));
      
      if (isJson && viewMode === 'pretty') {
        const formattedJson = formatJson(response.body);
        return (
          <pre className="response-body json">{formattedJson}</pre>
        );
      }
      
      // Default to raw
      return (
        <pre className="response-body raw">{response.body}</pre>
      );
    } catch (e) {
      // If JSON parsing fails, show as raw
      return (
        <pre className="response-body raw">{response.body}</pre>
      );
    }
  };

  const getStatusColorClass = (status: number) => {
    if (status === 0) return 'status-0xx';
    if (status >= 200 && status < 300) return 'status-2xx';
    if (status >= 300 && status < 400) return 'status-3xx';
    if (status >= 400 && status < 500) return 'status-4xx';
    return 'status-5xx';
  };
  

  return (
    <div className="component-container request-builder-modern">
      <div className="component-header">
        <h2><span className="gradient-text">API Request Builder</span></h2>
        <div className="environment-pill">
          {activeEnvironment ? (
            <div className="active-env">
              <div className="env-indicator"></div>
              <span>{activeEnvironment.name}</span>
            </div>
          ) : (
            <div className="no-env">No active environment</div>
          )}
        </div>
      </div>

      {/* URL Bar */}
      <div className="url-container glass-panel">
        {/* Replace the old method dropdown with the new MethodDropdown component */}
        <MethodDropdown 
          selectedMethod={request.method}
          onMethodChange={handleMethodChange}
          className="method-dropdown-modern"
        />
        
        <input
          ref={urlInputRef}
          type="text"
          value={request.url}
          onChange={(e) => handleUrlChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter request URL (e.g., https://api.example.com/endpoint)"
          className="url-input-modern"
        />
        
        {/* Replace the existing send button with the new SendButton component */}
        <SendButton 
          onClick={handleSendRequest}
          isLoading={isLoading}
          disabled={!request.url}
          method={request.method}
          size="medium"
          className="url-send-button"
        />
      </div>
      
      {/* Request tabs */}
      <div className="tabs-container">
        <ul className="tabs-list-modern">
          <li 
            className={`tab-item-modern ${activeTab === 'params' ? 'active' : ''}`}
            onClick={() => setActiveTab('params')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 5H3V7H21V5Z" fill="currentColor"/>
              <path d="M21 11H3V13H21V11Z" fill="currentColor"/>
              <path d="M21 17H3V19H21V17Z" fill="currentColor"/>
            </svg>
            Params
          </li>
          <li 
            className={`tab-item-modern ${activeTab === 'headers' ? 'active' : ''}`}
            onClick={() => setActiveTab('headers')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 4H21V6H3V4Z" fill="currentColor"/>
              <path d="M3 11H15V13H3V11Z" fill="currentColor"/>
              <path d="M3 18H9V20H3V18Z" fill="currentColor"/>
            </svg>
            Headers
          </li>
          <li 
            className={`tab-item-modern ${activeTab === 'body' ? 'active' : ''}`}
            onClick={() => setActiveTab('body')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H20V18H4V6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 14H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Body
          </li>
        </ul>
      </div>
      
      {/* Tab content */}
      <div className="tab-content glass-panel">
        {activeTab === 'params' && (
          <KeyValueEditor 
            items={request.params}
            onChange={handleParamsChange}
            keyPlaceholder="Parameter name"
            valuePlaceholder="Parameter value"
            title="Query Parameters"
          />
        )}
        
        {activeTab === 'headers' && (
          <KeyValueEditor 
            items={request.headers}
            onChange={handleHeadersChange}
            keyPlaceholder="Header name"
            valuePlaceholder="Header value"
            title="Request Headers"
          />
        )}
        
        {activeTab === 'body' && (
          <div className="body-editor-modern">
            <div className="body-type-select-modern">
              <button 
                className={`body-type-button ${bodyType === 'none' ? 'active' : ''}`}
                onClick={() => setBodyType('none')}
              >
                None
              </button>
              <button 
                className={`body-type-button ${bodyType === 'raw' ? 'active' : ''}`}
                onClick={() => setBodyType('raw')}
              >
                Raw JSON
              </button>
              <button 
                className={`body-type-button ${bodyType === 'form-data' ? 'active' : ''}`}
                onClick={() => setBodyType('form-data')}
              >
                Form Data
              </button>
            </div>
            
            {bodyType === 'raw' && (
              <div className="raw-body-container-modern">
                <div className="raw-body-header">
                  <div className="body-type-label">JSON</div>
                  <button 
                    onClick={formatRawBody}
                    className="format-button-modern"
                    title="Format JSON"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 10H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M11 14H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7 18H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7 6H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Format
                  </button>
                </div>
                {jsonFormatError && (
                  <div className="json-error-modern">{jsonFormatError}</div>
                )}
                <textarea
                  value={rawBody}
                  onChange={(e) => setRawBody(e.target.value)}
                  placeholder='Enter raw JSON body, e.g., {"key": "value"}'
                  className={`raw-body-input-modern ${jsonFormatError ? 'has-error' : ''}`}
                  rows={10}
                />
              </div>
            )}
            
            {bodyType === 'form-data' && (
              <KeyValueEditor 
                items={formData as KeyValueItem[]}
                onChange={(items: KeyValueItem[]) => handleFormDataChange(items as FormDataEntry[])}
                allowTypeSelection={true}
                keyPlaceholder="Key"
                valuePlaceholder="Value"
                title="Form Data"
              />
            )}
          </div>
        )}
      </div>
      
      {/* Save Request */}
      <div className="save-request-modern glass-panel">
        <div className="section-header">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17 21V13H7V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 3V8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h3>Save Request</h3>
        </div>
        
        <div className="save-request-inputs">
          <div className="input-group">
            <label htmlFor="requestName">Name</label>
            <input
              id="requestName"
              type="text"
              value={requestName}
              onChange={(e) => setRequestName(e.target.value)}
              placeholder="Request Name"
              className="modern-input"
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="saveCollection">Collection</label>
            <select 
              id="saveCollection"
              value={saveToCollection}
              onChange={(e) => setSaveToCollection(e.target.value)}
              className="modern-select"
            >
              <option value="">Select Collection</option>
              {collections.map((collection: any) => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Use SendButton for the save button as well with custom styling */}
        <SendButton 
          onClick={handleSaveRequest}
          isLoading={false}
          disabled={!requestName.trim() || !saveToCollection}
          method="POST"
          size="medium"
          className="save-button-override"
        />
        
        {saveError && <div className="error-message-modern">{saveError}</div>}
      </div>
      
      {/* Response Panel */}
      {response && (
        <div className="response-panel-modern" ref={responseRef}>
          <div className="section-header response-header-modern">
            <div className="response-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h3>Response</h3>
            </div>
            
            <div className="response-status-container">
              <div className={`status-badge-modern ${getStatusColorClass(response.status)}`}>
                <span className="status-code">{response.status}</span>
                <span className="status-text">{response.statusText}</span>
              </div>
            </div>

            <div className="response-meta">
              <div className="meta-item" title="Response Time">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>{response.time.toFixed(0)}ms</span>
              </div>
              <div className="meta-item" title="Response Size">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 16V8C20.9996 7.64928 20.9071 7.30481 20.7315 7.00116C20.556 6.69752 20.3037 6.44536 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44536 3.44398 6.69752 3.26846 7.00116C3.09294 7.30481 3.00036 7.64928 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                </svg>
                <span>{(response.size / 1024).toFixed(2)}KB</span>
              </div>
            </div>
          </div>
          
          <div className="tabs-container">
            <ul className="tabs-list-modern">
              <li 
                className={`tab-item-modern ${activeResponseTab === 'body' ? 'active' : ''}`}
                onClick={() => setActiveResponseTab('body')}
              >
                Body
              </li>
              <li 
                className={`tab-item-modern ${activeResponseTab === 'headers' ? 'active' : ''}`}
                onClick={() => setActiveResponseTab('headers')}
              >
                Headers
              </li>
            </ul>
          </div>
          
          <div className="response-tab-content glass-panel">
            {activeResponseTab === 'body' && (
              <>
                <div className="view-mode-toggle-modern">
                  <button 
                    className={`view-mode-button-modern ${viewMode === 'pretty' ? 'active' : ''}`}
                    onClick={() => setViewMode('pretty')}
                  >
                    Pretty
                  </button>
                  <button 
                    className={`view-mode-button-modern ${viewMode === 'raw' ? 'active' : ''}`}
                    onClick={() => setViewMode('raw')}
                  >
                    Raw
                  </button>
                </div>
                <div className="response-body-container-modern">
                  {renderResponseBody()}
                </div>
              </>
            )}
            
            {activeResponseTab === 'headers' && (
              <div className="response-headers-container-modern">
                {Object.keys(response.headers).length > 0 ? (
                  <table className="modern-table">
                    <thead>
                      <tr>
                        <th>Header</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(response.headers).map(([key, value], index) => (
                        <tr key={index}>
                          <td>{key}</td>
                          <td>{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="empty-state">No headers in response</div>
                )}
              </div>
            )}
          </div>
          
          {/* Add a retry button using SendButton component */}
          <div className="response-actions">
            <SendButton 
              onClick={handleSendRequest}
              isLoading={isLoading}
              disabled={!request.url}
              method={request.method}
              size="small"
              className="retry-request-button"
            />
            <button className="copy-response-button" onClick={() => {
              navigator.clipboard.writeText(response.body);
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
