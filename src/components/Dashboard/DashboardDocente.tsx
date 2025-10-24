import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { DocenteDataService } from '../../api/DocenteDataService';
import type { Estudiante } from '../../interfaces/Estudiante';
import type { Nota } from '../../interfaces/Nota';
import type { Curso } from '../../interfaces/Curso';
import { ProfileDocente } from '../Profile/ProfileDocente';
import './DashboardDocente.css';

type DocenteTab = 'resumen' | 'mis-cursos' | 'estudiantes' | 'calificaciones' | 'perfil';

interface DocenteStats {
  totalEstudiantesAtendidos: number;
  totalCursosAsignados: number;
  totalNotasRegistradas: number;
  promedioGeneral: number;
}

export const DashboardDocente: React.FC = () => {
  const { state, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<DocenteTab>('resumen');
  const [stats, setStats] = useState<DocenteStats>({
    totalEstudiantesAtendidos: 0,
    totalCursosAsignados: 0,
    totalNotasRegistradas: 0,
    promedioGeneral: 0
  });
  const [loading, setLoading] = useState(true);
  const [misCursos, setMisCursos] = useState<Curso[]>([]);
  const [misEstudiantes, setMisEstudiantes] = useState<Estudiante[]>([]);
  const [misNotas, setMisNotas] = useState<Nota[]>([]);

  const loadDocenteData = useCallback(async () => {
    if (!state.perfilDocente?.idDocente) return;
    
    try {
      setLoading(true);
      
      // Usar el servicio especializado para docentes
      const estadisticas = await DocenteDataService.obtenerEstadisticasDocente(
        state.perfilDocente.idDocente
      );

      setMisCursos(estadisticas.cursosDetalle);
      setMisEstudiantes(estadisticas.estudiantesDetalle);
      setMisNotas(estadisticas.notasDetalle);

      setStats({
        totalEstudiantesAtendidos: estadisticas.totalEstudiantes,
        totalCursosAsignados: estadisticas.totalCursos,
        totalNotasRegistradas: estadisticas.totalNotas,
        promedioGeneral: estadisticas.promedioGeneral
      });

    } catch (error) {
      console.error('Error al cargar datos del docente:', error);
    } finally {
      setLoading(false);
    }
  }, [state.perfilDocente, state.usuario]);

  useEffect(() => {
    if (state.perfilDocente?.idDocente) {
      loadDocenteData();
    }
  }, [state.perfilDocente, loadDocenteData]);

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      logout();
    }
  };

  const getWelcomeMessage = () => {
    const name = state.perfilDocente?.nombres || 'Docente';
    return `¡Hola, ${name}!`;
  };

  return (
    <div className="dashboard-docente">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="user-info">
            <img
              src={state.perfilDocente?.foto || "/assets/imgs/docente.png"}
              alt="Avatar"
              className="user-avatar"
            />
            <div>
              <h1>{getWelcomeMessage()}</h1>
              <p>Panel de Docente - {state.perfilDocente?.especialidad}</p>
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button
          className={`nav-button ${activeTab === 'resumen' ? 'active' : ''}`}
          onClick={() => setActiveTab('resumen')}
        >
          📊 Resumen
        </button>
        <button
          className={`nav-button ${activeTab === 'mis-cursos' ? 'active' : ''}`}
          onClick={() => setActiveTab('mis-cursos')}
        >
          📚 Mis Cursos
        </button>
        <button
          className={`nav-button ${activeTab === 'estudiantes' ? 'active' : ''}`}
          onClick={() => setActiveTab('estudiantes')}
        >
          👥 Mis Estudiantes
        </button>
        <button
          className={`nav-button ${activeTab === 'calificaciones' ? 'active' : ''}`}
          onClick={() => setActiveTab('calificaciones')}
        >
          📝 Calificaciones
        </button>
        <button
          className={`nav-button ${activeTab === 'perfil' ? 'active' : ''}`}
          onClick={() => setActiveTab('perfil')}
        >
          👤 Mi Perfil
        </button>
      </nav>

      <main className="dashboard-main">
        {activeTab === 'resumen' && (
          <div className="resumen-section">
            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Cargando información...</p>
              </div>
            ) : (
              <>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">📚</div>
                    <div className="stat-content">
                      <h3>Cursos Asignados</h3>
                      <p className="stat-number">{stats.totalCursosAsignados}</p>
                      <p className="stat-subtitle">Cursos que imparto</p>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                      <h3>Estudiantes</h3>
                      <p className="stat-number">{stats.totalEstudiantesAtendidos}</p>
                      <p className="stat-subtitle">Estudiantes en mis cursos</p>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon">📝</div>
                    <div className="stat-content">
                      <h3>Notas Registradas</h3>
                      <p className="stat-number">{stats.totalNotasRegistradas}</p>
                      <p className="stat-subtitle">Calificaciones ingresadas</p>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon">📈</div>
                    <div className="stat-content">
                      <h3>Promedio General</h3>
                      <p className="stat-number">
                        {stats.promedioGeneral > 0 ? stats.promedioGeneral.toFixed(2) : '--'}
                      </p>
                      <p className="stat-subtitle">De mis cursos</p>
                    </div>
                  </div>
                </div>

                <div className="welcome-card">
                  <h2>Bienvenido a tu Panel de Docente</h2>
                  <p>
                    Desde aquí puedes gestionar tus cursos y estudiantes asignados:
                  </p>
                  <ul>
                    <li><strong>Mis Cursos:</strong> Ver información de los cursos que impartes</li>
                    <li><strong>Mis Estudiantes:</strong> Lista de estudiantes en tus cursos</li>
                    <li><strong>Calificaciones:</strong> Registrar y modificar las notas de tus estudiantes</li>
                  </ul>
                  <p>
                    <strong>Nota:</strong> Solo puedes ver y gestionar información relacionada con tus cursos asignados.
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'mis-cursos' && (
          <div className="content-section">
            <div className="section-header">
              <h2>Mis Cursos Asignados</h2>
              <p>Cursos que impartes actualmente</p>
            </div>
            
            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Cargando cursos...</p>
              </div>
            ) : misCursos.length === 0 ? (
              <div className="empty-state">
                <h3>No tienes cursos asignados</h3>
                <p>Contacta al administrador para que te asigne cursos.</p>
              </div>
            ) : (
              <div className="cursos-grid">
                {misCursos.map((curso) => (
                  <div key={curso.idCurso} className="curso-card">
                    <div className="curso-header">
                      <h3>{curso.nombre}</h3>
                      <span className="curso-codigo">{curso.codigo as string}</span>
                    </div>
                    <div className="curso-details">
                      <p><strong>Descripción:</strong> {(curso.descripcion as string) || 'Sin descripción'}</p>
                      <p><strong>Créditos:</strong> {curso.creditos as number}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'estudiantes' && (
          <div className="content-section">
            <div className="section-header">
              <h2>Mis Estudiantes</h2>
              <p>Estudiantes inscritos en tus cursos</p>
            </div>
            
            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Cargando estudiantes...</p>
              </div>
            ) : misEstudiantes.length === 0 ? (
              <div className="empty-state">
                <h3>No hay estudiantes registrados</h3>
                <p>Aún no hay estudiantes inscritos en tus cursos.</p>
              </div>
            ) : (
              <div className="estudiantes-grid">
                {misEstudiantes.map((estudiante) => (
                  <div key={estudiante.idEstudiante} className="estudiante-card">
                    <div className="estudiante-header">
                      <img
                        src={estudiante.foto || '/assets/imgs/student.gif'}
                        alt="Estudiante"
                        className="estudiante-avatar"
                      />
                      <div>
                        <h3>{estudiante.nombres} {estudiante.apellidos}</h3>
                        <p className="estudiante-codigo">{estudiante.codigoEstudiante as string}</p>
                      </div>
                    </div>
                    <div className="estudiante-details">
                      <p><strong>Email:</strong> {estudiante.email}</p>
                      <p><strong>Teléfono:</strong> {(estudiante.telefono as string) || 'No registrado'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'calificaciones' && (
          <div className="content-section">
            <div className="section-header">
              <h2>Calificaciones</h2>
              <p>Notas registradas en tus cursos</p>
            </div>
            
            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Cargando calificaciones...</p>
              </div>
            ) : misNotas.length === 0 ? (
              <div className="empty-state">
                <h3>No hay calificaciones registradas</h3>
                <p>Aún no has registrado calificaciones para tus cursos.</p>
              </div>
            ) : (
              <div className="notas-table-container">
                <table className="notas-table">
                  <thead>
                    <tr>
                      <th>Estudiante</th>
                      <th>Curso</th>
                      <th>Tipo Evaluación</th>
                      <th>Calificación</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {misNotas.map((nota) => (
                      <tr key={nota.idNota}>
                        <td>
                          <div className="estudiante-info">
                            <strong>{nota.estudiante.nombres} {nota.estudiante.apellidos}</strong>
                            <small>{nota.estudiante.codigoEstudiante as string}</small>
                          </div>
                        </td>
                        <td>{nota.curso.nombre}</td>
                        <td>
                    <span className={`tipo-evaluacion-badge ${getTipoEvaluacionClass(nota.tipoEvaluacion || '')}`}>
                      {nota.tipoEvaluacion || 'N/A'}
                    </span>
                  </td>
                        <td>
                          <span className={`nota-badge ${nota.nota >= 13 ? 'aprobado' : 'desaprobado'}`}>
                            {nota.nota.toFixed(1)}
                          </span>
                        </td>
                        <td>
                          <span className={`estado-badge ${nota.nota >= 13 ? 'aprobado' : 'desaprobado'}`}>
                            {nota.nota >= 13 ? 'Aprobado' : 'Desaprobado'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'perfil' && <ProfileDocente />}
      </main>
    </div>
  );
};

// Función helper para estilos de tipo de evaluación
const getTipoEvaluacionClass = (tipoEvaluacion: string): string => {
  switch (tipoEvaluacion) {
    case 'PARCIAL':
      return 'tipo-parcial';
    case 'FINAL':
      return 'tipo-final';
    case 'TAREA':
      return 'tipo-tarea';
    case 'PRACTICA':
      return 'tipo-practica';
    default:
      return 'tipo-default';
  }
};