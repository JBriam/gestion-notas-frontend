import { useState } from "react";
import { motion } from "framer-motion";
import FormNota from "../components/Forms/FormNota";
import ListNota from "../components/Lists/ListNota";
import Layout from "../components/Layout/Layout";

export default function Notas() {
  const [vista, setVista] = useState<"lista" | "formulario">("lista");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleNotaGuardada = () => {
    setRefreshKey(prev => prev + 1); // Forza la actualización de la lista
    setVista("lista"); // Cambiar a la vista de lista después de guardar
  };

  return (
    <Layout>
      <div className="container-fluid px-0">
        <motion.div
          className="container py-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Header con navegación */}
          <motion.div
            className="card-header border-0 shadow rounded-4 mb-4 p-4"
            style={{
              background: "linear-gradient(90deg,rgb(39, 93, 155) 0%,rgb(56, 204, 249) 100%)",
            }}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="fw-bold text-white mb-0">
                  <i className="bi bi-clipboard-data-fill me-2"></i>
                  Gestión de Notas
                </h2>
                <p className="text-white-50 mb-0 mt-1">
                  {vista === "lista" 
                    ? "Visualiza y administra todas las notas registradas" 
                    : "Registra una nueva nota para un estudiante"
                  }
                </p>
              </div>
              
              {/* Botones de navegación */}
              <div className="d-flex gap-2">
                <button
                  className={`btn ${vista === "lista" ? "btn-light" : "btn-outline-light"}`}
                  onClick={() => setVista("lista")}
                >
                  <i className="bi bi-list-ul me-2"></i>
                  Ver Lista
                </button>
                <button
                  className={`btn ${vista === "formulario" ? "btn-light" : "btn-outline-light"}`}
                  onClick={() => setVista("formulario")}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Nueva Nota
                </button>
              </div>
            </div>
          </motion.div>

          {/* Contenido dinámico */}
          <motion.div
            key={vista + refreshKey} // Key para forzar re-render cuando cambia la vista o se actualiza
            initial={{ opacity: 0, x: vista === "lista" ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {vista === "lista" ? (
              <ListNota key={refreshKey} />
            ) : (
              <div className="card border-0 shadow rounded-4">
                <div className="card-body p-0">
                  <FormNota onSaved={handleNotaGuardada} />
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
}