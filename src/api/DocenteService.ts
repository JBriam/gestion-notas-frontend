import axiosInstance from './axiosConfig';
import axios from 'axios';
import type { Docente } from '../interfaces/Docente';
import type { DocenteProfile, ActualizarPerfilDocenteRequest } from '../interfaces/Auth';

export const DocenteService = {
  // Obtener perfil del docente por ID
  async obtenerPerfil(id: number): Promise<DocenteProfile> {
    try {
      const response = await axiosInstance.get(`/docentes/${id}`);
      const perfil: DocenteProfile = response.data;
      
      // Normalizar URL de la foto
      if (perfil.foto) {
        const foto = String(perfil.foto);
        if (!foto.startsWith('http') && !foto.startsWith('/')) {
          perfil.foto = `${axiosInstance.defaults.baseURL}/uploads/docentes/${foto}`;
        } else if (foto.startsWith('/uploads')) {
          perfil.foto = `${axiosInstance.defaults.baseURL}${foto}`;
        }
      }
      
      return perfil;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al obtener el perfil');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Actualizar perfil del docente
  async actualizarPerfil(id: number, perfil: ActualizarPerfilDocenteRequest): Promise<DocenteProfile> {
    try {
      const response = await axiosInstance.put(`/docentes/${id}/perfil`, perfil);
      const perfilActualizado: DocenteProfile = response.data;
      
      // Normalizar URL de la foto
      if (perfilActualizado.foto) {
        const foto = String(perfilActualizado.foto);
        if (!foto.startsWith('http') && !foto.startsWith('/')) {
          perfilActualizado.foto = `${axiosInstance.defaults.baseURL}/uploads/docentes/${foto}`;
        } else if (foto.startsWith('/uploads')) {
          perfilActualizado.foto = `${axiosInstance.defaults.baseURL}${foto}`;
        }
      }
      
      return perfilActualizado;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al actualizar el perfil');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Obtener todos los docentes
  async listar(): Promise<Docente[]> {
    try {
      const response = await axiosInstance.get('/docentes');
      const data: Docente[] = response.data.map((d: Docente) => {
        if (d.foto) {
          const foto = String(d.foto);
          if (!foto.startsWith('http') && !foto.startsWith('/')) {
            d.foto = `${axiosInstance.defaults.baseURL}/uploads/docentes/${foto}`;
          } else if (foto.startsWith('/uploads')) {
            d.foto = `${axiosInstance.defaults.baseURL}${foto}`;
          }
        }
        return d;
      });
      return data;
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
      const response = await axiosInstance.get(`/docentes/${id}`);
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
      const response = await axiosInstance.get(`/usuario/${idUsuario}`);
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
      const response = await axiosInstance.get('/buscar', {
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
      const response = await axiosInstance.get(`/especialidad/${especialidad}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al obtener docentes por especialidad');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Crear docente
  async crear(docente: Omit<Docente, 'idDocente'> | FormData): Promise<Docente> {
    try {
      let response;
      if (docente instanceof FormData) {
        response = await axiosInstance.post('/docentes/completo', docente, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        response = await axiosInstance.post('/docentes/completo', docente);
      }
      const created: Docente = response.data;
      if (created && created.foto) {
        const foto = String(created.foto);
        if (!foto.startsWith('http') && !foto.startsWith('/')) {
          created.foto = `${axiosInstance.defaults.baseURL}/uploads/docentes/${foto}`;
        } else if (foto.startsWith('/uploads')) {
          created.foto = `${axiosInstance.defaults.baseURL}${foto}`;
        }
      }
      return created;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al crear docente');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Actualizar docente
  async actualizar(docente: Docente | FormData): Promise<Docente> {
    try {
      let response;
      if (docente instanceof FormData) {
        const id = docente.get('idDocente');
        response = await axiosInstance.put(`/docentes/${id}`, docente, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        response = await axiosInstance.put(`/docentes/${docente.idDocente}`, docente);
      }
      const updated: Docente = response.data;
      if (updated && updated.foto) {
        const foto = String(updated.foto);
        if (!foto.startsWith('http') && !foto.startsWith('/')) {
          updated.foto = `${axiosInstance.defaults.baseURL}/uploads/docentes/${foto}`;
        } else if (foto.startsWith('/uploads')) {
          updated.foto = `${axiosInstance.defaults.baseURL}${foto}`;
        }
      }
      return updated;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al actualizar docente');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Eliminar docente
  async eliminar(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`/docentes/${id}`);
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
      const response = await axiosInstance.get('/estadisticas/especialidad');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al obtener estadísticas');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },
};