import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import DocenteManagement from "../Management/DocenteManagement";
import EstudianteManagement from "../Management/EstudianteManagement";
import CursoManagement from "../Management/CursoManagement";
import NotaManagement from "../Management/NotaManagement";
import { DocenteService } from "../../api/DocenteService";
import { EstudianteService } from "../../api/EstudianteService";
import { CursoService } from "../../api/CursoService";
import { NotaService } from "../../api/NotaService";
import "./DashboardAdmin.css";

type AdminTab =
  | "estudiantes"
  | "docentes"
  | "cursos"
  | "notas"
  | "estadisticas";

interface DashboardStats {
  totalEstudiantes: number;
  totalDocentes: number;
  totalCursos: number;
  totalNotas: number;
  promedioGeneral: number;
}

export const DashboardAdmin: React.FC = () => {
  const { state, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("estadisticas");
  const [stats, setStats] = useState<DashboardStats>({
    totalEstudiantes: 0,
    totalDocentes: 0,
    totalCursos: 0,
    totalNotas: 0,
    promedioGeneral: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const estudiantes = await EstudianteService.listar();
      const docentes = await DocenteService.listar();
      const cursos = await CursoService.listar();
      const notas = await NotaService.listar();

      const promedio =
        notas.length > 0
          ? notas.reduce((sum: number, notaItem) => sum + notaItem.nota, 0) /
            notas.length
          : 0;

      setStats({
        totalEstudiantes: estudiantes.length,
        totalDocentes: docentes.length,
        totalCursos: cursos.length,
        totalNotas: notas.length,
        promedioGeneral: Math.round(promedio * 100) / 100,
      });
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      logout();
    }
  };

  const getRoleDisplay = () => {
    switch (state.usuario?.rol) {
      case "ADMIN":
        return "Administrador";
      case "DOCENTE":
        return "Docente";
      default:
        return "Usuario";
    }
  };

  const getWelcomeMessage = () => {
    const name =
      state.perfilDocente?.nombres ||
      state.perfilEstudiante?.nombres ||
      "Admin";
    const role = getRoleDisplay();
    return `¡Hola, ${name}! Panel de ${role}`;
  };

  return (
    <div className="dashboard-admin">
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
              <p>Gestiona estudiantes, docentes, cursos y calificaciones</p>
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button
          className={`nav-button ${
            activeTab === "estadisticas" ? "active" : ""
          }`}
          onClick={() => setActiveTab("estadisticas")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
            />
          </svg>
          Estadísticas
        </button>
        <button
          className={`nav-button ${
            activeTab === "estudiantes" ? "active" : ""
          }`}
          onClick={() => setActiveTab("estudiantes")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
            />
          </svg>
          Estudiantes
        </button>
        <button
          className={`nav-button ${activeTab === "docentes" ? "active" : ""}`}
          onClick={() => setActiveTab("docentes")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
            />
          </svg>
          Docentes
        </button>
        <button
          className={`nav-button ${activeTab === "cursos" ? "active" : ""}`}
          onClick={() => setActiveTab("cursos")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
            />
          </svg>
          Cursos
        </button>
        <button
          className={`nav-button ${activeTab === "notas" ? "active" : ""}`}
          onClick={() => setActiveTab("notas")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
          Notas
        </button>
      </nav>

      <main className="dashboard-main">
        {activeTab === "estadisticas" && (
          <div className="estadisticas-section">
            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Cargando estadísticas...</p>
              </div>
            ) : (
              <>
                <div className="stats-overview">
                  <h2>Resumen General del Sistema</h2>
                  <div className="stats-grid">
                    <div className="stat-card primary">
                      <div className="stat-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                          />
                        </svg>
                      </div>
                      <div className="stat-content">
                        <p className="stat-number">{stats.totalEstudiantes}</p>
                        <p className="stat-subtitle">Total estudiantes</p>
                      </div>
                    </div>

                    <div className="stat-card success">
                      <div className="stat-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                          />
                        </svg>
                      </div>
                      <div className="stat-content">
                        <p className="stat-number">{stats.totalDocentes}</p>
                        <p className="stat-subtitle">Total docentes</p>
                      </div>
                    </div>

                    <div className="stat-card warning">
                      <div className="stat-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                          />
                        </svg>
                      </div>
                      <div className="stat-content">
                        <p className="stat-number">{stats.totalCursos}</p>
                        <p className="stat-subtitle">Total cursos</p>
                      </div>
                    </div>

                    <div className="stat-card info">
                      <div className="stat-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                          />
                        </svg>
                      </div>
                      <div className="stat-content">
                        <p className="stat-number">{stats.totalNotas}</p>
                        <p className="stat-subtitle">Notas registradas</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="metrics-section">
                  <div className="metrics-grid">
                    <div className="metric-card">
                      <h3>Rendimiento Académico</h3>
                      <div className="metric-content">
                        <div className="average-score">
                          <span className="score-number">
                            {stats.promedioGeneral > 0
                              ? stats.promedioGeneral.toFixed(2)
                              : "--"}
                          </span>
                          <span className="score-label">Promedio General</span>
                        </div>
                        <div className="score-distribution">
                          <div className="score-bar aprobados">
                            <span>Aprobados</span>
                            <div className="bar">
                              <div
                                className="fill"
                                style={{ width: "78%" }}
                              ></div>
                            </div>
                            <span>78%</span>
                          </div>
                          <div className="score-bar desaprobados">
                            <span>Desaprobados</span>
                            <div className="bar">
                              <div
                                className="fill"
                                style={{ width: "22%" }}
                              ></div>
                            </div>
                            <span>22%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="metric-card">
                      <h3>Distribución por Especialidad</h3>
                      <div className="specialty-list">
                        <div className="specialty-item">
                          <span className="specialty-name">Matemáticas</span>
                          <span className="specialty-count">5 docentes</span>
                        </div>
                        <div className="specialty-item">
                          <span className="specialty-name">Ciencias</span>
                          <span className="specialty-count">4 docentes</span>
                        </div>
                        <div className="specialty-item">
                          <span className="specialty-name">Lenguaje</span>
                          <span className="specialty-count">3 docentes</span>
                        </div>
                        <div className="specialty-item">
                          <span className="specialty-name">Historia</span>
                          <span className="specialty-count">2 docentes</span>
                        </div>
                        <div className="specialty-item">
                          <span className="specialty-name">
                            Educación Física
                          </span>
                          <span className="specialty-count">2 docentes</span>
                        </div>
                      </div>
                    </div>

                    <div className="metric-card">
                      <h3>Métricas de Desempeño</h3>
                      <div className="performance-metrics">
                        <div className="performance-item">
                          <div className="performance-label">
                            Estudiantes por Curso
                          </div>
                          <div className="performance-value">
                            {stats.totalCursos > 0
                              ? Math.round(
                                  stats.totalEstudiantes / stats.totalCursos
                                )
                              : 0}
                          </div>
                        </div>
                        <div className="performance-item">
                          <div className="performance-label">
                            Notas por Estudiante
                          </div>
                          <div className="performance-value">
                            {stats.totalEstudiantes > 0
                              ? Math.round(
                                  stats.totalNotas / stats.totalEstudiantes
                                )
                              : 0}
                          </div>
                        </div>
                        <div className="performance-item">
                          <div className="performance-label">
                            Cursos por Docente
                          </div>
                          <div className="performance-value">
                            {stats.totalDocentes > 0
                              ? Math.round(
                                  (stats.totalCursos / stats.totalDocentes) * 10
                                ) / 10
                              : 0}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="quick-actions">
                  <h3>Acciones Rápidas</h3>
                  <div className="action-buttons">
                    <button
                      className="action-btn primary"
                      onClick={() => setActiveTab("estudiantes")}
                    >
                      Gestionar Estudiantes
                    </button>
                    <button
                      className="action-btn success"
                      onClick={() => setActiveTab("docentes")}
                    >
                      Gestionar Docentes
                    </button>
                    <button
                      className="action-btn warning"
                      onClick={() => setActiveTab("cursos")}
                    >
                      Gestionar Cursos
                    </button>
                    <button
                      className="action-btn info"
                      onClick={() => setActiveTab("notas")}
                    >
                      Gestionar Notas
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="welcome-card">
              <h2>Bienvenido al Panel de Administración</h2>
              <p>
                Desde aquí puedes gestionar todos los aspectos del sistema de
                gestión de notas:
              </p>
              <ul>
                <li>
                  <strong>Estudiantes:</strong> Agregar, editar y eliminar
                  estudiantes
                </li>
                <li>
                  <strong>Docentes:</strong> Gestionar el personal docente del
                  colegio
                </li>
                <li>
                  <strong>Cursos:</strong> Gestionar los cursos disponibles
                </li>
                <li>
                  <strong>Notas:</strong> Registrar y modificar las
                  calificaciones
                </li>
                <li>
                  <strong>Estadísticas:</strong> Ver el rendimiento general del
                  sistema
                </li>
              </ul>
              <p>
                Utiliza las pestañas superiores para navegar entre las
                diferentes secciones.
              </p>
            </div>
          </div>
        )}

        {activeTab === "estudiantes" && (
          <div className="content-section">
            <EstudianteManagement />
          </div>
        )}

        {activeTab === "docentes" && (
          <div className="content-section">
            <DocenteManagement />
          </div>
        )}

        {activeTab === "cursos" && (
          <div className="content-section">
            <CursoManagement />
          </div>
        )}

        {activeTab === "notas" && (
          <div className="content-section">
            <NotaManagement />
          </div>
        )}
      </main>
    </div>
  );
};
