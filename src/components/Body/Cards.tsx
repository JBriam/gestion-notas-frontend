import "../../styles/style.css";

type CardsProps = {
  foto: string;
  nombre: string;
  contenido: string;
};

export default function Cards({ foto, nombre, contenido }: CardsProps) {
  return (
    <div className="tarjeta text-center p-4 bg-white rounded-4 shadow-sm h-100">
      <img
        src={foto}
        alt="Colaborador"
        style={{ width: "120px", height: "120px", objectFit: "cover", background: "#f8fafc" }}
        className="rounded-circle mb-3 shadow"
      />
      <h5 className="fw-bold text-primary mb-1">{nombre}</h5>
      <p className="text-secondary mb-0">{contenido}</p>
    </div>
  );
}
