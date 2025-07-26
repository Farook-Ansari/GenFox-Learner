import React, { useState } from 'react';

const LoginPage = ({ onLogin, onShowSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '', general: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Clear specific error when user starts typing
  const handleInputChange = (field, value) => {
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);
    setErrors((prev) => ({ ...prev, [field]: '', general: '' }));
  };

  const validateForm = () => {
    const newErrors = { email: '', password: '', general: '' };
    let isValid = true;

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:8765/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // Attempt to parse response as JSON, handle cases where it might fail
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        data = { message: 'Incorrect email or password' };
      }

      if (response.ok) {
        console.log('Login successful', data);
        localStorage.setItem('authToken', data.token); // Store token
        window.dispatchEvent(new Event('loginSuccess')); // Dispatch event
        if (onLogin) onLogin(data.token, email);
      } else {
        // Map server error messages to user-friendly messages
        let errorMessage = { email: '', password: '', general: 'Login failed' };
        if (data.message) {
          if (data.message.toLowerCase().includes('email') || data.message.toLowerCase().includes('user not found')) {
            errorMessage.email = 'Incorrect email address';
          } else if (data.message.toLowerCase().includes('password') || data.message.toLowerCase().includes('unauthorized')) {
            errorMessage.password = 'Incorrect password';
          } else {
            errorMessage.general = data.message;
          }
        } else if (response.status === 401) {
          errorMessage.password = 'Incorrect password'; // Default for 401 Unauthorized
        } else {
          errorMessage.general = `Server error (Status: ${response.status})`;
        }
        setErrors(errorMessage);
      }
    } catch (err) {
      setErrors({
        email: '',
        password: '',
        general: 'Unable to connect to the server. Please check your network and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div
        className={`w-full max-w-md mx-4 p-6 bg-white rounded-xl shadow-lg 
                  border border-blue-100 transition-transform duration-300
                  ${isHovered ? 'scale-105' : 'scale-100'}`}
        style={{
          backgroundImage: 'linear-gradient(135deg, rgba(239,246,255,0.8) 0%, rgba(255,255,255,0.95) 100%)',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 15px rgba(59, 130, 246, 0.15)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <h1 className="text-center mb-6">
          <span className="text-3xl font-semibold text-slate-700">Login</span>
        </h1>
        {errors.general && <p className="text-red-500 text-center mb-4">{errors.general}</p>}

        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-slate-700" htmlFor="email">
            Email
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
            <input
              id="email"
              type="email"
              className={`w-full px-4 py-3 pl-10 bg-blue-50 border rounded-lg
                      text-slate-700 placeholder-slate-400 text-base
                      focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-transparent
                      transition-all duration-300
                      ${errors.email ? 'border-red-500' : 'border-blue-100'}`}
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-slate-700" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <input
              id="password"
              type="password"
              className={`w-full px-4 py-3 pl-10 bg-blue-50 border rounded-lg
                      text-slate-700 placeholder-slate-400 text-base
                      focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-transparent
                      transition-all duration-300
                      ${errors.password ? 'border-red-500' : 'border-blue-100'}`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => handleInputChange('password', e.target.value)}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
        </div>

        <button
          className={`w-full px-4 py-3 text-white font-medium rounded-lg
                  bg-gradient-to-r from-blue-500 to-indigo-600
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                  hover:shadow-lg transition-all duration-300
                  relative overflow-hidden text-base
                  ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          <span className="relative z-10">
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing In...
              </span>
            ) : (
              'Sign In'
            )}
          </span>
          <div
            className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 hover:opacity-20 transition-opacity duration-300"
            style={{ display: isSubmitting ? 'none' : 'block' }}
          ></div>
        </button>

        <div className="mt-4 text-center flex justify-between">
          <a
            href="#"
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-300"
          >
            Forgot password?
          </a>
          <a
            href="#"
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-300"
            onClick={(e) => {
              e.preventDefault();
              onShowSignUp();
            }}
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;