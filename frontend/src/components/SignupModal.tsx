import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SignupModal.css";

interface SignupModalProps {
  onClose: () => void;
  onLogin: () => void;
  onSignupSuccess?: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({
  onClose,
  onLogin,
  onSignupSuccess,
}) => {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "Weak",
    color: "#ff3d00",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Handle modal click outside to close
  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Password strength checker
  useEffect(() => {
    if (formData.password) {
      // Calculate password strength
      const hasLowercase = /[a-z]/.test(formData.password);
      const hasUppercase = /[A-Z]/.test(formData.password);
      const hasNumbers = /[0-9]/.test(formData.password);
      const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);
      const isLongEnough = formData.password.length >= 8;

      let score = 0;
      if (hasLowercase) score += 1;
      if (hasUppercase) score += 1;
      if (hasNumbers) score += 1;
      if (hasSpecialChars) score += 1;
      if (isLongEnough) score += 1;

      // Set score and label
      let label = "";
      let color = "";

      switch (score) {
        case 0:
        case 1:
          label = "Very Weak";
          color = "#ff1744";
          break;
        case 2:
          label = "Weak";
          color = "#ff3d00";
          break;
        case 3:
          label = "Fair";
          color = "#ffd600";
          break;
        case 4:
          label = "Good";
          color = "#00c853";
          break;
        case 5:
          label = "Strong";
          color = "#00c853";
          break;
        default:
          label = "Weak";
          color = "#ff3d00";
      }

      setPasswordStrength({ score, label, color });
    } else {
      setPasswordStrength({ score: 0, label: "Weak", color: "#ff3d00" });
    }
  }, [formData.password]);

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
      isValid = false;
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    } else if (passwordStrength.score < 3) {
      newErrors.password = "Password is too weak";
      isValid = false;
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    // Terms agreement validation
    if (!agreeTerms) {
      newErrors.terms = "You must agree to the terms and conditions";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (validateForm()) {
      setIsLoading(true);

      try {
        // In a real application, this would be an actual API call
        // For this demo, we'll simulate a successful response
        /* 
        const response = await axios.post('http://localhost:5000/api/signup', {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        */

        // Simulate API response
        const mockResponse = {
          data: {
            token: "mock-jwt-token",
            userId: "123456",
            name: formData.name,
            email: formData.email,
          },
        };

        console.log("Signup successful:", mockResponse.data);

        // Store user data in localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: formData.name,
            email: formData.email,
            token: mockResponse.data.token,
          })
        );

        // Show success message
        setSignupSuccess(true);

        // Show success animation before redirecting
        setTimeout(() => {
          // Call the success callback to trigger redirect
          if (onSignupSuccess) {
            onSignupSuccess();
          }

          // Close modal after successful signup
          onClose();
        }, 1500);
      } catch (error) {
        console.error("Signup error:", error);

        // Handle specific API error responses
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 409) {
            setErrors({ email: "This email is already registered" });
          } else {
            setErrors({
              form: "Account creation failed. Please try again.",
            });
          }
        } else {
          setErrors({
            form: "Network error. Please check your connection.",
          });
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Social sign up handlers
  const handleGoogleSignup = () => {
    console.log("Google sign up clicked");
    // In a real app, you would redirect to Google OAuth
    // window.location.href = 'http://localhost:5000/api/auth/google';

    // For demo, simulate login success after a delay
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: "Google User",
          email: "google.user@example.com",
          token: "mock-google-oauth-token",
        })
      );

      if (onSignupSuccess) {
        onSignupSuccess();
      }
      onClose();
    }, 1500);
  };

  const handleGithubSignup = () => {
    console.log("GitHub sign up clicked");
    // In a real app, you would redirect to GitHub OAuth
    // window.location.href = 'http://localhost:5000/api/auth/github';

    // For demo, simulate login success after a delay
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: "GitHub User",
          email: "github.user@example.com",
          token: "mock-github-oauth-token",
        })
      );

      if (onSignupSuccess) {
        onSignupSuccess();
      }
      onClose();
    }, 1500);
  };

  // Password strength indicator
  const getPasswordStrengthBar = () => {
    return (
      <div className="password-strength">
        <div className="strength-bars">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className={`strength-bar ${
                passwordStrength.score >= level ? "filled" : ""
              }`}
              style={{
                backgroundColor:
                  passwordStrength.score >= level
                    ? passwordStrength.color
                    : undefined,
              }}
            />
          ))}
        </div>
        {formData.password && (
          <div
            className="strength-label"
            style={{ color: passwordStrength.color }}
          >
            {passwordStrength.label}
          </div>
        )}
      </div>
    );
  };

  // If signup was successful, show success message
  if (signupSuccess) {
    return (
      <div className="futuristic-modal-overlay">
        <div className="futuristic-modal success-modal">
          <div className="success-icon">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22 11.0857V12.0057C21.9988 14.1621 21.3005 16.2604 20.0093 17.9875C18.7182 19.7147 16.9033 20.9782 14.8354 21.5896C12.7674 22.201 10.5573 22.1276 8.53447 21.3803C6.51168 20.633 4.78465 19.2518 3.61096 17.4428C2.43727 15.6338 1.87979 13.4938 2.02168 11.342C2.16356 9.19029 2.99721 7.14205 4.39828 5.5028C5.79935 3.86354 7.69279 2.72111 9.79619 2.24587C11.8996 1.77063 14.1003 1.98806 16.07 2.86572"
                stroke="#00C853"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 4L12 14.01L9 11.01"
                stroke="#00C853"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2>Account Created!</h2>
          <p>
            Your account has been created successfully. Redirecting you to the
            main application...
          </p>
          <div className="loading-spinner success"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="futuristic-modal-overlay" onClick={handleModalClick}>
      <div className="futuristic-modal signup-modal">
        <button
          className="futuristic-modal-close"
          onClick={onClose}
          aria-label="Close signup modal"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 5L5 15M5 5L15 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="futuristic-modal-header">
          <div className="futuristic-modal-logo">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 9V3H15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 15V21H9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 3L14 10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 14L3 21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2>Create your account</h2>
          <p>Join RESTLab to test, build, and document APIs with ease</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {errors.form && (
            <div className="form-error-message">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 4V8M8 12H8.01M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {errors.form}
            </div>
          )}

          <div
            className={`futuristic-form-group ${
              formSubmitted && errors.name ? "has-error" : ""
            }`}
          >
            <label htmlFor="name">Full Name</label>
            <div className="custom-input-container">
              <div className="icon-container">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 15.75V14.25C15 13.4544 14.6839 12.6913 14.1213 12.1287C13.5587 11.5661 12.7956 11.25 12 11.25H6C5.20435 11.25 4.44129 11.5661 3.87868 12.1287C3.31607 12.6913 3 13.4544 3 14.25V15.75"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 8.25C10.6569 8.25 12 6.90685 12 5.25C12 3.59315 10.6569 2.25 9 2.25C7.34315 2.25 6 3.59315 6 5.25C6 6.90685 7.34315 8.25 9 8.25Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "error" : ""}
                placeholder="Enter your full name"
                autoComplete="name"
                disabled={isLoading}
              />
            </div>
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>

          <div
            className={`futuristic-form-group ${
              formSubmitted && errors.email ? "has-error" : ""
            }`}
          >
            <label htmlFor="email">Email</label>
            <div className="custom-input-container1">
              <div className="icon-container">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 3H15C15.825 3 16.5 3.675 16.5 4.5V13.5C16.5 14.325 15.825 15 15 15H3C2.175 15 1.5 14.325 1.5 13.5V4.5C1.5 3.675 2.175 3 3 3Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16.5 4.5L9 9.75L1.5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "error" : ""}
                placeholder="Enter your email"
                autoComplete="email"
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <div className="error-message">{errors.email}</div>
            )}
          </div>

          <div
            className={`futuristic-form-group ${
              formSubmitted && errors.password ? "has-error" : ""
            }`}
          >
            <label htmlFor="password">Password</label>
            <div className="custom-input-container2">
              <div className="icon-container">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.25 8.25H3.75C2.92157 8.25 2.25 8.92157 2.25 9.75V15C2.25 15.8284 2.92157 16.5 3.75 16.5H14.25C15.0784 16.5 15.75 15.8284 15.75 15V9.75C15.75 8.92157 15.0784 8.25 14.25 8.25Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.25 8.25V5.25C5.25 4.05653 5.72411 2.91193 6.56802 2.06802C7.41193 1.22411 8.55653 0.75 9.75 0.75C10.9435 0.75 12.0881 1.22411 12.932 2.06802C13.7759 2.91193 14.25 4.05653 14.25 5.25V8.25"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "error" : ""}
                placeholder="Create a password"
                autoComplete="new-password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.25 9C2.25 9 4.5 3.75 9 3.75C13.5 3.75 15.75 9 15.75 9C15.75 9 13.5 14.25 9 14.25C4.5 14.25 2.25 9 2.25 9Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 11.25C10.2426 11.25 11.25 10.2426 11.25 9C11.25 7.75736 10.2426 6.75 9 6.75C7.75736 6.75 6.75 7.75736 6.75 9C6.75 10.2426 7.75736 11.25 9 11.25Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3 3L15 15"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.25 9C2.25 9 4.5 3.75 9 3.75C13.5 3.75 15.75 9 15.75 9C15.75 9 13.5 14.25 9 14.25C4.5 14.25 2.25 9 2.25 9Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 11.25C10.2426 11.25 11.25 10.2426 11.25 9C11.25 7.75736 10.2426 6.75 9 6.75C7.75736 6.75 6.75 7.75736 6.75 9C6.75 10.2426 7.75736 11.25 9 11.25Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            </div>
            {getPasswordStrengthBar()}
            {errors.password && (
              <div className="error-message">{errors.password}</div>
            )}
            <div className="password-requirements">
              <div className="requirement">
                <span
                  className={
                    formData.password.length >= 8 ? "requirement-met" : ""
                  }
                >
                  {formData.password.length >= 8 ? "✓" : "•"}
                </span>
                <span>At least 8 characters</span>
              </div>
              <div className="requirement">
                <span
                  className={
                    /[A-Z]/.test(formData.password) ? "requirement-met" : ""
                  }
                >
                  {/[A-Z]/.test(formData.password) ? "✓" : "•"}
                </span>
                <span>One uppercase letter</span>
              </div>
              <div className="requirement">
                <span
                  className={
                    /[0-9]/.test(formData.password) ? "requirement-met" : ""
                  }
                >
                  {/[0-9]/.test(formData.password) ? "✓" : "•"}
                </span>
                <span>One number</span>
              </div>
              <div className="requirement">
                <span
                  className={
                    /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
                      ? "requirement-met"
                      : ""
                  }
                >
                  {/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? "✓" : "•"}
                </span>
                <span>One special character</span>
              </div>
            </div>
          </div>

          <div
            className={`futuristic-form-group ${
              formSubmitted && errors.confirmPassword ? "has-error" : ""
            }`}
          >
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="custom-input-container3">
              <div className="icon-container">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.25 8.25H3.75C2.92157 8.25 2.25 8.92157 2.25 9.75V15C2.25 15.8284 2.92157 16.5 3.75 16.5H14.25C15.0784 16.5 15.75 15.8284 15.75 15V9.75C15.75 8.92157 15.0784 8.25 14.25 8.25Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12.75 8.25V6C12.7517 4.7889 12.3097 3.62482 11.5 2.7375C10.6902 1.85017 9.58499 1.3082 8.37495 1.25636C7.16492 1.20453 5.98043 1.64646 5.09323 2.48408C4.20602 3.32171 3.68429 4.48207 3.65625 5.7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? "error" : ""}
                placeholder="Confirm your password"
                autoComplete="new-password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.25 9C2.25 9 4.5 3.75 9 3.75C13.5 3.75 15.75 9 15.75 9C15.75 9 13.5 14.25 9 14.25C4.5 14.25 2.25 9 2.25 9Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 11.25C10.2426 11.25 11.25 10.2426 11.25 9C11.25 7.75736 10.2426 6.75 9 6.75C7.75736 6.75 6.75 7.75736 6.75 9C6.75 10.2426 7.75736 11.25 9 11.25Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3 3L15 15"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.25 9C2.25 9 4.5 3.75 9 3.75C13.5 3.75 15.75 9 15.75 9C15.75 9 13.5 14.25 9 14.25C4.5 14.25 2.25 9 2.25 9Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 11.25C10.2426 11.25 11.25 10.2426 11.25 9C11.25 7.75736 10.2426 6.75 9 6.75C7.75736 6.75 6.75 7.75736 6.75 9C6.75 10.2426 7.75736 11.25 9 11.25Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="error-message">{errors.confirmPassword}</div>
            )}
          </div>

          <div
            className={`futuristic-form-group terms-group ${
              formSubmitted && errors.terms ? "has-error" : ""
            }`}
          >
            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                id="agree-terms"
                checked={agreeTerms}
                onChange={(e) => {
                  setAgreeTerms(e.target.checked);
                  if (errors.terms) {
                    setErrors((prev) => ({ ...prev, terms: "" }));
                  }
                }}
                className={errors.terms ? "error" : ""}
                disabled={isLoading}
              />
              <label htmlFor="agree-terms" className="terms-label">
                I agree to the{" "}
                <a href="#" className="terms-link">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="terms-link">
                  Privacy Policy
                </a>
              </label>
            </div>
            {errors.terms && (
              <div className="error-message">{errors.terms}</div>
            )}
          </div>

          <button
            type="submit"
            className={`submit-button ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <span>Create account</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.33331 8H12.6666"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 3.33331L12.6667 7.99998L8 12.6666"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="modal-footer">
          <p>
            Already have an account?{" "}
            <button
              className="text-button"
              onClick={onLogin}
              disabled={isLoading}
              type="button"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;
