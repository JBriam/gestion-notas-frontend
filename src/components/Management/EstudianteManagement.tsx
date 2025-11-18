import React, { useState, useEffect } from "react";
import { EstudianteService } from "../../api/EstudianteService";
import type { Estudiante } from "../../interfaces/Estudiante";
import { useValidation } from "../../utils/validation/useValidation";
import { estudianteSchema } from "../../utils/validation/schemas";
import "./EstudianteManagement.css";

interface EstudianteForm extends Record<string, unknown> {
  nombres: string;
  apellidos: string;
  telefono: string;
  direccion: string;
  distrito: string;
  foto: string;
  fechaNacimiento: string;
  codigoEstudiante: string;
  email: string;
  password?: string;
  confirmPassword?: string;
}

const EstudianteManagement: React.FC = () => {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDistrito, setFilterDistrito] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEstudiante, setSelectedEstudiante] =
    useState<Estudiante | null>(null);
  const [formData, setFormData] = useState<EstudianteForm>({
    nombres: "",
    apellidos: "",
    telefono: "",
    direccion: "",
    distrito: "",
    foto: "",
    fechaNacimiento: "",
    codigoEstudiante: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fotoFile, setFotoFile] = useState<File | null>(null);

  const {
    errors: validationErrors,
    validateField,
    validateForm,
    clearAllErrors,
    setError: setValidationError,
    clearError: clearValidationError,
  } = useValidation(estudianteSchema, formData, { mode: "onChange" });

  useEffect(() => {
    loadEstudiantes();
  }, []);

  const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
    const fileInput = document.getElementById("foto") as HTMLInputElement;
    const fileInputEdit = document.getElementById("foto-edit") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
    if (fileInputEdit) fileInputEdit.value = "";
  };

  const loadEstudiantes = async () => {
    try {
      setLoading(true);
      const data = await EstudianteService.listar();
      setEstudiantes(data);
    } catch (error) {
      console.error("Error al cargar estudiantes:", error);
      setError("Error al cargar la lista de estudiantes");
    } finally {
      setLoading(false);
    }
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
      if (!formData.email || !formData.password || !formData.nombres || !formData.apellidos) {
        setError("Los campos email, contraseña, nombres y apellidos son obligatorios");
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

      if (formData.telefono) fd.append("telefono", formData.telefono);
      if (formData.direccion) fd.append("direccion", formData.direccion);
      if (formData.distrito) fd.append("distrito", formData.distrito);
      if (formData.fechaNacimiento) fd.append("fechaNacimiento", formData.fechaNacimiento);
      if (formData.codigoEstudiante) fd.append("codigoEstudiante", formData.codigoEstudiante);

      if (fotoFile) {
        fd.append("foto", fotoFile);
      }

      const created = await EstudianteService.crear(fd);

      setSuccess("Estudiante creado exitosamente");

      if (created && created.foto) {
        setImagePreview(created.foto as string);
        setFormData((prev) => ({ ...prev, foto: created.foto as string }));
      }

      setShowCreateModal(false);
      clearAllErrors();
      resetForm();
      await loadEstudiantes();
    } catch (error) {
      console.error("Error al crear estudiante:", error);
      setError(error instanceof Error ? error.message : "Error al crear el estudiante");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEstudiante?.idEstudiante) return;

    try {
      if (!formData.email || !formData.nombres || !formData.apellidos) {
        setError("Los campos email, nombres y apellidos son obligatorios");
        return;
      }

      setLoading(true);

      const fd = new FormData();

      fd.append("idEstudiante", String(selectedEstudiante.idEstudiante));
      fd.append("email", formData.email);
      fd.append("nombres", formData.nombres);
      fd.append("apellidos", formData.apellidos);

      if (formData.telefono) fd.append("telefono", formData.telefono);
      if (formData.direccion) fd.append("direccion", formData.direccion);
      if (formData.distrito) fd.append("distrito", formData.distrito);
      if (formData.fechaNacimiento) fd.append("fechaNacimiento", formData.fechaNacimiento);
      if (formData.codigoEstudiante) fd.append("codigoEstudiante", formData.codigoEstudiante);

      if (formData.password) {
        if (formData.password.length < 6) {
          setError("La contraseña debe tener al menos 6 caracteres");
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setError("Las contraseñas no coinciden");
          return;
        }
        fd.append("password", formData.password);
      }

      if (fotoFile) {
        fd.append("foto", fotoFile);
      }

      const updated = await EstudianteService.actualizar(fd);

      setSuccess("Estudiante actualizado exitosamente");
      if (updated && updated.foto) {
        setImagePreview(updated.foto as string);
        setFormData((prev) => ({ ...prev, foto: updated.foto as string }));
      }
      setShowEditModal(false);
      resetForm();
      await loadEstudiantes();
    } catch (error) {
      console.error("Error al actualizar estudiante:", error);
      setError(error instanceof Error ? error.message : "Error al actualizar estudiante");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedEstudiante?.idEstudiante) return;

    try {
      setLoading(true);
      await EstudianteService.eliminar(selectedEstudiante.idEstudiante);
      setSuccess("Estudiante eliminado exitosamente");
      setShowDeleteModal(false);
      setSelectedEstudiante(null);
      await loadEstudiantes();
    } catch (error) {
      console.error("Error al eliminar estudiante:", error);
      setError("Error al eliminar el estudiante");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (estudiante: Estudiante) => {
    setSelectedEstudiante(estudiante);
    setFormData({
      nombres: estudiante.nombres,
      apellidos: estudiante.apellidos,
      telefono: (estudiante.telefono as string) || "",
      direccion: (estudiante.direccion as string) || "",
      distrito: (estudiante.distrito as string) || "",
      foto: (estudiante.foto as string) || "",
      fechaNacimiento: (estudiante.fechaNacimiento as string) || "",
      codigoEstudiante: estudiante.codigoEstudiante as string,
      email: estudiante.email as string,
    });
    setImagePreview((estudiante.foto as string) || "");
    setFotoFile(null);
    setShowEditModal(true);
  };

  const openDeleteModal = (estudiante: Estudiante) => {
    setSelectedEstudiante(estudiante);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setFormData({
      nombres: "",
      apellidos: "",
      codigoEstudiante: "",
      telefono: "",
      foto: "",
      fechaNacimiento: "",
      direccion: "",
      distrito: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setImagePreview(null);
    setFotoFile(null);
    setSelectedEstudiante(null);
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setError(null);
    setSuccess(null);
    resetForm();
  };

  const filteredEstudiantes = estudiantes.filter((estudiante) => {
    const matchesSearch =
      estudiante.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estudiante.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (estudiante.email as string)
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (estudiante.codigoEstudiante as string)
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesDistrito =
      !filterDistrito ||
      (estudiante.distrito as string)?.toLowerCase() ===
        filterDistrito.toLowerCase();

    return matchesSearch && matchesDistrito;
  });

  const uniqueDistritos = Array.from(
    new Set(estudiantes.map((e) => e.distrito as string).filter(Boolean))
  );

  // Auto-hide messages
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <div className="estudiante-management">
      <div className="management-header">
        <h2>Gestión de Estudiantes</h2>
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar estudiantes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <select
            value={filterDistrito}
            onChange={(e) => setFilterDistrito(e.target.value)}
            className="filter-select"
          >
            <option value="">Todos los distritos</option>
            {uniqueDistritos.map((distrito) => (
              <option key={distrito} value={distrito}>
                {distrito}
              </option>
            ))}
          </select>
          <button
            onClick={openCreateModal}
            className="btn-primary"
            disabled={loading}
          >
            + Nuevo Estudiante
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando estudiantes...</p>
        </div>
      ) : filteredEstudiantes.length === 0 ? (
        <div className="empty-state">
          <h3>No se encontraron estudiantes</h3>
          <p>
            {searchTerm || filterDistrito
              ? "No hay estudiantes que coincidan con los filtros aplicados."
              : "Aún no hay estudiantes registrados en el sistema."}
          </p>
        </div>
      ) : (
        <div className="estudiantes-grid">
          {filteredEstudiantes.map((estudiante) => (
            <div key={estudiante.idEstudiante} className="estudiante-card">
              <div className="estudiante-header">
                <img
                  src={estudiante.foto || "/assets/imgs/student.gif"}
                  alt="Estudiante"
                  className="estudiante-avatar"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/assets/imgs/student.gif";
                  }}
                />
                <div className="estudiante-info">
                  <h3>
                    {estudiante.nombres} {estudiante.apellidos}
                  </h3>
                  <p className="codigo">
                    {estudiante.codigoEstudiante as string}
                  </p>
                </div>
              </div>

              <div className="estudiante-details">
                <div className="detail-row">
                  <span className="label">Teléfono:</span>
                  <span>
                    {(estudiante.telefono as string) || "No registrado"}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Distrito:</span>
                  <span>
                    {(estudiante.distrito as string) || "No especificado"}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Email:</span>
                  <span>
                    {(estudiante.email as string) || "No especificado"}
                  </span>
                </div>
              </div>

              <div className="estudiante-actions">
                <button
                  onClick={() => openEditModal(estudiante)}
                  className="btn-edit"
                  disabled={loading}
                >
                  Editar
                </button>
                <button
                  onClick={() => openDeleteModal(estudiante)}
                  className="btn-delete"
                  disabled={loading}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para crear estudiante */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header create-header">
              <h3>
                <i className="bi bi-person-plus-fill"></i>
                Crear Nuevo Estudiante
              </h3>
              <button onClick={closeModals} className="modal-close">
                ×
              </button>
            </div>
            <form onSubmit={handleCreate} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nombres *</label>
                  <input
                    type="text"
                    name="nombres"
                    value={formData.nombres}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    className={validationErrors.nombres ? "input-error" : ""}
                  />
                  {validationErrors.nombres && (
                    <span className="error-text">{validationErrors.nombres}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Apellidos *</label>
                  <input
                    type="text"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    className={validationErrors.apellidos ? "input-error" : ""}
                  />
                  {validationErrors.apellidos && (
                    <span className="error-text">{validationErrors.apellidos}</span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="Ej: estudiante@ejemplo.com"
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
                  <label>Teléfono</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    placeholder="Ej: 987654321"
                    onChange={handleInputChange}
                    disabled={loading}
                    className={validationErrors.telefono ? "input-error" : ""}
                  />
                  {validationErrors.telefono && (
                    <span className="error-text">{validationErrors.telefono}</span>
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
                    <span className="error-text">{validationErrors.password}</span>
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
                    placeholder="Repite la contraseña"
                    disabled={loading}
                    className={validationErrors.confirmPassword ? "input-error" : ""}
                  />
                  {validationErrors.confirmPassword && (
                    <span className="error-text">{validationErrors.confirmPassword}</span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Distrito</label>
                  <input
                    type="text"
                    name="distrito"
                    value={formData.distrito}
                    onChange={handleInputChange}
                    disabled={loading}
                    className={validationErrors.distrito ? "input-error" : ""}
                  />
                  {validationErrors.distrito && (
                    <span className="error-text">{validationErrors.distrito}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Fecha de Nacimiento</label>
                  <input
                    type="date"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleInputChange}
                    disabled={loading}
                    className={validationErrors.fechaNacimiento ? "input-error" : ""}
                  />
                  {validationErrors.fechaNacimiento && (
                    <span className="error-text">{validationErrors.fechaNacimiento}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  disabled={loading}
                  className={validationErrors.direccion ? "input-error" : ""}
                />
                {validationErrors.direccion && (
                  <span className="error-text">{validationErrors.direccion}</span>
                )}
              </div>

              <div className="form-group">
                <label>Foto del Estudiante</label>
                <div className="image-upload-section">
                  <div className="image-input-group">
                  <input
                    type="file"
                    id="foto"
                    name="foto"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={loading}
                    style={{ padding: '8px', marginBottom: '10px' }}
                  />
                  </div>
                  {imagePreview && (
                    <div style={{ marginTop: '10px', textAlign: 'center', position: 'relative', display: 'inline-block' }}>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          maxWidth: '100px',
                          maxHeight: '100px',
                          border: '2px solid #ddd',
                          borderRadius: '8px',
                          objectFit: 'cover'
                        }}
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          lineHeight: '1',
                          padding: '0'
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
                  onClick={closeModals}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? "Creando..." : "Crear Estudiante"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para editar estudiante */}
      {showEditModal && selectedEstudiante && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header edit-header">
              <h3>
                <i className="bi bi-pencil-square"></i>
                Editar Estudiante
              </h3>
              <button onClick={closeModals} className="modal-close">
                ×
              </button>
            </div>
            <form onSubmit={handleEdit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nombres *</label>
                  <input
                    type="text"
                    value={formData.nombres}
                    onChange={(e) =>
                      setFormData({ ...formData, nombres: e.target.value })
                    }
                    required
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label>Apellidos *</label>
                  <input
                    type="text"
                    value={formData.apellidos}
                    onChange={(e) =>
                      setFormData({ ...formData, apellidos: e.target.value })
                    }
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
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label>Teléfono</label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) =>
                      setFormData({ ...formData, telefono: e.target.value })
                    }
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Distrito</label>
                  <input
                    type="text"
                    value={formData.distrito}
                    onChange={(e) =>
                      setFormData({ ...formData, distrito: e.target.value })
                    }
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label>Fecha de Nacimiento</label>
                  <input
                    type="date"
                    value={formData.fechaNacimiento}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fechaNacimiento: e.target.value,
                      })
                    }
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Dirección</label>
                <input
                  type="text"
                  value={formData.direccion}
                  onChange={(e) =>
                    setFormData({ ...formData, direccion: e.target.value })
                  }
                  disabled={loading}
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
                      disabled={loading}
                      style={{ padding: '8px', marginBottom: '10px' }}
                    />
                  </div>
                  {(imagePreview || formData.foto) && (
                    <div style={{ marginTop: '10px', textAlign: 'center', position: 'relative', display: 'inline-block' }}>
                      <img
                        src={imagePreview || formData.foto}
                        alt="Preview"
                        style={{
                          maxWidth: '100px',
                          maxHeight: '100px',
                          border: '2px solid #ddd',
                          borderRadius: '8px',
                          objectFit: 'cover'
                        }}
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          lineHeight: '1',
                          padding: '0'
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
                  onClick={closeModals}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? "Actualizando..." : "Actualizar Estudiante"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para eliminar estudiante */}
      {showDeleteModal && selectedEstudiante && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header delete-header">
              <h3>
                <i className="bi bi-trash-fill"></i>
                Eliminar Estudiante
              </h3>
              <button onClick={closeModals} className="modal-close">
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>¿Estás seguro de que deseas eliminar este estudiante?</p>
              <div className="delete-info">
                <strong>
                  {selectedEstudiante.nombres} {selectedEstudiante.apellidos}
                </strong>
                <p>
                  {selectedEstudiante.codigoEstudiante as string} -{" "}
                  {selectedEstudiante.email}
                </p>
              </div>
              <p className="warning">Esta acción no se puede deshacer.</p>
            </div>
            <div className="modal-actions">
              <button onClick={closeModals} className="btn-secondary">
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="btn-danger"
                disabled={loading}
              >
                {loading ? "Eliminando..." : "Eliminar Estudiante"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstudianteManagement;
