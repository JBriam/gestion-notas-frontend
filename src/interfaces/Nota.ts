import type { Estudiante } from "./Estudiante";
import type { Curso } from "./Curso";

// Interfaz para la respuesta del backend (con objetos anidados)
export interface Nota extends Record<string, unknown> {
  idNota?: number; // Opcional al crear
  estudiante: Estudiante;
  curso: Curso;
  nota: number;
  tipoEvaluacion?: string;
  fechaRegistro?: string;
  observaciones?: string;
}

// Interfaz para la estructura real que devuelve el backend
export interface NotaBackend {
  idNota: number;
  nota: number;
  tipoEvaluacion: string;
  fechaRegistro: string;
  observaciones: string;
  idEstudiante: number;
  idCurso: number;
}

// Interfaz para el formulario (solo IDs)
export interface NotaForm {
  idEstudiante: number;
  idCurso: number;
  nota: number;
  tipoEvaluacion?: string;
  observaciones?: string;
}