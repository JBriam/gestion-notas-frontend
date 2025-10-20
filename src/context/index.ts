/**
 * Barrel export para el módulo de autenticación
 * Simplifica las importaciones desde otros archivos
 */

export { AuthContext } from './AuthContext';
export type { AuthState, AuthContextType } from './AuthContext';
export { AuthProvider } from './AuthProvider';
export { useAuth } from './useAuth';
