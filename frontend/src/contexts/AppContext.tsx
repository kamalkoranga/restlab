import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  ApiRequest, 
  ApiResponse, 
  Collection, 
  Environment, 
  HistoryEntry
} from '../types';

interface AppContextType {
  collections: Collection[];
  environments: Environment[];
  history: HistoryEntry[];
  activeEnvironment: Environment | null;
  addCollection: (collection: Collection) => void;
  updateCollection: (collection: Collection) => void;
  deleteCollection: (id: string) => void;
  addEnvironment: (environment: Environment) => void;
  updateEnvironment: (environment: Environment) => void;
  deleteEnvironment: (id: string) => void;
  setActiveEnvironment: (environmentId: string | null) => void;
  addToHistory: (entry: HistoryEntry) => void;
  clearHistory: () => void;
  saveRequest: (request: ApiRequest, collectionId: string) => void;
  deleteRequest: (requestId: string, collectionId: string) => void;
  replaceVariables: (text: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collections, setCollections] = useState<Collection[]>(() => {
    const saved = localStorage.getItem('collections');
    return saved ? JSON.parse(saved) : [];
  });

  const [environments, setEnvironments] = useState<Environment[]>(() => {
    const saved = localStorage.getItem('environments');
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    const saved = localStorage.getItem('history');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeEnvironmentId, setActiveEnvironmentId] = useState<string | null>(() => {
    const saved = localStorage.getItem('activeEnvironmentId');
    return saved || null;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('collections', JSON.stringify(collections));
  }, [collections]);

  useEffect(() => {
    localStorage.setItem('environments', JSON.stringify(environments));
  }, [environments]);

  useEffect(() => {
    localStorage.setItem('history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (activeEnvironmentId) {
      localStorage.setItem('activeEnvironmentId', activeEnvironmentId);
    } else {
      localStorage.removeItem('activeEnvironmentId');
    }
  }, [activeEnvironmentId]);

  const activeEnvironment = activeEnvironmentId 
    ? environments.find(env => env.id === activeEnvironmentId) || null 
    : null;

  const addCollection = (collection: Collection) => {
    setCollections(prev => [...prev, collection]);
  };

  const updateCollection = (collection: Collection) => {
    setCollections(prev => 
      prev.map(coll => coll.id === collection.id ? collection : coll)
    );
  };

  const deleteCollection = (id: string) => {
    setCollections(prev => prev.filter(coll => coll.id !== id));
  };

  const addEnvironment = (environment: Environment) => {
    setEnvironments(prev => [...prev, environment]);
  };

  const updateEnvironment = (environment: Environment) => {
    setEnvironments(prev => 
      prev.map(env => env.id === environment.id ? environment : env)
    );
  };

  const deleteEnvironment = (id: string) => {
    setEnvironments(prev => prev.filter(env => env.id !== id));
    if (activeEnvironmentId === id) {
      setActiveEnvironmentId(null);
    }
  };

  const setActiveEnvironment = (environmentId: string | null) => {
    setActiveEnvironmentId(environmentId);
  };

  const addToHistory = (entry: HistoryEntry) => {
    setHistory(prev => [entry, ...prev].slice(0, 100)); // Keep only last 100 entries
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const saveRequest = (request: ApiRequest, collectionId: string) => {
    setCollections(prev => {
      return prev.map(collection => {
        if (collection.id === collectionId) {
          const existingRequestIndex = collection.requests.findIndex(r => r.id === request.id);
          if (existingRequestIndex >= 0) {
            // Update existing request
            const updatedRequests = [...collection.requests];
            updatedRequests[existingRequestIndex] = request;
            return { ...collection, requests: updatedRequests };
          } else {
            // Add new request
            return { ...collection, requests: [...collection.requests, request] };
          }
        }
        return collection;
      });
    });
  };

  const deleteRequest = (requestId: string, collectionId: string) => {
    setCollections(prev => {
      return prev.map(collection => {
        if (collection.id === collectionId) {
          return {
            ...collection,
            requests: collection.requests.filter(req => req.id !== requestId)
          };
        }
        return collection;
      });
    });
  };

  const replaceVariables = (text: string): string => {
    if (!activeEnvironment) return text;
    
    let result = text;
    const variablePattern = /{{([^}]+)}}/g;
    
    return result.replace(variablePattern, (match, variableName) => {
      const variable = activeEnvironment.variables.find(
        v => v.key === variableName && v.enabled
      );
      return variable ? variable.value : match;
    });
  };

  const value = {
    collections,
    environments,
    history,
    activeEnvironment,
    addCollection,
    updateCollection,
    deleteCollection,
    addEnvironment,
    updateEnvironment,
    deleteEnvironment,
    setActiveEnvironment,
    addToHistory,
    clearHistory,
    saveRequest,
    deleteRequest,
    replaceVariables
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}; 