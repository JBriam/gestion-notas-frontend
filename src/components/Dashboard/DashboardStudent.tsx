import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { ProfileStudent } from "../Profile/ProfileStudent";
import {
  EstudianteDataService,
  type CursoConNotas,
} from "../../api/EstudianteDataService";
import "./DashboardStudent.css";

export const DashboardStudent: React.FC = () => {
  const { state, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"notas" | "perfil">("notas");
  const [cursosConNotas, setCursosConNotas] = useState<CursoConNotas[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cargarNotasEstudiante = async () => {
      if (!state.perfilEstudiante?.idEstudiante) {
        return;
      }

      setLoading(true);
      try {
        const cursosData = await EstudianteDataService.obtenerNotasPorCurso(
          state.perfilEstudiante.idEstudiante
        );
        setCursosConNotas(cursosData);
      } catch (error) {
        console.error("[DashboardStudent] Error al cargar notas:", error);
        // En caso de error, mostrar arreglo vacío
        setCursosConNotas([]);
      } finally {
        setLoading(false);
      }
    };

    cargarNotasEstudiante();
  }, [state.perfilEstudiante?.idEstudiante]);

  const calcularPromedioGeneral = () => {
    if (cursosConNotas.length === 0) return 0;
    const suma = cursosConNotas.reduce((acc, curso) => acc + curso.promedio, 0);
    return (suma / cursosConNotas.length).toFixed(2);
  };

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      logout();
    }
  };

  return (
    <div className="dashboard-student">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="user-info">
            <img
              src={state.perfilEstudiante?.foto || "/assets/imgs/student.gif"}
              alt="Avatar"
              className="user-avatar"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/assets/imgs/student.gif";
              }}
            />
            <div>
              <h1>¡Hola, {state.perfilEstudiante?.nombres}!</h1>
              <p>Bienvenido a tu panel de estudiante</p>
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </header>

      <nav className="dashboard-nav">
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
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
          Mis Notas
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
        {activeTab === "notas" && (
          <div className="notas-section">
            <div className="section-header">
              <h2>Mis Calificaciones</h2>
              <div className="promedio-card">
                <span className="promedio-label">Promedio General:</span>
                <span className="promedio-valor">
                  {calcularPromedioGeneral()}
                </span>
              </div>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Cargando tus notas...</p>
              </div>
            ) : cursosConNotas.length === 0 ? (
              <div className="empty-state">
                <h3>No tienes calificaciones registradas</h3>
                <p>Cuando tu profesor registre tus notas, aparecerán aquí.</p>
              </div>
            ) : (
              <div className="cursos-grid">
                {cursosConNotas.map((cursoData) => (
                  <div key={cursoData.curso.idCurso} className="curso-card">
                    <div className="curso-header">
                      <h3>{cursoData.curso.nombre}</h3>
                      <span
                        className={`promedio-curso ${getNoteClass(
                          cursoData.promedio
                        )}`}
                      >
                        Promedio: {cursoData.promedio.toFixed(2)}
                      </span>
                    </div>
                    <div className="evaluaciones-container">
                      <p className="evaluaciones-titulo">
                        Evaluaciones ({cursoData.totalEvaluaciones})
                      </p>
                      <div className="evaluaciones-grid">
                        {cursoData.notas.map((nota) => (
                          <div key={nota.idNota} className="evaluacion-item">
                            <div className="evaluacion-header">
                              <span className="tipo-evaluacion">
                                {nota.tipoEvaluacion}
                              </span>
                              <span
                                className={`nota-valor ${getNoteClass(
                                  nota.valor
                                )}`}
                              >
                                {nota.valor}
                              </span>
                            </div>
                            <div className="evaluacion-details">
                              <p className="fecha">
                                {new Date(
                                  nota.fecha + "T00:00:00"
                                ).toLocaleDateString("es-PE")}
                              </p>
                              {nota.observaciones && (
                                <p className="observaciones">
                                  {nota.observaciones}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "perfil" && <ProfileStudent />}
      </main>
    </div>
  );
};

// Función auxiliar para determinar la clase CSS según la nota
const getNoteClass = (valor: number): string => {
  if (valor >= 18) return "excelente";
  if (valor >= 14) return "bueno";
  if (valor >= 11) return "regular";
  return "deficiente";
};
