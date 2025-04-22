import React, { useState, useEffect } from 'react';
import './App.css';
import { RequestBuilder } from './components/RequestBuilder';
import { Collections } from './components/Collections';
import { Environments } from './components/Environments';
import { History } from './components/History';
import LandingPage from './components/LandingPage';

function App() {
  const [activeTab, setActiveTab] = useState('builder');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Changed to true for default dark mode
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Apply dark mode on initial load
  useEffect(() => {
    document.documentElement.classList.add('dark-mode');
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark-mode');
  };

  // Toggle sidebar collapse
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Login success handler
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // If not authenticated, show landing page
  if (!isAuthenticated) {
    return <LandingPage onLogin={handleLogin} />;
  }

  return (
    <div className={`App ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <div className="app-layout">
        {/* Sidebar */}
        <aside className={`app-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="app-logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 9V3H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 15V21H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 3L14 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 14L3 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {!isSidebarCollapsed && <span>RESTLab</span>}
          </div>
          
          <nav className="app-nav">
            <button 
              className={`nav-item ${activeTab === 'builder' ? 'active' : ''}`}
              onClick={() => setActiveTab('builder')}
              title="Request Builder"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 19H21V21H3V19Z" fill="currentColor"/>
                <path d="M13 5.00001H21V7.00001H13V5.00001Z" fill="currentColor"/>
                <path d="M21 11H3V13H21V11Z" fill="currentColor"/>
                <path d="M3 3.00001H11V5.00001H3V3.00001Z" fill="currentColor"/>
                <path d="M11 7.00001H3V9.00001H11V7.00001Z" fill="currentColor"/>
                <path d="M13 15H21V17H13V15Z" fill="currentColor"/>
              </svg>
              {!isSidebarCollapsed && <span>Builder</span>}
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'collections' ? 'active' : ''}`}
              onClick={() => setActiveTab('collections')}
              title="Collections"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 5C3 3.89543 3.89543 3 5 3H9C10.1046 3 11 3.89543 11 5V9C11 10.1046 10.1046 11 9 11H5C3.89543 11 3 10.1046 3 9V5Z" fill="currentColor"/>
                <path d="M13 5C13 3.89543 13.8954 3 15 3H19C20.1046 3 21 3.89543 21 5V9C21 10.1046 20.1046 11 19 11H15C13.8954 11 13 10.1046 13 9V5Z" fill="currentColor"/>
                <path d="M3 15C3 13.8954 3.89543 13 5 13H9C10.1046 13 11 13.8954 11 15V19C11 20.1046 10.1046 21 9 21H5C3.89543 21 3 20.1046 3 19V15Z" fill="currentColor"/>
                <path d="M13 15C13 13.8954 13.8954 13 15 13H19C20.1046 13 21 13.8954 21 15V19C21 20.1046 20.1046 21 19 21H15C13.8954 21 13 20.1046 13 19V15Z" fill="currentColor"/>
              </svg>
              {!isSidebarCollapsed && <span>Collections</span>}
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'environments' ? 'active' : ''}`}
              onClick={() => setActiveTab('environments')}
              title="Environments"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {!isSidebarCollapsed && <span>Environments</span>}
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
              title="History"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.05078 11.0002C3.27805 7.56152 5.71096 4.64312 9.0001 3.76643C12.2892 2.88975 15.7648 4.27499 17.4966 7.21024C19.2284 10.1455 18.8102 13.916 16.4289 16.3668C14.0475 18.8176 10.2653 19.3433 7.22474 17.7646" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 11.0002V5.00024" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 11.0002H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {!isSidebarCollapsed && <span>History</span>}
            </button>
          </nav>
          
          <div className="sidebar-footer">
            <button 
              className="nav-item"
              onClick={toggleSidebar}
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {isSidebarCollapsed ? (
                  <path d="M8 6L14 12L8 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                ) : (
                  <path d="M16 6L10 12L16 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                )}
              </svg>
              {!isSidebarCollapsed && <span>{isSidebarCollapsed ? "Expand" : "Collapse"}</span>}
            </button>
            
            <button 
              className="nav-item"
              onClick={toggleDarkMode} 
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" fill="currentColor"/>
                  <path d="M12 3V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M12 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M5 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M21 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M5.63672 5.63672L7.05093 7.05093" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M16.9492 16.9492L18.3634 18.3634" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M5.63672 18.3634L7.05093 16.9492" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M16.9492 7.05093L18.3634 5.63672" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.9999 12.8C20.9559 14.5936 20.3699 16.3323 19.3193 17.7924C18.2688 19.2525 16.7948 20.3567 15.096 20.9692C13.3972 21.5817 11.5532 21.6795 9.79911 21.2498C8.04505 20.82 6.46402 19.882 5.27195 18.5625C4.07988 17.243 3.32872 15.6031 3.10562 13.8667C2.88253 12.1302 3.19552 10.3771 3.99919 8.83311C4.80287 7.28916 6.06367 6.02403 7.62465 5.18864C9.18563 4.35325 10.9749 3.98265 12.7599 4.12C11.985 5.37572 11.7681 6.86594 12.1568 8.27591C12.5455 9.68589 13.5085 10.8996 14.7999 11.64C16.0913 12.3804 17.6129 12.5983 19.0633 12.2479C20.5138 11.8975 21.7751 11.0055 22.5999 9.76C22.8687 10.7473 23.0055 11.7714 22.9999 12.8H20.9999Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              {!isSidebarCollapsed && <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>}
            </button>
          </div>
        </aside>
        
        {/* Main content */}
        <main className="app-main">
          <header className="app-header">
            <h1>
              {activeTab === 'builder' && 'Request Builder'}
              {activeTab === 'collections' && 'Collections'}
              {activeTab === 'environments' && 'Environments'}
              {activeTab === 'history' && 'Request History'}
            </h1>
            <div className="header-actions">
              <a href="https://github.com/username/postman-react" target="_blank" rel="noopener noreferrer" className="github-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37 0 0 5.37 0 12C0 17.31 3.435 21.795 8.205 23.385C8.805 23.49 9.03 23.13 9.03 22.815C9.03 22.53 9.015 21.585 9.015 20.58C6 21.135 5.22 19.845 4.98 19.17C4.845 18.825 4.26 17.76 3.75 17.475C3.33 17.25 2.73 16.695 3.735 16.68C4.68 16.665 5.355 17.55 5.58 17.91C6.66 19.725 8.385 19.215 9.075 18.9C9.18 18.12 9.495 17.595 9.84 17.295C7.17 16.995 4.38 15.96 4.38 11.37C4.38 10.065 4.845 8.985 5.61 8.145C5.49 7.845 5.07 6.615 5.73 4.965C5.73 4.965 6.735 4.65 9.03 6.195C9.99 5.925 11.01 5.79 12.03 5.79C13.05 5.79 14.07 5.925 15.03 6.195C17.325 4.635 18.33 4.965 18.33 4.965C18.99 6.615 18.57 7.845 18.45 8.145C19.215 8.985 19.68 10.05 19.68 11.37C19.68 15.975 16.875 16.995 14.205 17.295C14.64 17.67 15.015 18.39 15.015 19.515C15.015 21.12 15 22.41 15 22.815C15 23.13 15.225 23.505 15.825 23.385C18.2072 22.5807 20.2772 21.0497 21.7437 19.0074C23.2101 16.965 23.9993 14.5143 24 12C24 5.37 18.63 0 12 0Z" fill="currentColor"/>
                </svg>
                <span>GitHub</span>
              </a>
            </div>
          </header>
          
          <div className="app-content">
            {activeTab === 'builder' && <RequestBuilder />}
            {activeTab === 'collections' && <Collections />}
            {activeTab === 'environments' && <Environments />}
            {activeTab === 'history' && <History />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;