import { useEffect, useState } from "react";
import type { Estudiante } from "../../interfaces/Estudiante";
import FormEstudiante from "../Forms/FormEstudiante";
import { Modal } from "bootstrap";
import { ModalAgregar } from "../Modals/ModalAgregar";
import { ModalActualizar } from "../Modals/ModalActualizar";
import { ModalEliminar } from "../Modals/ModalEliminar";
import { EstudianteService } from "../../api/EstudianteService";
import ToastMessage from "../Modals/ToastMessage";

export default function ListEstudiante() {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [estudianteEditar, setEstudianteEditar] = useState<Estudiante | null>(
    null
  );
  const [estudianteAEliminar, setEstudianteAEliminar] =
    useState<Estudiante | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "danger" | "info",
  });

  // Método para listar la data
  const cargarEstudiantes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await EstudianteService.listar();
      setEstudiantes(data);
    } catch (error) {
      console.error("Error al cargar estudiantes:", error);
      setError((error as Error).message || "Error al cargar los datos");
    } finally {
      setIsLoading(false);
    }
  };

  // Método para eliminar
  const confirmarEliminacion = async () => {
    if (!estudianteAEliminar) return;

    try {
      await EstudianteService.eliminar(estudianteAEliminar.idEstudiante!);
      await cargarEstudiantes();
      setEstudianteAEliminar(null);
      setToast({ show: true, message: "Estudiante eliminado", type: "danger" });

      const modalEl = document.getElementById("modalEliminar");
      if (modalEl) {
        const modal = Modal.getInstance(modalEl) || new Modal(modalEl);
        modal.hide();
      }
    } catch (error) {
      console.error("Error al eliminar estudiante:", error);
      setToast({ show: true, message: "Error al eliminar estudiante", type: "danger" });
    }
  };

  // Para abrir el modal
  const abrirModal = (id: string) => {
    const modalEl = document.getElementById(id);
    if (modalEl) {
      const modal = new Modal(modalEl);
      modal.show();
    }
    // Ocultar toast si está visible
    if (toast.show) {
      setToast({ ...toast, show: false });
    }
  };

  // Para cerrar el modal
  const cerrarModal = (id: string) => {
    const modalEl = document.getElementById(id);
    if (modalEl) {
      const modal = Modal.getInstance(modalEl) || new Modal(modalEl);
      modal.hide();
    }
  };

  // Llamamos a la función para cargar los datos
  useEffect(() => {
    cargarEstudiantes();
  }, []);

  return (
    <>
      {/* Modal del botón eliminar */}
      <ModalEliminar
        nombres={estudianteAEliminar?.nombres ?? ""}
        apellidos={estudianteAEliminar?.apellidos ?? ""}
        funcion={confirmarEliminacion}
        tipo="estudiante"
      />
      {/* Termina el Modal */}

      {/* Modal del botón agregar */}
      <ModalAgregar
        onClose={() => cerrarModal("modalAgregar")}
        titulo="Nuevo estudiante"
        icono="bi-pen-fill"
        colorHeader="bg-primary"
      >
        <FormEstudiante
          onSaved={() => {
            setToast({
              show: true,
              message: "Estudiante creado exitosamente",
              type: "success",
            });
            cargarEstudiantes();
            cerrarModal("modalAgregar"); // Código optimizado
          }}
          clearEdit={() => {}}
        />
      </ModalAgregar>
      {/* Termina el Modal */}

      {/* Modal del botón editar */}
      <ModalActualizar
        onClose={() => setEstudianteEditar(null)}
        titulo="Actualizar estudiante"
        icono="bi-person-lines-fill"
        colorHeader="bg-success"
      >
        <FormEstudiante
          onSaved={() => {
            setToast({
              show: true,
              message: "Estudiante actualizado exitosamente",
              type: "success",
            });
            cargarEstudiantes();
            setEstudianteEditar(null);
            cerrarModal("modalActualizar");
          }}
          estudianteEdit={estudianteEditar}
          clearEdit={() => setEstudianteEditar(null)}
        />
      </ModalActualizar>
      {/* Termina el Modal */}

      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-11">
            {/* Título y botón fuera de la card */}
            <div
              className="card border-0 shadow rounded-4 mb-4 p-4"
              style={{
                background:
                  "linear-gradient(90deg,rgb(39, 155, 78) 0%, #38f9d7 100%)",
              }}
            >
              <h4 className="fw-bold text-white mb-0">
                <i className="bi bi-person-circle me-2"></i>Estudiantes
              </h4>
            </div>
            <div className="card-body mb-4">
              <div className="d-flex justify-content-end mb-3">
                <button
                  className="btn btn-primary fw-semibold rounded-pill"
                  onClick={() => {
                    setEstudianteEditar(null);
                    abrirModal("modalAgregar");
                  }}
                >
                  <i className="bi bi-plus-circle me-2"></i>Agregar
                </button>
              </div>
            </div>
            {/* Tabla en card pequeña y clara */}
            <div className="card border-0 shadow rounded-4">
              <div className="card-body p-0">
                {isLoading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-3 text-muted">Cargando estudiantes...</p>
                  </div>
                ) : error ? (
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
                ) : (
                <div className="table-responsive">
                  <table className="table table-hover table-striped align-middle rounded-4 overflow-hidden mb-0">
                    <thead className="table-primary">
                      <tr>
                        <th className="text-center">Id</th>
                        <th>Nombres</th>
                        <th>Apellidos</th>
                        <th>Email</th>
                        <th className="text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {estudiantes.map((est) => (
                        <tr key={est.idEstudiante}>
                          <td className="text-center">{est.idEstudiante}</td>
                          <td>{est.nombres}</td>
                          <td>{est.apellidos}</td>
                          <td>{est.email}</td>
                          <td className="text-center">
                            <div className="d-flex justify-content-center gap-2">
                              <button
                                className="btn btn-outline-primary btn-sm rounded-pill fw-semibold"
                                onClick={() => {
                                  setEstudianteEditar(est);
                                  abrirModal("modalActualizar");
                                }}
                              >
                                <i className="bi bi-pencil-square me-1"></i>
                                Editar
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm rounded-pill fw-semibold"
                                onClick={() => setEstudianteAEliminar(est)}
                                data-bs-toggle="modal"
                                data-bs-target="#modalEliminar"
                              >
                                <i className="bi bi-trash-fill me-1"></i>
                                Eliminar
                              </button>
                            </div>
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
