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
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Esto permite cargar los datos del estudiante al hacer clic en Editar
  useEffect(() => {
    if (estudianteEdit) setForm(estudianteEdit);
  }, [estudianteEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Manejar selección de archivo de foto
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida');
      return;
    }

    // Validar tamaño (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert('La imagen debe ser menor a 10MB');
      return;
    }

    // Guardar el archivo para enviarlo como FormData
    setFotoFile(file);

    // Crear preview
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFotoPreview(result);
      console.log('Foto cargada correctamente');
    };
    reader.onerror = (err) => {
      console.error("Error leyendo el archivo:", err);
      alert('Error al cargar la imagen');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validación básica
    if (!form.nombres.trim()) {
      alert('Los nombres son obligatorios');
      return;
    }
    if (!form.apellidos.trim()) {
      alert('Los apellidos son obligatorios');
      return;
    }
    if (!form.email?.trim()) {
      alert('El email es obligatorio');
      return;
    }
    if (!form.codigoEstudiante.trim()) {
      alert('El código de estudiante es obligatorio');
      return;
    }

    setLoading(true);
    try {
      if (estudianteEdit && form.idEstudiante) {
        // Para actualización
        console.log('Actualizando estudiante con ID:', form.idEstudiante);
        if (fotoFile) {
          const formData = new FormData();
          formData.append('idEstudiante', String(form.idEstudiante));
          formData.append('nombres', form.nombres.trim());
          formData.append('apellidos', form.apellidos.trim());
          formData.append('email', form.email.trim());
          formData.append('codigoEstudiante', form.codigoEstudiante.trim());
          formData.append('telefono', form.telefono?.trim() || '');
          formData.append('direccion', form.direccion?.trim() || '');
          formData.append('distrito', form.distrito?.trim() || '');
          formData.append('fechaNacimiento', form.fechaNacimiento || '');
          formData.append('foto', fotoFile);
          console.log('FormData enviado (con foto):', {
            idEstudiante: form.idEstudiante,
            nombres: form.nombres.trim(),
            apellidos: form.apellidos.trim(),
            email: form.email.trim(),
            codigoEstudiante: form.codigoEstudiante.trim(),
          });
          await EstudianteService.actualizar(formData);
        } else {
          console.log('Actualizando sin foto:', form);
          await EstudianteService.actualizar(form);
        }
      } else {
        // Para creación - siempre usar FormData
        console.log('Creando nuevo estudiante');
        const formData = new FormData();
        
        // Campos obligatorios
        formData.append('nombres', form.nombres.trim());
        formData.append('apellidos', form.apellidos.trim());
        const email = form.email?.trim();
        if (!email) {
          throw new Error('El email es obligatorio');
        }
        formData.append('email', email);
        formData.append('password', email); // Usar email como contraseña por defecto
        
        // Código de estudiante - solo si tiene valor
        if (form.codigoEstudiante?.trim()) {
          formData.append('codigoEstudiante', form.codigoEstudiante.trim());
        }
        
        // Campos opcionales - solo si tienen valor
        if (form.telefono?.trim()) {
          formData.append('telefono', form.telefono.trim());
        }
        if (form.direccion?.trim()) {
          formData.append('direccion', form.direccion.trim());
        }
        if (form.distrito?.trim()) {
          formData.append('distrito', form.distrito.trim());
        }
        if (form.fechaNacimiento) {
          formData.append('fechaNacimiento', form.fechaNacimiento);
        }
        
        // Foto opcional
        if (fotoFile) {
          formData.append('foto', fotoFile);
          console.log('Foto agregada al FormData:', fotoFile.name);
        }
        
        console.log('FormData enviado (creación):', {
          nombres: form.nombres.trim(),
          apellidos: form.apellidos.trim(),
          email: email,
          codigoEstudiante: form.codigoEstudiante?.trim() || '(auto-generado)',
          conFoto: !!fotoFile,
        });
        await EstudianteService.crear(formData);
      }
      
      // Éxito
      console.log('✅ Estudiante guardado exitosamente');
      alert('✅ Estudiante guardado exitosamente');
      onSaved();
      clearEdit();
      setForm({ nombres: "", apellidos: "", email: "", codigoEstudiante: "", foto: "" });
      setFotoFile(null);
      setFotoPreview("");
    } catch (error) {
      console.error("❌ Error al guardar estudiante:", error);
      const errorMessage = error instanceof Error ? error.message : 'Error al guardar el estudiante';
      console.error("Mensaje de error:", errorMessage);
      alert('❌ ' + errorMessage);
    } finally {
      setLoading(false);
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
        <div className="mb-3">
          <label className="form-label">Teléfono</label>
          <input
            type="tel"
            className="form-control mb-2"
            name="telefono"
            value={form.telefono || ""}
            onChange={handleChange}
            placeholder="Teléfono (opcional)"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Dirección</label>
          <input
            type="text"
            className="form-control mb-2"
            name="direccion"
            value={form.direccion || ""}
            onChange={handleChange}
            placeholder="Dirección (opcional)"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Distrito</label>
          <input
            type="text"
            className="form-control mb-2"
            name="distrito"
            value={form.distrito || ""}
            onChange={handleChange}
            placeholder="Distrito (opcional)"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Fecha de Nacimiento</label>
          <input
            type="date"
            className="form-control mb-2"
            name="fechaNacimiento"
            value={form.fechaNacimiento || ""}
            onChange={handleChange}
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
            disabled={loading}
          />
          
          {/* Vista previa de la imagen */}
          <div className="mt-3">
            {fotoPreview || form.foto ? (
              <div className="text-center">
                <img
                  src={fotoPreview || form.foto}
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
          <button className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Guardando...
              </>
            ) : (
              estudianteEdit ? "Actualizar" : "Registrar"
            )}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            data-bs-dismiss="modal"
            onClick={clearEdit}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
