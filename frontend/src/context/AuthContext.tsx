import axios from 'axios';
import type React from 'react';
import { type ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { Token, User } from '../types/api';

// API base URL - use environment variable or fallback
const API_URL = process.env.REACT_APP_API_URL || '/api';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  registrationEnabled: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [registrationEnabled, setRegistrationEnabled] = useState<boolean>(false);

  // Initialize auth state from sessionStorage (with localStorage fallback for existing users)
  useEffect(() => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (token) {
      // If token was in localStorage, move it to sessionStorage
      if (localStorage.getItem('token')) {
        const token = localStorage.getItem('token');
        if (token) {
          sessionStorage.setItem('token', token);
        }
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
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      axios.defaults.headers.common.Authorization = undefined;
    }
  }, []);

  const fetchUserData = async (token: string): Promise<void> => {
    try {
      if (!token) {
        setLoading(false);
        return;
      }

      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      const response = await axios.get<User>(`${API_URL}/auth/me`);
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      sessionStorage.removeItem('token');
      localStorage.removeItem('token'); // Clean up any old tokens
      axios.defaults.headers.common.Authorization = undefined;
      setLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
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

      const response = await axios.post<Token>(`${API_URL}/auth/login`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      const { access_token } = response.data;

      // Store token in sessionStorage instead of localStorage for better security
      sessionStorage.setItem('token', access_token);
      localStorage.removeItem('token'); // Remove from localStorage if it exists
      await fetchUserData(access_token);
      return true;
    } catch (error: unknown) {
      console.error('Login error:', error);
      const errorMessage =
        error instanceof Error && 'response' in error
          ? (error as { response?: { data?: { detail?: string } } }).response?.data?.detail ||
            'Login failed'
          : 'Login failed';
      setError(errorMessage);
      return false;
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
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

      await axios.post<User>(`${API_URL}/auth/register`, {
        username,
        email,
        password,
      });
      return true;
    } catch (error: unknown) {
      console.error('Registration error:', error);
      const errorMessage =
        error instanceof Error && 'response' in error
          ? (error as { response?: { data?: { detail?: string } } }).response?.data?.detail ||
            'Registration failed'
          : 'Registration failed';
      setError(errorMessage);
      return false;
    }
  };

  const logout = (): void => {
    sessionStorage.removeItem('token');
    localStorage.removeItem('token'); // Clean up any old tokens
    axios.defaults.headers.common.Authorization = undefined;
    setUser(null);
  };

  // Check if registration is enabled
  const checkRegistrationStatus = useCallback(async (): Promise<void> => {
    try {
      const response = await axios.get<{ enabled: boolean }>(`${API_URL}/auth/registration-status`);
      setRegistrationEnabled(response.data.enabled);
    } catch (error) {
      console.error('Error checking registration status:', error);
      setRegistrationEnabled(false); // Default to disabled if there's an error
    }
  }, []);

  // Check registration status on initial load
  useEffect(() => {
    checkRegistrationStatus();
  }, [checkRegistrationStatus]);

  const value: AuthContextType = {
    user,
    setUser,
    loading,
    error,
    login,
    register,
    logout,
    registrationEnabled,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
