// Configuración global de la API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || '/api',
  TIMEOUT: 10000, // 10 segundos
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

// Configuración de endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/usuarios/login',
    REGISTER: '/usuarios',
  },
  ESTUDIANTES: '/estudiantes',
  CURSOS: '/cursos',
  NOTAS: '/notas',
  DOCENTES: '/docentes',
};