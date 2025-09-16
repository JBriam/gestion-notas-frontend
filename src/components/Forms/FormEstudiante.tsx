import { useEffect, useState } from "react";
import type { Estudiante } from "../../interfaces/Estudiante";
import { EstudianteService } from "../../api/EstudianteService";

interface Props {
  onSaved: () => void;
  estudianteEdit?: Estudiante | null;
  clearEdit: () => void;
}

export default function FormEstudiante({
  onSaved, // Función que se ejecuta cuando se guarda un estudiante (por ejemplo, tras registrar o actualizar).
  estudianteEdit, // Objeto del estudiante que se va a editar. Si no hay ninguno, es null o undefined.
  clearEdit, //	Función que se llama para limpiar la selección del estudiante que se está editando.
}: Props) {
  const [form, setForm] = useState<Estudiante>({
    nombres: "",
    apellidos: "",
    email: "",
  });

  // Esto permite cargar los datos del estudiante al hacer clic en Editar
  useEffect(() => {
    if (estudianteEdit) setForm(estudianteEdit);
  }, [estudianteEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (estudianteEdit) {
        await EstudianteService.actualizar(form); // PUT
      } else {
        await EstudianteService.crear(form); // POST
      }
      onSaved();
      clearEdit();
      setForm({ nombres: "", apellidos: "", email: "" });
    } catch (error) {
      console.error("Error al guardar estudiante:", error);
    }
  };

  return (
    <div className="table-responsive">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombres</label>
          <input
            type="text"
            className="form-control mb-2"
            name="nombres"
            value={form.nombres}
            onChange={handleChange}
            placeholder="Ingresa sus nombres"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Apellidos</label>
          <input
            type="text"
            className="form-control mb-2"
            name="apellidos"
            value={form.apellidos}
            onChange={handleChange}
            placeholder="Ingresa sus apellidos"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            className="form-control mb-2"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="email@example.com"
            required
          />
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary">
            {estudianteEdit ? "Actualizar" : "Registrar"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            data-bs-dismiss="modal"
            onClick={clearEdit}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
