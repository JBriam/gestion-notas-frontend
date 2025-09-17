import { LocalStorageService } from "../localStorage/LocalStorageService";
import type { Estudiante } from "../interfaces/Estudiante";

// Instancia del servicio localStorage para estudiantes
const estudianteStorage = new LocalStorageService<Estudiante>('estudiantes', 'idEstudiante');

// Inicializar con datos por defecto si está vacío
estudianteStorage.initializeWithDefaults([
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
  }
]);

export const EstudianteService = {
  async listar(): Promise<Estudiante[]> {
    return await estudianteStorage.getAll();
  },

  async crear(estudiante: Omit<Estudiante, 'idEstudiante'>): Promise<Estudiante> {
    return await estudianteStorage.create(estudiante);
  },

  async actualizar(estudiante: Estudiante): Promise<Estudiante> {
    return await estudianteStorage.update(estudiante);
  },

  async eliminar(id: number): Promise<void> {
    await estudianteStorage.delete(id);
  },
};
