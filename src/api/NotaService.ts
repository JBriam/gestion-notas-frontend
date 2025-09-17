import { LocalStorageService } from "../localStorage/LocalStorageService";
import type { Nota, NotaForm } from "../interfaces/Nota";
import type { Estudiante } from "../interfaces/Estudiante";
import type { Curso } from "../interfaces/Curso";

// Instancia del servicio localStorage para notas
const notaStorage = new LocalStorageService<Nota>('notas', 'idNota');

// Servicios auxiliares para obtener datos relacionados
const getEstudiantes = (): Estudiante[] => {
  const data = localStorage.getItem('estudiantes');
  return data ? JSON.parse(data) : [];
};

const getCursos = (): Curso[] => {
  const data = localStorage.getItem('cursos');
  return data ? JSON.parse(data) : [];
};

export const NotaService = {
  async listar(): Promise<Nota[]> {
    return await notaStorage.getAll();
  },

  async crear(notaForm: NotaForm): Promise<Nota> {
    const estudiantes = getEstudiantes();
    const cursos = getCursos();
    
    const estudiante = estudiantes.find(e => e.idEstudiante === notaForm.idEstudiante);
    const curso = cursos.find(c => c.idCurso === notaForm.idCurso);
    
    if (!estudiante) {
      throw new Error(`Estudiante con ID ${notaForm.idEstudiante} no encontrado`);
    }
    
    if (!curso) {
      throw new Error(`Curso con ID ${notaForm.idCurso} no encontrado`);
    }
    
    const notaCompleta: Omit<Nota, 'idNota'> = {
      estudiante,
      curso,
      nota: notaForm.nota
    };
    
    return await notaStorage.create(notaCompleta);
  },

  async actualizar(nota: Nota): Promise<Nota> {
    return await notaStorage.update(nota);
  },

  async eliminar(id: number): Promise<void> {
    await notaStorage.delete(id);
  },
};
