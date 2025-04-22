import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Collection, ApiRequest } from '../types';
import { v4 as uuidv4 } from 'uuid';
import './FuturisticStyles.css';

export const Collections: React.FC = () => {
  const { 
    collections, 
    addCollection, 
    updateCollection,
    deleteCollection,
    deleteRequest,
  } = useAppContext();
  
  const [newCollectionName, setNewCollectionName] = useState('');
  const [expandedCollections, setExpandedCollections] = useState<Record<string, boolean>>({});
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ApiRequest | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  // Initialize expanded state for any new collections
  useEffect(() => {
    const newExpandedState = { ...expandedCollections };
    let stateChanged = false;
    
    collections.forEach(collection => {
      if (expandedCollections[collection.id] === undefined) {
        newExpandedState[collection.id] = true;
        stateChanged = true;
      }
    });
    
    if (stateChanged) {
      setExpandedCollections(newExpandedState);
    }
  }, [collections]);
  
  // Filter collections based on search query
  const filteredCollections = collections.filter(collection => 
    collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collection.requests.some(request => 
      request.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.url.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) return;
    
    const newCollection: Collection = {
      id: uuidv4(),
      name: newCollectionName,
      requests: []
    };
    
    addCollection(newCollection);
    setNewCollectionName('');
    setIsCreating(false);
  };

  const toggleCollectionExpand = (collectionId: string) => {
    setExpandedCollections(prev => ({
      ...prev,
      [collectionId]: !prev[collectionId]
    }));
  };

  const handleDeleteCollection = (collectionId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this collection?')) {
      deleteCollection(collectionId);
      if (selectedCollection?.id === collectionId) {
        setSelectedCollection(null);
        setSelectedRequest(null);
      }
    }
  };

  const handleDeleteRequest = (requestId: string, collectionId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this request?')) {
      deleteRequest(requestId, collectionId);
      if (selectedRequest?.id === requestId) {
        setSelectedRequest(null);
      }
    }
  };

  const handleSelectRequest = (request: ApiRequest, collection: Collection) => {
    setSelectedRequest(request);
    setSelectedCollection(collection);
  };

  const handleExportCollection = (collection: Collection, event: React.MouseEvent) => {
    event.stopPropagation();
    
    const dataStr = JSON.stringify(collection, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `${collection.name}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportCollection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const imported = JSON.parse(content) as Collection;
        
        // Validate the imported data
        if (!imported.name || !Array.isArray(imported.requests)) {
          throw new Error('Invalid collection format');
        }
        
        // Generate a new ID for the collection
        const newCollection: Collection = {
          ...imported,
          id: uuidv4(),
          // Ensure all requests have IDs
          requests: imported.requests.map(req => ({
            ...req,
            id: req.id || uuidv4()
          }))
        };
        
        addCollection(newCollection);
      } catch (error) {
        alert('Error importing collection: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    };
    reader.readAsText(file);
    
    // Reset the input
    event.target.value = '';
  };

  return (
    <div className="futuristic-container">
      <div className="futuristic-header">
        <h2>Collections</h2>
        <div className="futuristic-header-actions">
          <button
            className="futuristic-btn futuristic-btn-primary"
            onClick={() => setIsCreating(true)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            New Collection
          </button>
          
          <label className="futuristic-btn futuristic-btn-secondary import-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Import
            <input
              type="file"
              accept=".json"
              onChange={handleImportCollection}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      {isCreating && (
        <div className="futuristic-input-group futuristic-slide-in">
          <div className="futuristic-input-with-button">
            <input
              type="text"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              placeholder="Enter collection name"
              className="futuristic-input"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newCollectionName.trim()) {
                  handleCreateCollection();
                } else if (e.key === 'Escape') {
                  setIsCreating(false);
                  setNewCollectionName('');
                }
              }}
            />
            <button 
              onClick={handleCreateCollection}
              className="futuristic-btn futuristic-btn-primary"
              disabled={!newCollectionName.trim()}
            >
              Create
            </button>
          </div>
        </div>
      )}

      <div className="futuristic-input-group">
        <div className="futuristic-input-with-button">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search collections and requests..."
            className="futuristic-input"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="futuristic-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="futuristic-two-column">
        <div className="futuristic-sidebar">
          {filteredCollections.length === 0 ? (
            <div className="futuristic-empty-state">
              <svg className="futuristic-empty-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 5C5 3.89543 5.89543 3 7 3H9.5C10.0523 3 10.5 3.44772 10.5 4V8C10.5 8.55228 10.9477 9 11.5 9H15.5C16.0523 9 16.5 8.55228 16.5 8V4C16.5 3.44772 16.9477 3 17.5 3H20C21.1046 3 22 3.89543 22 5V19C22 20.1046 21.1046 21 20 21H7C5.89543 21 5 20.1046 5 19V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.5 3L16.5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.5 13H18.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.5 17H18.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="futuristic-empty-title">No collections found</p>
              <p className="futuristic-empty-description">
                {searchQuery ? 'Try a different search term' : 'Create your first collection to organize API requests'}
              </p>
            </div>
          ) : (
            <div className="collections-list">
              {filteredCollections.map((collection: Collection) => (
                <div 
                  key={collection.id} 
                  className={`futuristic-card collection-item ${selectedCollection?.id === collection.id ? 'active futuristic-glow-effect' : ''}`}
                >
                  <div className="collection-header" onClick={() => toggleCollectionExpand(collection.id)}>
                    <div className="collection-name">
                      <svg 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg" 
                        style={{ 
                          transform: expandedCollections[collection.id] ? 'rotate(90deg)' : 'none', 
                          transition: 'transform 0.3s ease' 
                        }}
                      >
                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>{collection.name}</span>
                      <span className="collection-count">{collection.requests.length}</span>
                    </div>
                    <div className="collection-actions">
                      <button
                        onClick={(e) => handleExportCollection(collection, e)}
                        className="futuristic-btn"
                        title="Export Collection"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button
                        onClick={(e) => handleDeleteCollection(collection.id, e)}
                        className="futuristic-btn"
                        title="Delete Collection"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M19 6V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {expandedCollections[collection.id] && (
                    <div className="requests-list-container futuristic-slide-in">
                      {collection.requests.length === 0 ? (
                        <div className="empty-requests">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 9V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 19C16.4183 19 20 15.4183 20 11C20 6.58172 16.4183 3 12 3C7.58172 3 4 6.58172 4 11C4 12.2145 4.268 13.3698 4.74437 14.4042C4.93756 14.8308 5.02476 15.056 5.00108 15.2754C4.97915 15.4751 4.89377 15.6653 4.76164 15.8182C4.61633 15.9907 4.3915 16.0709 3.94188 16.2313L2.54188 16.6612C2.19049 16.7787 2.01476 16.8373 1.90808 16.9514C1.81421 17.0521 1.76218 17.1807 1.76073 17.314C1.75911 17.4634 1.83852 17.6237 1.99733 17.9445L3.49733 20.4445C3.65614 20.7652 3.73557 20.9256 3.87438 21.0136C3.99598 21.0908 4.14435 21.1177 4.28923 21.0896C4.45213 21.0576 4.60928 20.9342 4.92355 20.6876L6.5867 19.3195C6.89374 19.0765 7.04727 18.9551 7.21633 18.8975C7.36519 18.8465 7.52228 18.8255 7.67963 18.8357C7.85917 18.8473 8.03275 18.9145 8.37984 19.0487C9.44628 19.4656 10.6421 19.7048 11.9156 19.7048" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <p>No requests in this collection</p>
                          <p className="empty-description">Save requests to this collection for easy access</p>
                        </div>
                      ) : (
                        <div className="requests-list">
                          {collection.requests.map((request: ApiRequest) => (
                            <div 
                              key={request.id} 
                              className={`request-item ${selectedRequest?.id === request.id ? 'active' : ''}`}
                              onClick={() => handleSelectRequest(request, collection)}
                            >
                              <div className="request-item-content">
                                <span className={`futuristic-method futuristic-method-${request.method.toLowerCase()}`}>
                                  {request.method}
                                </span>
                                <span className="request-name">{request.name || request.url}</span>
                              </div>
                              <button
                                onClick={(e) => handleDeleteRequest(request.id, collection.id, e)}
                                className="futuristic-btn"
                                title="Delete Request"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="futuristic-content">
          {selectedRequest ? (
            <div className="request-details futuristic-slide-in">
              <div className="request-details-header">
                <h3>{selectedRequest.name || 'Untitled Request'}</h3>
                <div className="request-label-container">
                  <span className={`futuristic-method futuristic-method-${selectedRequest.method.toLowerCase()}`}>
                    {selectedRequest.method}
                  </span>
                </div>
              </div>
              
              <div className="request-url-display">
                <div className="url-label">URL</div>
                <div className="url-value">{selectedRequest.url}</div>
              </div>
              
              {selectedRequest.params.length > 0 && (
                <div className="request-section">
                  <div className="section-header">
                    <h4>Query Parameters</h4>
                    <div className="section-badge">{selectedRequest.params.length}</div>
                  </div>
                  <table className="futuristic-table">
                    <thead>
                      <tr>
                        <th>Key</th>
                        <th>Value</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRequest.params.map((param, index) => (
                        <tr key={index}>
                          <td>{param.key}</td>
                          <td>{param.value}</td>
                          <td>
                            <span className={`status-pill ${param.enabled ? 'enabled' : 'disabled'}`}>
                              {param.enabled ? 'Enabled' : 'Disabled'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {selectedRequest.headers.length > 0 && (
                <div className="request-section">
                  <div className="section-header">
                    <h4>Headers</h4>
                    <div className="section-badge">{selectedRequest.headers.length}</div>
                  </div>
                  <table className="futuristic-table">
                    <thead>
                      <tr>
                        <th>Key</th>
                        <th>Value</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRequest.headers.map((header, index) => (
                        <tr key={index}>
                          <td>{header.key}</td>
                          <td>{header.value}</td>
                          <td>
                            <span className={`status-pill ${header.enabled ? 'enabled' : 'disabled'}`}>
                              {header.enabled ? 'Enabled' : 'Disabled'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {selectedRequest.body.mode !== 'none' && (
                <div className="request-section">
                  <div className="section-header">
                    <h4>Body</h4>
                    <div className="section-type-badge">{selectedRequest.body.mode}</div>
                  </div>
                  
                  {selectedRequest.body.mode === 'raw' && selectedRequest.body.raw && (
                    <div className="body-preview-container">
                      <pre className="body-preview">{selectedRequest.body.raw}</pre>
                    </div>
                  )}
                  
                  {selectedRequest.body.mode === 'form-data' && selectedRequest.body.formData && (
                    <table className="futuristic-table">
                      <thead>
                        <tr>
                          <th>Key</th>
                          <th>Value</th>
                          <th>Type</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRequest.body.formData.map((item, index) => (
                          <tr key={index}>
                            <td>{item.key}</td>
                            <td>{item.value}</td>
                            <td>
                              <span className="type-badge">{item.type}</span>
                            </td>
                            <td>
                              <span className={`status-pill ${item.enabled ? 'enabled' : 'disabled'}`}>
                                {item.enabled ? 'Enabled' : 'Disabled'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              <div className="request-actions">
                <button className="futuristic-btn futuristic-btn-primary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Send Request
                </button>
                <button className="futuristic-btn futuristic-btn-secondary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 3.33782C15.5291 2.48697 13.8214 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 10.1786 21.513 8.47087 20.6622 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 5V2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 22V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 5L7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17 17L19 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Make a Copy
                </button>
              </div>
            </div>
          ) : (
            <div className="futuristic-empty-state">
              <svg className="futuristic-empty-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 16V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="futuristic-empty-title">Select a request</p>
              <p className="futuristic-empty-description">Click on a request from a collection to view its details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};