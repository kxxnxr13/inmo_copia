import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para agregar el token a las peticiones protegidas
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar respuestas 401 (token inválido)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado - limpiar localStorage y recargar
      console.log('🔒 Token inválido - cerrando sesión automáticamente');
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Recargar la página para que el AuthContext detecte que no hay token
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
    return Promise.reject(error);
  }
);

export default api;
