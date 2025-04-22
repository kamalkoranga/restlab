
import React, { useState, useEffect } from 'react';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import './LandingPage.css'; // Make sure to create this CSS file

interface LandingPageProps {
  onLogin?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Dark mode enabled by default

  // Apply dark mode on initial load
  useEffect(() => {
    document.body.classList.add('dark-theme');
    
    // Optional: Add smooth reveal animation for page elements
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });

    return () => {
      document.body.classList.remove('dark-theme');
      document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.unobserve(el);
      });
    };
  }, []);

  const handleLoginSuccess = () => {
    if (onLogin) {
      onLogin();
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-theme');
  };

  return (
    <div className={`landing-page ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      {/* Floating particles background */}
      <div className="particles-container">
        {[...Array(20)].map((_, index) => (
          <div key={index} className="particle" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 20 + 10}s`,
            animationDelay: `${Math.random() * 5}s`
          }}></div>
        ))}
      </div>

      {/* Theme toggle */}
      <button 
        className="theme-toggle"
        onClick={toggleDarkMode} 
        aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {isDarkMode ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.9999 12.8C20.9559 14.5936 20.3699 16.3323 19.3193 17.7924C18.2688 19.2525 16.7948 20.3567 15.096 20.9692C13.3972 21.5817 11.5532 21.6795 9.79911 21.2498C8.04505 20.82 6.46402 19.882 5.27195 18.5625C4.07988 17.243 3.32872 15.6031 3.10562 13.8667C2.88253 12.1302 3.19552 10.3771 3.99919 8.83311C4.80287 7.28916 6.06367 6.02403 7.62465 5.18864C9.18563 4.35325 10.9749 3.98265 12.7599 4.12C11.985 5.37572 11.7681 6.86594 12.1568 8.27591C12.5455 9.68589 13.5085 10.8996 14.7999 11.64C16.0913 12.3804 17.6129 12.5983 19.0633 12.2479C20.5138 11.8975 21.7751 11.0055 22.5999 9.76C22.8687 10.7473 23.0055 11.7714 22.9999 12.8H20.9999Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {/* Hero Section with improved design */}
      <header className="landing-hero">
        <div className="landing-container">
          <div className="hero-content animate-on-scroll">
            <div className="hero-logo">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="hero-logo-icon">
                <path d="M21 9V3H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 15V21H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 3L14 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 14L3 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h1 className="gradient-text">RESTLab</h1>
            </div>
            <h2 className="hero-title">The Ultimate API Testing Experience</h2>
            <p className="hero-subtitle">
              Build, test, and document your APIs with confidence. RESTLab combines beautiful design with powerful features to give you the ultimate API development experience.
            </p>
            <div className="hero-cta">
              <button 
                className="cta-button primary pulse-animation" 
                onClick={() => setShowSignupModal(true)}
              >
                <span>Get Started - It's Free</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button 
                className="cta-button secondary glow-on-hover"
                onClick={() => setShowLoginModal(true)}
              >
                Log In
              </button>
            </div>
          </div>
          <div className="hero-image animate-on-scroll">
            <div className="image-container glow-effect">
              <img src="/hero-image.png" alt="RESTLab Interface Screenshot" />
              <div className="browser-frame"></div>
              <div className="reflection"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section with card hover effects */}
      <section className="features-section">
        <div className="landing-container">
          <h2 className="section-title gradient-text animate-on-scroll">Powerful Features</h2>
          <div className="features-grid">
            <div className="feature-card glass-card animate-on-scroll">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 4V2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M4 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M12 20V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M20 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>Intuitive Interface</h3>
              <p>Modern, clean design that makes API testing a joy. Build and manage requests with ease.</p>
              <div className="card-highlight"></div>
            </div>

            <div className="feature-card glass-card animate-on-scroll">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 6H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 6V6.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 12V12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 18V18.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Collections</h3>
              <p>Organize your API requests into collections for better workflow management.</p>
              <div className="card-highlight"></div>
            </div>

            <div className="feature-card glass-card animate-on-scroll">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 10H4V20H8V10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 4H10V20H14V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 15H16V20H20V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Environment Variables</h3>
              <p>Switch between development, testing, and production environments effortlessly.</p>
              <div className="card-highlight"></div>
            </div>

            <div className="feature-card glass-card animate-on-scroll">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Request History</h3>
              <p>Keep track of all your API calls with detailed request and response information.</p>
              <div className="card-highlight"></div>
            </div>

            <div className="feature-card glass-card animate-on-scroll">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21.0001H7C5.89543 21.0001 5 20.1046 5 19.0001V5.00006C5 3.8955 5.89543 3.00006 7 3.00006H14L19 8.00006V19.0001C19 20.1046 18.1046 21.0001 17 21.0001Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 11H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 15H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Beautiful Response Formatting</h3>
              <p>JSON responses are automatically formatted and syntax-highlighted for readability.</p>
              <div className="card-highlight"></div>
            </div>

            <div className="feature-card glass-card animate-on-scroll">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Fully Customizable</h3>
              <p>Dark mode, customizable layouts, and more to make RESTLab work the way you do.</p>
              <div className="card-highlight"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section with improved visuals */}
      <section className="how-it-works-section">
        <div className="landing-container">
          <h2 className="section-title gradient-text animate-on-scroll">How RESTLab Works</h2>
          <div className="steps-container">
            <div className="step-card glass-card animate-on-scroll">
              <div className="step-number">1</div>
              <h3>Create Requests</h3>
              <p>Build API requests with our intuitive interface. Set headers, parameters, and body data with ease.</p>
              <div className="step-image">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 4H4V11H11V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 4H13V11H20V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11 13H4V20H11V13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 13H13V20H20V13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className="steps-connector animate-on-scroll"></div>
            <div className="step-card glass-card animate-on-scroll">
              <div className="step-number">2</div>
              <h3>Organize Collections</h3>
              <p>Group related requests into collections for better organization and sharing capabilities.</p>
              <div className="step-image">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className="steps-connector animate-on-scroll"></div>
            <div className="step-card glass-card animate-on-scroll">
              <div className="step-number">3</div>
              <h3>Run & Test</h3>
              <p>Execute requests and analyze responses in a beautiful, formatted view designed for developers.</p>
              <div className="step-image">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      {/* Testimonials section - New */}
      <section className="testimonials-section">
        <div className="landing-container">
          <h2 className="section-title gradient-text animate-on-scroll">What Developers Say</h2>
          <div className="testimonials-carousel">
            <div className="testimonial-card glass-card animate-on-scroll">
              <div className="testimonial-content">
                <svg className="quote-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 11H6C4.89543 11 4 10.1046 4 9V6.5C4 5.39543 4.89543 4.5 6 4.5H9C10.1046 4.5 11 5.39543 11 6.5V14C11 17.3137 8.31371 20 5 20V18C7.20914 18 9 16.2091 9 14V11C9 11.5523 8.55228 12 8 12H6C5.44772 12 5 11.5523 5 11V6.5C5 5.94772 5.44772 5.5 6 5.5H9C9.55228 5.5 10 5.94772 10 6.5V11Z" fill="currentColor"/>
                  <path d="M20 11H16C14.8954 11 14 10.1046 14 9V6.5C14 5.39543 14.8954 4.5 16 4.5H19C20.1046 4.5 21 5.39543 21 6.5V14C21 17.3137 18.3137 20 15 20V18C17.2091 18 19 16.2091 19 14V11C19 11.5523 18.5523 12 18 12H16C15.4477 12 15 11.5523 15 11V6.5C15 5.94772 15.4477 5.5 16 5.5H19C19.5523 5.5 20 5.94772 20 6.5V11Z" fill="currentColor"/>
                </svg>
                <p>RESTLab has completely transformed how I test and document my APIs. The dark mode is gorgeous, and the interface is so intuitive that I've cut my testing time in half.</p>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    <img src="/avatars/dev1.jpg" alt="Developer avatar" />
                  </div>
                  <div className="author-info">
                    <h4>Alex Johnson</h4>
                    <p>Senior Backend Developer</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card glass-card animate-on-scroll">
              <div className="testimonial-content">
                <svg className="quote-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 11H6C4.89543 11 4 10.1046 4 9V6.5C4 5.39543 4.89543 4.5 6 4.5H9C10.1046 4.5 11 5.39543 11 6.5V14C11 17.3137 8.31371 20 5 20V18C7.20914 18 9 16.2091 9 14V11C9 11.5523 8.55228 12 8 12H6C5.44772 12 5 11.5523 5 11V6.5C5 5.94772 5.44772 5.5 6 5.5H9C9.55228 5.5 10 5.94772 10 6.5V11Z" fill="currentColor"/>
                  <path d="M20 11H16C14.8954 11 14 10.1046 14 9V6.5C14 5.39543 14.8954 4.5 16 4.5H19C20.1046 4.5 21 5.39543 21 6.5V14C21 17.3137 18.3137 20 15 20V18C17.2091 18 19 16.2091 19 14V11C19 11.5523 18.5523 12 18 12H16C15.4477 12 15 11.5523 15 11V6.5C15 5.94772 15.4477 5.5 16 5.5H19C19.5523 5.5 20 5.94772 20 6.5V11Z" fill="currentColor"/>
                </svg>
                <p>The environment variables feature is a game-changer for my team. We can switch between dev, staging, and prod seamlessly. The dark theme is easy on the eyes during late-night debugging sessions.</p>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    <img src="/avatars/dev2.jpg" alt="Developer avatar" />
                  </div>
                  <div className="author-info">
                    <h4>Samantha Chen</h4>
                    <p>Full Stack Developer</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="testimonial-card glass-card animate-on-scroll">
              <div className="testimonial-content">
                <svg className="quote-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 11H6C4.89543 11 4 10.1046 4 9V6.5C4 5.39543 4.89543 4.5 6 4.5H9C10.1046 4.5 11 5.39543 11 6.5V14C11 17.3137 8.31371 20 5 20V18C7.20914 18 9 16.2091 9 14V11C9 11.5523 8.55228 12 8 12H6C5.44772 12 5 11.5523 5 11V6.5C5 5.94772 5.44772 5.5 6 5.5H9C9.55228 5.5 10 5.94772 10 6.5V11Z" fill="currentColor"/>
                  <path d="M20 11H16C14.8954 11 14 10.1046 14 9V6.5C14 5.39543 14.8954 4.5 16 4.5H19C20.1046 4.5 21 5.39543 21 6.5V14C21 17.3137 18.3137 20 15 20V18C17.2091 18 19 16.2091 19 14V11C19 11.5523 18.5523 12 18 12H16C15.4477 12 15 11.5523 15 11V6.5C15 5.94772 15.4477 5.5 16 5.5H19C19.5523 5.5 20 5.94772 20 6.5V11Z" fill="currentColor"/>
                </svg>
                <p>As a team lead, I appreciate how RESTLab helps onboard new developers quickly. The collections feature lets us share API endpoints effortlessly, and the dark UI is a hit with the whole team.</p>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    <img src="/avatars/dev3.jpg" alt="Developer avatar" />
                  </div>
                  <div className="author-info">
                    <h4>Michael Rodriguez</h4>
                    <p>Tech Lead, API Team</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="testimonial-indicators">
            <button className="indicator active"></button>
            <button className="indicator"></button>
            <button className="indicator"></button>
          </div>
        </div>
      </section>

      {/* CTA Section with enhanced design */}
      <section className="cta-section">
        <div className="landing-container">
          <div className="cta-backdrop"></div>
          <h2 className="gradient-text animate-on-scroll">Ready to elevate your API workflow?</h2>
          <p className="animate-on-scroll">Join thousands of developers who are already using RESTLab to test and document their APIs.</p>
          <button 
            className="cta-button primary large glow-effect animate-on-scroll"
            onClick={() => setShowSignupModal(true)}
          >
            <span>Get Started Now</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="users-using">
            <div className="avatar-stack">
              <div className="avatar-item"><img src="/avatars/user1.jpg" alt="User avatar" /></div>
              <div className="avatar-item"><img src="/avatars/user2.jpg" alt="User avatar" /></div>
              <div className="avatar-item"><img src="/avatars/user3.jpg" alt="User avatar" /></div>
              <div className="avatar-item"><img src="/avatars/user4.jpg" alt="User avatar" /></div>
              <div className="avatar-item more">+2.5k</div>
            </div>
            <p>Over 2,500 developers joined last month</p>
          </div>
        </div>
      </section>

      {/* Footer with improved design */}
      <footer className="landing-footer">
        <div className="landing-container">
          <div className="footer-content">
            <div className="footer-logo">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 9V3H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 15V21H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 3L14 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 14L3 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="gradient-text">RESTLab</span>
            </div>
            <p>&copy; {new Date().getFullYear()} RESTLab. All rights reserved.</p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23 3C22.0424 3.67548 20.9821 4.19211 19.86 4.53C19.2577 3.83751 18.4573 3.34669 17.567 3.12393C16.6767 2.90116 15.7395 2.95769 14.8821 3.28438C14.0247 3.61108 13.2884 4.1942 12.773 4.95372C12.2575 5.71324 11.9877 6.61234 12 7.53V8.53C10.2426 8.57557 8.50127 8.18581 6.93101 7.39545C5.36074 6.60508 4.01032 5.43864 3 4C3 4 -1 13 8 17C5.94053 18.398 3.48716 19.0989 1 19C10 24 21 19 21 7.5C20.9991 7.22145 20.9723 6.94359 20.92 6.67C21.9406 5.66349 22.6608 4.39271 23 3V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="GitHub">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37 0 0 5.37 0 12C0 17.31 3.435 21.795 8.205 23.385C8.805 23.49 9.03 23.13 9.03 22.815C9.03 22.53 9.015 21.585 9.015 20.58C6 21.135 5.22 19.845 4.98 19.17C4.845 18.825 4.26 17.76 3.75 17.475C3.33 17.25 2.73 16.695 3.735 16.68C4.68 16.665 5.355 17.55 5.58 17.91C6.66 19.725 8.385 19.215 9.075 18.9C9.18 18.12 9.495 17.595 9.84 17.295C7.17 16.995 4.38 15.96 4.38 11.37C4.38 10.065 4.845 8.985 5.61 8.145C5.49 7.845 5.07 6.615 5.73 4.965C5.73 4.965 6.735 4.65 9.03 6.195C9.99 5.925 11.01 5.79 12.03 5.79C13.05 5.79 14.07 5.925 15.03 6.195C17.325 4.635 18.33 4.965 18.33 4.965C18.99 6.615 18.57 7.845 18.45 8.145C19.215 8.985 19.68 10.05 19.68 11.37C19.68 15.975 16.875 16.995 14.205 17.295C14.64 17.67 15.015 18.39 15.015 19.515C15.015 21.12 15 22.41 15 22.815C15 23.13 15.225 23.505 15.825 23.385C18.2072 22.5807 20.2772 21.0497 21.7437 19.0074C23.2101 16.965 23.9993 14.5143 24 12C24 5.37 18.63 0 12 0Z" fill="currentColor"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 9H2V21H6V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="footer-links">
            <div className="footer-links-group">
              <h4>Product</h4>
              <ul>
                <li><a href="#">Features</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">Documentation</a></li>
                <li><a href="#">API</a></li>
              </ul>
            </div>
            <div className="footer-links-group">
              <h4>Company</h4>
              <ul>
                <li><a href="#">About</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Press</a></li>
              </ul>
            </div>
            <div className="footer-links-group">
              <h4>Resources</h4>
              <ul>
                <li><a href="#">Support</a></li>
                <li><a href="#">Community</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Privacy Policy</a></li>
              </ul>
            </div>
            <div className="footer-links-group">
              <h4>Subscribe</h4>
              <p>Get the latest news and updates</p>
              <div className="subscribe-form">
                <input type="email" placeholder="Your email" />
                <button>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showLoginModal && (
        <LoginModal 
          onClose={() => setShowLoginModal(false)} 
          onSignup={() => {
            setShowLoginModal(false);
            setShowSignupModal(true);
          }}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      
      {/* Modals */}
      {showLoginModal && (
        <LoginModal 
          onClose={() => setShowLoginModal(false)} 
          onSignup={() => {
            setShowLoginModal(false);
            setShowSignupModal(true);
          }}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      
      {showSignupModal && (
        <SignupModal 
          onClose={() => setShowSignupModal(false)} 
          onLogin={() => {
            setShowSignupModal(false);
            setShowLoginModal(true);
          }}
          onSignupSuccess={handleLoginSuccess}
        />
      )}

      {/* Back to top button */}
      <button 
        className="back-to-top-button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5 12L12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Cookie consent banner - hidden by default */}
      <div className="cookie-consent" style={{ display: 'none' }}>
        <div className="cookie-content">
          <p>We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p>
          <div className="cookie-buttons">
            <button className="cookie-button secondary">Cookie settings</button>
            <button className="cookie-button primary">Accept all</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
