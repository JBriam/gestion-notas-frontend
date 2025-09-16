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
        ></motion.section>