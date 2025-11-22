import React, { useState, useEffect } from "react";
import { DocenteService } from "../../api/DocenteService";
import type { Docente } from "../../interfaces/Docente";
import { useValidation } from "../../utils/validation/useValidation";
import { docenteSchema } from "../../utils/validation/schemas";
import "./DocenteManagement.css";

interface DocenteForm extends Record<string, unknown> {
  nombres: string;
  apellidos: string;
  telefono: string;
  direccion: string;
  distrito: string;
  foto: string;
  especialidad: string;
  fechaContratacion: string;
  codigoDocente: string;
  email: string;
  password?: string;
  confirmPassword?: string;
}

const DocenteManagement: React.FC = () => {
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Estados para modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDocente, setSelectedDocente] = useState<Docente | null>(null);

  // Estado para formularios
  const [formData, setFormData] = useState<DocenteForm>({
    nombres: "",
    apellidos: "",
    telefono: "",
    direccion: "",
    distrito: "",
    foto: "",
    especialidad: "",
    fechaContratacion: "",
    codigoDocente: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDocentes, setFilteredDocentes] = useState<Docente[]>([]);

  // Estado para preview de imagen
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fotoFile, setFotoFile] = useState<File | null>(null);

  // Hook de validación
  const {
    errors: validationErrors,
    validateField,
    validateForm,
    clearAllErrors,
    setError: setValidationError,
    clearError: clearValidationError,
  } = useValidation(docenteSchema, formData, { mode: "onChange" });

  // Debug: ver errores en tiempo real

  useEffect(() => {
    cargarDocentes();
  }, []);

  useEffect(() => {
    // Filtrar docentes cuando cambie el término de búsqueda
    if (searchTerm) {
      const filtered = docentes.filter(
        (docente) =>
          `${docente.nombres} ${docente.apellidos}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          docente.especialidad
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          docente.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDocentes(filtered);
    } else {
      setFilteredDocentes(docentes);
    }
  }, [searchTerm, docentes]);

  const cargarDocentes = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await DocenteService.listar();
      setDocentes(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Error al cargar docentes"
      );
    } finally {
      setLoading(false);
    }
  };

  const limpiarFormulario = () => {
    setFormData({
      nombres: "",
      apellidos: "",
      telefono: "",
      direccion: "",
      distrito: "",
      foto: "",
      especialidad: "",
      fechaContratacion: "",
      codigoDocente: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validar campo inmediatamente
    const fieldError = validateField(name, value);

    if (fieldError) {
      setValidationError(name, fieldError);
    } else {
      clearValidationError(name);
    }
  };

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
          setFormData((prev) => ({ ...prev, foto: compressedBase64 }));
          setImagePreview(compressedBase64);
          setFotoFile(file);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, foto: "" }));
    setImagePreview(null);
    setFotoFile(null);
    // Resetear el input file para permitir seleccionar la misma imagen
    const fileInput = document.getElementById("foto") as HTMLInputElement;
    const fileInputEdit = document.getElementById(
      "foto-edit"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
    if (fileInputEdit) fileInputEdit.value = "";
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
        const isValid = validateForm();
        if (!isValid) {
          setError("Por favor corrige los errores en el formulario");
          setLoading(false);
          return;
        }
    
        try {
          if (
            !formData.email ||
            !formData.password ||
            !formData.nombres ||
            !formData.apellidos ||
            !formData.especialidad
          ) {
            setError(
              "Los campos email, contraseña, nombres, apellidos y especialidad son obligatorios"
            );
            return;
          }
    
          if (formData.password && formData.password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            return;
          }
    
          if (formData.password !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
          }
    
          setLoading(true);
    
          const fd = new FormData();
    
          fd.append("email", formData.email);
          fd.append("password", formData.password);
          fd.append("nombres", formData.nombres);
          fd.append("apellidos", formData.apellidos);
          fd.append("especialidad", formData.especialidad);
    
          if (formData.telefono) fd.append("telefono", formData.telefono);
          if (formData.direccion) fd.append("direccion", formData.direccion);
          if (formData.distrito) fd.append("distrito", formData.distrito);
          if (formData.fechaContratacion)
            fd.append("fechaContratacion", formData.fechaContratacion);
          if (formData.codigoDocente)
            fd.append("codigoDocente", formData.codigoDocente);
    
          if (fotoFile) {
            fd.append("foto", fotoFile);
          }
    
          const created = await DocenteService.crear(fd);
    
          setSuccess("Docente creado exitosamente");
    
          if (created && created.foto) {
            setImagePreview(created.foto as string);
            setFormData((prev) => ({ ...prev, foto: created.foto as string }));
          }
    
          setShowCreateModal(false);
          clearAllErrors();
          resetForm();
          await cargarDocentes();
        } catch (error) {
          console.error("Error al crear docente:", error);
          setError(
            error instanceof Error ? error.message : "Error al crear el docente"
          );
        } finally {
          setLoading(false);
        }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDocente) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Crear FormData para enviar archivo
      const formDataToSend = new FormData();
      formDataToSend.append("idDocente", selectedDocente.idDocente.toString());

      Object.keys(formData).forEach((key) => {
        if (key !== "foto" && key !== "password" && key !== "confirmPassword") {
          const value = formData[key as keyof DocenteForm];
          if (value) {
            formDataToSend.append(key, value as string);
          }
        }
      });

      // Añadir archivo si existe
      if (fotoFile) {
        formDataToSend.append("foto", fotoFile);
      }

      await DocenteService.actualizar(formDataToSend);
      setSuccess("Docente actualizado exitosamente");
      setShowEditModal(false);
      setSelectedDocente(null);
      limpiarFormulario();
      setFotoFile(null);
      await cargarDocentes();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Error al actualizar docente"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedDocente) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await DocenteService.eliminar(selectedDocente.idDocente);
      setSuccess("Docente eliminado exitosamente");
      setShowDeleteModal(false);
      setSelectedDocente(null);
      await cargarDocentes();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Error al eliminar docente"
      );
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (docente: Docente) => {
    setSelectedDocente(docente);
    setFormData({
      nombres: docente.nombres,
      apellidos: docente.apellidos,
      telefono: docente.telefono || "",
      direccion: docente.direccion || "",
      distrito: docente.distrito || "",
      foto: docente.foto || "",
      especialidad: docente.especialidad || "",
      fechaContratacion: docente.fechaContratacion || "",
      codigoDocente: docente.codigoDocente || "",
      email: docente.email || "",
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (docente: Docente) => {
    setSelectedDocente(docente);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setFormData({
      nombres: "",
      apellidos: "",
      codigoDocente: "",
      telefono: "",
      foto: "",
      fechaContratacion: "",
      especialidad: "",
      direccion: "",
      distrito: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setImagePreview(null);
    setFotoFile(null);
    setSelectedDocente(null);
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedDocente(null);
    limpiarFormulario();
    setImagePreview(null);
    setFotoFile(null);
    setError("");
    setSuccess("");
  };

  return (
    <div className="docente-management">
      <div className="management-header">
        <h2>Gestión de Docentes</h2>
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar docentes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button
            className="btn-primary"
            onClick={() => setShowCreateModal(true)}
            disabled={loading}
          >
            + Agregar Docente
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando docentes...</p>
        </div>
      ) : (
        <div className="docentes-grid">
          {filteredDocentes.length === 0 ? (
            <div className="empty-state">
              <h3>No hay docentes registrados</h3>
              <p>Comienza agregando un nuevo docente al sistema.</p>
            </div>
          ) : (
            filteredDocentes.map((docente) => (
              <div key={docente.idDocente} className="docente-card">
                <div className="docente-header">
                  <img
                    src={docente.foto || "/assets/imgs/docente.png"}
                    alt={`${docente.nombres} ${docente.apellidos}`}
                    className="docente-avatar"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/assets/imgs/docente.png";
                    }}
                  />
                  <div className="docente-info">
                    <h3>{`${docente.nombres} ${docente.apellidos}`}</h3>
                    <p className="especialidad">
                      {docente.especialidad || "Sin especialidad"}
                    </p>
                  </div>
                </div>

                <div className="docente-details">
                  <div className="detail-row">
                    <span className="label">Email:</span>
                    <span>{docente.email || "Sin email"}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Teléfono:</span>
                    <span>{docente.telefono || "No registrado"}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Distrito:</span>
                    <span>{docente.distrito || "No registrado"}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Fecha contratación:</span>
                    <span>
                      {docente.fechaContratacion
                        ? new Date(
                            docente.fechaContratacion + "T00:00:00"
                          ).toLocaleDateString("es-PE")
                        : "No registrada"}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Estado:</span>
                    <span
                      className={`status ${
                        docente.usuarioActivo ? "active" : "inactive"
                      }`}
                    >
                      {docente.usuarioActivo ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </div>

                <div className="docente-actions">
                  <button
                    className="btn-edit"
                    onClick={() => openEditModal(docente)}
                    disabled={loading}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => openDeleteModal(docente)}
                    disabled={loading}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal Crear Docente */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header create-header">
              <h3>
                <i className="bi bi-person-plus-fill"></i>
                Agregar Nuevo Docente
              </h3>
              <button className="modal-close" onClick={closeModals}>
                ×
              </button>
            </div>

            <form onSubmit={handleCreate} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombres">Nombres *</label>
                  <input
                    type="text"
                    id="nombres"
                    name="nombres"
                    value={formData.nombres}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    className={validationErrors.nombres ? "input-error" : ""}
                  />
                  {validationErrors.nombres && (
                    <span className="error-text">
                      {validationErrors.nombres}
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="apellidos">Apellidos *</label>
                  <input
                    type="text"
                    id="apellidos"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    className={validationErrors.apellidos ? "input-error" : ""}
                  />
                  {validationErrors.apellidos && (
                    <span className="error-text">
                      {validationErrors.apellidos}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    placeholder="Ej: docente@ejemplo.com"
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    className={validationErrors.email ? "input-error" : ""}
                  />
                  {validationErrors.email && (
                    <span className="error-text">{validationErrors.email}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="telefono">Teléfono</label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    disabled={loading}
                    className={validationErrors.telefono ? "input-error" : ""}
                  />
                  {validationErrors.telefono && (
                    <span className="error-text">
                      {validationErrors.telefono}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Contraseña *</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="Mínimo 6 caracteres"
                    disabled={loading}
                    minLength={6}
                    className={validationErrors.password ? "input-error" : ""}
                  />
                  {validationErrors.password && (
                    <span className="error-text">
                      {validationErrors.password}
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <label>Confirmar Contraseña *</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    placeholder="Repite tu contraseña"
                    disabled={loading}
                    className={
                      validationErrors.confirmPassword ? "input-error" : ""
                    }
                  />
                  {validationErrors.confirmPassword && (
                    <span className="error-text">
                      {validationErrors.confirmPassword}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="especialidad">Especialidad</label>
                  <input
                    type="text"
                    id="especialidad"
                    name="especialidad"
                    value={formData.especialidad}
                    onChange={handleInputChange}
                    disabled={loading}
                    className={
                      validationErrors.especialidad ? "input-error" : ""
                    }
                  />
                  {validationErrors.especialidad && (
                    <span className="error-text">
                      {validationErrors.especialidad}
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="fechaContratacion">
                    Fecha de Contratación
                  </label>
                  <input
                    type="date"
                    id="fechaContratacion"
                    name="fechaContratacion"
                    value={formData.fechaContratacion}
                    onChange={handleInputChange}
                    disabled={loading}
                    className={
                      validationErrors.fechaContratacion ? "input-error" : ""
                    }
                  />
                  {validationErrors.fechaContratacion && (
                    <span className="error-text">
                      {validationErrors.fechaContratacion}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="distrito">Distrito</label>
                <input
                  type="text"
                  id="distrito"
                  name="distrito"
                  value={formData.distrito}
                  onChange={handleInputChange}
                  disabled={loading}
                  className={validationErrors.distrito ? "input-error" : ""}
                />
                {validationErrors.distrito && (
                  <span className="error-text">
                    {validationErrors.distrito}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="direccion">Dirección</label>
                <textarea
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  disabled={loading}
                  style={{ resize: "none" }}
                  className={validationErrors.direccion ? "input-error" : ""}
                />
                {validationErrors.direccion && (
                  <span className="error-text">
                    {validationErrors.direccion}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>Foto del Docente</label>
                <div className="image-upload-section">
                  <div className="image-input-group">
                    <input
                      type="file"
                      id="foto"
                      name="foto"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={loading}
                      style={{ padding: "8px", marginBottom: "10px" }}
                    />
                  </div>
                  {imagePreview && (
                    <div
                      style={{
                        marginTop: "10px",
                        textAlign: "center",
                        position: "relative",
                        display: "inline-block",
                      }}
                    >
                      <img
                        src={imagePreview}
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

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={closeModals}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? "Creando..." : "Crear Docente"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Docente */}
      {showEditModal && selectedDocente && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header edit-header">
              <h3>
                <i className="bi bi-pencil-square"></i>
                Editar Docente
              </h3>
              <button className="modal-close" onClick={closeModals}>
                ×
              </button>
            </div>

            <form onSubmit={handleEdit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombres">Nombres *</label>
                  <input
                    type="text"
                    id="nombres"
                    name="nombres"
                    value={formData.nombres}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="apellidos">Apellidos *</label>
                  <input
                    type="text"
                    id="apellidos"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    placeholder="Ej: docente@ejemplo.com"
                    onChange={handleInputChange}
                    required
                    disabled={loading}
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
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="especialidad">Especialidad</label>
                  <input
                    type="text"
                    id="especialidad"
                    name="especialidad"
                    value={formData.especialidad}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="fechaContratacion">
                    Fecha de Contratación
                  </label>
                  <input
                    type="date"
                    id="fechaContratacion"
                    name="fechaContratacion"
                    value={formData.fechaContratacion}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="distrito">Distrito</label>
                <input
                  type="text"
                  id="distrito"
                  name="distrito"
                  value={formData.distrito}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="direccion">Dirección</label>
                <textarea
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  disabled={loading}
                  style={{ resize: "none" }}
                  className={validationErrors.direccion ? "input-error" : ""}
                />
                {validationErrors.direccion && (
                  <span className="error-text">
                    {validationErrors.direccion}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>Foto del Docente</label>
                <div className="image-upload-section">
                  <div className="image-input-group">
                    <input
                      type="file"
                      id="foto-edit"
                      name="foto"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={loading}
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

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={closeModals}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? "Actualizando..." : "Actualizar Docente"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Eliminar Docente */}
      {showDeleteModal && selectedDocente && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header delete-header">
              <h3>
                <i className="bi bi-trash-fill"></i>
                Eliminar Docente
              </h3>
              <button className="modal-close" onClick={closeModals}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <p>¿Estás seguro de que deseas eliminar al docente?</p>
              <div className="delete-info">
                <strong>{`${selectedDocente.nombres} ${selectedDocente.apellidos}`}</strong>
                <p>{selectedDocente.especialidad || "Sin especialidad"}</p>
              </div>
              <p className="warning">Esta acción no se puede deshacer.</p>
            </div>

            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={closeModals}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                className="btn-danger"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocenteManagement;
