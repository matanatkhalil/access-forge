import React, { useState } from 'react';
import { X } from 'lucide-react';

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

  return <form></form>;
};

export default AuthModal;
