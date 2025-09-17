import { LocalStorageService } from "../localStorage/LocalStorageService";
import type { Curso } from "../interfaces/Curso";

// Instancia del servicio localStorage para cursos
const cursoStorage = new LocalStorageService<Curso>('cursos', 'idCurso');

// Inicializar con datos por defecto si está vacío
cursoStorage.initializeWithDefaults([
  { idCurso: 1, nombre: "Matemáticas" },
  { idCurso: 2, nombre: "Español" },
  { idCurso: 3, nombre: "Ciencias Naturales" },
  { idCurso: 4, nombre: "Historia" },
  { idCurso: 5, nombre: "Inglés" }
]);

export const CursoService = {
  async listar(): Promise<Curso[]> {
    return await cursoStorage.getAll();
  },

  async crear(curso: Omit<Curso, 'idCurso'>): Promise<Curso> {
    return await cursoStorage.create(curso);
  },

  async actualizar(curso: Curso): Promise<Curso> {
    return await cursoStorage.update(curso);
  },

  async eliminar(id: number): Promise<void> {
    await cursoStorage.delete(id);
  },
};
