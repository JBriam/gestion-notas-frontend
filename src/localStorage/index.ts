/**
 * Barrel export para localStorage utilities
 * Facilita las importaciones centralizadas
 */

// Servicios principales
export { LocalStorageService } from './LocalStorageService';

// Inicializadores y utilitarios
export {
  inicializarDatosDefecto,
  limpiarTodosLosDatos,
  reiniciarDatos,
  reiniciarLocalStorage,
  limpiarLocalStorage
} from './DataInitializer';