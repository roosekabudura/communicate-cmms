import axios from 'axios';

const api = axios.create({ baseURL: 'http://127.0.0.1:8000' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authService = {
  login: async (email, password) => {
    const response = await fetch('http://127.0.0.1:8000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    
    // This saves the token so you stay logged in
    localStorage.setItem('token', data.token); 
    
    // We return the whole data (including the role) back to the Login page
    return data; 
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';
  }
};

export const assetService = {
  getAll: () => api.get('/assets'),
  create: (data) => api.post('/assets', data),
  update: (id, data) => api.put(`/assets${id}`, data),
  delete: (id) => api.delete(`/assets/${id}`)
};

export const engineerService = {
  getAll: () => api.get('/engineers/'),
  create: (data) => api.post('/engineers/', data),
  update: (id, data) => api.put(`/engineers/${id}`, data),
  delete: (id) => api.delete(`/engineers/${id}`)
};

export const workOrderService = {
  getAll: () => api.get('/work-orders/'),
  create: (data) => api.post('/work-orders/', data),
  update: (id, data) => api.put(`/work-orders/${id}`, data),
  delete: (id) => api.delete(`/work-orders/${id}`)
};

export const inventoryService = {
  getAll: () => api.get('/inventory/'),
  create: (data) => api.post('/inventory/', data),
  update: (id, data) => api.put(`/inventory/${id}`, data),
  delete: (id) => api.delete(`/inventory/${id}`)
};


export default api;
