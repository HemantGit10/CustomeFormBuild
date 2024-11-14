
import axios from 'axios';

// Create an Axios instance with base URL and any default headers.
const axiosInstance = axios.create({
  baseURL: '', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add request or response interceptors for authentication handling.
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Assuming JWT stored in localStorage
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
