import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://3.221.112.57/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token
apiClient.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`; // Añade el token al encabezado
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar expiración del token
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken'); // Elimina el token
      window.location.href = '/login'; // Redirige al login
    }
    return Promise.reject(error);
  }
);

export default apiClient;

