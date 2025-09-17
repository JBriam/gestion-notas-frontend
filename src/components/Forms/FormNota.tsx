import { useEffect, useState } from "react";
import type { Estudiante } from "../../interfaces/Estudiante";
import type { Curso } from "../../interfaces/Curso";
import type { NotaForm } from "../../interfaces/Nota";
import { NotaService } from "../../api/NotaService";
import { EstudianteService } from "../../api/EstudianteService";
import { CursoService } from "../../api/CursoService";
import ToastMessage from "../Modals/ToastMessage";

interface FormNotaProps {
  onSaved?: () => void;
}

export default function FormNota({ onSaved }: FormNotaProps) {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [form, setForm] = useState<NotaForm>({
    idEstudiante: 0,
    idCurso: 0,
    nota: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "danger"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [estudiantes, cursos] = await Promise.all([
          EstudianteService.listar(),
          CursoService.listar(),
        ]);
        setEstudiantes(estudiantes);
        setCursos(cursos);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };
    fetchData();
  }, []);

  const showToast = (message: string, type: "success" | "danger" = "success") => {
    setToast({ show: true, message, type });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validaciones
    if (form.idEstudiante === 0) {
      showToast("Por favor selecciona un estudiante", "danger");
      return;
    }
    
    if (form.idCurso === 0) {
      showToast("Por favor selecciona un curso", "danger");
      return;
    }
    
    if (form.nota < 0 || form.nota > 20 || isNaN(form.nota)) {
      showToast("La nota debe ser un número válido entre 0 y 20", "danger");
      return;
    }
    
    setIsLoading(true);
    try {
      // Usar directamente el form que ya tiene la estructura correcta
      await NotaService.crear(form);
      
      // Limpiar formulario
      setForm({
        idEstudiante: 0,
        idCurso: 0,
        nota: 0
      });
      
      // Mostrar mensaje de éxito
      showToast("¡Nota registrada exitosamente!");
      
      // Llamar callback si existe
      if (onSaved) {
        onSaved();
      }
    } catch (error: unknown) {
      console.error("Error al guardar nota:", error);
      const message = error instanceof Error ? error.message : "Error al registrar la nota";
      showToast(message, "danger");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-11">
            <div
              className="card-header border-0 shadow rounded-4 mb-4 p-4"
              style={{
                background:
                  "linear-gradient(90deg,rgb(39, 93, 155) 0%,rgb(56, 204, 249) 100%)",
              }}
            >
              <h4 className="fw-bold text-white mb-0">
                <i className="bi bi-pen-fill me-2"></i>Registrar nota
              </h4>
            </div>
            <div className="card-body mb-4 border-0 shadow rounded-4 p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Estudiante</label>
                  <select 
                    className="form-select"
                    value={form.idEstudiante}
                    onChange={(e) => setForm({...form, idEstudiante: Number(e.target.value)})}
                    required
                  >
                    <option value={0}>Seleccionar estudiante</option>
                    {estudiantes.map((est) => (
                      <option key={est.idEstudiante} value={est.idEstudiante}>
                        {est.nombres} {est.apellidos}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Curso</label>
                  <select 
                    className="form-select"
                    value={form.idCurso}
                    onChange={(e) => setForm({...form, idCurso: Number(e.target.value)})}
                    required
                  >
                    <option value={0}>Seleccionar curso</option>
                    {cursos.map((cur) => (
                      <option key={cur.idCurso} value={cur.idCurso}>
                        {cur.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Nota</label>
                  <input
                    type="number"
                    className="form-control"
                    min={0}
                    max={20}
                    step="0.1"
                    value={form.nota === 0 ? "" : form.nota}
                    onChange={(e) => {
                      const value = e.target.value;
                      const numericValue = value === "" ? 0 : Number(value);
                      setForm({...form, nota: numericValue});
                    }}
                    placeholder="Ingrese la nota (0-20)"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Registrando...
                    </>
                  ) : (
                    "Registrar"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Message */}
      <ToastMessage
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </>
  );
}
