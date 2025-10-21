// Interfaces para la gestión de docentes

export interface Docente {
  idDocente: number;
  nombres: string;
  apellidos: string;
  telefono?: string;
  direccion?: string;
  distrito?: string;
  foto?: string;
  especialidad?: string;
  fechaContratacion?: string;
  codigoDocente: string;
  // Información del usuario asociado
  email?: string;
  rolUsuario?: string;
  usuarioActivo?: boolean;
}