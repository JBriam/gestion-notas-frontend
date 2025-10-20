// Configuración global de la API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  TIMEOUT: 10000, // 10 segundos
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

// Debug: Mostrar la URL que se está usando
console.log('🔧 API Configuration:', {
  BASE_URL: API_CONFIG.BASE_URL,
  ENV_VARIABLE: import.meta.env.VITE_API_URL,
  FALLBACK_USED: !import.meta.env.VITE_API_URL
});

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