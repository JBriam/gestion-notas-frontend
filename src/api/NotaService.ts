import api from './axiosConfig';
import axios from 'axios';
import type { Nota, NotaForm, NotaBackend } from "../interfaces/Nota";

export const NotaService = {
  // Obtener todas las notas
  async listar(): Promise<NotaBackend[]> {
    try {
      const response = await api.get('/notas');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al obtener notas');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Obtener notas por estudiante
  async obtenerPorEstudiante(idEstudiante: number): Promise<Nota[]> {
    try {
      const response = await api.get(`/notas/estudiante/${idEstudiante}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al obtener notas del estudiante');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Crear nota
  async crear(notaForm: NotaForm): Promise<Nota> {
    try {
      const response = await api.post('/notas', notaForm);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al crear nota');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Actualizar nota
  async actualizar(nota: Nota): Promise<Nota> {
    try {
      const response = await api.put(`/notas/${nota.idNota}`, nota);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al actualizar nota');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Eliminar nota
  async eliminar(id: number): Promise<void> {
    try {
      await api.delete(`/notas/${id}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al eliminar nota');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },
};
