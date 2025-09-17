import api from "./axiosConfig";
import type { Nota } from "../interfaces/Nota";

export const NotaService = {
  async listar(): Promise<Nota[]> {
    const res = await api.get("/notas");
    return res.data;
  },

  async crear(nota: unknown): Promise<Nota> {
    const res = await api.post("/notas", nota);
    return res.data;
  },

  async actualizar(nota: Nota): Promise<Nota> {
    const res = await api.put(`/notas/${nota.idNota}`, nota);
    return res.data;
  },

  async eliminar(id: number): Promise<void> {
    await api.delete(`/notas/${id}`);
  },
};
