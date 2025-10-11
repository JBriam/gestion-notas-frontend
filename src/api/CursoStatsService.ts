import { NotaService } from './NotaService';
import type { NotaBackend } from '../interfaces/Nota';

export interface EstadisticasCurso {
  idCurso: number;
  estudiantesInscritos: number;
  notasRegistradas: number;
  promedioCurso: number;
  estudiantes: number[]; // IDs de estudiantes que tienen notas en este curso
}

export const CursoStatsService = {
  /**
   * Obtiene estadísticas de un curso específico
   */
  async obtenerEstadisticasCurso(idCurso: number): Promise<EstadisticasCurso> {
    try {
      console.log(`[CursoStatsService] Obteniendo estadísticas para curso ${idCurso}`);
      
      // Obtener todas las notas para filtrar por curso
      const todasLasNotas = await NotaService.listar() as unknown as NotaBackend[];
      console.log('[CursoStatsService] Total de notas obtenidas:', todasLasNotas.length);
      
      // Filtrar notas del curso específico
      const notasDelCurso = todasLasNotas.filter(nota => nota.idCurso === idCurso);
      console.log(`[CursoStatsService] Notas del curso ${idCurso}:`, notasDelCurso.length);
      
      // Obtener estudiantes únicos que tienen notas en este curso
      const estudiantesUnicos = [...new Set(notasDelCurso.map(nota => nota.idEstudiante))];
      
      // Calcular promedio del curso
      const promedio = notasDelCurso.length > 0 
        ? notasDelCurso.reduce((sum, nota) => sum + nota.nota, 0) / notasDelCurso.length
        : 0;
      
      const estadisticas: EstadisticasCurso = {
        idCurso,
        estudiantesInscritos: estudiantesUnicos.length,
        notasRegistradas: notasDelCurso.length,
        promedioCurso: Number(promedio.toFixed(2)),
        estudiantes: estudiantesUnicos
      };
      
      console.log(`[CursoStatsService] Estadísticas calculadas para curso ${idCurso}:`, estadisticas);
      return estadisticas;
      
    } catch (error) {
      console.error(`[CursoStatsService] Error al obtener estadísticas del curso ${idCurso}:`, error);
      // Retornar estadísticas vacías en caso de error
      return {
        idCurso,
        estudiantesInscritos: 0,
        notasRegistradas: 0,
        promedioCurso: 0,
        estudiantes: []
      };
    }
  },
  
  /**
   * Obtiene estadísticas de múltiples cursos
   */
  async obtenerEstadisticasMultiplesCursos(idsCursos: number[]): Promise<Map<number, EstadisticasCurso>> {
    try {
      console.log('[CursoStatsService] Obteniendo estadísticas para múltiples cursos:', idsCursos);
      
      // Obtener todas las notas una sola vez
      const todasLasNotas = await NotaService.listar() as unknown as NotaBackend[];
      console.log('[CursoStatsService] Total de notas obtenidas:', todasLasNotas.length);
      
      const estadisticasMap = new Map<number, EstadisticasCurso>();
      
      // Procesar cada curso
      for (const idCurso of idsCursos) {
        // Filtrar notas del curso específico
        const notasDelCurso = todasLasNotas.filter(nota => nota.idCurso === idCurso);
        
        // Obtener estudiantes únicos que tienen notas en este curso
        const estudiantesUnicos = [...new Set(notasDelCurso.map(nota => nota.idEstudiante))];
        
        // Calcular promedio del curso
        const promedio = notasDelCurso.length > 0 
          ? notasDelCurso.reduce((sum, nota) => sum + nota.nota, 0) / notasDelCurso.length
          : 0;
        
        const estadisticas: EstadisticasCurso = {
          idCurso,
          estudiantesInscritos: estudiantesUnicos.length,
          notasRegistradas: notasDelCurso.length,
          promedioCurso: Number(promedio.toFixed(2)),
          estudiantes: estudiantesUnicos
        };
        
        estadisticasMap.set(idCurso, estadisticas);
        console.log(`[CursoStatsService] Estadísticas para curso ${idCurso}:`, estadisticas);
      }
      
      return estadisticasMap;
      
    } catch (error) {
      console.error('[CursoStatsService] Error al obtener estadísticas múltiples:', error);
      
      // Retornar mapa vacío con estadísticas en 0 para cada curso
      const estadisticasMap = new Map<number, EstadisticasCurso>();
      idsCursos.forEach(idCurso => {
        estadisticasMap.set(idCurso, {
          idCurso,
          estudiantesInscritos: 0,
          notasRegistradas: 0,
          promedioCurso: 0,
          estudiantes: []
        });
      });
      
      return estadisticasMap;
    }
  }
};