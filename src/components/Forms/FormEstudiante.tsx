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
    codigoEstudiante: "",
    foto: "",
  });

  // Esto permite cargar los datos del estudiante al hacer clic en Editar
  useEffect(() => {
    if (estudianteEdit) setForm(estudianteEdit);
  }, [estudianteEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Leer archivo y convertir a base64 para enviarlo en el campo 'foto'
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida');
      return;
    }

    // Validar tamaño (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      alert('La imagen debe ser menor a 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      console.log('Foto cargada correctamente'); // Para debug
      setForm(prevForm => ({ ...prevForm, foto: result }));
    };
    reader.onerror = (err) => {
      console.error("Error leyendo el archivo:", err);
      alert('Error al cargar la imagen');
    };
    reader.readAsDataURL(file);
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
      setForm({ nombres: "", apellidos: "", email: "", codigoEstudiante: "", foto: "" });
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
          <label className="form-label">Código de estudiante</label>
          <input
            type="text"
            className="form-control mb-2"
            name="codigoEstudiante"
            value={form.codigoEstudiante as string}
            onChange={handleChange}
            placeholder="Código único"
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
        {/* Campo para la foto */}
        <div className="mb-3">
          <label className="form-label d-block">Foto del estudiante</label>
          <input
            type="file"
            accept="image/*"
            className="form-control mb-2"
            onChange={handleFileChange}
          />
          
          {/* Vista previa de la imagen */}
          <div className="mt-3">
            {form.foto ? (
              <div className="text-center">
                <img
                  src={form.foto}
                  alt="Vista previa"
                  className="img-thumbnail"
                  style={{ 
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "8px"
                  }}
                />
                <div className="mt-2">
                  <small className="text-muted">Vista previa de la imagen</small>
                </div>
              </div>
            ) : (
              <div className="text-center border rounded p-3">
                <i className="bi bi-image text-muted fs-3 d-block mb-2"></i>
                <small className="text-muted">No hay imagen seleccionada</small>
              </div>
            )}
          </div>
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
