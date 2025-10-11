export interface Curso extends Record<string, unknown> {
  idCurso?: number;
  nombre: string;
  codigo?: string;
  codigoCurso?: string;
  descripcion?: string;
  creditos?: number;
  activo?: boolean;
  idDocente?: number; // ID del docente asignado
  docente?: {
    idDocente: number;
    nombres: string;
    apellidos: string;
    especialidad?: string;
  };
}