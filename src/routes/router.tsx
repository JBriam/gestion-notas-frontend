import { Routes, Route } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { DashboardStudent } from "../components/Dashboard/DashboardStudent";
import { DashboardAdmin } from "../components/Dashboard/DashboardAdmin";
import { DashboardDocente } from "../components/Dashboard/DashboardDocente";
import { ProtectedRoute } from "../components/Auth/ProtectedRoute";

export default function AppRouter() {
  const { state } = useAuth();

  // Si no está autenticado, no renderizar rutas (AuthWrapper se encarga del login)
  if (!state.isAuthenticated || !state.usuario) {
    return null;
  }

  // Redirección basada en el rol del usuario
  return (
    <Routes>
      {/* Ruta principal - redirige según el rol */}
      <Route 
        path="/" 
        element={
          state.usuario.rol === 'ESTUDIANTE' ? (
            <ProtectedRoute allowedRoles={['ESTUDIANTE']}>
              <DashboardStudent />
            </ProtectedRoute>
          ) : state.usuario.rol === 'ADMIN' ? (
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardAdmin />
            </ProtectedRoute>
          ) : (
            <ProtectedRoute allowedRoles={['DOCENTE']}>
              <DashboardDocente />
            </ProtectedRoute>
          )
        } 
      />
      
      {/* Rutas específicas para estudiantes */}
      <Route 
        path="/dashboard/estudiante" 
        element={
          <ProtectedRoute allowedRoles={['ESTUDIANTE']}>
            <DashboardStudent />
          </ProtectedRoute>
        } 
      />
      
      {/* Rutas específicas para admin */}
      <Route 
        path="/dashboard/admin" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardAdmin />
          </ProtectedRoute>
        } 
      />
      
      {/* Rutas específicas para docente */}
      <Route 
        path="/dashboard/docente" 
        element={
          <ProtectedRoute allowedRoles={['DOCENTE']}>
            <DashboardDocente />
          </ProtectedRoute>
        } 
      />
      
      {/* Ruta de fallback - redirige a dashboard apropiado */}
      <Route 
        path="*" 
        element={
          state.usuario.rol === 'ESTUDIANTE' ? (
            <ProtectedRoute allowedRoles={['ESTUDIANTE']}>
              <DashboardStudent />
            </ProtectedRoute>
          ) : state.usuario.rol === 'ADMIN' ? (
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardAdmin />
            </ProtectedRoute>
          ) : (
            <ProtectedRoute allowedRoles={['DOCENTE']}>
              <DashboardDocente />
            </ProtectedRoute>
          )
        } 
      />
    </Routes>
  );
}