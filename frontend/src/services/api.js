import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getOne: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

export const contactAPI = {
  get: () => api.get('/contact'),
  update: (data) => api.put('/contact', data),
};

export const testimonialAPI = {
  getAll: () => api.get('/testimonials'),
  create: (data) => api.post('/testimonials', data),
  update: (id, data) => api.put(`/testimonials/${id}`, data),
  delete: (id) => api.delete(`/testimonials/${id}`),
};

export const galleryAPI = {
  getAll: (params) => api.get('/gallery', { params }),
  create: (data) => api.post('/gallery', data),
  update: (id, data) => api.put(`/gallery/${id}`, data),
  delete: (id) => api.delete(`/gallery/${id}`),
};

export const inquiryAPI = {
  create: (data) => api.post('/inquiries', data),
  getAll: (params) => api.get('/inquiries', { params }),
  markAsRead: (id) => api.put(`/inquiries/${id}/read`),
  delete: (id) => api.delete(`/inquiries/${id}`),
};

export default api;
