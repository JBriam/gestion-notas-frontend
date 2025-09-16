import { useState } from "react";
import Layout from "../components/Layout/Layout";
import DashboardPremium from "../components/Dashboard/DashboardPremium";
import DashboardStats from "../components/Dashboard/DashboardStats";
import gif from "../assets/imgs/student.gif";
import { motion } from "framer-motion";

export default function Home() {
  const [viewMode, setViewMode] = useState<"estudiantes" | "cursos">(
    "estudiantes"
  );

  return (
    <Layout>
      <div className="container-fluid px-0">
        {/* Hero Section - Sin card, más moderno */}
        <motion.section
          className="py-5 mb-5"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 text-white">
                <motion.h1
                  className="display-4 fw-bold mb-4"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  Sistema de Gestión de Notas
                </motion.h1>
                <motion.p
                  className="lead mb-4 opacity-75"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  Administra estudiantes, cursos y notas de manera eficiente y
                  profesional. Visualiza el rendimiento académico con nuestro
                  dashboard interactivo.
                </motion.p>
                <motion.div
                  className="d-flex flex-wrap gap-4 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <div className="d-flex align-items-center">
                    <div
                      className="bg-white bg-opacity-25 rounded-circle  d-flex align-items-center justify-content-center p-3 me-3"
                      style={{
                        width: "60px",
                        height: "60px",
                      }}
                    >
                      <i className="bi bi-people-fill fs-4 text-white"></i>
                    </div>
                    <div>
                      <h6 className="mb-0 fw-semibold">Estudiantes</h6>
                      <small className="opacity-75">Gestión completa</small>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div
                      className="bg-white bg-opacity-25 rounded-circle  d-flex align-items-center justify-content-center p-3 me-3"
                      style={{
                        width: "60px",
                        height: "60px",
                      }}
                    ></div>
                     <i className="bi bi-journal-bookmark-fill fs-4 text-white"></i>
                    </div>
                    <div>
                      <h6 className="mb-0 fw-semibold">Cursos</h6>
                      <small className="opacity-75">
                        Organización avanzada
                      </small>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div
                      className="bg-white bg-opacity-25 rounded-circle  d-flex align-items-center justify-content-center p-3 me-3"
                      style={{
                        width: "60px",
                        height: "60px",
                      }}
                    >
                      <i className="bi bi-clipboard-data-fill fs-4 text-white"></i>
                    </div>
                    <div>
                      <h6 className="mb-0 fw-semibold">Notas</h6>
                      <small className="opacity-75">
                        Seguimiento detallado
                      </small>
                    </div>
                  </div>
                </motion.div>
              </div>
              <div className="col-lg-6 text-center">
                <motion.div
                  className="position-relative"
                  animate={{
                    y: [0, -20, 0], // Animación flotante
                  }}
                  transition={{
                    duration: 3,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                >
                  <div
                    className="bg-white bg-opacity-20 backdrop-blur rounded-circle mx-auto"
                    style={{
                      width: "250px",
                      height: "250px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={gif}
                      alt="Estudiante animado"
                      style={{
                        width: "200px",
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "50%",
                        border: "4px solid rgba(255,255,255,0.3)",
                      }}
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>
