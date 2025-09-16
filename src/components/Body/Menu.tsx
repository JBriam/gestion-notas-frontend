import {Link, useLocation} from "react-router-dom";

export default function Menu() {
  const location = useLocation();

  return (
    <ul className="navbar-nav ms-auto mb-2 mb-lg-0 custom-menu">
      <li className="nav-item mx-2">
        <Link className={`nav-link fw-semibold ${location.pathname === "/" ? "active text-primary" : "text-white"}`} to="/">
          <i className="bi bi-house-door-fill me-1"></i>Inicio
        </Link>
      </li>
      <li className="nav-item mx-2">
        <Link className={`nav-link fw-semibold ${location.pathname === "/estudiantes" ? "active text-primary" : "text-white"}`} to="/estudiantes">
          <i className="bi bi-people-fill me-1"></i>Estudiantes
        </Link>
      </li>
      <li className="nav-item mx-2">
        <Link className={`nav-link fw-semibold ${location.pathname === "/cursos" ? "active text-primary" : "text-white"}`} to="/cursos">
          <i className="bi bi-journal-bookmark-fill me-1"></i>Cursos
        </Link>
      </li>
      <li className="nav-item mx-2">
        <Link className={`nav-link fw-semibold ${location.pathname === "/notas" ? "active text-primary" : "text-white"}`} to="/notas">
          <i className="bi bi-clipboard-data-fill me-1"></i>Notas
        </Link>
      </li>
    </ul>
  );
}
