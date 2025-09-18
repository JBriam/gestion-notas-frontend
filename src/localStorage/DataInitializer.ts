/**
 * Archivo para inicializar datos por defecto en localStorage
 * Útil para pruebas y demo de la aplicación
 */

import { LocalStorageService } from "./LocalStorageService";
import type { Curso } from "../interfaces/Curso";
import type { Estudiante } from "../interfaces/Estudiante";
import type { Nota } from "../interfaces/Nota";

// Datos por defecto para cursos
const cursosDefecto: Curso[] = [
  { idCurso: 1, nombre: "Matemáticas" },
  { idCurso: 2, nombre: "Español" },
  { idCurso: 3, nombre: "Ciencias Naturales" },
  { idCurso: 4, nombre: "Historia" },
  { idCurso: 5, nombre: "Inglés" },
  { idCurso: 6, nombre: "Educación Física" },
  { idCurso: 7, nombre: "Arte" }
];

// Datos por defecto para estudiantes
const estudiantesDefecto: Estudiante[] = [
  { 
    idEstudiante: 1, 
    nombres: "Juan Carlos", 
    apellidos: "Pérez García", 
    email: "juan.perez@ejemplo.com" 
  },
  { 
    idEstudiante: 2, 
    nombres: "María Elena", 
    apellidos: "González López", 
    email: "maria.gonzalez@ejemplo.com" 
  },
  { 
    idEstudiante: 3, 
    nombres: "Luis Fernando", 
    apellidos: "Martínez Rodríguez", 
    email: "luis.martinez@ejemplo.com" 
  },
  { 
    idEstudiante: 4, 
    nombres: "Ana Sofía", 
    apellidos: "Hernández Silva", 
    email: "ana.hernandez@ejemplo.com" 
  },
  { 
    idEstudiante: 5, 
    nombres: "Carlos Eduardo", 
    apellidos: "López Torres", 
    email: "carlos.lopez@ejemplo.com" 
  }
];

// Datos por defecto para notas
const notasDefecto: Nota[] = [
  {
    idNota: 1,
    estudiante: estudiantesDefecto[0],
    curso: cursosDefecto[0],
    nota: 18.5
  },
  {
    idNota: 2,
    estudiante: estudiantesDefecto[0],
    curso: cursosDefecto[1],
    nota: 16.0
  },
  {
    idNota: 3,
    estudiante: estudiantesDefecto[1],
    curso: cursosDefecto[0],
    nota: 19.5
  },
  {
    idNota: 4,
    estudiante: estudiantesDefecto[1],
    curso: cursosDefecto[2],
    nota: 17.0
  },
  {
    idNota: 5,
    estudiante: estudiantesDefecto[2],
    curso: cursosDefecto[1],
    nota: 15.5
  }
];

/**
 * Inicializa todos los datos por defecto en localStorage
 * Solo se ejecuta si no existen datos previos
 */
export const inicializarDatosDefecto = () => {
  const cursoStorage = new LocalStorageService<Curso>('cursos', 'idCurso');
  const estudianteStorage = new LocalStorageService<Estudiante>('estudiantes', 'idEstudiante');
  const notaStorage = new LocalStorageService<Nota>('notas', 'idNota');

  cursoStorage.initializeWithDefaults(cursosDefecto);
  estudianteStorage.initializeWithDefaults(estudiantesDefecto);
  notaStorage.initializeWithDefaults(notasDefecto);

  console.log('✅ Datos por defecto inicializados en localStorage');
};

/**
 * Limpia todos los datos del localStorage
 * Útil para reiniciar la aplicación con datos frescos
 */
export const limpiarTodosLosDatos = () => {
  const cursoStorage = new LocalStorageService<Curso>('cursos', 'idCurso');
  const estudianteStorage = new LocalStorageService<Estudiante>('estudiantes', 'idEstudiante');
  const notaStorage = new LocalStorageService<Nota>('notas', 'idNota');

  cursoStorage.clear();
  estudianteStorage.clear();
  notaStorage.clear();

  console.log('🗑️ Todos los datos han sido eliminados del localStorage');
};

/**
 * Reinicia los datos con los valores por defecto
 */
export const reiniciarDatos = () => {
  limpiarTodosLosDatos();
  inicializarDatosDefecto();
};

/**
 * Función global para reiniciar localStorage desde la consola del navegador
 * Úsala escribiendo: window.reiniciarLocalStorage()
 */
export const reiniciarLocalStorage = () => {
  console.log('🔄 Reiniciando localStorage...');
  reiniciarDatos();
  console.log('✅ localStorage reiniciado con datos por defecto');
  console.log('🔄 Recarga la página para ver los cambios');
};

/**
 * Función global para limpiar localStorage desde la consola del navegador
 * Úsala escribiendo: window.limpiarLocalStorage()
 */
export const limpiarLocalStorage = () => {
  console.log('🗑️ Limpiando localStorage...');
  limpiarTodosLosDatos();
  console.log('✅ localStorage limpiado completamente');
  console.log('🔄 Recarga la página para ver los cambios');
};

// Hacer las funciones disponibles globalmente
if (typeof window !== 'undefined') {
  (window as typeof window & {
    reiniciarLocalStorage: typeof reiniciarLocalStorage;
    limpiarLocalStorage: typeof limpiarLocalStorage;
    inicializarDatos: typeof inicializarDatosDefecto;
  }).reiniciarLocalStorage = reiniciarLocalStorage;
  (window as typeof window & {
    reiniciarLocalStorage: typeof reiniciarLocalStorage;
    limpiarLocalStorage: typeof limpiarLocalStorage;
    inicializarDatos: typeof inicializarDatosDefecto;
  }).limpiarLocalStorage = limpiarLocalStorage;
  (window as typeof window & {
    reiniciarLocalStorage: typeof reiniciarLocalStorage;
    limpiarLocalStorage: typeof limpiarLocalStorage;
    inicializarDatos: typeof inicializarDatosDefecto;
  }).inicializarDatos = inicializarDatosDefecto;
}