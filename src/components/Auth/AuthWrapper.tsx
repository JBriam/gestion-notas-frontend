import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Login } from './Login';
import { Register } from './Register';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { state } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  // Si está autenticado, mostrar el contenido de la aplicación
  if (state.isAuthenticated) {
    return <>{children}</>;
  }

  // Si no está autenticado, mostrar login o registro
  return showRegister ? (
    <Register onSwitchToLogin={() => setShowRegister(false)} />
  ) : (
    <Login onSwitchToRegister={() => setShowRegister(true)} />
  );
};