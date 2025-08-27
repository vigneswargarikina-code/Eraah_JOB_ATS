import axios from 'axios';


const API_BASE_URL = 'http://localhost:5000/api';


const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  (config) => {
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);


export const candidateAPI = {
  
  getAll: (params = {}) => api.get('/candidates', { params }),
  
  
  getById: (id) => api.get(`/candidates/${id}`),
  
  
  create: (candidateData) => api.post('/candidates', candidateData),
  
  
  update: (id, candidateData) => api.put(`/candidates/${id}`, candidateData),
  
  
  updateStatus: (id, status) => api.patch(`/candidates/${id}/status`, { status }),
  
  
  delete: (id) => api.delete(`/candidates/${id}`),
  
  
  getByStatus: (status, params = {}) => api.get(`/candidates/status/${status}`, { params }),
  
  
  getAnalytics: () => api.get('/candidates/analytics/overview'),
};


export const healthCheck = () => api.get('/health');

export default api;

