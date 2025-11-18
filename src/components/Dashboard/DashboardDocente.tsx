import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import { DocenteDataService } from "../../api/DocenteDataService";
import type { Estudiante } from "../../interfaces/Estudiante";
import type { Nota } from "../../interfaces/Nota";
import type { Curso } from "../../interfaces/Curso";
import { ProfileDocente } from "../Profile/ProfileDocente";
import "./DashboardDocente.css";

type DocenteTab =
  | "resumen"
  | "mis-cursos"
  | "estudiantes"
  | "calificaciones"
  | "perfil";

interface DocenteStats {
  totalEstudiantesAtendidos: number;
  totalCursosAsignados: number;
  totalNotasRegistradas: number;
  promedioGeneral: number;
}

export const DashboardDocente: React.FC = () => {
  const { state, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<DocenteTab>("resumen");
  const [stats, setStats] = useState<DocenteStats>({
    totalEstudiantesAtendidos: 0,
    totalCursosAsignados: 0,
    totalNotasRegistradas: 0,
    promedioGeneral: 0,
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
        promedioGeneral: estadisticas.promedioGeneral,
      });
    } catch (error) {
      console.error("Error al cargar datos del docente:", error);
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
    if (window.confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      logout();
    }
  };

  const getWelcomeMessage = () => {
    const name = state.perfilDocente?.nombres || "Docente";
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
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/assets/imgs/docente.png";
              }}
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
          className={`nav-button ${activeTab === "resumen" ? "active" : ""}`}
          onClick={() => setActiveTab("resumen")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
            />
          </svg>
          Resumen
        </button>
        <button
          className={`nav-button ${activeTab === "mis-cursos" ? "active" : ""}`}
          onClick={() => setActiveTab("mis-cursos")}
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
          Mis Cursos
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
          Mis Estudiantes
        </button>
        <button
          className={`nav-button ${
            activeTab === "calificaciones" ? "active" : ""
          }`}
          onClick={() => setActiveTab("calificaciones")}
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
          Calificaciones
        </button>
        <button
          className={`nav-button ${activeTab === "perfil" ? "active" : ""}`}
          onClick={() => setActiveTab("perfil")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
          Mi Perfil
        </button>
      </nav>

      <main className="dashboard-main">
        {activeTab === "resumen" && (
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
                    <h3>Cursos Asignados</h3>
                    <p className="stat-number">{stats.totalCursosAsignados}</p>
                    <p className="stat-subtitle">Cursos que imparto</p>
                  </div>

                  <div className="stat-card">
                    <h3>Estudiantes</h3>
                    <p className="stat-number">
                      {stats.totalEstudiantesAtendidos}
                    </p>
                    <p className="stat-subtitle">Estudiantes en mis cursos</p>
                  </div>

                  <div className="stat-card">
                    <h3>Notas Registradas</h3>
                    <p className="stat-number">{stats.totalNotasRegistradas}</p>
                    <p className="stat-subtitle">Calificaciones ingresadas</p>
                  </div>

                  <div className="stat-card">
                    <h3>Promedio General</h3>
                    <p className="stat-number">
                      {stats.promedioGeneral > 0
                        ? stats.promedioGeneral.toFixed(2)
                        : "--"}
                    </p>
                    <p className="stat-subtitle">De mis cursos</p>
                  </div>
                </div>

                <div className="welcome-card">
                  <h2>Bienvenido a tu Panel de Docente</h2>
                  <p>
                    Desde aquí puedes gestionar tus cursos y estudiantes
                    asignados:
                  </p>
                  <ul>
                    <li>
                      <strong>Mis Cursos:</strong> Ver información de los cursos
                      que impartes
                    </li>
                    <li>
                      <strong>Mis Estudiantes:</strong> Lista de estudiantes en
                      tus cursos
                    </li>
                    <li>
                      <strong>Calificaciones:</strong> Registrar y modificar las
                      notas de tus estudiantes
                    </li>
                  </ul>
                  <p>
                    <strong>Nota:</strong> Solo puedes ver y gestionar
                    información relacionada con tus cursos asignados.
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "mis-cursos" && (
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
                      <span className="curso-codigo">
                        {curso.codigoCurso as string}
                      </span>
                    </div>
                    <div className="curso-details">
                      <p>
                        <strong>Descripción:</strong>{" "}
                        {(curso.descripcion as string) || "Sin descripción"}
                      </p>
                      <p>
                        <strong>Créditos:</strong> {curso.creditos as number}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "estudiantes" && (
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
                  <div
                    key={estudiante.idEstudiante}
                    className="estudiante-card"
                  >
                    <div className="estudiante-header">
                      <img
                        src={estudiante.foto || "/assets/imgs/student.gif"}
                        alt="Estudiante"
                        className="estudiante-avatar"
                      />
                      <div>
                        <h3>
                          {estudiante.nombres} {estudiante.apellidos}
                        </h3>
                        <p className="estudiante-codigo">
                          {estudiante.codigoEstudiante as string}
                        </p>
                      </div>
                    </div>
                    <div className="estudiante-details">
                      <p>
                        <strong>Email:</strong> {estudiante.email}
                      </p>
                      <p>
                        <strong>Teléfono:</strong>{" "}
                        {(estudiante.telefono as string) || "No registrado"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "calificaciones" && (
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
                            <strong>
                              {nota.estudiante.nombres}{" "}
                              {nota.estudiante.apellidos}
                            </strong>
                            <small>
                              {nota.estudiante.codigoEstudiante as string}
                            </small>
                          </div>
                        </td>
                        <td>{nota.curso.nombre}</td>
                        <td>
                          <span
                            className={`tipo-evaluacion-badge ${getTipoEvaluacionClass(
                              nota.tipoEvaluacion || ""
                            )}`}
                          >
                            {nota.tipoEvaluacion || "N/A"}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`nota-badge ${
                              nota.nota >= 13 ? "aprobado" : "desaprobado"
                            }`}
                          >
                            {nota.nota.toFixed(1)}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`estado-badge ${
                              nota.nota >= 13 ? "aprobado" : "desaprobado"
                            }`}
                          >
                            {nota.nota >= 13 ? "Aprobado" : "Desaprobado"}
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

        {activeTab === "perfil" && <ProfileDocente />}
      </main>
    </div>
  );
};

// Función helper para estilos de tipo de evaluación
const getTipoEvaluacionClass = (tipoEvaluacion: string): string => {
  switch (tipoEvaluacion) {
    case "PARCIAL":
      return "tipo-parcial";
    case "FINAL":
      return "tipo-final";
    case "TAREA":
      return "tipo-tarea";
    case "PRACTICA":
      return "tipo-practica";
    default:
      return "tipo-default";
  }
};
