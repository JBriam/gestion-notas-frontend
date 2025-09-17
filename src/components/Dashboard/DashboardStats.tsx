import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardService } from "../../api/DashboardService";
import type {
  EstudianteConNotasDTO,
  CursoConNotasDTO,
} from "../../interfaces/Dashboard";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  trend?: number;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  color,
  trend,
}) => {
  return (
    <motion.div
      className="col-md-3 col-sm-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className={`card border-0 shadow-sm h-100 ${color}`}
        style={{ borderRadius: "16px" }}
      >
        <div className="card-body p-4 text-white">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h6 className="text-white-50 mb-2 fw-normal">{title}</h6>
              <h3 className="fw-bold mb-0">{value}</h3>
              {trend !== undefined && (
                <div className="d-flex align-items-center mt-2">
                  <i
                    className={`bi bi-arrow-${trend >= 0 ? "up" : "down"} me-1`}
                  ></i>
                  <small className="text-white-50">
                    {Math.abs(trend)}% vs mes anterior
                  </small>
                </div>
              )}
            </div>
            <div
              className="bg-white bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center p-3 mt-3"
              style={{
                width: "60px",
                height: "60px",
              }}
            >
              <i className={`${icon} fs-4 text-white`}></i>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const DashboardStats: React.FC = () => {
  const [estudiantes, setEstudiantes] = useState<EstudianteConNotasDTO[]>([]);
  const [cursos, setCursos] = useState<CursoConNotasDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [estudiantesData, cursosData] = await Promise.all([
          DashboardService.getEstudiantesConNotas(),
          DashboardService.getCursosConNotas(),
        ]);
        setEstudiantes(estudiantesData);
        setCursos(cursosData);
      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="row g-4 mb-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="col-md-3 col-sm-6">
            <div className="card border-0" style={{ borderRadius: "16px" }}>
              <div className="card-body p-4">
                <div className="placeholder-glow">
                  <span className="placeholder col-7"></span>
                  <span className="placeholder col-4"></span>
                  <span className="placeholder col-6"></span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Calcular estadísticas
  const totalEstudiantes = estudiantes.length;
  const totalCursos = cursos.length;
  const promedioGeneral =
    estudiantes.length > 0
      ? estudiantes.reduce((sum, est) => sum + est.promedio, 0) /
        estudiantes.length
      : 0;

  const estudiantesExcelentes = estudiantes.filter(
    (est) => est.promedio >= 16
  ).length;
  const porcentajeExcelencia =
    totalEstudiantes > 0
      ? Math.round((estudiantesExcelentes / totalEstudiantes) * 100)
      : 0;

  return (
    <div className="row g-4 mb-4">
      <StatsCard
        title="Total Estudiantes"
        value={totalEstudiantes}
        icon="bi bi-people-fill"
        color="gradient-primary"
        trend={12}
      />
      <StatsCard
        title="Cursos Activos"
        value={totalCursos}
        icon="bi bi-journal-bookmark-fill"
        color="gradient-success"
        trend={8}
      />
      <StatsCard
        title="Promedio General"
        value={promedioGeneral.toFixed(1)}
        icon="bi bi-trophy-fill"
        color="gradient-warning"
        trend={5}
      />
      <StatsCard
        title="Excelencia Académica"
        value={`${porcentajeExcelencia}%`}
        icon="bi bi-star-fill"
        color="gradient-info"
        trend={15}
      />
    </div>
  );
};

export default DashboardStats;
