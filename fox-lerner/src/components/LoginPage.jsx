import React, { useState } from 'react';

const LoginPage = ({ onLogin, onShowSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    try {
      const response = await fetch('http://localhost:8765/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Login successful', data);
        if (onLogin) onLogin(data.token, email);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Error connecting to server: ' + err.message);
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
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 15px rgba(59, 130, 246, 0.15)'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <h1 className="text-center mb-6">
          <span className="text-3xl font-semibold text-slate-700">Login</span>
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-slate-700" htmlFor="email">Email</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" 
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-3 pl-10 bg-blue-50 border border-blue-100 rounded-lg
                      text-slate-700 placeholder-slate-400 text-base
                      focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-transparent
                      transition-all duration-300"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-slate-700" htmlFor="password">Password</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" 
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-3 pl-10 bg-blue-50 border border-blue-100 rounded-lg
                      text-slate-700 placeholder-slate-400 text-base
                      focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-transparent
                      transition-all duration-300"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        
        <button
          className="w-full px-4 py-3 text-white font-medium rounded-lg
                  bg-gradient-to-r from-blue-500 to-indigo-600
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                  hover:shadow-lg transition-all duration-300
                  relative overflow-hidden text-base"
          onClick={handleSubmit}
        >
          <span className="relative z-10">Sign In</span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
        </button>
        
        <div className="mt-4 text-center flex justify-between">
          <a href="#" className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-300">
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