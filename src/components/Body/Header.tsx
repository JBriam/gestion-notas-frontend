import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../../assets/logo.png";

// Animaciones para los ítems del menú
const navItemVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

// Contenedor del menú animado (efecto escalonado)
const navContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.1,
    },
  },
};

export default function Header() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-dark shadow-sm sticky-top"
    >
      <nav className="navbar navbar-expand-lg navbar-dark container">
        {/* Logo + nombre */}
        <NavLink className="navbar-brand d-flex align-items-center" to="/">
          <img
            src={logo}
            alt="Logo"
            width={40}
            height={40}
            className="me-2"
          />
          <span className="fw-bold fs-6 text-white">Cambridge College</span>
        </NavLink>

        {/* Botón hamburguesa */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#main-navbar"
          aria-controls="main-navbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menú colapsable con animaciones */}
        <div className="collapse navbar-collapse" id="main-navbar">
          <motion.ul
            className="navbar-nav ms-auto"
            variants={navContainerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.li className="nav-item" variants={navItemVariants}>
              <NavLink className="nav-link" to="/">
                <i className="bi bi-speedometer2 me-1"></i> Dashboard
              </NavLink>
            </motion.li>
            <motion.li className="nav-item" variants={navItemVariants}>
              <NavLink className="nav-link" to="/estudiantes">
                <i className="bi bi-people-fill me-1"></i> Estudiantes
              </NavLink>
            </motion.li>
            <motion.li className="nav-item" variants={navItemVariants}>
              <NavLink className="nav-link" to="/cursos">
                <i className="bi bi-book-fill me-1"></i> Cursos
              </NavLink>
            </motion.li>
            <motion.li className="nav-item" variants={navItemVariants}>
              <NavLink className="nav-link" to="/notas">
                <i className="bi bi-pencil-square me-1"></i> Registrar Nota
              </NavLink>
            </motion.li>
          </motion.ul>
        </div>
      </nav>
    </motion.header>
  );
}
