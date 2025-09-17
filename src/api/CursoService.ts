import api from "../api/axiosConfig";
import type { Curso } from "../interfaces/Curso";

export const CursoService = {
  async listar(): Promise<Curso[]> {
    const res = await api.get("/curso");
    return res.data;
  },

  async crear(curso: Curso): Promise<Curso> {
    const res = await api.post("/curso", curso);
    return res.data;
  },

  async actualizar(curso: Curso): Promise<Curso> {
    const res = await api.put(`/curso/${curso.idCurso}`, curso);
    return res.data;
  },

  async eliminar(id: number): Promise<void> {
    await api.delete(`/curso/${id}`);
  },
};
