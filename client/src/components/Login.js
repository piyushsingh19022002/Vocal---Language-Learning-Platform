import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../utils/api';
import './Login.css';

const Login = ({ isLogin = true }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password });
        
      } else {
        await register(formData);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Start Learning Today</h1>
        <p className="login-subtitle">
          {isLogin ? 'Log in to continue your language journey.' : 'Create an account to get started.'}
        </p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              {isLogin && (
                <a href="/forgot-password" className="forgot-password">
                  Forgot Password?
                </a>
              )}
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Loading...' : 'Continue'}
          </button>

          <button type="button" className="btn-google">
            <span className="google-icon">G</span>
            Continue with Google
          </button>
        </form>

        <p className="signup-link">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <a href={isLogin ? '/signup' : '/login'}>
            {isLogin ? 'Signup' : 'Login'}
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;

