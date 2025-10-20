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

export interface CrearDocenteRequest {
  nombres: string;
  apellidos: string;
  telefono?: string;
  distrito?: string;
  foto?: string;
  especialidad?: string;
  fechaContratacion?: string;
  idUsuario?: number;
}

export interface ActualizarDocenteRequest {
  nombres?: string;
  apellidos?: string;
  telefono?: string;
  distrito?: string;
  foto?: string;
  especialidad?: string;
  fechaContratacion?: string;
}