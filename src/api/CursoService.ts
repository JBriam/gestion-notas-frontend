import axios from 'axios';
import axiosInstance from './axiosConfig';
import type { Curso } from "../interfaces/Curso";

export const CursoService = {
  // Obtener todos los cursos
  async listar(): Promise<Curso[]> {
    try {
      const response = await axiosInstance.get('/cursos');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al obtener cursos');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Crear curso
  async crear(curso: Omit<Curso, 'idCurso'>): Promise<Curso> {
    try {
      const response = await axiosInstance.post('/cursos', curso);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al crear curso');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Actualizar curso
  async actualizar(curso: Curso): Promise<Curso> {
    try {
      const response = await axiosInstance.put(`/cursos/${curso.idCurso}`, curso);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al actualizar curso');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Eliminar curso
  async eliminar(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`/cursos/${id}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al eliminar curso');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },
};
