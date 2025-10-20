/**
 * Hook personalizado para usar el contexto de autenticación
 * Este archivo SOLO exporta el hook
 */

import { useContext } from 'react';
import { AuthContext, type AuthContextType } from './AuthContext';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
