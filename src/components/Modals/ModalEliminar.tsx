type ModalEliminarProps = {
  nombres: string;
  apellidos?: string; // Opcional para cursos
  funcion: () => void;
  tipo: "estudiante" | "curso";
};

export function ModalEliminar({
  nombres,
  apellidos,
  funcion,
  tipo,
}: ModalEliminarProps) {
  // Define textos e iconos según el tipo
  const titulo =
    tipo === "curso" ? "Eliminar curso" : "Eliminar estudiante";
  const icono =
    tipo === "curso"
      ? "bi-journal-x-fill"
      : "bi-exclamation-triangle-fill";
  const entidad =
    tipo === "curso"
      ? `el curso "${nombres}"`
      : `al estudiante ${nombres} ${apellidos ?? ""}`;

  return (
    <div
      className="modal fade"
      id="modalEliminar"
      tabIndex={-1}
      aria-labelledby="modalEliminarLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-danger text-white">
            <h1 className="modal-title fs-5" id="modalEliminarLabel">
              <i className={`bi ${icono} me-2`}></i>
              {titulo}
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            ¿Estás seguro de eliminar <b>{entidad}</b>?
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-danger"
              data-bs-dismiss="modal"
              onClick={funcion}
            >
              Aceptar
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
