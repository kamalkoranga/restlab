import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { HistoryEntry } from '../types';
import { formatJson } from '../utils/apiUtils';
import './ComponentStyles.css';

export const History: React.FC = () => {
  const { history, clearHistory } = useAppContext();
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);
  const [activeTab, setActiveTab] = useState<'request' | 'response'>('response');
  const [responseTab, setResponseTab] = useState<'body' | 'headers'>('body');
  const [viewMode, setViewMode] = useState<'pretty' | 'raw'>('pretty');
  
  const handleSelectEntry = (entry: HistoryEntry) => {
    setSelectedEntry(entry);
  };
  
  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all history entries?')) {
      clearHistory();
      setSelectedEntry(null);
    }
  };
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  const getStatusColorClass = (status: number) => {
    if (status === 0) return 'status-0xx';
    if (status >= 200 && status < 300) return 'status-2xx';
    if (status >= 300 && status < 400) return 'status-3xx';
    if (status >= 400 && status < 500) return 'status-4xx';
    return 'status-5xx';
  };
  
  const renderResponseBody = () => {
    if (!selectedEntry?.response) return null;
    
    try {
      // Try to parse as JSON
      const response = selectedEntry.response;
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
        <pre className="response-body raw">{selectedEntry.response.body}</pre>
      );
    }
  };

  return (
    <div className="component-container">
      <div className="component-header">
        <h2>Request History</h2>
        <div className="component-header-actions">
          <button 
            className="btn btn-danger"
            onClick={handleClearHistory}
            disabled={history.length === 0}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '4px'}}>
              <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19 6V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Clear History
          </button>
        </div>
      </div>

      <div className="collections-layout">
        <div className="collections-sidebar">
          {history.length === 0 ? (
            <div className="empty-state">
              <svg className="empty-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.05078 11.0002C3.27805 7.56152 5.71096 4.64312 9.0001 3.76643C12.2892 2.88975 15.7648 4.27499 17.4966 7.21024C19.2284 10.1455 18.8102 13.916 16.4289 16.3668C14.0475 18.8176 10.2653 19.3433 7.22474 17.7646" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 11.0002V5.00024" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 11.0002H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="empty-title">No request history</p>
              <p className="empty-description">Your API request history will appear here after you make requests</p>
            </div>
          ) : (
            <div className="history-list">
              {history.map((entry: HistoryEntry) => (
                <div 
                  key={entry.id} 
                  className={`history-item ${selectedEntry?.id === entry.id ? 'active' : ''}`}
                  onClick={() => handleSelectEntry(entry)}
                >
                  <div className="history-header">
                    <div className="history-method-url">
                      <span className={`request-method-badge method-${entry.request.method.toLowerCase()}`}>
                        {entry.request.method}
                      </span>
                      <span className="history-url">{entry.request.url}</span>
                    </div>
                  </div>
                  <div className="history-response-info">
                    {entry.response ? (
                      <div className="response-status">
                        <span className={`status-badge ${getStatusColorClass(entry.response.status)}`}>
                          {entry.response.status} {entry.response.statusText}
                        </span>
                      </div>
                    ) : (
                      <span className="error-message">Failed</span>
                    )}
                    <span className="history-timestamp">{formatDate(entry.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="collections-content">
          {selectedEntry ? (
            <div className="entry-details">
              <div className="tabs-container">
                <ul className="tabs-list">
                  <li 
                    className={`tab-item ${activeTab === 'request' ? 'active' : ''}`}
                    onClick={() => setActiveTab('request')}
                  >
                    Request
                  </li>
                  <li 
                    className={`tab-item ${activeTab === 'response' ? 'active' : ''}`}
                    onClick={() => setActiveTab('response')}
                  >
                    Response
                  </li>
                </ul>
              </div>

              {activeTab === 'request' && 
                <div className="request-details">
                  <h3>{selectedEntry.request.name || 'Request Details'}</h3>
                  <div className="request-url">
                    <span className={`method method-${selectedEntry.request.method.toLowerCase()}`}>
                      {selectedEntry.request.method}
                    </span>
                    <span className="url">{selectedEntry.request.url}</span>
                  </div>
                  
                  {selectedEntry.request.params.length > 0 && (
                    <div className="request-section">
                      <h4>Query Parameters</h4>
                      <table className="details-table">
                        <thead>
                          <tr>
                            <th>Key</th>
                            <th>Value</th>
                            <th>Enabled</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedEntry.request.params.map((param, index) => (
                            <tr key={index}>
                              <td>{param.key}</td>
                              <td>{param.value}</td>
                              <td>{param.enabled ? 'Yes' : 'No'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  
                  {selectedEntry.request.headers.length > 0 && (
                    <div className="request-section">
                      <h4>Headers</h4>
                      <table className="details-table">
                        <thead>
                          <tr>
                            <th>Key</th>
                            <th>Value</th>
                            <th>Enabled</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedEntry.request.headers.map((header, index) => (
                            <tr key={index}>
                              <td>{header.key}</td>
                              <td>{header.value}</td>
                              <td>{header.enabled ? 'Yes' : 'No'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  
                  {selectedEntry.request.body.mode !== 'none' && (
                    <div className="request-section">
                      <h4>Body</h4>
                      {selectedEntry.request.body.mode === 'raw' && selectedEntry.request.body.raw && (
                        <pre className="body-preview">{selectedEntry.request.body.raw}</pre>
                      )}
                      
                      {selectedEntry.request.body.mode === 'form-data' && selectedEntry.request.body.formData && (
                        <table className="details-table">
                          <thead>
                            <tr>
                              <th>Key</th>
                              <th>Value</th>
                              <th>Type</th>
                              <th>Enabled</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedEntry.request.body.formData.map((item, index) => (
                              <tr key={index}>
                                <td>{item.key}</td>
                                <td>{item.value}</td>
                                <td>{item.type}</td>
                                <td>{item.enabled ? 'Yes' : 'No'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                </div>
              
              }

              {activeTab === 'response' && (
                <div className="response-details">
                  {selectedEntry.response ? (
                    <>
                      <div className="response-header">
                        <div className="response-status">
                          <span className={`status-badge ${getStatusColorClass(selectedEntry.response.status)}`}>
                            {selectedEntry.response.status} {selectedEntry.response.statusText}
                          </span>
                        </div>
                        <div className="response-meta">
                          <span className="response-time">{selectedEntry.response.time} ms</span>
                          <span className="response-size">{selectedEntry.response.size} B</span>
                        </div>
                      </div>

                      <div className="tabs-container">
                        <ul className="tabs-list">
                          <li 
                            className={`tab-item ${responseTab === 'body' ? 'active' : ''}`}
                            onClick={() => setResponseTab('body')}
                          >
                            Response Body
                          </li>
                          <li 
                            className={`tab-item ${responseTab === 'headers' ? 'active' : ''}`}
                            onClick={() => setResponseTab('headers')}
                          >
                            Response Headers
                          </li>
                        </ul>
                      </div>

                      {responseTab === 'body' && (
                        <>
                          <div className="view-mode-toggle">
                            <button 
                              className={`view-mode-button ${viewMode === 'pretty' ? 'active' : ''}`}
                              onClick={() => setViewMode('pretty')}
                            >
                              Pretty
                            </button>
                            <button 
                              className={`view-mode-button ${viewMode === 'raw' ? 'active' : ''}`}
                              onClick={() => setViewMode('raw')}
                            >
                              Raw
                            </button>
                          </div>
                          <div className="response-body-container">
                            {renderResponseBody()}
                          </div>
                        </>
                      )}
                      
                      {responseTab === 'headers' && (
                        <div className="response-headers-container">
                          <table className="headers-table">
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Value</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(selectedEntry.response.headers).map(([name, value]) => (
                                <tr key={name}>
                                  <td>{name}</td>
                                  <td>{value}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="empty-state small">
                      <p>No response received</p>
                      <p className="empty-description">The request failed or was cancelled before a response was received</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="no-selection">
              <div className="empty-state">
                <svg className="empty-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 16V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p className="empty-title">Select a history item</p>
                <p className="empty-description">Click on a request from the history to view its details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 
