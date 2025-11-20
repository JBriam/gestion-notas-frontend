import React, { useState, useEffect } from "react";
import { NotaService } from "../../api/NotaService";
import { EstudianteService } from "../../api/EstudianteService";
import { CursoService } from "../../api/CursoService";
import type { Nota, NotaForm, NotaBackend } from "../../interfaces/Nota";
import type { Estudiante } from "../../interfaces/Estudiante";
import type { Curso } from "../../interfaces/Curso";
import "./NotaManagement.css";

const NotaManagement: React.FC = () => {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCurso, setFilterCurso] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNota, setSelectedNota] = useState<Nota | null>(null);
  const [formData, setFormData] = useState<NotaForm>({
    idEstudiante: 0,
    idCurso: 0,
    nota: 0,
    tipoEvaluacion: "",
    observaciones: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
        const [notasData, estudiantesData, cursosData] = await Promise.all([
          NotaService.listar(),
        EstudianteService.listar(),
        CursoService.listar(),
      ]);

      // Combinar datos para crear la estructura que espera el frontend
      const notasConDatos: Nota[] = notasData.map(
        (notaBackend: NotaBackend) => {
          const estudiante = estudiantesData.find(
            (est: Estudiante) => est.idEstudiante === notaBackend.idEstudiante
          );
          const curso = cursosData.find(
            (cur: Curso) => cur.idCurso === notaBackend.idCurso
          );

          return {
            idNota: notaBackend.idNota,
            nota: notaBackend.nota,
            estudiante: estudiante || {
              idEstudiante: notaBackend.idEstudiante,
              nombres: "Estudiante no encontrado",
              apellidos: "",
              codigoEstudiante: "N/A",
            },
            curso: curso || {
              idCurso: notaBackend.idCurso,
              nombre: "Curso no encontrado",
              codigo: "N/A",
            },
            tipoEvaluacion: notaBackend.tipoEvaluacion,
            fechaRegistro: notaBackend.fechaRegistro,
            observaciones: notaBackend.observaciones,
          } as Nota;
        }
      );

      setNotas(notasConDatos);
      setEstudiantes(estudiantesData);
      setCursos(cursosData);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setError("Error al cargar la información");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validación de nota duplicada
    const existeDuplicada = notas.some(
      (nota) =>
        nota.estudiante.idEstudiante === formData.idEstudiante &&
        nota.curso.idCurso === formData.idCurso &&
        nota.tipoEvaluacion === formData.tipoEvaluacion
    );
    if (existeDuplicada) {
      setError("Nota duplicada no permitida para este estudiante, curso y evaluación.");
      return;
    }
    try {
      setLoading(true);
      await NotaService.crear(formData);
      setSuccess("Nota creada exitosamente");
      setShowCreateModal(false);
      resetForm();
      await loadData();
    } catch (error) {
      console.error("Error al crear nota:", error);
      setError("Error al crear la nota");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNota?.idNota) return;
    // Validación de nota duplicada (excluyendo la nota actual)
    const existeDuplicada = notas.some(
      (nota) =>
        nota.idNota !== selectedNota.idNota &&
        nota.estudiante.idEstudiante === formData.idEstudiante &&
        nota.curso.idCurso === formData.idCurso &&
        nota.tipoEvaluacion === formData.tipoEvaluacion
    );
    if (existeDuplicada) {
      setError("Nota duplicada no permitida para este estudiante, curso y evaluación.");
      return;
    }
    try {
      setLoading(true);
      const updatedNota = {
        ...selectedNota,
        nota: formData.nota,
        tipoEvaluacion: formData.tipoEvaluacion,
        observaciones: formData.observaciones,
      };

      await NotaService.actualizar(updatedNota);
      setSuccess("Nota actualizada exitosamente");
      setShowEditModal(false);
      resetForm();
      await loadData();
    } catch (error) {
      console.error("Error al actualizar nota:", error);
      setError("Error al actualizar la nota");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedNota?.idNota) return;

    try {
      setLoading(true);
      await NotaService.eliminar(selectedNota.idNota);
      setSuccess("Nota eliminada exitosamente");
      setShowDeleteModal(false);
      setSelectedNota(null);
      await loadData();
    } catch (error) {
      console.error("Error al eliminar nota:", error);
      setError("Error al eliminar la nota");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (nota: Nota) => {
    setSelectedNota(nota);
    setFormData({
      idEstudiante: nota.estudiante.idEstudiante || 0,
      idCurso: nota.curso.idCurso || 0,
      nota: nota.nota,
      tipoEvaluacion: nota.tipoEvaluacion || "",
      observaciones: nota.observaciones || "",
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (nota: Nota) => {
    setSelectedNota(nota);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setFormData({
      idEstudiante: 0,
      idCurso: 0,
      nota: 0,
      tipoEvaluacion: "",
      observaciones: "",
    });
    setSelectedNota(null);
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    resetForm();
  };

  const getEstadoNota = (nota: number): "aprobado" | "desaprobado" => {
    return nota >= 13 ? "aprobado" : "desaprobado";
  };

  const filteredNotas = notas.filter((nota) => {
    const nombreCompleto =
      `${nota.estudiante.nombres} ${nota.estudiante.apellidos}`.toLowerCase();
    const nombreCurso = nota.curso.nombre.toLowerCase();
      const codigoEstudiante = (nota.estudiante.codigoEstudiante ?? "").toLowerCase();

    const matchesSearch =
      nombreCompleto.includes(searchTerm.toLowerCase()) ||
      nombreCurso.includes(searchTerm.toLowerCase()) ||
      codigoEstudiante.includes(searchTerm.toLowerCase());

    const matchesCurso =
      !filterCurso || nombreCurso.includes(filterCurso.toLowerCase());
    const matchesEstado =
      !filterEstado || getEstadoNota(nota.nota) === filterEstado;

    return matchesSearch && matchesCurso && matchesEstado;
  });

  const estadisticas = {
    total: notas.length,
    aprobados: notas.filter((n) => n.nota >= 13).length,
    desaprobados: notas.filter((n) => n.nota < 13).length,
    promedio:
      notas.length > 0
        ? notas.reduce((sum, n) => sum + n.nota, 0) / notas.length
        : 0,
  };

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
    <div className="nota-management">
      <div className="management-header">
        <div className="header-title">
          <h2>Gestión de Notas</h2>
          <div className="stats-summary">
            <span className="stat-item">
              Total: <strong>{estadisticas.total}</strong>
            </span>
            <span className="stat-item success">
              Aprobados: <strong>{estadisticas.aprobados}</strong>
            </span>
            <span className="stat-item danger">
              Desaprobados: <strong>{estadisticas.desaprobados}</strong>
            </span>
            <span className="stat-item info">
              Promedio: <strong>{estadisticas.promedio.toFixed(2)}</strong>
            </span>
          </div>
        </div>
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar por estudiante o curso..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <select
            value={filterCurso}
            onChange={(e) => setFilterCurso(e.target.value)}
            className="filter-select"
          >
            <option value="">Todos los cursos</option>
            {cursos.map((curso) => (
              <option key={curso.idCurso} value={curso.nombre}>
                {curso.nombre}
              </option>
            ))}
          </select>
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="filter-select"
          >
            <option value="">Todos los estados</option>
            <option value="aprobado">Aprobados</option>
            <option value="desaprobado">Desaprobados</option>
          </select>
          <button
            onClick={openCreateModal}
            className="btn-primary"
            disabled={loading}
          >
            + Nueva Nota
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando notas...</p>
        </div>
      ) : filteredNotas.length === 0 ? (
        <div className="empty-state">
          <h3>No se encontraron notas</h3>
          <p>
            {searchTerm || filterCurso || filterEstado
              ? "No hay notas que coincidan con los filtros aplicados."
              : "Aún no hay notas registradas en el sistema."}
          </p>
        </div>
      ) : (
        <div className="notas-table-container">
          <table className="notas-table">
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Curso</th>
                <th>Tipo Evaluación</th>
                <th>Calificación</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotas.map((nota) => (
                <tr
                  key={nota.idNota}
                  className={`nota-row ${getEstadoNota(nota.nota)}`}
                >
                  <td>
                    <div className="estudiante-info">
                      <img
                        src="/assets/imgs/student.gif"
                        alt="Estudiante"
                        className="estudiante-avatar-small"
                      />
                      <div>
                        <strong>
                          {nota.estudiante.nombres} {nota.estudiante.apellidos}
                        </strong>
                        <span className="codigo-badge">
                          {(nota.estudiante.codigoEstudiante as string) ||
                            "N/A"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="curso-info">
                      <strong>{nota.curso.nombre}</strong>
                      <small>{(nota.curso.codigoCurso as string) || ""}</small>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`tipo-evaluacion-badge ${getTipoEvaluacionClass(
                        nota.tipoEvaluacion || ""
                      )}`}
                    >
                      {nota.tipoEvaluacion || "N/A"}
                    </span>
                  </td>
                  <td>
                    <span className={`nota-badge ${getEstadoNota(nota.nota)}`}>
                      {nota.nota.toFixed(1)}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`estado-badge ${getEstadoNota(nota.nota)}`}
                    >
                      {getEstadoNota(nota.nota) === "aprobado"
                        ? "Aprobado"
                        : "Desaprobado"}
                    </span>
                  </td>
                  <td>
                    <div className="nota-actions">
                      <button
                        onClick={() => openEditModal(nota)}
                        className="btn-edit-small"
                        disabled={loading}
                        title="Editar nota"
                      >
                        <svg
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => openDeleteModal(nota)}
                        className="btn-delete-small"
                        disabled={loading}
                        title="Eliminar nota"
                      >
                        <svg
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal para crear nota */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header create-header">
              <h3>
                <i className="bi bi-journal-plus"></i>
                Registrar Nueva Nota
              </h3>
              <button onClick={closeModals} className="modal-close">
                ×
              </button>
            </div>
            <form onSubmit={handleCreate} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Estudiante *</label>
                  <select
                    value={formData.idEstudiante}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        idEstudiante: parseInt(e.target.value),
                      })
                    }
                    required
                    disabled={loading}
                  >
                    <option value={0}>Seleccionar estudiante</option>
                    {estudiantes.map((estudiante) => (
                      <option
                        key={estudiante.idEstudiante}
                        value={estudiante.idEstudiante}
                      >
                        {estudiante.nombres} {estudiante.apellidos} -{" "}
                        {estudiante.codigoEstudiante as string}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Curso *</label>
                  <select
                    value={formData.idCurso}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        idCurso: parseInt(e.target.value),
                      })
                    }
                    required
                    disabled={loading}
                  >
                    <option value={0}>Seleccionar curso</option>
                    {cursos.map((curso) => (
                      <option key={curso.idCurso} value={curso.idCurso}>
                        {curso.nombre} -{" "}
                        {(curso.codigoCurso as string) || "Sin código"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Calificación * (0-20)</label>
                  <input
                    type="number"
                    value={formData.nota}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      if (value > 20) {
                        setError("La nota no puede ser mayor a 20");
                        setFormData({ ...formData, nota: 20 });
                      } else {
                        setError(null);
                        setFormData({ ...formData, nota: value });
                      }
                    }}
                    required
                    min="0"
                    max="20"
                    step="0.1"
                    disabled={loading}
                    placeholder="Ej: 15.5"
                  />
                  {error && (
                    <div className="form-error-message" style={{ color: 'red' }}>{error}</div>
                  )}
                  <small className="form-hint">
                    Calificación de 0 a 20. Nota mínima aprobatoria: 13
                  </small>
                </div>
                <div className="form-group">
                  <label>Tipo de Evaluación</label>
                  <select
                    value={formData.tipoEvaluacion}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tipoEvaluacion: e.target.value,
                      })
                    }
                    required
                    disabled={loading}
                  >
                    <option value={0}>Seleccionar evaluación</option>
                    <option value="EXAMEN">Examen</option>
                    <option value="FINAL">Final</option>
                    <option value="PARCIAL">Parcial</option>
                    <option value="PRACTICA">Práctica</option>
                    <option value="TAREA">Tarea</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Observaciones</label>
                <textarea
                  value={formData.observaciones || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      observaciones: e.target.value,
                    })
                  }
                  disabled={loading}
                  placeholder="Ej: Buen desempeño"
                />
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
                  {loading ? "Registrando..." : "Registrar Nota"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para editar nota */}
      {showEditModal && selectedNota && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header edit-header">
              <h3>
                <i className="bi bi-pencil-square"></i>
                Editar Nota
              </h3>
              <button onClick={closeModals} className="modal-close">
                ×
              </button>
            </div>
            <form onSubmit={handleEdit} className="modal-form">
              <div className="readonly-info">
                <div className="info-item">
                  <strong>Estudiante:</strong> {selectedNota.estudiante.nombres}{" "}
                  {selectedNota.estudiante.apellidos}
                </div>
                <div className="info-item">
                  <strong>Curso:</strong> {selectedNota.curso.nombre} - {selectedNota.curso.codigoCurso}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Nueva Calificación * (0-20)</label>
                  <input
                    type="number"
                    value={formData.nota}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      if (value > 20) {
                        setError("La nota no puede ser mayor a 20");
                        setFormData({ ...formData, nota: 20 });
                      } else {
                        setError(null);
                        setFormData({ ...formData, nota: value });
                      }
                    }}
                    required
                    min="0"
                    max="20"
                    step="0.1"
                    disabled={loading}
                  />
                  {error && (
                    <div className="form-error-message" style={{ color: 'red' }}>{error}</div>
                  )}
                  <small className="form-hint">
                    Calificación actual: {selectedNota.nota} | Estado:{" "}
                    {getEstadoNota(selectedNota.nota) === "aprobado"
                      ? "Aprobado"
                      : "Desaprobado"}
                  </small>
                </div>
                <div className="form-group">
                  <label>Tipo de Evaluación</label>
                  <select
                    value={formData.tipoEvaluacion}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tipoEvaluacion: e.target.value,
                      })
                    }
                    required
                    disabled={loading}
                  >
                    <option value={0}>Seleccionar evaluación</option>
                    <option value="EXAMEN">Examen</option>
                    <option value="FINAL">Final</option>
                    <option value="PARCIAL">Parcial</option>
                    <option value="PRACTICA">Práctica</option>
                    <option value="TAREA">Tarea</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Observaciones</label>
                <textarea
                  value={formData.observaciones || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      observaciones: e.target.value,
                    })
                  }
                  disabled={loading}
                  placeholder="Ej: Buen desempeño"
                />
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
                  {loading ? "Actualizando..." : "Actualizar Nota"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para eliminar nota */}
      {showDeleteModal && selectedNota && (
        <div className="modal-overlay">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header delete-header">
              <h3>
                <i className="bi bi-trash-fill"></i>
                Eliminar Nota
              </h3>
              <button onClick={closeModals} className="modal-close">
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>¿Estás seguro de que deseas eliminar esta nota?</p>
              <div className="delete-info">
                <strong>Estudiante:</strong> {selectedNota.estudiante.nombres}{" "}
                {selectedNota.estudiante.apellidos}
                <br />
                <strong>Curso:</strong> {selectedNota.curso.nombre}
                <br />
                <strong>Calificación:</strong> {selectedNota.nota} (
                {getEstadoNota(selectedNota.nota) === "aprobado"
                  ? "Aprobado"
                  : "Desaprobado"}
                )
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
                {loading ? "Eliminando..." : "Eliminar Nota"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Función helper para estilos de tipo de evaluación
const getTipoEvaluacionClass = (tipoEvaluacion: string): string => {
  switch (tipoEvaluacion) {
    case "PARCIAL":
      return "tipo-parcial";
    case "FINAL":
      return "tipo-final";
    case "TAREA":
      return "tipo-tarea";
    case "PRACTICA":
      return "tipo-practica";
    default:
      return "tipo-default";
  }
};

export default NotaManagement;
