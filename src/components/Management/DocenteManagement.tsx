import React, { useState, useEffect } from "react";
import { DocenteService } from "../../api/DocenteService";
import type { Docente } from "../../interfaces/Docente";
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await DocenteService.crear(formData);
      setSuccess("Docente creado exitosamente");
      setShowCreateModal(false);
      limpiarFormulario();
      await cargarDocentes();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Error al crear docente"
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
      setLoading(true);
      const updatedDocente = {
        ...selectedDocente,
        ...formData,
      };
      await DocenteService.actualizar(updatedDocente);
      setSuccess("Docente actualizado exitosamente");
      setShowEditModal(false);
      setSelectedDocente(null);
      limpiarFormulario();
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

  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedDocente(null);
    limpiarFormulario();
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
                    src={docente.foto || "/src/assets/imgs/docente.png"}
                    alt={`${docente.nombres} ${docente.apellidos}`}
                    className="docente-avatar"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/src/assets/imgs/docente.png";
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
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
                  />
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

              <div className="form-row">
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
                  <input
                    type="text"
                    id="direccion"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
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
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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

              <div className="form-row">
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
                  <input
                    type="text"
                    id="direccion"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
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
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
