import React from 'react';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'ADMIN' | 'DOCENTE' | 'ESTUDIANTE'>;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles, 
  fallback 
}) => {
  const { state } = useAuth();

  // Si no está autenticado, no renderizar nada (el AuthWrapper se encargará de mostrar login)
  if (!state.isAuthenticated || !state.usuario) {
    return null;
  }

  // Si se especifican roles permitidos, verificar que el usuario tenga el rol correcto
  if (allowedRoles && !allowedRoles.includes(state.usuario.rol)) {
    return (
      <div className="access-denied">
        {fallback || (
          <div style={{ 
            padding: '40px', 
            textAlign: 'center', 
            color: '#666' 
          }}>
            <h2>Acceso Denegado</h2>
            <p>No tienes permisos para acceder a esta sección.</p>
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
};