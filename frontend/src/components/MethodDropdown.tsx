import React, { useState, useRef, useEffect } from 'react';
import { HttpMethod } from '../types';
import './MethodDropdown.css';

interface MethodDropdownProps {
  selectedMethod: HttpMethod;
  onMethodChange: (method: HttpMethod) => void;
  className?: string;
}

export const MethodDropdown: React.FC<MethodDropdownProps> = ({
  selectedMethod,
  onMethodChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Available HTTP methods
  const methods: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleMethodSelect = (method: HttpMethod) => {
    onMethodChange(method);
    setIsOpen(false);
  };

  // Get CSS class for a method
  const getMethodClass = (method: HttpMethod) => {
    switch (method) {
      case 'GET': return 'get';
      case 'POST': return 'post';
      case 'PUT': return 'put';
      case 'DELETE': return 'delete';
      case 'PATCH': return 'patch';
      case 'OPTIONS': return 'options';
      case 'HEAD': return 'head';
      default: return '';
    }
  };

  return (
    <div 
      className={`method-dropdown-container ${className}`}
      ref={dropdownRef}
    >
      <button 
        className={`method-selector ${getMethodClass(selectedMethod)} ${isOpen ? 'active' : ''}`}
        onClick={toggleDropdown}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="method-text">{selectedMethod}</span>
        <span className="dropdown-arrow"></span>
      </button>
      
      {isOpen && (
        <div className="method-options">
          {methods.map(method => (
            <button
              key={method}
              className={`method-option ${getMethodClass(method)} ${method === selectedMethod ? 'selected' : ''}`}
              onClick={() => handleMethodSelect(method)}
              aria-selected={method === selectedMethod}
            >
              {method}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};