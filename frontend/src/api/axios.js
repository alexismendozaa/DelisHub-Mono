import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token
apiClient.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`; // Añade el token al encabezado
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});




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
