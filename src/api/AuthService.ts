import api from './axiosConfig';
import axios from 'axios';
import type { LoginRequest, LoginResponse, RegisterRequest } from '../interfaces/Auth';

export const AuthService = {
  // Login de usuario
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await api.post('/usuarios/login', credentials);
      return response.data;
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
      await api.post('/usuarios/registro-completo', userData);
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