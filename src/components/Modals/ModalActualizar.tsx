type ModalActualizarProps = {
  onClose: () => void;
  children: React.ReactNode;
  titulo?: string;
  icono?: string;
  colorHeader?: string;
};

export function ModalActualizar({
  onClose,
  children,
  titulo = "Actualizar",
  icono = "bi-pencil-square",
  colorHeader = "bg-success",
}: ModalActualizarProps) {
  return (
    <div
      className="modal fade"
      id="modalActualizar"
      tabIndex={-1}
      aria-labelledby="modalActualizarLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className={`modal-header ${colorHeader} text-white`}>
            <h5 className="mb-0" id="modalActualizarLabel">
              <i className={`bi ${icono} me-2`}></i>
              {titulo}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>
  );
}
