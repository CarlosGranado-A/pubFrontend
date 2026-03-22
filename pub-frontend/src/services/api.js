import axios from 'axios';

const api = axios.create({
  // Substitua pela porta correta do seu backend Spring Boot
  baseURL: 'http://localhost:8080' 
});

// Interceptor para injetar o token em todas as requisições
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default api;