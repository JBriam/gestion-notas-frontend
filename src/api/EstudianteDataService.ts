import { NotaService } from './NotaService';

// Interfaz para la respuesta real del backend al obtener notas por estudiante
interface NotaEstudianteBackend {
  idNota: number;
  nota: number;
  tipoEvaluacion: string;
  fechaRegistro: string;
  observaciones: string;
  idEstudiante: number;
  nombreEstudiante: string;
  apellidosEstudiante: string;
  codigoEstudiante: string;
  idCurso: number;
  nombreCurso: string;
  codigoCurso: string;
  estadoAcademico: string;
}

// Interfaz específica para las notas del estudiante en el dashboard
export interface NotaEstudiante {
  idNota: number;
  valor: number;
  fecha: string;
  observaciones?: string;
  tipoEvaluacion: string; // PARCIAL, FINAL, TAREA, PRACTICA
  curso: {
    idCurso: number;
    nombre: string;
    descripcion: string;
  };
}

// Interfaz para agrupar notas por curso
export interface CursoConNotas {
  curso: {
    idCurso: number;
    nombre: string;
    descripcion: string;
  };
  notas: NotaEstudiante[];
  promedio: number;
  totalEvaluaciones: number;
}

export const EstudianteDataService = {
  /**
   * Obtiene todas las notas de un estudiante con información completa del curso
   */
  async obtenerNotasEstudiante(idEstudiante: number): Promise<NotaEstudiante[]> {
    try {
      
      // Obtener notas del estudiante - el método devuelve la estructura real del backend
      const notasResponse = await NotaService.obtenerPorEstudiante(idEstudiante) as unknown as NotaEstudianteBackend[];
      
      // El backend ya incluye toda la información del curso en la respuesta
      // No necesitamos hacer consultas adicionales
      
      // Transformar las notas al formato requerido
      const notasEstudiante: NotaEstudiante[] = [];
      
      for (const nota of notasResponse) {
        // Usar la interfaz correcta para extraer datos
        const idNota = nota.idNota || 0;
        const valor = nota.nota || 0; // El backend usa 'nota' como valor
        const fechaRegistro = nota.fechaRegistro || '';
        const observaciones = nota.observaciones || '';
        const tipoEvaluacion = nota.tipoEvaluacion || 'EVALUACION';
        const idCurso = nota.idCurso || 0;
        const nombreCurso = nota.nombreCurso || 'Curso sin nombre';
        const codigoCurso = nota.codigoCurso || '';
        
        // Formatear la fecha para mostrar solo la parte de fecha
        let fecha = fechaRegistro;
        if (fechaRegistro.includes('T')) {
          fecha = fechaRegistro.split('T')[0];
        }
        
        // Crear el objeto curso con la información disponible
        const curso = {
          idCurso,
          nombre: nombreCurso,
          descripcion: `${codigoCurso}${codigoCurso ? ' - ' : ''}${nombreCurso}`
        };
        
        // Agregar la nota transformada
        notasEstudiante.push({
          idNota,
          valor,
          fecha,
          observaciones,
          tipoEvaluacion,
          curso
        });
      }
      
      return notasEstudiante;
      
    } catch (error) {
      console.error('[EstudianteDataService] Error al obtener notas del estudiante:', error);
      throw new Error('Error al cargar las notas del estudiante');
    }
  },

  /**
   * Calcula el promedio general de un estudiante
   */
  calcularPromedio(notas: NotaEstudiante[]): number {
    if (notas.length === 0) return 0;
    const suma = notas.reduce((acc, nota) => acc + nota.valor, 0);
    return Number((suma / notas.length).toFixed(2));
  },

  /**
   * Agrupa las notas por curso para mejor visualización
   */
  async obtenerNotasPorCurso(idEstudiante: number): Promise<CursoConNotas[]> {
    try {
      const notas = await this.obtenerNotasEstudiante(idEstudiante);
      
      // Agrupar notas por curso
      const cursosMap = new Map<number, CursoConNotas>();
      
      notas.forEach(nota => {
        const idCurso = nota.curso.idCurso;
        
        if (!cursosMap.has(idCurso)) {
          cursosMap.set(idCurso, {
            curso: nota.curso,
            notas: [],
            promedio: 0,
            totalEvaluaciones: 0
          });
        }
        
        cursosMap.get(idCurso)!.notas.push(nota);
      });
      
      // Calcular promedios para cada curso
      const cursosConNotas = Array.from(cursosMap.values()).map(cursoData => {
        const promedio = this.calcularPromedio(cursoData.notas);
        return {
          ...cursoData,
          promedio,
          totalEvaluaciones: cursoData.notas.length
        };
      });
      
      return cursosConNotas;
    } catch (error) {
      console.error('[EstudianteDataService] Error al obtener notas por curso:', error);
      throw error;
    }
  },

  /**
   * Obtiene estadísticas del estudiante
   */
  async obtenerEstadisticasEstudiante(idEstudiante: number) {
    try {
      const notas = await this.obtenerNotasEstudiante(idEstudiante);
      
      const stats = {
        totalNotas: notas.length,
        promedio: this.calcularPromedio(notas),
        notaMaxima: notas.length > 0 ? Math.max(...notas.map(n => n.valor)) : 0,
        notaMinima: notas.length > 0 ? Math.min(...notas.map(n => n.valor)) : 0,
        cursosConNotas: [...new Set(notas.map(n => n.curso.nombre))].length
      };
      
      return stats;
    } catch (error) {
      console.error('[EstudianteDataService] Error al obtener estadísticas:', error);
      throw error;
    }
  }
};