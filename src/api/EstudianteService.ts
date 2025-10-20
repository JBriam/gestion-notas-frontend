import api from './axiosConfig';
import axios from 'axios';
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
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al obtener estudiantes');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Crear estudiante (para admin/docente)
  async crear(estudiante: Omit<Estudiante, 'idEstudiante'>): Promise<Estudiante> {
    try {
      const response = await api.post('/estudiantes', estudiante);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al crear estudiante');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Actualizar estudiante (para admin/docente)
  async actualizar(estudiante: Estudiante): Promise<Estudiante> {
    try {
      const response = await api.put(`/estudiantes/${estudiante.idEstudiante}`, estudiante);
      return response.data;
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
