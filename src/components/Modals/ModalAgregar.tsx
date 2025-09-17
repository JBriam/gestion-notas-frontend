type ModalProps = {
  onClose: () => void;
  children: React.ReactNode;
  titulo: string;
  icono: string;
  colorHeader?: string; // opcional, para cambiar el color del header
};

export function ModalAgregar({ onClose, children, titulo, icono, colorHeader = "bg-primary" }: ModalProps) {
  return (
    <div className="modal fade" id="modalAgregar" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className={`modal-header ${colorHeader} text-white`}>
            <h5 className="mb-0">
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
