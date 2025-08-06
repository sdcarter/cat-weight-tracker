import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// API base URL - use environment variable or fallback
const API_URL = process.env.REACT_APP_API_URL || '/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registrationEnabled, setRegistrationEnabled] = useState(false);

  // Initialize auth state from sessionStorage (with localStorage fallback for existing users)
  useEffect(() => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (token) {
      // If token was in localStorage, move it to sessionStorage
      if (localStorage.getItem('token')) {
        sessionStorage.setItem('token', localStorage.getItem('token'));
        localStorage.removeItem('token');
      }
      fetchUserData(token);
    } else {
      setLoading(false);
    }
  }, []);

  // Configure axios to use the token for all requests
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [user]);

  const fetchUserData = async (token) => {
    try {
      if (!token) {
        setLoading(false);
        return;
      }
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get(`${API_URL}/auth/me`);
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      sessionStorage.removeItem('token');
      localStorage.removeItem('token'); // Clean up any old tokens
      delete axios.defaults.headers.common['Authorization'];
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      setError(null);
      
      // Validate inputs
      if (!username || !password) {
        setError('Username and password are required');
        return false;
      }
      
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      
      const response = await axios.post(`${API_URL}/auth/login`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      const { access_token } = response.data;
      
      // Store token in sessionStorage instead of localStorage for better security
      sessionStorage.setItem('token', access_token);
      localStorage.removeItem('token'); // Remove from localStorage if it exists
      await fetchUserData(access_token);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.detail || 'Login failed');
      return false;
    }
  };

  const register = async (username, email, password) => {
    try {
      setError(null);
      
      // Validate inputs
      if (!username || !email || !password) {
        setError('Username, email, and password are required');
        return false;
      }
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address');
        return false;
      }
      
      // Password strength validation
      if (password.length < 8) {
        setError('Password must be at least 8 characters long');
        return false;
      }
      
      await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password
      });
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.detail || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    localStorage.removeItem('token'); // Clean up any old tokens
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  // Check if registration is enabled
  const checkRegistrationStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/registration-status`);
      setRegistrationEnabled(response.data.enabled);
    } catch (error) {
      console.error('Error checking registration status:', error);
      setRegistrationEnabled(false); // Default to disabled if there's an error
    }
  };

  // Check registration status on initial load
  useEffect(() => {
    checkRegistrationStatus();
  }, []);

  const value = {
    user,
    setUser,
    loading,
    error,
    login,
    register,
    logout,
    registrationEnabled
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};