// src/api/axiosConfig.ts
import axios from "axios";
import { API_CONFIG } from "./config";

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Interceptor para agregar token de autenticación si es necesario
api.interceptors.request.use(
  (config) => {
    // Aquí podrías agregar el token de autenticación si lo implementas
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o no válido
      localStorage.removeItem('usuario');
      localStorage.removeItem('perfilEstudiante');
      localStorage.removeItem('perfilDocente');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;