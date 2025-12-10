import axiosInstance from './axiosConfig';

const getBaseURL = () => {
  return axiosInstance.defaults.baseURL || 'http://localhost:8080/api';
};

export const FotoService = {
  /**
   * Actualizar foto de perfil del estudiante
   * @param estudianteId ID del estudiante
   * @param file Archivo de imagen
   * @returns Respuesta con datos del estudiante actualizado
   */
  actualizarFotoEstudiante: async (estudianteId: number, file: File) => {
    try {
      const formData = new FormData();
      formData.append('foto', file);

      const response = await axiosInstance.put(
        `/estudiantes/${estudianteId}/foto`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Normalizar URL de la foto
      if (response.data && response.data.foto) {
        const foto = String(response.data.foto);
        if (!foto.startsWith('http') && !foto.startsWith('/')) {
          response.data.foto = `${getBaseURL()}/uploads/estudiantes/${foto}`;
        } else if (foto.startsWith('/uploads')) {
          response.data.foto = `${getBaseURL()}${foto}`;
        }
      }

      return {
        success: true,
        data: response.data,
        message: 'Foto actualizada exitosamente',
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Error al actualizar la foto';

      return {
        success: false,
        message: errorMessage,
        error: error.response?.data || error,
      };
    }
  },

  /**
   * Actualizar foto de perfil del docente
   * @param docenteId ID del docente
   * @param file Archivo de imagen
   * @returns Respuesta con datos del docente actualizado
   */
  actualizarFotoDocente: async (docenteId: number, file: File) => {
    try {
      const formData = new FormData();
      formData.append('foto', file);

      const response = await axiosInstance.put(
        `/docentes/${docenteId}/foto`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Normalizar URL de la foto
      if (response.data?.foto) {
        const foto = String(response.data.foto);
        if (!foto.startsWith('http') && !foto.startsWith('/')) {
          response.data.foto = `${getBaseURL()}/uploads/docentes/${foto}`;
        } else if (foto.startsWith('/uploads')) {
          response.data.foto = `${getBaseURL()}${foto}`;
        }
      }

      return {
        success: true,
        data: response.data,
        message: 'Foto actualizada exitosamente',
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Error al actualizar la foto';

      return {
        success: false,
        message: errorMessage,
        error: error.response?.data || error,
      };
    }
  },

  /**
   * Validar archivo de imagen
   * @param file Archivo a validar
   * @returns Objeto con validación
   */
  validarImagen: (file: File) => {
    const maxSizeInMB = 5;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (!file) {
      return {
        valid: false,
        message: 'Debes seleccionar un archivo',
      };
    }

    if (!validMimeTypes.includes(file.type)) {
      return {
        valid: false,
        message: 'Solo se permiten imágenes (JPEG, PNG, GIF, WebP)',
      };
    }

    if (file.size > maxSizeInBytes) {
      return {
        valid: false,
        message: `El tamaño máximo permitido es ${maxSizeInMB}MB`,
      };
    }

    return {
      valid: true,
      message: 'Archivo válido',
    };
  },
};
