
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Environment, EnvironmentVariable } from '../types';
import { v4 as uuidv4 } from 'uuid';
import './FuturisticStyles.css';

export const Environments: React.FC = () => {
  const {
    environments,
    activeEnvironment,
    addEnvironment,
    updateEnvironment,
    deleteEnvironment,
    setActiveEnvironment
  } = useAppContext();

  const [newEnvName, setNewEnvName] = useState('');
  const [selectedEnvironment, setSelectedEnvironment] = useState<Environment | null>(activeEnvironment);
  const [isEditing, setIsEditing] = useState(false);
  const [newVariable, setNewVariable] = useState<Omit<EnvironmentVariable, 'id'>>({
    key: '',
    value: '',
    enabled: true,
    category: 'general'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [variableFilter, setVariableFilter] = useState('all');
  const [showSecretValues, setShowSecretValues] = useState<Record<string, boolean>>({});
  const [bulkText, setBulkText] = useState('');
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [variableCategories] = useState(['general', 'api', 'auth', 'database', 'custom']);

  // Initialize selected environment if there's an active one
  useEffect(() => {
    if (activeEnvironment && !selectedEnvironment) {
      setSelectedEnvironment(activeEnvironment);
    }
  }, [activeEnvironment, selectedEnvironment]);

  // Filter environments based on search
  const filteredEnvironments = searchQuery
    ? environments.filter(env =>
      env.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      env.variables.some(v =>
        v.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.value.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
    : environments;

  // Filter variables by category
  const filteredVariables = selectedEnvironment?.variables.filter(variable => {
    if (variableFilter === 'all') return true;
    return variable.category === variableFilter;
  }) || [];

  const handleCreateEnvironment = () => {
    if (!newEnvName.trim()) return;

    const newEnvironment: Environment = {
      id: uuidv4(),
      name: newEnvName,
      variables: [],
      description: ''
    };

    addEnvironment(newEnvironment);
    setNewEnvName('');
    setSelectedEnvironment(newEnvironment);
    setIsCreating(false);
  };

  const handleUpdateEnvironmentField = (field: string, value: string) => {
    if (!selectedEnvironment) return;

    const updatedEnvironment: Environment = {
      ...selectedEnvironment,
      [field]: value
    };

    updateEnvironment(updatedEnvironment);
    setSelectedEnvironment(updatedEnvironment);
  };

  const handleSelectEnvironment = (environment: Environment) => {
    setSelectedEnvironment(environment);
    setIsEditing(false);
    setIsBulkMode(false);
    setVariableFilter('all');
  };

  const handleSetActive = (environmentId: string | null, event: React.MouseEvent) => {
    event.stopPropagation();
    setActiveEnvironment(environmentId);
  };

  const handleDeleteEnvironment = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();

    if (window.confirm('Are you sure you want to delete this environment?')) {
      deleteEnvironment(id);
      if (selectedEnvironment?.id === id) {
        setSelectedEnvironment(null);
        setIsEditing(false);
      }
    }
  };

  const handleAddVariable = () => {
    if (!selectedEnvironment || !newVariable.key.trim()) return;

    const updatedEnvironment: Environment = {
      ...selectedEnvironment,
      variables: [
        ...selectedEnvironment.variables,
        {
          ...newVariable,
          id: uuidv4()
        }
      ]
    };

    updateEnvironment(updatedEnvironment);
    setNewVariable({
      key: '',
      value: '',
      enabled: true,
      category: newVariable.category
    });
    setSelectedEnvironment(updatedEnvironment);
  };

  const handleUpdateVariable = (index: number, field: keyof EnvironmentVariable, value: any) => {
    if (!selectedEnvironment) return;

    const updatedVariables = [...selectedEnvironment.variables];
    updatedVariables[index] = {
      ...updatedVariables[index],
      [field]: value
    };

    const updatedEnvironment: Environment = {
      ...selectedEnvironment,
      variables: updatedVariables
    };

    updateEnvironment(updatedEnvironment);
    setSelectedEnvironment(updatedEnvironment);
  };

  const handleDeleteVariable = (index: number) => {
    if (!selectedEnvironment) return;

    const updatedVariables = [...selectedEnvironment.variables];
    updatedVariables.splice(index, 1);

    const updatedEnvironment: Environment = {
      ...selectedEnvironment,
      variables: updatedVariables
    };

    updateEnvironment(updatedEnvironment);
    setSelectedEnvironment(updatedEnvironment);
  };

  const toggleShowSecretValue = (variableId: string) => {
    setShowSecretValues(prev => ({
      ...prev,
      [variableId]: !prev[variableId]
    }));
  };

  const handleDuplicateEnvironment = (environment: Environment, event: React.MouseEvent) => {
    event.stopPropagation();

    const newEnvironment: Environment = {
      ...environment,
      id: uuidv4(),
      name: `${environment.name} (Copy)`,
      variables: environment.variables.map(v => ({ ...v, id: uuidv4() }))
    };

    addEnvironment(newEnvironment);
    setSelectedEnvironment(newEnvironment);
  };

  const handleExportEnvironment = (environment: Environment, event: React.MouseEvent) => {
    event.stopPropagation();

    const dataStr = JSON.stringify(environment, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

    const exportFileDefaultName = `${environment.name}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportEnvironment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const imported = JSON.parse(content) as Environment;

        // Validate the imported data
        if (!imported.name || !Array.isArray(imported.variables)) {
          throw new Error('Invalid environment format');
        }

        // Generate a new ID for the environment
        const newEnvironment: Environment = {
          ...imported,
          id: uuidv4(),
          variables: imported.variables.map(v => ({
            ...v,
            id: v.id || uuidv4(),
            category: v.category || 'general'
          }))
        };

        addEnvironment(newEnvironment);
        setSelectedEnvironment(newEnvironment);
      } catch (error) {
        alert('Error importing environment: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    };
    reader.readAsText(file);

    // Reset the input
    event.target.value = '';
  };

  const handleBulkImport = () => {
    if (!selectedEnvironment || !bulkText.trim()) return;

    try {
      // Split by line, then parse key-value pairs
      const lines = bulkText.split('\n').filter(line => line.trim());
      const newVariables: EnvironmentVariable[] = [];

      lines.forEach(line => {
        // Support formats like "KEY=VALUE" or "KEY: VALUE"
        const match = line.match(/^([^=:]+)[=:](.*)$/);
        if (match) {
          const [, key, value] = match;
          newVariables.push({
            id: uuidv4(),
            key: key.trim(),
            value: value.trim(),
            enabled: true,
            category: 'general'
          });
        }
      });

      if (newVariables.length > 0) {
        const updatedEnvironment: Environment = {
          ...selectedEnvironment,
          variables: [
            ...selectedEnvironment.variables,
            ...newVariables
          ]
        };

        updateEnvironment(updatedEnvironment);
        setSelectedEnvironment(updatedEnvironment);
        setBulkText('');
        setIsBulkMode(false);
      }
    } catch (error) {
      alert('Error processing bulk variables: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const getVariableCategoryColor = (category: string) => {
    switch (category) {
      case 'api': return 'var(--method-get)';
      case 'auth': return 'var(--method-post)';
      case 'database': return 'var(--method-put)';
      case 'custom': return 'var(--method-patch)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div className="futuristic-container">
      <div className="futuristic-header">
        <h2>Environments</h2>
        <div className="futuristic-header-actions">
          <button
            className="futuristic-btn futuristic-btn-primary"
            onClick={() => setIsCreating(true)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            New Environment
          </button>

          <label className="futuristic-btn futuristic-btn-secondary import-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Import
            <input
              type="file"
              accept=".json"
              onChange={handleImportEnvironment}
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
              value={newEnvName}
              onChange={(e) => setNewEnvName(e.target.value)}
              placeholder="Enter environment name"
              className="futuristic-input"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newEnvName.trim()) {
                  handleCreateEnvironment();
                } else if (e.key === 'Escape') {
                  setIsCreating(false);
                  setNewEnvName('');
                }
              }}
            />
            <button
              onClick={handleCreateEnvironment}
              className="futuristic-btn futuristic-btn-primary"
              disabled={!newEnvName.trim()}
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
            placeholder="Search environments or variables..."
            className="futuristic-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="futuristic-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="futuristic-two-column">
        <div className="futuristic-sidebar">
          {filteredEnvironments.length === 0 ? (
            <div className="futuristic-empty-state">
              <svg className="futuristic-empty-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="futuristic-empty-title">No environments found</p>
              <p className="futuristic-empty-description">
                {searchQuery ? 'Try a different search term' : 'Create your first environment to manage variables'}
              </p>
            </div>
          ) : (
            <div className="environments-list">
              {filteredEnvironments.map((env: Environment) => (
                <div
                  key={env.id}
                  className={`futuristic-card environment-card ${selectedEnvironment?.id === env.id ? 'active' : ''} ${activeEnvironment?.id === env.id ? 'futuristic-glow-effect' : ''}`}
                  onClick={() => handleSelectEnvironment(env)}
                >
                  <div className="environment-header">
                    <div className="environment-name">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>{env.name}</span>
                      {activeEnvironment?.id === env.id && (
                        <span className="futuristic-active-pill">Active</span>
                      )}
                    </div>
                    <div className="environment-actions">
                      {activeEnvironment?.id !== env.id ? (
                        <button
                          onClick={(e) => handleSetActive(env.id, e)}
                          className="futuristic-btn"
                          title="Set as Active"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      ) : (
                        <button
                          onClick={(e) => handleSetActive(null, e)}
                          className="futuristic-btn"
                          title="Deactivate"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={(e) => handleDuplicateEnvironment(env, e)}
                        className="futuristic-btn"
                        title="Duplicate Environment"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 9H11C9.89543 9 9 9.89543 9 11V20C9 21.1046 9.89543 22 11 22H20C21.1046 22 22 21.1046 22 20V11C22 9.89543 21.1046 9 20 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => handleExportEnvironment(env, e)}
                        className="futuristic-btn"
                        title="Export Environment"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => handleDeleteEnvironment(env.id, e)}
                        className="futuristic-btn"
                        title="Delete Environment"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M19 6V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="environment-content">
                    {env.description && (
                      <div className="environment-description">{env.description}</div>
                    )}
                    <div className="variable-summary">
                      <div className="variable-count">
                        <span className="count-number">{env.variables.length}</span>
                        <span className="count-label">variable{env.variables.length !== 1 ? 's' : ''}</span>
                      </div>

                      {env.variables.length > 0 && (
                        <div className="variable-categories">
                          {/* Group variables by category and show count */}
                          {Array.from(new Set(env.variables.map(v => v.category || 'general'))).map(category => (
                            <div
                              key={category}
                              className="category-badge"
                              style={{ backgroundColor: `${getVariableCategoryColor(category)}20`, color: getVariableCategoryColor(category) }}
                            >
                              {category}: {env.variables.filter(v => (v.category || 'general') === category).length}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="futuristic-content">
          {selectedEnvironment ? (
            <div className="environment-editor futuristic-slide-in">
              <div className="editor-header">
                <div className="editor-title">
                  <h3>
                    {isEditing ? (
                      <input
                        type="text"
                        value={selectedEnvironment.name}
                        onChange={(e) => handleUpdateEnvironmentField('name', e.target.value)}
                        className="futuristic-input environment-name-edit"
                      />
                    ) : (
                      <span onClick={() => setIsEditing(true)}>
                        {selectedEnvironment.name}
                        <span className="edit-icon" title="Edit name">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10219 21.5 2.50001C21.8978 2.89783 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </span>
                    )}
                    {activeEnvironment?.id === selectedEnvironment.id && (
                      <span className="futuristic-active-pill">Active</span>
                    )}
                  </h3>

                  {isEditing ? (
                    <textarea
                      value={selectedEnvironment.description || ''}
                      onChange={(e) => handleUpdateEnvironmentField('description', e.target.value)}
                      placeholder="Add a description (optional)"
                      className="futuristic-input environment-description-edit"
                    />
                  ) : (
                    <p className="environment-description" onClick={() => setIsEditing(true)}>
                      {selectedEnvironment.description || 'Add a description (click to edit)'}
                    </p>
                  )}
                </div>

                <div className="editor-actions">
                  {activeEnvironment?.id !== selectedEnvironment.id ? (
                    <button
                      onClick={(e) => handleSetActive(selectedEnvironment.id, e)}
                      className="futuristic-btn futuristic-btn-primary"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Set Active
                    </button>
                  ) : (
                    <button
                      onClick={(e) => handleSetActive(null, e)}
                      className="futuristic-btn futuristic-btn-secondary"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Deactivate
                    </button>
                  )}

                  {isEditing ? (
                    <button
                      onClick={() => setIsEditing(false)}
                      className="futuristic-btn futuristic-btn-secondary"
                    >
                      Done Editing
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="futuristic-btn futuristic-btn-secondary"
                    >
                      Edit Details
                    </button>
                  )}
                </div>
              </div>

              <div className="variables-section">
                <div className="section-header">
                  <h4>Variables</h4>
                  <div className="section-actions">
                    <div className="futuristic-tabs">
                      <button
                        className={`futuristic-tab ${variableFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setVariableFilter('all')}
                      >
                        All
                      </button>
                      {variableCategories.map(category => (
                        <button
                          key={category}
                          className={`futuristic-tab ${variableFilter === category ? 'active' : ''}`}
                          onClick={() => setVariableFilter(category)}
                          style={{
                            color: variableFilter === category ? getVariableCategoryColor(category) : undefined,
                            borderBottom: variableFilter === category ? `2px solid ${getVariableCategoryColor(category)}` : undefined
                          }}
                        >
                          {category}
                        </button>
                      ))}
                    </div>


                    <div className="mode-toggle">
                      <button
                        className={`futuristic-btn ${!isBulkMode ? 'futuristic-btn-primary' : 'futuristic-btn-secondary'}`}
                        onClick={() => setIsBulkMode(false)}
                        title="Add variables one by one"
                      >
                        Single Mode
                      </button>
                      <button
                        className={`futuristic-btn ${isBulkMode ? 'futuristic-btn-primary' : 'futuristic-btn-secondary'}`}
                        onClick={() => setIsBulkMode(true)}
                        title="Add multiple variables at once"
                      >
                        Bulk Mode
                      </button>
                    </div>
                  </div>
                </div>

                {isBulkMode ? (
                  <div className="bulk-mode-container futuristic-slide-in">
                    <div className="bulk-instructions">
                      <p>
                        Enter variables in bulk using <code>KEY=VALUE</code> or <code>KEY: VALUE</code> format, one per line.
                      </p>
                    </div>
                    <textarea
                      value={bulkText}
                      onChange={(e) => setBulkText(e.target.value)}
                      placeholder="API_KEY=your-api-key-here&#10;BASE_URL=https://api.example.com&#10;TOKEN: your-token-here"
                      className="futuristic-input bulk-textarea"
                      rows={8}
                    />
                    <div className="bulk-actions">
                      <button
                        onClick={() => setBulkText('')}
                        className="futuristic-btn futuristic-btn-secondary"
                        disabled={!bulkText.trim()}
                      >
                        Clear
                      </button>
                      <button
                        onClick={handleBulkImport}
                        className="futuristic-btn futuristic-btn-primary"
                        disabled={!bulkText.trim()}
                      >
                        Add Variables
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="single-mode-container futuristic-slide-in">
                    <div className="add-variable-form">
                      <div className="variable-form-row">
                        <input
                          type="text"
                          value={newVariable.key}
                          onChange={(e) => setNewVariable({ ...newVariable, key: e.target.value })}
                          placeholder="Variable name (e.g. API_KEY)"
                          className="futuristic-input variable-key-input"
                        />
                        <select
                          value={newVariable.category}
                          onChange={(e) => setNewVariable({ ...newVariable, category: e.target.value })}
                          className="futuristic-select variable-category-select"
                        >
                          {variableCategories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>
                      <div className="variable-form-row">
                        <input
                          type="text"
                          value={newVariable.value}
                          onChange={(e) => setNewVariable({ ...newVariable, value: e.target.value })}
                          placeholder="Variable value"
                          className="futuristic-input variable-value-input"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newVariable.key.trim()) {
                              handleAddVariable();
                            }
                          }}
                        />
                        <button
                          onClick={handleAddVariable}
                          className="futuristic-btn futuristic-btn-primary"
                          disabled={!newVariable.key.trim()}
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {filteredVariables.length > 0 ? (
                      <div className="variables-list futuristic-slide-in">
                        {filteredVariables.map((variable, index) => {
                          const realIndex = selectedEnvironment!.variables.findIndex(v => v.id === variable.id);
                          return (
                            <div 
                              key={variable.id} 
                              className={`variable-item ${!variable.enabled ? 'disabled' : ''}`}
                            >
                              <div className="variable-header">
                                <div className="variable-name">
                                  <input
                                    type="checkbox"
                                    checked={variable.enabled}
                                    onChange={(e) => handleUpdateVariable(realIndex, 'enabled', e.target.checked)}
                                    className="futuristic-checkbox"
                                  />
                                  <input
                                    type="text"
                                    value={variable.key}
                                    onChange={(e) => handleUpdateVariable(realIndex, 'key', e.target.value)}
                                    className="futuristic-input variable-key-edit"
                                    placeholder="Variable name"
                                  />
                                </div>
                                <div className="variable-actions">
                                  <select
                                    value={variable.category || 'general'}
                                    onChange={(e) => handleUpdateVariable(realIndex, 'category', e.target.value)}
                                    className="futuristic-select variable-category-select-mini"
                                    style={{ 
                                      color: getVariableCategoryColor(variable.category || 'general'),
                                      borderColor: getVariableCategoryColor(variable.category || 'general')
                                    }}
                                  >
                                    {variableCategories.map(category => (
                                      <option key={category} value={category}>{category}</option>
                                    ))}
                                  </select>
                                  <button
                                    onClick={() => handleDeleteVariable(realIndex)}
                                    className="futuristic-btn"
                                    title="Delete Variable"
                                  >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              <div className="variable-content">
                                <div className="variable-value-container">
                                  <div className="value-with-toggle">
                                    <input
                                      type={variable.key.toLowerCase().includes('token') || 
                                            variable.key.toLowerCase().includes('key') || 
                                            variable.key.toLowerCase().includes('secret') || 
                                            variable.key.toLowerCase().includes('password') ? 
                                            (showSecretValues[variable.id] ? 'text' : 'password') : 'text'}
                                      value={variable.value}
                                      onChange={(e) => handleUpdateVariable(realIndex, 'value', e.target.value)}
                                      className="futuristic-input variable-value-edit"
                                      placeholder="Variable value"
                                    />
                                    {(variable.key.toLowerCase().includes('token') || 
                                      variable.key.toLowerCase().includes('key') || 
                                      variable.key.toLowerCase().includes('secret') || 
                                      variable.key.toLowerCase().includes('password')) && (
                                      <button
                                        onClick={() => toggleShowSecretValue(variable.id)}
                                        className="futuristic-btn secret-toggle"
                                        title={showSecretValues[variable.id] ? "Hide value" : "Show value"}
                                      >
                                        {showSecretValues[variable.id] ? (
                                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                          </svg>
                                        ) : (
                                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9.9 4.24002C10.5883 4.0789 11.2931 3.99836 12 4.00002C19 4.00002 23 12 23 12C22.393 13.1356 21.6691 14.2048 20.84 15.19M14.12 14.12C13.8454 14.4148 13.5141 14.6512 13.1462 14.8151C12.7782 14.9791 12.3809 15.0673 11.9781 15.0744C11.5753 15.0815 11.1752 15.0074 10.8016 14.8565C10.4281 14.7056 10.0887 14.4811 9.80385 14.1962C9.51897 13.9113 9.29439 13.572 9.14351 13.1984C8.99262 12.8249 8.91853 12.4247 8.92563 12.0219C8.93274 11.6191 9.02091 11.2219 9.18488 10.8539C9.34884 10.4859 9.58525 10.1547 9.88 9.88002M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 1 12 1 12C2.24389 9.68192 3.96914 7.65663 6.06 6.06002L17.94 17.94Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M1 1L23 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                          </svg>
                                        )}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="futuristic-empty-state">
                        <svg className="futuristic-empty-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <p className="futuristic-empty-title">No variables found</p>
                        <p className="futuristic-empty-description">
                          {variableFilter !== 'all' 
                            ? `No ${variableFilter} variables found. Add one or change the filter.` 
                            : 'Add your first variable using the form above'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="futuristic-empty-state">
              <svg className="futuristic-empty-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="futuristic-empty-title">No environment selected</p>
              <p className="futuristic-empty-description">
                Select an environment from the sidebar or create a new one
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
                  
