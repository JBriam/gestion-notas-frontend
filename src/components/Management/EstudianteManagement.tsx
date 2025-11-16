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

  // Estado para vista previa de imagen
  const [imagePreview, setImagePreview] = useState<string>("");

  // Estados para mostrar/ocultar contraseñas
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Hook de validación
  const validation = useValidation(estudianteSchema, formData, {
    mode: 'onBlur',
    revalidateMode: 'onChange'
  });

  useEffect(() => {
    loadEstudiantes();
  }, []);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        setError('Por favor selecciona un archivo de imagen válido');
        return;
      }

      // Comprimir y redimensionar la imagen AGRESIVAMENTE
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Crear canvas para redimensionar
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Reducir dimensiones AÚN MÁS (máx 100x100 px para menos caracteres)
          let width = img.width;
          let height = img.height;
          const maxSize = 100; // Reducido de 200 a 100
          
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
          
          // Dibujar imagen redimensionada
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Convertir a Base64 con MÁXIMA compresión (0.3 = 30% calidad)
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.3);
          
          // Verificar tamaño final
          const sizeInKB = Math.round((compressedBase64.length * 3) / 4 / 1024);
          const caracteres = compressedBase64.length;
          console.log(`✅ Imagen SUPER comprimida:`);
          console.log(`   - Tamaño: ${sizeInKB}KB (original: ${Math.round(file.size / 1024)}KB)`);
          console.log(`   - Caracteres: ${caracteres.toLocaleString()} (Base64)`);
          console.log(`   - Dimensiones: ${Math.round(width)}x${Math.round(height)}px`);
          
          setFormData((prev) => ({ ...prev, foto: compressedBase64 }));
          setImagePreview(compressedBase64);
          setError('');
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulario
    if (!validation.validateForm()) {
      console.log("❌ ERRORES DE VALIDACIÓN:", validation.errors);
      console.log("📋 DATOS DEL FORMULARIO:", formData);
      setError(`Por favor, corrige los errores: ${Object.keys(validation.errors).join(', ')}`);
      return;
    }
    
    try {
      setLoading(true);
      
      // Remover confirmPassword antes de enviar
      const { confirmPassword, codigoEstudiante, ...estudianteDataWithoutConfirm } = formData;
      
      // Preparar datos para enviar
      const dataToSend = {
        ...estudianteDataWithoutConfirm,
        password: (formData.password || '').trim(),
        // Solo incluir codigoEstudiante si tiene valor, sino undefined para que el backend lo genere
        ...(codigoEstudiante && codigoEstudiante.trim() !== '' ? { codigoEstudiante: codigoEstudiante.trim() } : {}),
        // Limpiar campos opcionales vacíos
        telefono: formData.telefono?.trim() || undefined,
        direccion: formData.direccion?.trim() || undefined,
        distrito: formData.distrito?.trim() || undefined,
        foto: formData.foto?.trim() || undefined,
        fechaNacimiento: formData.fechaNacimiento || undefined,
      };
      
      console.log('🚀 Creando estudiante:', dataToSend);
      
      await EstudianteService.crear(dataToSend);
      setSuccess("Estudiante creado exitosamente");
      setShowCreateModal(false);
      resetForm();
      await loadEstudiantes();
    } catch (error) {
      console.error("Error al crear estudiante:", error);
      setError("Error al crear el estudiante");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEstudiante?.idEstudiante) return;

    // Validar formulario
    if (!validation.validateForm()) {
      setError("Por favor, corrige los errores del formulario");
      return;
    }

    try {
      setLoading(true);
      
      // Remover password y confirmPassword del formData
      const { password, confirmPassword, ...estudianteData } = formData;
      
      const updatedEstudiante = {
        ...selectedEstudiante,
        ...estudianteData,
      };
      
      console.log('Actualizando estudiante:', updatedEstudiante);
      
      await EstudianteService.actualizar(updatedEstudiante);
      setSuccess("Estudiante actualizado exitosamente");
      setShowEditModal(false);
      resetForm();
      await loadEstudiantes();
    } catch (error) {
      console.error("Error al actualizar estudiante:", error);
      setError("Error al actualizar el estudiante");
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
    setImagePreview(estudiante.foto as string || "");
    validation.reset();
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
    setSelectedEstudiante(null);
    setImagePreview("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    validation.reset();
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
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
                  src={estudiante.foto || "/src/assets/imgs/student.gif"}
                  alt="Estudiante"
                  className="estudiante-avatar"
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
                  ✏️ Editar
                </button>
                <button
                  onClick={() => openDeleteModal(estudiante)}
                  className="btn-delete"
                  disabled={loading}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para crear estudiante */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
                  <label htmlFor="create-nombres">Nombres *</label>
                  <input
                    type="text"
                    id="create-nombres"
                    name="nombres"
                    value={formData.nombres}
                    {...validation.getFieldProps("nombres")}
                    onChange={(e) => {
                      setFormData({ ...formData, nombres: e.target.value });
                      validation.getFieldProps("nombres").onChange(e);
                    }}
                    required
                    disabled={loading}
                  />
                  {validation.errors.nombres && (
                    <div className="field-error">{validation.errors.nombres}</div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="create-apellidos">Apellidos *</label>
                  <input
                    type="text"
                    id="create-apellidos"
                    name="apellidos"
                    value={formData.apellidos}
                    {...validation.getFieldProps("apellidos")}
                    onChange={(e) => {
                      setFormData({ ...formData, apellidos: e.target.value });
                      validation.getFieldProps("apellidos").onChange(e);
                    }}
                    required
                    disabled={loading}
                  />
                  {validation.errors.apellidos && (
                    <div className="field-error">{validation.errors.apellidos}</div>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="create-email">Email *</label>
                  <input
                    type="email"
                    id="create-email"
                    name="email"
                    value={formData.email}
                    placeholder="Ej: estudiante@ejemplo.com"
                    {...validation.getFieldProps("email")}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      validation.getFieldProps("email").onChange(e);
                    }}
                    required
                    disabled={loading}
                  />
                  {validation.errors.email && (
                    <div className="field-error">{validation.errors.email}</div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="create-telefono">Teléfono</label>
                  <input
                    type="tel"
                    id="create-telefono"
                    name="telefono"
                    value={formData.telefono}
                    placeholder="Ej: 987654321"
                    {...validation.getFieldProps("telefono")}
                    onChange={(e) => {
                      setFormData({ ...formData, telefono: e.target.value });
                      validation.getFieldProps("telefono").onChange(e);
                    }}
                    disabled={loading}
                  />
                  {validation.errors.telefono && (
                    <div className="field-error">{validation.errors.telefono}</div>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password">Contraseña *</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      {...validation.getFieldProps("password")}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        validation.getFieldProps("password").onChange(e);
                      }}
                      placeholder="Mínimo 6 caracteres"
                      disabled={loading}
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                    </button>
                  </div>
                  {validation.errors.password && (
                    <div className="field-error">{validation.errors.password}</div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmar Contraseña *</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      {...validation.getFieldProps("confirmPassword")}
                      onChange={(e) => {
                        setFormData({ ...formData, confirmPassword: e.target.value });
                        validation.getFieldProps("confirmPassword").onChange(e);
                      }}
                      placeholder="Repite tu contraseña"
                      disabled={loading}
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={loading}
                    >
                      <i className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                    </button>
                  </div>
                  {validation.errors.confirmPassword && (
                    <div className="field-error">{validation.errors.confirmPassword}</div>
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
                    {...validation.getFieldProps("distrito")}
                    onChange={(e) => {
                      setFormData({ ...formData, distrito: e.target.value });
                      validation.getFieldProps("distrito").onChange(e);
                    }}
                    disabled={loading}
                  />
                  {validation.errors.distrito && (
                    <div className="field-error">{validation.errors.distrito}</div>
                  )}
                </div>
                <div className="form-group">
                  <label>Fecha de Nacimiento</label>
                  <input
                    type="date"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    {...validation.getFieldProps("fechaNacimiento")}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        fechaNacimiento: e.target.value,
                      });
                      validation.getFieldProps("fechaNacimiento").onChange(e);
                    }}
                    disabled={loading}
                  />
                  {validation.errors.fechaNacimiento && (
                    <div className="field-error">{validation.errors.fechaNacimiento}</div>
                  )}
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

              <div className="form-group full-width">
                <label htmlFor="foto">Foto de Perfil (Opcional)</label>
                
                {/* Vista previa de la imagen */}
                {(imagePreview || formData.foto) && (
                  <div className="image-preview">
                    <img 
                      src={imagePreview || formData.foto} 
                      alt="Vista previa" 
                      className="preview-img"
                    />
                  </div>
                )}

                {/* Botón para subir imagen */}
                <div className="upload-section">
                  <input
                    type="file"
                    id="fotoFileCreate"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    disabled={loading}
                  />
                  <label htmlFor="fotoFileCreate" className="btn-upload">
                    <i className="bi bi-upload"></i> Subir Imagen
                  </label>
                  <small className="form-hint">
                    O ingresa una URL
                  </small>
                </div>

                {/* Campo de URL */}
                <input
                  type="url"
                  id="foto"
                  name="foto"
                  value={formData.foto.startsWith('data:') ? '' : formData.foto}
                  onChange={(e) =>
                    setFormData({ ...formData, foto: e.target.value })
                  }
                  placeholder="https://ejemplo.com/foto.jpg"
                  disabled={loading}
                  className="url-input"
                />
                <small className="form-hint">
                  La imagen se comprimirá automáticamente a ~2KB
                </small>
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
                    name="nombres"
                    value={formData.nombres}
                    {...validation.getFieldProps("nombres")}
                    onChange={(e) => {
                      setFormData({ ...formData, nombres: e.target.value });
                      validation.getFieldProps("nombres").onChange(e);
                    }}
                    required
                    disabled={loading}
                  />
                  {validation.errors.nombres && (
                    <div className="field-error">{validation.errors.nombres}</div>
                  )}
                </div>
                <div className="form-group">
                  <label>Apellidos *</label>
                  <input
                    type="text"
                    name="apellidos"
                    value={formData.apellidos}
                    {...validation.getFieldProps("apellidos")}
                    onChange={(e) => {
                      setFormData({ ...formData, apellidos: e.target.value });
                      validation.getFieldProps("apellidos").onChange(e);
                    }}
                    required
                    disabled={loading}
                  />
                  {validation.errors.apellidos && (
                    <div className="field-error">{validation.errors.apellidos}</div>
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
                    {...validation.getFieldProps("email")}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      validation.getFieldProps("email").onChange(e);
                    }}
                    required
                    disabled={loading}
                  />
                  {validation.errors.email && (
                    <div className="field-error">{validation.errors.email}</div>
                  )}
                </div>
                <div className="form-group">
                  <label>Teléfono</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    {...validation.getFieldProps("telefono")}
                    onChange={(e) => {
                      setFormData({ ...formData, telefono: e.target.value });
                      validation.getFieldProps("telefono").onChange(e);
                    }}
                    disabled={loading}
                  />
                  {validation.errors.telefono && (
                    <div className="field-error">{validation.errors.telefono}</div>
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
                    {...validation.getFieldProps("distrito")}
                    onChange={(e) => {
                      setFormData({ ...formData, distrito: e.target.value });
                      validation.getFieldProps("distrito").onChange(e);
                    }}
                    disabled={loading}
                  />
                  {validation.errors.distrito && (
                    <div className="field-error">{validation.errors.distrito}</div>
                  )}
                </div>
                <div className="form-group">
                  <label>Fecha de Nacimiento</label>
                  <input
                    type="date"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    {...validation.getFieldProps("fechaNacimiento")}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        fechaNacimiento: e.target.value,
                      });
                      validation.getFieldProps("fechaNacimiento").onChange(e);
                    }}
                    disabled={loading}
                  />
                  {validation.errors.fechaNacimiento && (
                    <div className="field-error">{validation.errors.fechaNacimiento}</div>
                  )}
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

              <div className="form-group full-width">
                <label htmlFor="fotoEdit">Foto de Perfil (Opcional)</label>
                
                {/* Vista previa de la imagen */}
                {(imagePreview || formData.foto) && (
                  <div className="image-preview">
                    <img 
                      src={imagePreview || formData.foto} 
                      alt="Vista previa" 
                      className="preview-img"
                    />
                  </div>
                )}

                {/* Botón para subir imagen */}
                <div className="upload-section">
                  <input
                    type="file"
                    id="fotoFileEdit"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    disabled={loading}
                  />
                  <label htmlFor="fotoFileEdit" className="btn-upload">
                    <i className="bi bi-upload"></i> Subir Nueva Imagen
                  </label>
                  <small className="form-hint">
                    O ingresa una URL
                  </small>
                </div>

                {/* Campo de URL */}
                <input
                  type="url"
                  id="fotoEdit"
                  name="foto"
                  value={formData.foto.startsWith('data:') ? '' : formData.foto}
                  onChange={(e) =>
                    setFormData({ ...formData, foto: e.target.value })
                  }
                  placeholder="https://ejemplo.com/foto.jpg"
                  disabled={loading}
                  className="url-input"
                />
                <small className="form-hint">
                  La imagen se comprimirá automáticamente a ~2KB
                </small>
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
