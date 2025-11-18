// Interfaces que corresponden a los DTOs del backend

export interface LoginRequest extends Record<string, unknown> {
  email: string;
  password: string;
}

export interface RegisterRequest extends Record<string, unknown> {
  nombres: string;
  apellidos: string;
  telefono?: string;
  email: string;
  password: string;
  rol: 'ADMIN' | 'DOCENTE' | 'ESTUDIANTE';
  foto?: string;
}

export interface Usuario {
  idUsuario: number;
  email: string;
  rol: 'ADMIN' | 'DOCENTE' | 'ESTUDIANTE';
  activo: boolean;
  fechaCreacion: string;
}

export interface EstudianteProfile {
  idEstudiante: number;
  nombres: string;
  apellidos: string;
  telefono?: string;
  direccion?: string;
  distrito?: string;
  foto?: string;
  fechaNacimiento?: string;
  codigoEstudiante?: string;
  // Información del usuario asociado
  email?: string;
}

export interface DocenteProfile {
  idDocente: number;
  nombres: string;
  apellidos: string;
  telefono?: string;
  direccion?: string;
  distrito?: string;
  foto?: string;
  fechaContratacion?: string;
  especialidad?: string;
  codigoDocente?: string;
  // Información del usuario asociado
  email?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  usuario?: Usuario;
  perfilEstudiante?: EstudianteProfile;
  perfilDocente?: DocenteProfile;
}

export interface ActualizarPerfilEstudianteRequest {
  nombres?: string;
  apellidos?: string;
  telefono?: string;
  direccion?: string;
  distrito?: string;
  foto?: string;
  fechaNacimiento?: string;
  // Información del usuario asociado
  email?: string;
}

export interface ActualizarPerfilDocenteRequest {
  nombres?: string;
  apellidos?: string;
  telefono?: string;
  direccion?: string;
  distrito?: string;
  foto?: string;
  fechaContratacion?: string;
  especialidad?: string;
  // Información del usuario asociado
  email?: string;
}