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
      console.log('📤 ENVIANDO AL BACKEND:', estudiante);
      const response = await api.post('/estudiantes/completo', estudiante);
      console.log('✅ RESPUESTA DEL BACKEND:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('❌ ERROR DEL BACKEND:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
        throw new Error(error.response?.data?.message || 'Error al crear estudiante');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Actualizar estudiante (para admin/docente)
  async actualizar(estudiante: Estudiante): Promise<Estudiante> {
    try {
      // Enviar solo los campos que el backend acepta
      const estudianteDTO = {
        nombres: estudiante.nombres,
        apellidos: estudiante.apellidos,
        codigoEstudiante: estudiante.codigoEstudiante,
        telefono: estudiante.telefono,
        direccion: estudiante.direccion,
        distrito: estudiante.distrito,
        foto: estudiante.foto,
        fechaNacimiento: estudiante.fechaNacimiento
      };
      
      console.log('=== DEBUG SERVICE ACTUALIZAR ESTUDIANTE ===');
      console.log('ID:', estudiante.idEstudiante);
      console.log('DTO a enviar:', estudianteDTO);
      
      const response = await api.put(`/estudiantes/${estudiante.idEstudiante}`, estudianteDTO);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('❌ Error del backend al actualizar estudiante:');
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
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
