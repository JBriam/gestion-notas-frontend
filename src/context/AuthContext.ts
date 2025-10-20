/**
 * Contexto de Autenticación
 * Este archivo SOLO exporta el contexto y los tipos
 */

import { createContext } from 'react';
import type { Usuario, EstudianteProfile, DocenteProfile } from '../interfaces/Auth';

export interface AuthState {
  isAuthenticated: boolean;
  usuario: Usuario | null;
  perfilEstudiante: EstudianteProfile | null;
  perfilDocente: DocenteProfile | null;
  loading: boolean;
}

export interface AuthContextType {
  state: AuthState;
  login: (usuario: Usuario, perfilEstudiante?: EstudianteProfile, perfilDocente?: DocenteProfile) => void;
  logout: () => void;
  updateProfile: (perfilEstudiante?: EstudianteProfile, perfilDocente?: DocenteProfile) => void;
  setLoading: (loading: boolean) => void;
}

// Crear el contexto con valor por defecto
export const AuthContext = createContext<AuthContextType | null>(null);
