import { useEffect, useState } from "react";
import type { Curso } from "../../interfaces/Curso";
import api from "../../api/axiosConfig";
import FormCurso from "../Forms/FormCurso";
import { Modal } from "bootstrap";
import { ModalAgregar } from "../Modals/ModalAgregar";
import { ModalActualizar } from "../Modals/ModalActualizar";
import { ModalEliminar } from "../Modals/ModalEliminar";
import { CursoService } from "../../api/CursoService";
import ToastMessage from "../Modals/ToastMessage";

export default function ListCurso() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cursoEditar, setCursoEditar] = useState<Curso | null>(null);
  const [cursoAEliminar, setCursoAEliminar] = useState<Curso | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "danger" | "info",
  });

  // Método para listar la data
  const cargarCursos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await CursoService.listar();
      setCursos(data);
    } catch (error) {
      console.error("Error al cargar cursos:", error);
      setError((error as Error).message || "Error al cargar los datos");
    } finally {
      setIsLoading(false);
    }
  };

  // Método para eliminar
  const confirmarEliminacion = async () => {
    if (!cursoAEliminar) return;

    try {
      await api.delete(`/curso/${cursoAEliminar.idCurso}`);
      await cargarCursos();
      setCursoAEliminar(null);
      setToast({ show: true, message: "Curso eliminado", type: "danger" });

      const modalEl = document.getElementById("modalEliminar");
      if (modalEl) {
        const modal = Modal.getInstance(modalEl) || new Modal(modalEl);
        modal.hide();
      }
    } catch (error) {
      console.error("Error al eliminar curso:", error);
    }
  };

  // Para abrir el modal
  const abrirModal = (id: string) => {
    const modalEl = document.getElementById(id);
    if (modalEl) {
      const modal = new Modal(modalEl);
      modal.show();
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
    cargarCursos();
  }, []);

  return (
    <>
      {/* Modal del botón eliminar */}
      <ModalEliminar
        nombres={cursoAEliminar?.nombre ?? ""}
        funcion={confirmarEliminacion}
        tipo="curso"
      />
      {/* Termina el Modal */}

      {/* Modal del botón agregar */}
      <ModalAgregar
        onClose={() => cerrarModal("modalAgregar")}
        titulo="Nuevo curso"
        icono="bi-journal-plus"
        colorHeader="bg-primary"
      >
        <FormCurso
          onSaved={() => {
            cargarCursos();
            cerrarModal("modalAgregar"); // Código optimizado
            setToast({
              show: true,
              message: "Curso agregado",
              type: "success",
            });
          }}
          clearEdit={() => {}}
        />
      </ModalAgregar>
      {/* Termina el Modal */}

      {/* Modal del botón editar */}
      <ModalActualizar
        onClose={() => setCursoEditar(null)}
        titulo="Actualizar curso"
        icono="bi-journal-bookmark-fill"
        colorHeader="bg-success"
      >
        <FormCurso
          onSaved={() => {
            cargarCursos();
            setCursoEditar(null);
            cerrarModal("modalActualizar");
            setToast({
              show: true,
              message: "Datos actualizados",
              type: "info",
            });
          }}
          cursoEdit={cursoEditar}
          clearEdit={() => setCursoEditar(null)}
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
                  "linear-gradient(90deg,rgb(155, 85, 39) 0%,rgb(249, 172, 56) 100%)",
              }}
            >
              <h4 className="fw-bold text-white mb-0">
                <i className="bi bi-book-half me-2"></i>Cursos
              </h4>
            </div>
            <div className="card-body mb-4">
              <div className="d-flex justify-content-end mb-3">
                <button
                  className="btn btn-primary fw-semibold rounded-pill"
                  onClick={() => {
                    setCursoEditar(null); // Limpia el formulario
                    setToast({ ...toast, show: false }); // Oculta el Toast si está visible
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
                    <p className="mt-3 text-muted">Cargando cursos...</p>
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
                        <th>Curso</th>
                        <th className="text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cursos.map((cur) => (
                        <tr key={cur.idCurso}>
                          <td className="text-center">{cur.idCurso}</td>
                          <td>{cur.nombre}</td>
                          <td className="text-center">
                            <div className="d-flex justify-content-center gap-2">
                              <button
                                className="btn btn-outline-primary btn-sm rounded-pill fw-semibold"
                                onClick={() => {
                                  setCursoEditar(cur);
                                  abrirModal("modalActualizar");
                                }}
                              >
                                <i className="bi bi-pencil-square me-1"></i>
                                Editar
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm rounded-pill fw-semibold"
                                onClick={() => {
                                  setCursoAEliminar(cur);
                                }}
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
      <ToastMessage
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </>
  );
}
