import { useEffect, useState } from "react";
import type { Nota } from "../../interfaces/Nota";
import { Modal } from "bootstrap";
import { NotaService } from "../../api/NotaService";
import ToastMessage from "../Modals/ToastMessage";

export default function ListNota() {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [notaAEliminar, setNotaAEliminar] = useState<Nota | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "danger"
  });

  // Método para cargar notas
  const cargarNotas = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await NotaService.listar();
      setNotas(data);
    } catch (error) {
      console.error("Error al cargar notas:", error);
      setError((error as Error).message || "Error al cargar los datos");
    } finally {
      setIsLoading(false);
    }
  };

  // Método para eliminar
  const confirmarEliminacion = async () => {
    if (!notaAEliminar) return;

    try {
      await NotaService.eliminar(notaAEliminar.idNota!);
      await cargarNotas();
      setNotaAEliminar(null);
      setToast({ show: true, message: "Nota eliminada", type: "danger" });

      // Cerrar modal
      const modalElement = document.getElementById("modalEliminarNota");
      if (modalElement) {
        const modal = Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        }
      }
    } catch (error) {
      console.error("Error al eliminar nota:", error);
      setToast({
        show: true,
        message: "Error al eliminar la nota",
        type: "danger"
      });
    }
  };

  // Método para abrir modal de eliminación
  const abrirModalEliminar = (nota: Nota) => {
    setNotaAEliminar(nota);
    const modalElement = document.getElementById("modalEliminarNota");
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  };

  // Función para obtener el color de la nota
  const getNotaColor = (nota: number) => {
    if (nota >= 18) return "text-success fw-bold"; // Verde para excelente
    if (nota >= 14) return "text-primary fw-bold"; // Azul para bueno
    if (nota >= 11) return "text-warning fw-bold"; // Amarillo para regular
    return "text-danger fw-bold"; // Rojo para deficiente
  };

  // Función para obtener el badge de la nota
  const getNotaBadge = (nota: number) => {
    if (nota >= 18) return "badge bg-success";
    if (nota >= 14) return "badge bg-primary";
    if (nota >= 11) return "badge bg-warning";
    return "badge bg-danger";
  };

  // Función para obtener el texto del nivel
  const getNivelTexto = (nota: number) => {
    if (nota >= 18) return "Excelente";
    if (nota >= 14) return "Bueno";
    if (nota >= 11) return "Regular";
    return "Deficiente";
  };

  useEffect(() => {
    cargarNotas();
  }, []);

  // Llamamos a la función para cargar los datos
  useEffect(() => {
    cargarNotas();
  }, []);

  if (isLoading) {
    return (
      <div className="container py-4">
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow rounded-4">
              <div className="card-body p-4">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
                  <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="text-muted">Cargando notas...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow rounded-4">
              <div className="card-body p-4 text-center">
                <div
                  className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: "80px",
                    height: "80px",
                    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                    color: "white"
                  }}
                >
                  <i className="bi bi-exclamation-triangle-fill fs-2"></i>
                </div>
                <h5 className="text-muted mb-2">No se pudieron cargar las notas</h5>
                <p className="text-muted small mb-3">{error}</p>
                <button 
                  className="btn btn-primary" 
                  onClick={cargarNotas}
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container py-4">
        <div className="row">
          <div className="col-12">
            {/* Header */}
            <div
              className="card-header border-0 shadow rounded-4 mb-4 p-4"
              style={{
                background: "linear-gradient(90deg,rgb(39, 93, 155) 0%,rgb(56, 204, 249) 100%)",
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="fw-bold text-white mb-0">
                    <i className="bi bi-clipboard-data-fill me-2"></i>
                    Lista de Notas
                  </h4>
                  <p className="text-white-50 mb-0 mt-1">
                    Total: {notas.length} nota{notas.length !== 1 ? 's' : ''} registrada{notas.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  className="btn btn-light"
                  onClick={cargarNotas}
                  disabled={isLoading}
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Actualizar
                </button>
              </div>
            </div>

            {/* Lista de notas */}
            <div className="card border-0 shadow rounded-4">
              <div className="card-body p-0">
                {notas.length === 0 ? (
                  <div className="text-center py-5">
                    <div
                      className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                      style={{
                        width: "80px",
                        height: "80px",
                        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                        color: "white"
                      }}
                    >
                      <i className="bi bi-clipboard-data fs-2"></i>
                    </div>
                    <h5 className="text-muted mb-2">No hay notas registradas</h5>
                    <p className="text-muted small mb-0">
                      Las notas que registres aparecerán aquí
                    </p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="px-4 py-3 border-0">
                            <i className="bi bi-person-fill me-2 text-primary"></i>
                            Estudiante
                          </th>
                          <th className="px-4 py-3 border-0">
                            <i className="bi bi-journal-bookmark-fill me-2 text-success"></i>
                            Curso
                          </th>
                          <th className="px-4 py-3 border-0 text-center">
                            <i className="bi bi-trophy-fill me-2 text-warning"></i>
                            Nota
                          </th>
                          <th className="px-4 py-3 border-0 text-center">
                            <i className="bi bi-bar-chart-fill me-2 text-info"></i>
                            Nivel
                          </th>
                          <th className="px-4 py-3 border-0 text-center">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {notas.map((nota, index) => (
                          <tr key={nota.idNota || index} className="align-middle">
                            <td className="px-4 py-3">
                              <div className="d-flex align-items-center">
                                <div
                                  className="rounded-circle me-3 d-flex align-items-center justify-content-center text-white fw-bold"
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    background: `linear-gradient(135deg, ${
                                      ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a'][index % 5]
                                    } 0%, ${
                                      ['#764ba2', '#f5576c', '#00f2fe', '#38f9d7', '#fee140'][index % 5]
                                    } 100%)`
                                  }}
                                >
                                  {nota.estudiante.nombres.charAt(0)}
                                  {nota.estudiante.apellidos.charAt(0)}
                                </div>
                                <div>
                                  <div className="fw-semibold">
                                    {nota.estudiante.nombres} {nota.estudiante.apellidos}
                                  </div>
                                  <small className="text-muted">
                                    {nota.estudiante.email}
                                  </small>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="badge bg-light text-dark px-3 py-2 rounded-pill">
                                <i className="bi bi-book me-1"></i>
                                {nota.curso.nombre}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`fs-5 ${getNotaColor(nota.nota)}`}>
                                {nota.nota.toFixed(1)}
                              </span>
                              <small className="text-muted d-block">/ 20</small>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={getNotaBadge(nota.nota)}>
                                {getNivelTexto(nota.nota)}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => abrirModalEliminar(nota)}
                                title="Eliminar nota"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de eliminación personalizado para notas */}
      <div
        className="modal fade"
        id="modalEliminarNota"
        tabIndex={-1}
        aria-labelledby="modalEliminarNotaLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="modalEliminarNotaLabel">
                <i className="bi bi-exclamation-triangle-fill text-danger me-2"></i>
                Eliminar Nota
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {notaAEliminar && (
                <p>
                  ¿Estás seguro de que quieres eliminar la nota <strong>{notaAEliminar.nota}</strong> de{" "}
                  <strong>{notaAEliminar.estudiante.nombres} {notaAEliminar.estudiante.apellidos}</strong>{" "}
                  en el curso <strong>{notaAEliminar.curso.nombre}</strong>?
                </p>
              )}
              <div className="alert alert-warning d-flex align-items-center" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                <div>Esta acción no se puede deshacer.</div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={confirmarEliminacion}
              >
                <i className="bi bi-trash me-2"></i>
                Eliminar
              </button>
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