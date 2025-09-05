import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Estudiantes from "../pages/Estudiantes";
import Cursos from "../pages/Cursos";
import Notas from "../pages/Notas";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/estudiantes" element={<Estudiantes />} />
      <Route path="/cursos" element={<Cursos />} />
      <Route path="/notas" element={<Notas />} />
    </Routes>
  );
}