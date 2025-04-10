import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('mor_2314');
  const [password, setPassword] = useState('83r5^_');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'https://fakestoreapi.com/auth/login',
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (!response.data.token) throw new Error('No token received');
      
      localStorage.setItem('token', response.data.token);
      navigate('/products');
      
    } catch (err) {
      let errorMessage = 'Login failed';
      if (err.response) {
        errorMessage = err.response.data || `Error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = 'Server not responding';
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Sign in to access your account</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
            />
            <span className="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </span>
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
            <span className="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </span>
          </div>
          
          <button type="submit" disabled={isLoading} className="login-button">
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : 'Sign In'}
          </button>
        </form>

        <div className="test-credentials">
          <p className="divider"><span>Test credentials</span></p>
          <div className="credentials-box">
            <div>
              <span>Username:</span>
              <code>mor_2314</code>
            </div>
            <div>
              <span>Password:</span>
              <code>83r5^_</code>
            </div>
          </div>
        </div>
      </div>
      
      <div className="login-footer">
        <p>Don't have an account? <a href="#">Sign up</a></p>
        <p><a href="#">Forgot password?</a></p>
      </div>
    </div>
  );
};

export default Login;