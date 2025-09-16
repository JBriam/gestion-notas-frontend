export interface NotaCursoDTO {
  idCurso: number;
  nombreCurso: string;
  nota: number;
}

export interface NotaEstudianteDTO {
  idEstudiante: number;
  nombresEstudiante: string;
  apellidosEstudiante: string;
  nota: number;
}

export interface EstudianteConNotasDTO {
  idEstudiante: number;
  nombres: string;
  apellidos: string;
  email: string;
  notas: NotaCursoDTO[];
  promedio: number;
}

export interface CursoConNotasDTO {
  idCurso: number;
  nombre: string;
  notas: NotaEstudianteDTO[];
  promedioGeneral: number;
  totalEstudiantes: number;
}