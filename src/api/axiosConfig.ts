// src/api/axiosConfig.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // Esto conecta con el backend
});

export default api;