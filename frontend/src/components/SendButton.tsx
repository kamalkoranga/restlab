import React from 'react';
import './SendButton.css';

interface SendButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled?: boolean;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const SendButton: React.FC<SendButtonProps> = ({ 
  onClick, 
  isLoading, 
  disabled = false, 
  method = 'GET', 
  size = 'medium',
  className = ''
}) => {
  // Determine method color class
  const getMethodColorClass = () => {
    switch (method) {
      case 'GET': return 'method-get';
      case 'POST': return 'method-post';
      case 'PUT': return 'method-put';
      case 'DELETE': return 'method-delete';
      case 'PATCH': return 'method-patch';
      case 'OPTIONS': return 'method-options';
      case 'HEAD': return 'method-head';
      default: return '';
    }
  };

  // Determine size class
  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'btn-small';
      case 'large': return 'btn-large';
      default: return 'btn-medium';
    }
  };

  return (
    <button 
      onClick={onClick} 
      disabled={isLoading || disabled}
      className={`send-button ${getMethodColorClass()} ${getSizeClass()} ${className} ${isLoading ? 'loading' : ''}`}
      title={`Send ${method} Request`}
      aria-label={`Send ${method} Request`}
      data-method={method}
    >
      {isLoading ? (
        <div className="loading-animation">
          <div className="dot dot1"></div>
          <div className="dot dot2"></div>
          <div className="dot dot3"></div>
        </div>
      ) : (
        <>
          <span className="method-indicator">{method}</span>
          <svg className="send-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </>
      )}
    </button>
  );
};