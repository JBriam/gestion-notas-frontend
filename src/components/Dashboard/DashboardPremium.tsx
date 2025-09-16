import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardService } from "../../api/DashboardService";
import type {
  EstudianteConNotasDTO,
  CursoConNotasDTO,
} from "../../interfaces/Dashboard";

interface DashboardProps {
  viewMode: "estudiantes" | "cursos";
}

const DashboardPremium: React.FC<DashboardProps> = ({ viewMode }) => {
  const [estudiantes, setEstudiantes] = useState<EstudianteConNotasDTO[]>([]);
  const [cursos, setCursos] = useState<CursoConNotasDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (viewMode === "estudiantes") {
          const data = await DashboardService.getEstudiantesConNotas();
          setEstudiantes(data);
        } else {
          const data = await DashboardService.getCursosConNotas();
          setCursos(data);
        }
      } catch (err: unknown) {
        setError((err as Error).message || "Error al cargar los datos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [viewMode]);

  // Función para obtener gradiente del avatar
  const getGradientColor = (index: number) => {
    const gradients = [
      "#667eea 0%, #764ba2 100%",
      "#f093fb 0%, #f5576c 100%",
      "#4facfe 0%, #00f2fe 100%",
      "#43e97b 0%, #38f9d7 100%",
      "#fa709a 0%, #fee140 100%",
      "#a8edea 0%, #fed6e3 100%",
    ];
    return gradients[index % gradients.length];
  };

  // Función para obtener color basado en la nota
  const getColorByGrade = (nota: number) => {
    if (nota >= 16) return "text-success";
    if (nota >= 13) return "text-warning";
    return "text-danger";
  };

  // Función para obtener background de promedio
  const getPromedioBackground = (promedio: number) => {
    if (promedio >= 16) return "#10b981 0%, #059669 100%"; // Verde
    if (promedio >= 13) return "#f59e0b 0%, #d97706 100%"; // Amarillo/Naranja
    return "#ef4444 0%, #dc2626 100%"; // Rojo
  };

  // Función para obtener etiqueta de promedio
  const getPromedioLabel = (promedio: number) => {
    if (promedio >= 18) return "Excelente";
    if (promedio >= 16) return "Muy Bueno";
    if (promedio >= 13) return "Bueno";
    if (promedio >= 11) return "Regular";
    return "Deficiente";
  };

  // Funciones para círculos de color en notas
  const getColorByGradeCircle = (nota: number) => {
    if (nota >= 16) return "bg-success";
    if (nota >= 13) return "bg-warning";
    return "bg-danger";
  };

  const getColorByGradeBg = (nota: number) => {
    if (nota >= 16) return "bg-success";
    if (nota >= 13) return "bg-warning";
    return "bg-danger";
  };

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3 text-muted">Cargando información...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5">
        <div 
          className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
          style={{
            width: "80px",
            height: "80px",
            background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
            color: "white"
          }}
        >
          <i className="bi bi-exclamation-triangle-fill fs-2"></i>
        </div>
        <h5 className="text-muted mb-2">No se pudieron cargar los datos</h5>
        <p className="text-muted small mb-0">
          Inténtelo de nuevo más tarde
        </p>
      </div>
    );
  }

  return (
    <>
      {/* CSS personalizado para hover effects */}
      <style>{`
        .hover-shadow:hover {
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
          transform: translateY(-2px);
        }
        .hover-bg-light:hover {
          background-color: rgba(0,0,0,0.03) !important;
        }
      `}</style>

      <motion.div
        className="row g-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {viewMode === "estudiantes" ? (
          // Vista por Estudiantes Premium
          estudiantes.length > 0 ? (
            estudiantes.map((estudiante, index) => (
              <motion.div
                key={estudiante.idEstudiante}
                className="col-12 col-md-6 col-lg-4"
                variants={cardVariants}
              >
                <div
                  className="card h-100 border-0 shadow-sm hover-shadow"
                  style={{
                    background:
                      "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                    borderRadius: "16px",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div className="card-body p-4">
                    {/* Avatar y nombre con diseño premium */}
                    <div className="d-flex align-items-center mb-4">
                      <div className="position-relative">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
                          style={{
                            width: "60px",
                            height: "60px",
                            background: `linear-gradient(135deg, ${getGradientColor(
                              index
                            )})`,
                          }}
                        >
                          {estudiante.nombres.charAt(0)}
                          {estudiante.apellidos.charAt(0)}
                        </div>
                        <div
                          className="position-absolute bottom-0 end-0 bg-success rounded-circle border border-white"
                          style={{ width: "16px", height: "16px" }}
                        ></div>
                      </div>
                      <div className="ms-3 flex-grow-1">
                        <h6 className="card-title mb-1 fw-bold text-dark">
                          {estudiante.nombres} {estudiante.apellidos}
                        </h6>
                        <div className="d-flex align-items-center text-muted small">
                          <i className="bi bi-envelope me-1"></i>
                          <span className="text-truncate">
                            {estudiante.email}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Promedio con diseño premium */}
                    <div
                      className="mb-4 p-3 rounded-3"
                      style={{
                        background: `linear-gradient(135deg, ${getPromedioBackground(
                          estudiante.promedio
                        )})`,
                        border: "1px solid rgba(255,255,255,0.2)",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center text-white">
                          <i className="bi bi-trophy-fill me-2"></i>
                          <span className="fw-semibold">Promedio</span>
                        </div>
                        <div className="d-flex align-items-center">
                          <span className="fw-bold fs-4 text-white me-2">
                            {estudiante.promedio.toFixed(2)}
                          </span>
                          <div className="text-white small">
                            {getPromedioLabel(estudiante.promedio)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Notas por curso con mejor diseño */}
                    <div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <h6 className="fw-semibold mb-0 text-dark">
                          <i className="bi bi-journal-bookmark me-2 text-primary"></i>
                          Cursos
                        </h6>
                        <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill">
                          {estudiante.notas.length}
                        </span>
                      </div>
                      {estudiante.notas.length > 0 ? (
                        <div className="space-y-2">
                          {estudiante.notas.map((nota) => (
                            <div
                              key={nota.idCurso}
                              className="d-flex justify-content-between align-items-center p-2 rounded-2 hover-bg-light"
                              style={{
                                transition: "background-color 0.2s ease",
                              }}
                            >
                              <div className="d-flex align-items-center">
                                <div
                                  className={`w-3 h-3 rounded-circle me-2 ${getColorByGradeCircle(
                                    nota.nota
                                  )}`}
                                  style={{ width: "8px", height: "8px" }}
                                ></div>
                                <span className="small fw-medium text-dark">
                                  {nota.nombreCurso}
                                </span>
                              </div>
                              <div className="d-flex align-items-center">
                                <span
                                  className={`fw-bold ${getColorByGrade(
                                    nota.nota
                                  )}`}
                                >
                                  {nota.nota.toFixed(1)}
                                </span>
                                <div
                                  className="ms-2"
                                  style={{
                                    width: "40px",
                                    height: "4px",
                                    backgroundColor: "#e9ecef",
                                    borderRadius: "2px",
                                  }}
                                >
                                  <div
                                    className={`h-100 rounded-1 ${getColorByGradeBg(
                                      nota.nota
                                    )}`}
                                    style={{
                                      width: `${(nota.nota / 20) * 100}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <i className="bi bi-journal-x fs-2 text-muted opacity-50"></i>
                          <p className="text-muted small mt-2 mb-0">
                            Sin notas registradas
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-12">
              <div className="text-center py-5">
                <i className="bi bi-person-x fs-1 text-muted"></i>
                <p className="text-muted mt-3">
                  No hay estudiantes con notas registradas
                </p>
              </div>
            </div>
          )
        ) : // Vista por Cursos Premium
        cursos.length > 0 ? (
          cursos.map((curso, index) => (
            <motion.div
              key={curso.idCurso}
              className="col-12 col-md-6 col-lg-4"
              variants={cardVariants}
            >
              <div
                className="card h-100 border-0 shadow-sm hover-shadow"
                style={{
                  background:
                    "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                  borderRadius: "16px",
                  transition: "all 0.3s ease",
                }}
              >
                <div className="card-body p-4">
                  {/* Encabezado del curso premium */}
                  <div className="d-flex align-items-center mb-4">
                    <div className="position-relative">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center text-white shadow-sm"
                        style={{
                          width: "60px",
                          height: "60px",
                          background: `linear-gradient(135deg, ${getGradientColor(
                            index
                          )})`,
                        }}
                      >
                        <i className="bi bi-journal-bookmark fs-4"></i>
                      </div>
                      <div
                        className="position-absolute bottom-0 end-0 bg-info rounded-circle border border-white"
                        style={{ width: "16px", height: "16px" }}
                      ></div>
                    </div>
                    <div className="ms-3 flex-grow-1">
                      <h6 className="card-title mb-1 fw-bold text-dark">
                        {curso.nombre}
                      </h6>
                      <div className="d-flex align-items-center text-muted small">
                        <i className="bi bi-calendar-event me-1"></i>
                        <span>Curso académico</span>
                      </div>
                    </div>
                  </div>

                  {/* Promedio del curso */}
                  <div
                    className="mb-4 p-3 rounded-3"
                    style={{
                      background: `linear-gradient(135deg, ${getPromedioBackground(
                        curso.promedioGeneral
                      )})`,
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center text-white">
                        <i className="bi bi-bar-chart-fill me-2"></i>
                        <span className="fw-semibold">Promedio</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <span className="fw-bold fs-4 text-white me-2">
                          {curso.promedioGeneral.toFixed(2)}
                        </span>
                        <div className="text-white small">
                          {getPromedioLabel(curso.promedioGeneral)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Estudiantes inscritos */}
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <h6 className="fw-semibold mb-0 text-dark">
                        <i className="bi bi-people me-2 text-success"></i>
                        Estudiantes
                      </h6>
                      <span className="badge bg-success bg-opacity-10 text-success rounded-pill">
                        {curso.notas.length}
                      </span>
                    </div>
                    {curso.notas.length > 0 ? (
                      <div className="space-y-2">
                        {curso.notas.map((nota) => (
                          <div
                            key={nota.idEstudiante}
                            className="d-flex justify-content-between align-items-center p-2 rounded-2 hover-bg-light"
                            style={{ transition: "background-color 0.2s ease" }}
                          >
                            <div className="d-flex align-items-center">
                              <div
                                className={`w-3 h-3 rounded-circle me-2 ${getColorByGradeCircle(
                                  nota.nota
                                )}`}
                                style={{ width: "8px", height: "8px" }}
                              ></div>
                              <span className="small fw-medium text-dark">
                                {nota.nombresEstudiante}{" "}
                                {nota.apellidosEstudiante}
                              </span>
                            </div>
                            <div className="d-flex align-items-center">
                              <span
                                className={`fw-bold ${getColorByGrade(
                                  nota.nota
                                )}`}
                              >
                                {nota.nota.toFixed(1)}
                              </span>
                              <div
                                className="ms-2"
                                style={{
                                  width: "40px",
                                  height: "4px",
                                  backgroundColor: "#e9ecef",
                                  borderRadius: "2px",
                                }}
                              >
                                <div
                                  className={`h-100 rounded-1 ${getColorByGradeBg(
                                    nota.nota
                                  )}`}
                                  style={{
                                    width: `${(nota.nota / 20) * 100}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <i className="bi bi-people-x fs-2 text-muted opacity-50"></i>
                        <p className="text-muted small mt-2 mb-0">
                          Sin estudiantes registrados
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-12">
            <div className="text-center py-5">
              <i className="bi bi-journal-x fs-1 text-muted"></i>
              <p className="text-muted mt-3">
                No hay cursos con notas registradas
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default DashboardPremium;
