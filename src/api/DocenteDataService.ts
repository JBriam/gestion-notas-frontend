import { EstudianteService } from './EstudianteService';
import { NotaService } from './NotaService';
import { CursoService } from './CursoService';
import type { Estudiante } from '../interfaces/Estudiante';
import type { Nota, NotaBackend } from '../interfaces/Nota';
import type { Curso } from '../interfaces/Curso';

export class DocenteDataService {
  /**
   * Obtiene los cursos asignados a un docente específico
   */
  static async obtenerCursosDelDocente(idDocente: number): Promise<Curso[]> {
    try {
      console.log('🔍 Obteniendo cursos para docente:', idDocente);
      const todosCursos = await CursoService.listar();
      console.log('📚 Todos los cursos obtenidos:', todosCursos);
      
      // Filtrar solo los cursos asignados al docente
      // La estructura real del backend tiene idDocente directamente en el curso
      const cursosDelDocente = todosCursos.filter((curso: Curso) => {
        console.log('🔍 Verificando curso:', curso);
        console.log('📋 idDocente en curso:', curso.idDocente);
        console.log('🆔 ID docente buscado:', idDocente);
        
        // Verificar si el curso tiene idDocente que coincida
        return curso.idDocente === idDocente;
      });
      
      console.log('✅ Cursos filtrados para el docente:', cursosDelDocente);
      return cursosDelDocente;
    } catch (error) {
      console.error('Error al obtener cursos del docente:', error);
      throw error;
    }
  }

  /**
   * Obtiene las notas de los cursos asignados a un docente
   */
  static async obtenerNotasDelDocente(idDocente: number): Promise<Nota[]> {
    try {
      console.log('🔍 Obteniendo notas para docente:', idDocente);
      const cursosDelDocente = await this.obtenerCursosDelDocente(idDocente);
      const idsCarsos = cursosDelDocente.map(curso => curso.idCurso);
      console.log('📋 IDs de cursos del docente:', idsCarsos);
      
      const todasLasNotasBackend = await NotaService.listar();
      console.log('📊 Todas las notas del backend:', todasLasNotasBackend);
      
      // Filtrar solo las notas de los cursos del docente
      const notasDelDocente = todasLasNotasBackend.filter((nota: NotaBackend) => 
        nota.idCurso && idsCarsos.includes(nota.idCurso)
      );
      
      console.log('✅ Notas filtradas del docente:', notasDelDocente);
      
      // Convertir a la estructura esperada por el frontend
      const estudiantes = await EstudianteService.listar();
      const cursos = await CursoService.listar();
      
      return notasDelDocente.map((notaBackend: NotaBackend) => {
        const estudiante = estudiantes.find(est => est.idEstudiante === notaBackend.idEstudiante);
        const curso = cursos.find(cur => cur.idCurso === notaBackend.idCurso);
        
        return {
          idNota: notaBackend.idNota,
          nota: notaBackend.nota,
          tipoEvaluacion: notaBackend.tipoEvaluacion,
          fechaRegistro: notaBackend.fechaRegistro,
          observaciones: notaBackend.observaciones,
          estudiante: estudiante || {
            idEstudiante: notaBackend.idEstudiante,
            nombres: 'Estudiante no encontrado',
            apellidos: '',
            codigoEstudiante: 'N/A'
          },
          curso: curso || {
            idCurso: notaBackend.idCurso,
            nombre: 'Curso no encontrado',
            codigo: 'N/A'
          }
        } as Nota;
      });
    } catch (error) {
      console.error('Error al obtener notas del docente:', error);
      throw error;
    }
  }

  /**
   * Obtiene los estudiantes que están en los cursos de un docente
   */
  static async obtenerEstudiantesDelDocente(idDocente: number): Promise<Estudiante[]> {
    try {
      const notasDelDocente = await this.obtenerNotasDelDocente(idDocente);
      
      // Crear un Map para evitar duplicados de estudiantes
      const estudiantesUnicos = new Map<number, Estudiante>();
      
      notasDelDocente.forEach(nota => {
        if (nota.estudiante.idEstudiante) {
          estudiantesUnicos.set(nota.estudiante.idEstudiante, nota.estudiante);
        }
      });

      return Array.from(estudiantesUnicos.values());
    } catch (error) {
      console.error('Error al obtener estudiantes del docente:', error);
      throw error;
    }
  }

  /**
   * Obtiene estadísticas específicas para un docente
   */
  static async obtenerEstadisticasDocente(idDocente: number) {
    try {
      const [cursos, estudiantes, notas] = await Promise.all([
        this.obtenerCursosDelDocente(idDocente),
        this.obtenerEstudiantesDelDocente(idDocente),
        this.obtenerNotasDelDocente(idDocente)
      ]);

      const promedio = notas.length > 0 
        ? notas.reduce((sum, nota) => sum + nota.nota, 0) / notas.length
        : 0;

      return {
        totalCursos: cursos.length,
        totalEstudiantes: estudiantes.length,
        totalNotas: notas.length,
        promedioGeneral: Math.round(promedio * 100) / 100,
        cursosDetalle: cursos,
        estudiantesDetalle: estudiantes,
        notasDetalle: notas
      };
    } catch (error) {
      console.error('Error al obtener estadísticas del docente:', error);
      throw error;
    }
  }

  /**
   * Verifica si un docente puede gestionar una nota específica
   */
  static async puedeGestionarNota(idDocente: number, idNota: number): Promise<boolean> {
    try {
      const notasDelDocente = await this.obtenerNotasDelDocente(idDocente);
      return notasDelDocente.some(nota => nota.idNota === idNota);
    } catch (error) {
      console.error('Error al verificar permisos de nota:', error);
      return false;
    }
  }

  /**
   * Verifica si un docente puede ver información de un estudiante específico
   */
  static async puedeVerEstudiante(idDocente: number, idEstudiante: number): Promise<boolean> {
    try {
      const estudiantesDelDocente = await this.obtenerEstudiantesDelDocente(idDocente);
      return estudiantesDelDocente.some(estudiante => estudiante.idEstudiante === idEstudiante);
    } catch (error) {
      console.error('Error al verificar permisos de estudiante:', error);
      return false;
    }
  }

  /**
   * Obtiene las notas de un estudiante específico en los cursos del docente
   */
  static async obtenerNotasEstudianteEnMisCursos(idDocente: number, idEstudiante: number): Promise<Nota[]> {
    try {
      const puedeVer = await this.puedeVerEstudiante(idDocente, idEstudiante);
      if (!puedeVer) {
        throw new Error('No tienes permisos para ver las notas de este estudiante');
      }

      const notasDelDocente = await this.obtenerNotasDelDocente(idDocente);
      return notasDelDocente.filter(nota => nota.estudiante.idEstudiante === idEstudiante);
    } catch (error) {
      console.error('Error al obtener notas del estudiante:', error);
      throw error;
    }
  }
}