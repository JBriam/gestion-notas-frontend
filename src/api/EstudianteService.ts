import api from './axiosConfig';
import axios from 'axios';
import { API_CONFIG } from './config';
import type { EstudianteProfile, ActualizarPerfilEstudianteRequest } from '../interfaces/Auth';
import type { Estudiante } from "../interfaces/Estudiante";

export const EstudianteService = {
  // Obtener perfil del estudiante por ID
  async obtenerPerfil(id: number): Promise<EstudianteProfile> {
    try {
      const response = await api.get(`/estudiantes/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al obtener el perfil');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Actualizar perfil del estudiante
  async actualizarPerfil(id: number, perfil: ActualizarPerfilEstudianteRequest): Promise<EstudianteProfile> {
    try {
      const response = await api.put(`/estudiantes/${id}/perfil`, perfil);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al actualizar el perfil');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Obtener todos los estudiantes (para admin/docente)
  async listar(): Promise<Estudiante[]> {
    try {
      const response = await api.get('/estudiantes');
      // Normalizar ruta de la foto: si el backend devuelve solo el nombre de archivo,
      // convertirlo en una URL completa apuntando a /uploads/estudiantes/
      const data: Estudiante[] = response.data.map((e: Estudiante) => {
        if (e.foto) {
          const foto = String(e.foto);
          if (!foto.startsWith('http') && !foto.startsWith('/')) {
            e.foto = `${API_CONFIG.BASE_URL}/uploads/estudiantes/${foto}`;
          } else if (foto.startsWith('/uploads')) {
            e.foto = `${API_CONFIG.BASE_URL}${foto}`;
          }
        }
        return e;
      });
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al obtener estudiantes');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Crear estudiante (para admin/docente)
  async crear(estudiante: Omit<Estudiante, 'idEstudiante'> | FormData): Promise<Estudiante> {
    try {
      let response;
      if (estudiante instanceof FormData) {
        // Validar tamaño de archivo si hay foto
        const foto = estudiante.get('foto') as File;
        if (foto && foto.size > 10 * 1024 * 1024) {
          throw new Error('La imagen debe ser menor a 10MB');
        }
        response = await api.post('/api/estudiantes/completo', estudiante, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        response = await api.post('/api/estudiantes/completo', estudiante);
      }
      const created: Estudiante = response.data;
      if (created && created.foto) {
        const foto = String(created.foto);
        if (!foto.startsWith('http') && !foto.startsWith('/')) {
          created.foto = `${API_CONFIG.BASE_URL}/uploads/estudiantes/${foto}`;
        } else if (foto.startsWith('/uploads')) {
          created.foto = `${API_CONFIG.BASE_URL}${foto}`;
        }
      }
      return created;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al crear estudiante');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Actualizar estudiante (para admin/docente)
  async actualizar(estudiante: Estudiante | FormData): Promise<Estudiante> {
    try {
      let response;
      if (estudiante instanceof FormData) {
        // FormData debe incluir el campo idEstudiante
        const id = estudiante.get('idEstudiante');
        response = await api.put(`/estudiantes/${id}`, estudiante, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        response = await api.put(`/estudiantes/${estudiante.idEstudiante}`, estudiante);
      }
      const updated: Estudiante = response.data;
      if (updated && updated.foto) {
        const foto = String(updated.foto);
        if (!foto.startsWith('http') && !foto.startsWith('/')) {
          updated.foto = `${API_CONFIG.BASE_URL}/uploads/estudiantes/${foto}`;
        } else if (foto.startsWith('/uploads')) {
          updated.foto = `${API_CONFIG.BASE_URL}${foto}`;
        }
      }
      return updated;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al actualizar estudiante');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Eliminar estudiante (para admin/docente)
  async eliminar(id: number): Promise<void> {
    try {
      await api.delete(`/estudiantes/${id}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al eliminar estudiante');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },
};
