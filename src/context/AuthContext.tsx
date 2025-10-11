import React, { createContext, useReducer, useEffect } from 'react';
import type { Usuario, EstudianteProfile, DocenteProfile } from '../interfaces/Auth';

interface AuthState {
  isAuthenticated: boolean;
  usuario: Usuario | null;
  perfilEstudiante: EstudianteProfile | null;
  perfilDocente: DocenteProfile | null;
  loading: boolean;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { usuario: Usuario; perfilEstudiante?: EstudianteProfile; perfilDocente?: DocenteProfile } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PROFILE'; payload: { perfilEstudiante?: EstudianteProfile; perfilDocente?: DocenteProfile } };

const initialState: AuthState = {
  isAuthenticated: false,
  usuario: null,
  perfilEstudiante: null,
  perfilDocente: null,
  loading: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        usuario: action.payload.usuario,
        perfilEstudiante: action.payload.perfilEstudiante || null,
        perfilDocente: action.payload.perfilDocente || null,
        loading: false,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
      };
    case 'LOGOUT':
      return {
        ...initialState,
      };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        perfilEstudiante: action.payload.perfilEstudiante || state.perfilEstudiante,
        perfilDocente: action.payload.perfilDocente || state.perfilDocente,
      };
    default:
      return state;
  }
};

interface AuthContextType {
  state: AuthState;
  login: (usuario: Usuario, perfilEstudiante?: EstudianteProfile, perfilDocente?: DocenteProfile) => void;
  logout: () => void;
  updateProfile: (perfilEstudiante?: EstudianteProfile, perfilDocente?: DocenteProfile) => void;
  setLoading: (loading: boolean) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Cargar datos de sesión desde localStorage al inicializar
  useEffect(() => {
    const savedUser = localStorage.getItem('usuario');
    const savedPerfilEstudiante = localStorage.getItem('perfilEstudiante');
    const savedPerfilDocente = localStorage.getItem('perfilDocente');

    if (savedUser) {
      try {
        const usuario = JSON.parse(savedUser);
        const perfilEstudiante = savedPerfilEstudiante ? JSON.parse(savedPerfilEstudiante) : null;
        const perfilDocente = savedPerfilDocente ? JSON.parse(savedPerfilDocente) : null;

        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { usuario, perfilEstudiante, perfilDocente }
        });
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('usuario');
        localStorage.removeItem('perfilEstudiante');
        localStorage.removeItem('perfilDocente');
      }
    }
  }, []);

  const login = (usuario: Usuario, perfilEstudiante?: EstudianteProfile, perfilDocente?: DocenteProfile) => {
    // Guardar en localStorage
    localStorage.setItem('usuario', JSON.stringify(usuario));
    if (perfilEstudiante) {
      localStorage.setItem('perfilEstudiante', JSON.stringify(perfilEstudiante));
    }
    if (perfilDocente) {
      localStorage.setItem('perfilDocente', JSON.stringify(perfilDocente));
    }

    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: { usuario, perfilEstudiante, perfilDocente }
    });
  };

  const logout = () => {
    // Limpiar localStorage
    localStorage.removeItem('usuario');
    localStorage.removeItem('perfilEstudiante');
    localStorage.removeItem('perfilDocente');

    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = (perfilEstudiante?: EstudianteProfile, perfilDocente?: DocenteProfile) => {
    // Actualizar localStorage
    if (perfilEstudiante) {
      localStorage.setItem('perfilEstudiante', JSON.stringify(perfilEstudiante));
    }
    if (perfilDocente) {
      localStorage.setItem('perfilDocente', JSON.stringify(perfilDocente));
    }

    dispatch({
      type: 'UPDATE_PROFILE',
      payload: { perfilEstudiante, perfilDocente }
    });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: loading ? 'LOGIN_START' : 'LOGIN_FAILURE' });
  };

  const contextValue: AuthContextType = {
    state,
    login,
    logout,
    updateProfile,
    setLoading,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

