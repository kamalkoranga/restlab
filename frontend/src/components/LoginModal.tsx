import React, { useState } from 'react';

interface LoginModalProps {
  onClose: () => void;
  onSignup: () => void;
  onLoginSuccess?: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onSignup, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    let isValid = true;

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        // In a real app, we would make an actual API call here
        console.log('Login submitted:', { email, password, rememberMe });
        
        // Call the success callback
        if (onLoginSuccess) {
          onLoginSuccess();
        }
        
        // Close modal after successful login
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content login-modal">
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <div className="modal-logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 9V3H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 15V21H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 3L14 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 14L3 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2>Log in to RESTLab</h2>
          <p>Welcome back! Please enter your details.</p>
        </div>
        
        <div className="social-login">
          <button className="social-button google">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4"/>
              <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/>
              <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957273C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957273 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
              <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
            </svg>
            <span>Continue with Google</span>
          </button>
          <button className="social-button github">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M9 0C4.0275 0 0 4.13211 0 9.22838C0 13.3071 2.5785 16.7638 6.15375 17.9841C6.60375 18.0709 6.76875 17.7853 6.76875 17.5403C6.76875 17.3212 6.76125 16.7405 6.7575 15.9712C4.254 16.5277 3.726 14.7332 3.726 14.7332C3.3165 13.6681 2.72475 13.3832 2.72475 13.3832C1.9095 12.8111 2.78775 12.8229 2.78775 12.8229C3.6915 12.887 4.16625 13.7737 4.16625 13.7737C4.96875 15.1847 6.273 14.777 6.7875 14.5414C6.8685 13.9443 7.10025 13.5381 7.3575 13.3071C5.35875 13.0719 3.258 12.2832 3.258 8.74711C3.258 7.73778 3.60675 6.91094 4.18425 6.26298C4.083 6.02999 3.77925 5.0909 4.263 3.82376C4.263 3.82376 5.01675 3.57683 6.738 4.76959C7.458 4.56588 8.223 4.46402 8.988 4.46019C9.753 4.46402 10.518 4.56588 11.238 4.76959C12.948 3.57683 13.7017 3.82376 13.7017 3.82376C14.1855 5.0909 13.8818 6.02999 13.7917 6.26298C14.3655 6.91094 14.7142 7.73778 14.7142 8.74711C14.7142 12.2942 12.6105 13.0681 10.608 13.2989C10.923 13.5829 11.2155 14.1499 11.2155 15.0119C11.2155 16.2399 11.2043 17.2326 11.2043 17.5341C11.2043 17.7759 11.3617 18.0647 11.823 17.9723C15.4237 16.7638 18 13.3002 18 9.22838C18 4.13211 13.9703 0 9 0Z" fill="#24292F"/>
            </svg>
            <span>Continue with GitHub</span>
          </button>
        </div>
        
        <div className="divider">
          <span>or</span>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? 'error' : ''}
              placeholder="Enter your password"
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>
          
          <div className="form-row">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me">Remember me</label>
            </div>
            <a href="#" className="forgot-password">Forgot password?</a>
          </div>
          
          <button 
            type="submit" 
            className={`submit-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                <span>Logging in...</span>
              </>
            ) : 'Log in'}
          </button>
        </form>
        
        <div className="modal-footer">
          <p>
            Don't have an account?{' '}
            <button className="text-button" onClick={onSignup}>
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal; 