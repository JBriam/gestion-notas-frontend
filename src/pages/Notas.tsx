import { motion } from "framer-motion";
import FormNota from "../components/Forms/FormNota";
import Layout from "../components/Layout/Layout";

export default function Notas() {
  return (
    <Layout>
      <motion.div
        className="container py-5"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="p-4 bg-light rounded shadow-sm"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.h1
            className="mb-3 border-bottom pb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Página de Notas
          </motion.h1>
          <motion.p
            className="text-muted mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            </motion.p>
          <FormNota />
        </motion.div>
      </motion.div>
    </Layout>
  );
}