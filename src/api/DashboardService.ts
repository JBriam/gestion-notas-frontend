import api from "./axiosConfig";
import type { EstudianteConNotasDTO, CursoConNotasDTO } from "../interfaces/Dashboard";

export const DashboardService = {
    async getEstudiantesConNotas(): Promise<EstudianteConNotasDTO[]> {
    const res = await api.get("/dashboard/estudiantes");
    return res.data;
  },

  async getCursosConNotas(): Promise<CursoConNotasDTO[]> {
    const res = await api.get("/dashboard/cursos");
    return res.data;
  },

  async getEstudianteConNotasById(id: number): Promise<EstudianteConNotasDTO> {
    const res = await api.get(`/dashboard/estudiante/${id}`);
    return res.data;
  },

  async getCursoConNotasById(id: number): Promise<CursoConNotasDTO> {
    const res = await api.get(`/dashboard/curso/${id}`);
    return res.data;
  }
};
