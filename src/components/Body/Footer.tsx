import Cards from "./Cards";
import foto1 from "../../assets/imgs/rector.jpeg";
import foto2 from "../../assets/imgs/administrativa.jpeg";
import foto3 from "../../assets/imgs/docente.png";

export default function Footer() {
  return (
    <>
      <section className="container py-5 mb-5">
        <h4 className="text-center mb-5 text-primary fw-bold">Nuestro equipo</h4>
        <div className="row justify-content-center g-4">
          <div className="col-12 col-sm-6 col-md-4 d-flex justify-content-center">
            <Cards foto={foto1} nombre="Mariano Estrada" contenido="Rector" />
          </div>
          <div className="col-12 col-sm-6 col-md-4 d-flex justify-content-center">
            <Cards foto={foto2} nombre="Rocío Loza" contenido="Administrativa" />
          </div>
          <div className="col-12 col-sm-6 col-md-4 d-flex justify-content-center">
            <Cards foto={foto3} nombre="Edilberto Núñez" contenido="Docente" />
          </div>
        </div>
      </section>
      <footer className="bg-dark text-white text-center p-3 mt-0">
        <div className="container">
          <small>
            &copy; 2025 Sistema de Notas - Todos los derechos reservados
          </small>
        </div>
      </footer>
    </>
  );
}
