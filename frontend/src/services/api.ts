import axios, { AxiosResponse, AxiosError } from 'axios';
import { 
  User, 
  Cat, 
  WeightRecord, 
  PlotData, 
  Token,
  UserCreate,
  UserLogin,
  UserUpdate,
  UserPasswordChange,
  CatCreate,
  CatUpdate,
  WeightRecordCreate,
  ApiError
} from '../types/api';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Check sessionStorage first (current), then localStorage (fallback)
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('access_token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Error handler utility
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    
    if (axiosError.response?.data?.detail) {
      return axiosError.response.data.detail;
    }
    
    if (axiosError.response?.data?.errors) {
      return axiosError.response.data.errors.join(', ');
    }
    
    switch (axiosError.response?.status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Authentication required. Please log in.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'A conflict occurred. The resource may already exist.';
      case 422:
        return 'Validation error. Please check your input.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

// Authentication API
export const authApi = {
  async login(credentials: UserLogin): Promise<Token> {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    
    const response: AxiosResponse<Token> = await apiClient.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  async register(userData: UserCreate): Promise<User> {
    const response: AxiosResponse<User> = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response: AxiosResponse<User> = await apiClient.get('/auth/me');
    return response.data;
  },

  async updateProfile(userData: UserUpdate): Promise<User> {
    const response: AxiosResponse<User> = await apiClient.put('/auth/me', userData);
    return response.data;
  },

  async changePassword(passwordData: UserPasswordChange): Promise<void> {
    await apiClient.put('/auth/me/password', passwordData);
  },
};

// Cat API
export const catApi = {
  async getCats(): Promise<Cat[]> {
    const response: AxiosResponse<Cat[]> = await apiClient.get('/auth/users/me/cats');
    return response.data;
  },

  async createCat(catData: CatCreate): Promise<Cat> {
    const response: AxiosResponse<Cat> = await apiClient.post('/cats/', catData);
    return response.data;
  },

  async updateCat(catId: number, catData: CatUpdate): Promise<Cat> {
    const response: AxiosResponse<Cat> = await apiClient.put(`/cats/${catId}`, catData);
    return response.data;
  },

  async deleteCat(catId: number): Promise<void> {
    await apiClient.delete(`/cats/${catId}`);
  },

  async getCat(catId: number): Promise<Cat> {
    const response: AxiosResponse<Cat> = await apiClient.get(`/cats/${catId}`);
    return response.data;
  },
};

// Weight Record API
export const weightApi = {
  async getWeightRecords(catId: number): Promise<WeightRecord[]> {
    const response: AxiosResponse<WeightRecord[]> = await apiClient.get(`/cats/${catId}/weights`);
    return response.data;
  },

  async createWeightRecord(catId: number, weightData: WeightRecordCreate): Promise<WeightRecord> {
    const response: AxiosResponse<WeightRecord> = await apiClient.post(
      `/cats/${catId}/weights`, 
      weightData
    );
    return response.data;
  },

  async updateWeightRecord(weightId: number, weightData: Partial<WeightRecordCreate>): Promise<WeightRecord> {
    const response: AxiosResponse<WeightRecord> = await apiClient.put(
      `/weights/${weightId}`, 
      weightData
    );
    return response.data;
  },

  async deleteWeightRecord(weightId: number): Promise<void> {
    await apiClient.delete(`/weights/${weightId}`);
  },

  async getPlotData(catId: number): Promise<PlotData> {
    const response: AxiosResponse<PlotData> = await apiClient.get(`/cats/${catId}/plot`);
    return response.data;
  },
};

// Health check API
export const healthApi = {
  async checkHealth(): Promise<{ status: string }> {
    const response: AxiosResponse<{ status: string }> = await apiClient.get('/');
    return response.data;
  },
};

// Export all APIs
export const api = {
  auth: authApi,
  cats: catApi,
  weights: weightApi,
  health: healthApi,
};

export default api;
