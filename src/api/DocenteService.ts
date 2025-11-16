import api from './axiosConfig';
import axios from 'axios';
import type { Docente } from '../interfaces/Docente';
import type { DocenteProfile, ActualizarPerfilDocenteRequest } from '../interfaces/Auth';

export const DocenteService = {
  // Obtener perfil del docente por ID
  async obtenerPerfil(id: number): Promise<DocenteProfile> {
    try {
      const response = await api.get(`/docentes/${id}`);
      return response.data;
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
      const response = await api.put(`/docentes/${id}/perfil`, perfil);
      return response.data;
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
      const response = await api.get('/docentes');
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
      const response = await api.get('/docentes/activos');
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
      const response = await api.get(`/docentes/${id}`);
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
      const response = await api.get(`/usuario/${idUsuario}`);
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
      const response = await api.get('/buscar', {
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
      const response = await api.get(`/especialidad/${especialidad}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al obtener docentes por especialidad');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Crear docente
  async crear(docente: Omit<Docente, 'idDocente'>): Promise<Docente> {
    try {
      const response = await api.post('/docentes/completo', docente);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Mostrar el error completo del backend
        const errorMessage = error.response?.data?.message || error.response?.data || 'Error al crear docente';
        console.error('Error del backend:', error.response?.data);
        throw new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Actualizar docente
  async actualizar(docente: Docente): Promise<Docente> {
    try {
      // Enviar solo los campos que el backend acepta (sin idDocente, email, etc.)
      const docenteDTO = {
        nombres: docente.nombres,
        apellidos: docente.apellidos,
        codigoDocente: docente.codigoDocente,
        telefono: docente.telefono,
        direccion: docente.direccion,
        distrito: docente.distrito,
        foto: docente.foto,
        especialidad: docente.especialidad,
        fechaContratacion: docente.fechaContratacion
      };
      
      console.log('=== DEBUG SERVICE ACTUALIZAR ===');
      console.log('ID:', docente.idDocente);
      console.log('DTO a enviar:', docenteDTO);
      console.log('Foto length:', docente.foto?.length || 0);
      
      const response = await api.put(`/docentes/${docente.idDocente}`, docenteDTO);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('❌ Error del backend al actualizar:');
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
        console.error('Headers:', error.response?.headers);
        const errorMessage = error.response?.data?.message || error.response?.data || 'Error al actualizar docente';
        throw new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Eliminar docente
  async eliminar(id: number): Promise<void> {
    try {
      await api.delete(`/docentes/${id}`);
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
      const response = await api.get('/estadisticas/especialidad');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al obtener estadísticas');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },
};