import { useEffect, useState } from "react";
import type { Curso } from "../../interfaces/Curso";
import { CursoService } from "../../api/CursoService";

interface Props {
  onSaved: () => void;
  cursoEdit?: Curso | null;
  clearEdit: () => void;
}

export default function FormCurso({
  onSaved, // Función que se ejecuta cuando se guarda un curso (por ejemplo, tras registrar o actualizar).
  cursoEdit, // Objeto del curso que se va a editar. Si no hay ninguno, es null o undefined.
  clearEdit, //	Función que se llama para limpiar la selección del curso que se está editando.
}: Props) {
  const [form, setForm] = useState<Curso>({
    nombre: "",
  });

  // Esto permite cargar los datos del curso al hacer clic en Editar
  useEffect(() => {
    if (cursoEdit) {
      setForm(cursoEdit);
    } else {
      setForm({ nombre: "" }); // Limpia el formulario al agregar
    }
  }, [cursoEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (cursoEdit) {
        await CursoService.actualizar(form); // PUT
      } else {
        console.log("Enviando datos:", form);
        await CursoService.crear(form); // POST
      }
      console.log("Curso guardado");
      onSaved();
      clearEdit();
      setForm({ nombre: "" });
    } catch (error) {
      console.error("Error al guardar curso:", error);
    }
  };

  return (
    <div className="table-responsive">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            className="form-control mb-2"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Ingresa el nombre del curso"
            required
          />
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary">
            {cursoEdit ? "Actualizar" : "Registrar"}
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
