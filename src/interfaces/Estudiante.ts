export interface Estudiante extends Record<string, unknown> {
  idEstudiante?: number; // Opcional al crear
  nombres: string;
  apellidos: string;
  email: string;
}