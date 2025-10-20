export interface Estudiante extends Record<string, unknown> {
  idEstudiante?: number; // Opcional al crear
  nombres: string;
  apellidos: string;
  telefono?: string;
  direccion?: string;
  distrito?: string;
  foto?: string;
  fechaNacimiento?: string;
  codigoEstudiante: string;
  // Información del usuario asociado
  email?: string;
  rolUsuario?: string;
  usuarioActivo?: boolean;
}