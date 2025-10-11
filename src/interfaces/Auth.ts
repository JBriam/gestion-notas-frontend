// Interfaces que corresponden a los DTOs del backend

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  rol: 'ADMIN' | 'DOCENTE' | 'ESTUDIANTE';
}

export interface Usuario {
  idUsuario: number;
  username: string;
  email: string;
  rol: 'ADMIN' | 'DOCENTE' | 'ESTUDIANTE';
  activo: boolean;
  fechaCreacion: string;
}

export interface EstudianteProfile {
  idEstudiante: number;
  nombres: string;
  apellidos: string;
  email?: string;
  telefono?: string;
  distrito?: string;
  foto?: string;
  fechaNacimiento?: string;
  codigoEstudiante?: string;
  usuario?: Usuario;
}

export interface DocenteProfile {
  idDocente: number;
  nombres: string;
  apellidos: string;
  email?: string;
  telefono?: string;
  especialidad?: string;
  usuario?: Usuario;
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
  email?: string;
  telefono?: string;
  distrito?: string;
  foto?: string;
  fechaNacimiento?: string;
}