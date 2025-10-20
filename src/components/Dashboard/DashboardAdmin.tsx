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
      state.perfilDocente?.nombres || state.perfilEstudiante?.nombres || "Admin";
    const role = getRoleDisplay();
    return `¡Hola, ${name}! Panel de ${role}`;
  };

  return (
    <div className="dashboard-admin">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="user-info">
            <img
              src={state.perfilDocente?.foto || '/src/assets/imgs/docente.png'}
              alt="Avatar"
              className="user-avatar"
            />
            <div>
              <h1>{getWelcomeMessage()}</h1>
              <p>Gestiona estudiantes, cursos y calificaciones</p>
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
          📊 Estadísticas
        </button>
        <button
          className={`nav-button ${
            activeTab === "estudiantes" ? "active" : ""
          }`}
          onClick={() => setActiveTab("estudiantes")}
        >
          👥 Estudiantes
        </button>
        <button
          className={`nav-button ${activeTab === "docentes" ? "active" : ""}`}
          onClick={() => setActiveTab("docentes")}
        >
          👨‍🏫 Docentes
        </button>
        <button
          className={`nav-button ${activeTab === "cursos" ? "active" : ""}`}
          onClick={() => setActiveTab("cursos")}
        >
          📚 Cursos
        </button>
        <button
          className={`nav-button ${activeTab === "notas" ? "active" : ""}`}
          onClick={() => setActiveTab("notas")}
        >
          📝 Notas
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
                      <div className="stat-icon">👥</div>
                      <div className="stat-content">
                        <h3>Total Estudiantes</h3>
                        <p className="stat-number">{stats.totalEstudiantes}</p>
                        <p className="stat-subtitle">Estudiantes registrados</p>
                        <div className="stat-progress">
                          <div
                            className="progress-bar"
                            style={{ width: "85%" }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="stat-card success">
                      <div className="stat-icon">👨‍🏫</div>
                      <div className="stat-content">
                        <h3>Total Docentes</h3>
                        <p className="stat-number">{stats.totalDocentes}</p>
                        <p className="stat-subtitle">Docentes activos</p>
                        <div className="stat-progress">
                          <div
                            className="progress-bar"
                            style={{ width: "72%" }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="stat-card warning">
                      <div className="stat-icon">📚</div>
                      <div className="stat-content">
                        <h3>Total Cursos</h3>
                        <p className="stat-number">{stats.totalCursos}</p>
                        <p className="stat-subtitle">Cursos activos</p>
                        <div className="stat-progress">
                          <div
                            className="progress-bar"
                            style={{ width: "60%" }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="stat-card info">
                      <div className="stat-icon">📝</div>
                      <div className="stat-content">
                        <h3>Notas Registradas</h3>
                        <p className="stat-number">{stats.totalNotas}</p>
                        <p className="stat-subtitle">Total de calificaciones</p>
                        <div className="stat-progress">
                          <div
                            className="progress-bar"
                            style={{ width: "95%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="metrics-section">
                  <div className="metrics-grid">
                    <div className="metric-card">
                      <h3>📈 Rendimiento Académico</h3>
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
                      <h3>�‍🏫 Distribución por Especialidad</h3>
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
                      <h3>🎯 Métricas de Desempeño</h3>
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
                  <h3>🚀 Acciones Rápidas</h3>
                  <div className="action-buttons">
                    <button
                      className="action-btn primary"
                      onClick={() => setActiveTab("estudiantes")}
                    >
                      👥 Gestionar Estudiantes
                    </button>
                    <button
                      className="action-btn success"
                      onClick={() => setActiveTab("docentes")}
                    >
                      👨‍🏫 Gestionar Docentes
                    </button>
                    <button
                      className="action-btn warning"
                      onClick={() => setActiveTab("cursos")}
                    >
                      📚 Gestionar Cursos
                    </button>
                    <button
                      className="action-btn info"
                      onClick={() => setActiveTab("notas")}
                    >
                      📝 Gestionar Notas
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
