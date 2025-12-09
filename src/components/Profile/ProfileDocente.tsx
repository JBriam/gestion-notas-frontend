import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { DocenteService } from "../../api/DocenteService";
import type { ActualizarPerfilDocenteRequest } from "../../interfaces/Auth";
import "./Profile.css";

interface Especialidad {
  id: number;
  nombre: string;
}

interface Distrito {
  id: number;
  nombre: string;
}

export const ProfileDocente: React.FC = () => {
  const { state, updateProfile } = useAuth();
  const [formData, setFormData] = useState<ActualizarPerfilDocenteRequest>({
    nombres: "",
    apellidos: "",
    telefono: "",
    direccion: "",
    distrito: "",
    foto: "",
    fechaContratacion: "",
    especialidad: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [distritos, setDistritos] = useState<Distrito[]>([]);
  useEffect(() => {
    const obtenerDistritos = async () => {
      try {
        const solicitud = await fetch("distritos.json");
        const respuesta = await solicitud.json();
        setDistritos(respuesta.distritos);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    obtenerDistritos();
  }, []);

  const [especialidad, setEspecialidad] = useState<Especialidad[]>([]);
  useEffect(() => {
    const obtenerEspecialidad = async () => {
      try {
        const solicitud = await fetch("especialidad.json");
        const respuesta = await solicitud.json();
        setEspecialidad(respuesta.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    obtenerEspecialidad();
  }, []);

  // Cargar datos del perfil al montar el componente
  useEffect(() => {
    if (state.perfilDocente) {
      setFormData({
        nombres: state.perfilDocente.nombres || "",
        apellidos: state.perfilDocente.apellidos || "",
        telefono: state.perfilDocente.telefono || "",
        direccion: state.perfilDocente.direccion || "",
        distrito: state.perfilDocente.distrito || "",
        foto: state.perfilDocente.foto || "",
        fechaContratacion: state.perfilDocente.fechaContratacion || "",
        especialidad: state.perfilDocente.especialidad || "",
        email: state.perfilDocente.email || "",
      });
    }
  }, [state.perfilDocente]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.perfilDocente?.idDocente) {
      setError("No se encontró el ID del docente");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const perfilActualizado = await DocenteService.actualizarPerfil(
        state.perfilDocente.idDocente,
        formData,
        fotoFile || undefined
      );

      // Actualizar el contexto con los nuevos datos
      updateProfile(undefined, perfilActualizado);

      setSuccess("Perfil actualizado correctamente");
      setIsEditing(false);
      setFotoFile(null);
      setImagePreview(null);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Error al actualizar el perfil"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Restaurar los datos originales
    if (state.perfilDocente) {
      setFormData({
        nombres: state.perfilDocente.nombres || "",
        apellidos: state.perfilDocente.apellidos || "",
        telefono: state.perfilDocente.telefono || "",
        direccion: state.perfilDocente.direccion || "",
        distrito: state.perfilDocente.distrito || "",
        foto: state.perfilDocente.foto || "",
        fechaContratacion: state.perfilDocente.fechaContratacion || "",
        especialidad: state.perfilDocente.especialidad || "",
        email: state.perfilDocente.email || "",
      });
    }
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Por favor selecciona un archivo de imagen válido");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          let width = img.width;
          let height = img.height;
          const maxSize = 100;

          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
          // Solo guardar la vista previa, NO en formData.foto
          setImagePreview(compressedBase64);
          setFotoFile(file);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFotoFile(null);
    const fileInput = document.getElementById("foto") as HTMLInputElement;
    const fileInputEdit = document.getElementById(
      "foto-edit"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
    if (fileInputEdit) fileInputEdit.value = "";
  };

  if (!state.perfilDocente) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <h2>Perfil no encontrado</h2>
          <p>No se pudo cargar la información del perfil del docente.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <img
              src={state.perfilDocente.foto || "/assets/imgs/docente.png"}
              alt="Foto de perfil"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/assets/imgs/docente.png";
              }}
            />
          </div>
          <div className="profile-info">
            <h2>{`${formData.nombres} ${formData.apellidos}`}</h2>
            <p className="profile-role">Docente</p>
            <p className="profile-code">
              Código: {state.perfilDocente.codigoDocente || "No asignado"}
            </p>
          </div>
          <div className="profile-actions">
            {!isEditing ? (
              <button
                type="button"
                className="edit-button"
                onClick={() => setIsEditing(true)}
              >
                Editar Perfil
              </button>
            ) : (
              <div className="edit-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombres">Nombres</label>
              <input
                type="text"
                id="nombres"
                name="nombres"
                value={formData.nombres}
                onChange={handleInputChange}
                disabled={!isEditing || loading}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="apellidos">Apellidos</label>
              <input
                type="text"
                id="apellidos"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleInputChange}
                disabled={!isEditing || loading}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || ""}
                onChange={handleInputChange}
                disabled={!isEditing || loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                disabled={!isEditing || loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="especialidad">Especialidad</label>
              <select
                value={formData.especialidad}
                onChange={(e) =>
                  setFormData({ ...formData, especialidad: e.target.value })
                }
                disabled={!isEditing || loading}
              >
                <option value="">Selecciona una especialidad</option>
                {especialidad.map((esp: Especialidad) => (
                  <option key={esp.id} value={esp.nombre}>
                    {esp.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Distrito</label>
              <select
                value={formData.distrito}
                onChange={(e) =>
                  setFormData({ ...formData, distrito: e.target.value })
                }
                disabled={!isEditing || loading}
              >
                <option value="">Selecciona un distrito</option>
                {distritos.map((distrito: Distrito) => (
                  <option key={distrito.id} value={distrito.nombre}>
                    {distrito.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="fechaContratacion">Fecha de Contratación</label>
              <input
                type="date"
                id="fechaContratacion"
                name="fechaContratacion"
                value={formData.fechaContratacion}
                onChange={handleInputChange}
                disabled={!isEditing || loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="direccion">Dirección</label>
            <textarea
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
              disabled={!isEditing || loading}
              style={{ resize: "none" }}
              placeholder="Ingrese su dirección"
            />
          </div>

          <div className="form-group">
            <label>Foto del Estudiante</label>
            <div className="image-upload-section">
              <div className="image-input-group">
                <input
                  type="file"
                  id="foto-edit"
                  name="foto"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={!isEditing || loading}
                  style={{ padding: "8px", marginBottom: "10px" }}
                />
              </div>
              {(imagePreview || formData.foto) && (
                <div
                  style={{
                    marginTop: "10px",
                    textAlign: "center",
                    position: "relative",
                    display: "inline-block",
                  }}
                >
                  <img
                    src={imagePreview || formData.foto}
                    alt="Preview"
                    style={{
                      maxWidth: "100px",
                      maxHeight: "100px",
                      border: "2px solid #ddd",
                      borderRadius: "8px",
                      objectFit: "cover",
                    }}
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    style={{
                      position: "absolute",
                      top: "-8px",
                      right: "-8px",
                      background: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "24px",
                      height: "24px",
                      cursor: "pointer",
                      fontSize: "14px",
                      lineHeight: "1",
                      padding: "0",
                    }}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {isEditing && (
            <div className="form-actions">
              <button type="submit" className="save-button" disabled={loading}>
                {loading ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
