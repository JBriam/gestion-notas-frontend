import { motion } from "framer-motion";
import Layout from "../components/Layout/Layout";
import ListCurso from "../components/Lists/ListCurso";

export default function Cursos() {
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
          Página de Cursos
        </motion.h1>
        <motion.p
          className="text-muted mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Aquí puedes ver la lista de cursos.
        </motion.p>
        <ListCurso />
      </motion.div>
    </Layout>
  );
}
