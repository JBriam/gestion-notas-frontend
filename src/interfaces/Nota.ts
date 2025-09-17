import type { Estudiante } from "./Estudiante";
import type { Curso } from "./Curso";

export interface Nota extends Record<string, unknown> {
  idNota?: number; // Opcional al crear
  estudiante: Estudiante;
  curso: Curso;
  nota: number;
}

// Interfaz para el formulario (solo IDs)
export interface NotaForm {
  idEstudiante: number;
  idCurso: number;
  nota: number;
}