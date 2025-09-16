import { motion } from "framer-motion";
import Layout from "../components/Layout/Layout";
import ListEstudiante from "../components/Lists/ListEstudiante";
export default function Estudiantes() {
  return (
    <Layout>
      <motion.div
        className="container mt-5 p-4 bg-light rounded shadow-sm"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.h1
          className="mb-3 border-bottom pb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Página de Estudiantes
        </motion.h1>
        <motion.p
          className="text-muted mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        ></motion.p>
        Aquí puedes ver la lista de estudiantes.
        </motion.p>
        <ListEstudiante />
      </motion.div>
    </Layout>
  );
}