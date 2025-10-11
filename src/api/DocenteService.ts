import axios from 'axios';
import axiosInstance from './axiosConfig';
import type { Docente, CrearDocenteRequest, ActualizarDocenteRequest } from '../interfaces/Docente';

export const DocenteService = {
  // Obtener todos los docentes
  async listar(): Promise<Docente[]> {
    try {
      const response = await axiosInstance.get('/docentes');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al obtener docentes');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Obtener docentes activos
  async obtenerActivos(): Promise<Docente[]> {
    try {
      const response = await axiosInstance.get('/docentes/activos');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al obtener docentes activos');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Obtener docente por ID
  async obtenerPorId(id: number): Promise<Docente> {
    try {
      const response = await docenteAPI.get(`/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al obtener docente');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Obtener docente por ID de usuario
  async obtenerPorIdUsuario(idUsuario: number): Promise<Docente> {
    try {
      const response = await docenteAPI.get(`/usuario/${idUsuario}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al obtener docente por usuario');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Buscar docentes por nombre
  async buscar(termino: string): Promise<Docente[]> {
    try {
      const response = await docenteAPI.get('/buscar', {
        params: { termino }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al buscar docentes');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Obtener docentes por especialidad
  async obtenerPorEspecialidad(especialidad: string): Promise<Docente[]> {
    try {
      const response = await docenteAPI.get(`/especialidad/${especialidad}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al obtener docentes por especialidad');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Crear docente
  async crear(docente: CrearDocenteRequest): Promise<Docente> {
    try {
      const response = await docenteAPI.post('/', docente);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al crear docente');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Actualizar docente
  async actualizar(id: number, docente: ActualizarDocenteRequest): Promise<Docente> {
    try {
      const response = await docenteAPI.put(`/${id}`, docente);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al actualizar docente');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Actualizar perfil del docente
  async actualizarPerfil(id: number, perfil: ActualizarDocenteRequest): Promise<Docente> {
    try {
      const response = await docenteAPI.put(`/${id}/perfil`, perfil);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al actualizar perfil');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Eliminar docente
  async eliminar(id: number): Promise<void> {
    try {
      await docenteAPI.delete(`/${id}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al eliminar docente');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Obtener estadísticas por especialidad
  async obtenerEstadisticasEspecialidad(): Promise<{ especialidad: string; cantidad: number }[]> {
    try {
      const response = await docenteAPI.get('/estadisticas/especialidad');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al obtener estadísticas');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },
};