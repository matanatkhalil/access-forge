import React, { useState } from 'react';
import { X } from 'lucide-react';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = async (e) => {
    e.preventDefault(); // so the browser doesn't reload the page
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        onLoginSuccess(data.user);
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault(); // so the browser doesn't reload the page
    setError('');
    setLoading(true); // so we can show a spinner or disable the submit button

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        onLoginSuccess(data.user);
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error registering:', error);
      setError('Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">
          <X size={20} aria-hidden="true" />
        </button>
        <form onSubmit={isLoginMode ? handleLogin : handleSignup}>
          {!isLoginMode && (
            <div className="input-name">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Min 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error-message">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Please wait...' : isLoginMode ? 'Log In' : 'Sign Up'}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setError('');
            }}
          >
            {isLoginMode ? "Don't have an account? Create one" : 'Already have an account? Log in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
