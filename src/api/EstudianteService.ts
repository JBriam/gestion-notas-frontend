import axiosInstance from './axiosConfig';
import axios from 'axios';
import type { EstudianteProfile, ActualizarPerfilEstudianteRequest } from '../interfaces/Auth';
import type { Estudiante } from "../interfaces/Estudiante";

export const EstudianteService = {
  // Obtener perfil del estudiante por ID
  async obtenerPerfil(id: number): Promise<EstudianteProfile> {
    try {
      const response = await axiosInstance.get(`/estudiantes/${id}`);
      const perfil: EstudianteProfile = response.data;
      
      // Normalizar URL de la foto
      if (perfil.foto) {
        const foto = String(perfil.foto);
        if (!foto.startsWith('http') && !foto.startsWith('/')) {
          perfil.foto = `${axiosInstance.defaults.baseURL}/uploads/estudiantes/${foto}`;
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

  // Actualizar perfil del estudiante
  async actualizarPerfil(id: number, perfil: ActualizarPerfilEstudianteRequest, fotoFile?: File): Promise<EstudianteProfile> {
    try {
      // Siempre usar FormData porque el backend espera multipart/form-data
      const formData = new FormData();
      
      // Solo agregar la foto si hay un archivo nuevo
      if (fotoFile) {
        formData.append('foto', fotoFile);
      }
      
      // Agregar los demás campos
      formData.append('nombres', perfil.nombres || '');
      formData.append('apellidos', perfil.apellidos || '');
      formData.append('telefono', perfil.telefono || '');
      formData.append('direccion', perfil.direccion || '');
      formData.append('distrito', perfil.distrito || '');
      formData.append('fechaNacimiento', perfil.fechaNacimiento || '');
      formData.append('email', perfil.email || '');
      
      const response = await axiosInstance.put(`/estudiantes/${id}/perfil`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      const perfilActualizado: EstudianteProfile = response.data;
      
      // Normalizar URL de la foto
      if (perfilActualizado && perfilActualizado.foto) {
        const foto = String(perfilActualizado.foto);
        if (!foto.startsWith('http') && !foto.startsWith('/')) {
          perfilActualizado.foto = `${axiosInstance.defaults.baseURL}/uploads/estudiantes/${foto}`;
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

  // Obtener todos los estudiantes (para admin/docente)
  async listar(): Promise<Estudiante[]> {
    try {
      const response = await axiosInstance.get('/estudiantes');
      // Normalizar ruta de la foto: si el backend devuelve solo el nombre de archivo,
      // convertirlo en una URL completa apuntando a /uploads/estudiantes/
      const data: Estudiante[] = response.data.map((e: Estudiante) => {
        if (e.foto) {
          const foto = String(e.foto);
          if (!foto.startsWith('http') && !foto.startsWith('/')) {
            e.foto = `${axiosInstance.defaults.baseURL}/uploads/estudiantes/${foto}`;
          } else if (foto.startsWith('/uploads')) {
            e.foto = `${axiosInstance.defaults.baseURL}${foto}`;
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
        response = await axiosInstance.post('/estudiantes/completo', estudiante, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        response = await axiosInstance.post('/estudiantes/completo', estudiante);
      }
      const created: Estudiante = response.data;
      if (created && created.foto) {
        const foto = String(created.foto);
        if (!foto.startsWith('http') && !foto.startsWith('/')) {
          created.foto = `${axiosInstance.defaults.baseURL}/uploads/estudiantes/${foto}`;
        } else if (foto.startsWith('/uploads')) {
          created.foto = `${axiosInstance.defaults.baseURL}${foto}`;
        }
      }
      return created;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message;
        const errorData = error.response?.data;
        
        console.log('Error al crear estudiante:', { status, message, errorData });
        
        // Detectar errores de correo duplicado - verificar múltiples formatos
        const errorString = JSON.stringify(errorData || {}).toLowerCase();
        const messageStr = (message || '').toLowerCase();
        
        if (status === 409 || 
            messageStr.includes('email') || 
            messageStr.includes('correo') || 
            messageStr.includes('existe') ||
            messageStr.includes('duplicado') ||
            messageStr.includes('duplicate') ||
            errorString.includes('email') ||
            errorString.includes('correo') ||
            errorString.includes('existe') ||
            errorString.includes('duplicado') ||
            errorString.includes('duplicate')) {
          throw new Error('El correo electrónico ya está registrado. Por favor, utilice otro correo.');
        }
        
        throw new Error(message || 'Error al crear estudiante');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Actualizar estudiante (para admin/docente)
  async actualizar(estudiante: Estudiante | FormData): Promise<Estudiante> {
    try {
      let response;
      if (estudiante instanceof FormData) {
        const id = estudiante.get('idEstudiante');
        response = await axiosInstance.put(`/estudiantes/${id}`, estudiante, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        response = await axiosInstance.put(`/estudiantes/${estudiante.idEstudiante}`, estudiante);
      }
      const updated: Estudiante = response.data;
      if (updated && updated.foto) {
        const foto = String(updated.foto);
        if (!foto.startsWith('http') && !foto.startsWith('/')) {
          updated.foto = `${axiosInstance.defaults.baseURL}/uploads/estudiantes/${foto}`;
        } else if (foto.startsWith('/uploads')) {
          updated.foto = `${axiosInstance.defaults.baseURL}${foto}`;
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
      await axiosInstance.delete(`/estudiantes/${id}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al eliminar estudiante');
      }
      throw new Error('Error de conexión con el servidor');
    }
  },
};
