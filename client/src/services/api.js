import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth functions
export const register = (userData) => API.post('/register', userData);
export const login = (userData) => API.post('/login', userData);

// Financial data functions
export const saveFinancialData = (financialData) => 
  API.post('/save-financial-data', financialData);

export const generateSavingsPlan = (financialData) => 
  API.post('/generate-plan', financialData);

export const getFinancialHistory = () => 
  API.get('/financial-history');

// Helper function to check if token is expired
export const isTokenValid = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    return decoded.exp > Date.now() / 1000;
  } catch {
    return false;
  }
};

export default API;