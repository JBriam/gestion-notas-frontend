import api from "../api/axiosConfig";
import type { Estudiante } from "../interfaces/Estudiante";

export const EstudianteService = {
  async listar(): Promise<Estudiante[]> {
    const res = await api.get("/estudiante");
    return res.data;
  },

  async crear(estudiante: Estudiante): Promise<Estudiante> {
    const res = await api.post("/estudiante", estudiante);
    return res.data;
  },

  async actualizar(estudiante: Estudiante): Promise<Estudiante> {
    const res = await api.put(
      `/estudiante/${estudiante.idEstudiante}`,
      estudiante
    );
    return res.data;
  },

  async eliminar(id: number): Promise<void> {
    await api.delete(`/estudiante/${id}`);
  },
};
