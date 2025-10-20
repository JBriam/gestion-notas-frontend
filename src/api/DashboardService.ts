import type { EstudianteConNotasDTO, CursoConNotasDTO, NotaCursoDTO, NotaEstudianteDTO } from "../interfaces/Dashboard";
import type { Estudiante } from "../interfaces/Estudiante";
import type { Curso } from "../interfaces/Curso";
import type { Nota } from "../interfaces/Nota";

// Funciones auxiliares para obtener datos del localStorage
const getEstudiantes = (): Estudiante[] => {
  const data = localStorage.getItem('estudiantes');
  return data ? JSON.parse(data) : [];
};

const getCursos = (): Curso[] => {
  const data = localStorage.getItem('cursos');
  return data ? JSON.parse(data) : [];
};

const getNotas = (): Nota[] => {
  const data = localStorage.getItem('notas');
  return data ? JSON.parse(data) : [];
};

// Función para calcular promedio
const calcularPromedio = (notas: number[]): number => {
  if (notas.length === 0) return 0;
  const suma = notas.reduce((acc, nota) => acc + nota, 0);
  return Math.round((suma / notas.length) * 100) / 100; // Redondear a 2 decimales
};

export const DashboardService = {
  async getEstudiantesConNotas(): Promise<EstudianteConNotasDTO[]> {
    return new Promise((resolve) => {
      const estudiantes = getEstudiantes();
      const notas = getNotas();

      const estudiantesConNotas: EstudianteConNotasDTO[] = estudiantes.map(estudiante => {
        // Filtrar notas del estudiante
        const notasEstudiante = notas.filter(nota => 
          nota.estudiante.idEstudiante === estudiante.idEstudiante
        );

        // Mapear notas a formato DTO
        const notasCurso: NotaCursoDTO[] = notasEstudiante.map(nota => ({
          idCurso: nota.curso.idCurso!,
          nombreCurso: nota.curso.nombre,
          nota: nota.nota
        }));

        // Calcular promedio
        const promedio = calcularPromedio(notasEstudiante.map(n => n.nota));

        return {
          idEstudiante: estudiante.idEstudiante!,
          nombres: estudiante.nombres,
          apellidos: estudiante.apellidos,
          email: estudiante.email,
          notas: notasCurso,
          promedio
        };
      });

      resolve(estudiantesConNotas);
    });
  },

  async getCursosConNotas(): Promise<CursoConNotasDTO[]> {
    return new Promise((resolve) => {
      const cursos = getCursos();
      const notas = getNotas();

      const cursosConNotas: CursoConNotasDTO[] = cursos.map(curso => {
        // Filtrar notas del curso
        const notasCurso = notas.filter(nota => 
          nota.curso.idCurso === curso.idCurso
        );

        // Mapear notas a formato DTO
        const notasEstudiante: NotaEstudianteDTO[] = notasCurso.map(nota => ({
          idEstudiante: nota.estudiante.idEstudiante!,
          nombresEstudiante: nota.estudiante.nombres,
          apellidosEstudiante: nota.estudiante.apellidos,
          nota: nota.nota
        }));

        // Calcular promedio general y total de estudiantes
        const promedioGeneral = calcularPromedio(notasCurso.map(n => n.nota));
        const totalEstudiantes = notasCurso.length;

        return {
          idCurso: curso.idCurso!,
          nombre: curso.nombre,
          notas: notasEstudiante,
          promedioGeneral,
          totalEstudiantes
        };
      });

      resolve(cursosConNotas);
    });
  },

  async getEstudianteConNotasById(id: number): Promise<EstudianteConNotasDTO> {
    return new Promise((resolve, reject) => {
      const estudiantes = getEstudiantes();
      const notas = getNotas();

      const estudiante = estudiantes.find(est => est.idEstudiante === id);
      
      if (!estudiante) {
        reject(new Error(`Estudiante con ID ${id} no encontrado`));
        return;
      }

      // Filtrar notas del estudiante
      const notasEstudiante = notas.filter(nota => 
        nota.estudiante.idEstudiante === estudiante.idEstudiante
      );

      // Mapear notas a formato DTO
      const notasCurso: NotaCursoDTO[] = notasEstudiante.map(nota => ({
        idCurso: nota.curso.idCurso!,
        nombreCurso: nota.curso.nombre,
        nota: nota.nota
      }));

      // Calcular promedio
      const promedio = calcularPromedio(notasEstudiante.map(n => n.nota));

      const estudianteConNotas: EstudianteConNotasDTO = {
        idEstudiante: estudiante.idEstudiante!,
        nombres: estudiante.nombres,
        apellidos: estudiante.apellidos,
        notas: notasCurso,
        promedio
      };

      resolve(estudianteConNotas);
    });
  },

  async getCursoConNotasById(id: number): Promise<CursoConNotasDTO> {
    return new Promise((resolve, reject) => {
      const cursos = getCursos();
      const notas = getNotas();

      const curso = cursos.find(cur => cur.idCurso === id);
      
      if (!curso) {
        reject(new Error(`Curso con ID ${id} no encontrado`));
        return;
      }

      // Filtrar notas del curso
      const notasCurso = notas.filter(nota => 
        nota.curso.idCurso === curso.idCurso
      );

      // Mapear notas a formato DTO
      const notasEstudiante: NotaEstudianteDTO[] = notasCurso.map(nota => ({
        idEstudiante: nota.estudiante.idEstudiante!,
        nombresEstudiante: nota.estudiante.nombres,
        apellidosEstudiante: nota.estudiante.apellidos,
        nota: nota.nota
      }));

      // Calcular promedio general y total de estudiantes
      const promedioGeneral = calcularPromedio(notasCurso.map(n => n.nota));
      const totalEstudiantes = notasCurso.length;

      const cursoConNotas: CursoConNotasDTO = {
        idCurso: curso.idCurso!,
        nombre: curso.nombre,
        notas: notasEstudiante,
        promedioGeneral,
        totalEstudiantes
      };

      resolve(cursoConNotas);
    });
  }
};
