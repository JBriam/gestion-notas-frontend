import axios from 'axios';
import axiosInstance from './axiosConfig';
import type { LoginRequest, LoginResponse, RegisterRequest } from '../interfaces/Auth';

export const AuthService = {
  // Login de usuario
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await axiosInstance.post('/usuarios/login', credentials);
      const data: LoginResponse = response.data;
      
      // Normalizar URL de foto del estudiante si existe
      if (data.perfilEstudiante?.foto) {
        const foto = String(data.perfilEstudiante.foto);
        if (!foto.startsWith('http') && !foto.startsWith('/')) {
          data.perfilEstudiante.foto = `${axiosInstance.defaults.baseURL}/uploads/estudiantes/${foto}`;
        } else if (foto.startsWith('/uploads')) {
          data.perfilEstudiante.foto = `${axiosInstance.defaults.baseURL}${foto}`;
        }
      }
      
      // Normalizar URL de foto del docente si existe
      if (data.perfilDocente?.foto) {
        const foto = String(data.perfilDocente.foto);
        if (!foto.startsWith('http') && !foto.startsWith('/')) {
          data.perfilDocente.foto = `${axiosInstance.defaults.baseURL}/uploads/docentes/${foto}`;
        } else if (foto.startsWith('/uploads')) {
          data.perfilDocente.foto = `${axiosInstance.defaults.baseURL}${foto}`;
        }
      }
      
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return {
          success: false,
          message: error.response.data?.message || 'Error en el login',
        };
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Registro de usuario
  register: async (userData: RegisterRequest): Promise<{ success: boolean; message: string }> => {
    try {
      await axiosInstance.post('/usuarios/registro-completo', userData);
      return {
        success: true,
        message: 'Usuario registrado exitosamente',
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        let message = 'Error al registrar usuario';
        
        if (status === 409) {
          message = 'El usuario o email ya existe';
        } else if (status === 400) {
          message = 'Datos de registro inválidos';
        }
        
        return {
          success: false,
          message,
        };
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Validar token o sesión (si implementas tokens en el futuro)
  validateSession: async (): Promise<boolean> => {
    // Por ahora retorna true si hay datos en localStorage
    // En el futuro puedes implementar validación de tokens
    const usuario = localStorage.getItem('usuario');
    return !!usuario;
  },
};