import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// API base URL - use environment-specific URL
const API_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : '/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registrationEnabled, setRegistrationEnabled] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData(token);
    } else {
      setLoading(false);
    }
  }, []);

  // Configure axios to use the token for all requests
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [user]);

  const fetchUserData = async (token) => {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get(`${API_URL}/auth/me`);
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      setError(null);
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      
      const response = await axios.post(`${API_URL}/auth/login`, formData);
      const { access_token } = response.data;
      
      localStorage.setItem('token', access_token);
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
    localStorage.removeItem('token');
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