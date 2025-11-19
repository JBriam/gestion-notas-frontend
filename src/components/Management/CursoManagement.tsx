import React, { useState, useEffect } from 'react';
import { CursoService } from '../../api/CursoService';
import { DocenteService } from '../../api/DocenteService';
import { CursoStatsService, type EstadisticasCurso } from '../../api/CursoStatsService';
import type { Curso } from '../../interfaces/Curso';
import type { Docente } from '../../interfaces/Docente';
import './CursoManagement.css';

interface CursoForm extends Record<string, unknown> {
  nombre: string;
  codigoCurso: string;
  descripcion: string;
  creditos: number;
  activo?: boolean;
  idDocente?: number;
}

const CursoManagement: React.FC = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [estadisticasCursos, setEstadisticasCursos] = useState<Map<number, EstadisticasCurso>>(new Map());
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDocente, setFilterDocente] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);
  const [formData, setFormData] = useState<CursoForm>({
    nombre: '',
    codigoCurso: '',
    descripcion: '',
    creditos: 1,
    activo: true,
    idDocente: undefined
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadEstadisticas = async (cursosData: Curso[]) => {
    try {
      setLoadingStats(true);
      
      // Obtener IDs de cursos válidos
      const idsCursos = cursosData
        .filter(curso => curso.idCurso !== undefined)
        .map(curso => curso.idCurso!);
      
      if (idsCursos.length > 0) {
        const estadisticas = await CursoStatsService.obtenerEstadisticasMultiplesCursos(idsCursos);
        setEstadisticasCursos(estadisticas);
      }
    } catch (error) {
      console.error('[CursoManagement] Error al cargar estadísticas:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [cursosData, docentesData] = await Promise.all([
        CursoService.listar(),
        DocenteService.listar()
      ]);
      setCursos(cursosData);
      setDocentes(docentesData);
      
      // Cargar estadísticas de los cursos
      await loadEstadisticas(cursosData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError('Error al cargar la información');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validaciones
      if (!formData.nombre.trim()) {
        setError("El nombre del curso es obligatorio");
        return;
      }
      if (formData.nombre.length < 3) {
        setError("El nombre debe tener al menos 3 caracteres");
        return;
      }
      if (formData.nombre.length > 100) {
        setError("El nombre no puede tener más de 100 caracteres");
        return;
      }

      if (!formData.codigoCurso.trim()) {
        setError("El código del curso es obligatorio");
        return;
      }
      if (formData.codigoCurso.length < 2) {
        setError("El código debe tener al menos 2 caracteres");
        return;
      }
      if (formData.codigoCurso.length > 20) {
        setError("El código no puede tener más de 20 caracteres");
        return;
      }

      if (formData.creditos < 1 || formData.creditos > 10) {
        setError("Los créditos deben estar entre 1 y 10");
        return;
      }

      if (formData.descripcion && formData.descripcion.length > 500) {
        setError("La descripción no puede tener más de 500 caracteres");
        return;
      }

      setLoading(true);
      await CursoService.crear(formData);
      setSuccess('Curso creado exitosamente');
      setShowCreateModal(false);
      resetForm();
      await loadData();
    } catch (error) {
      console.error('Error al crear curso:', error);
      setError('Error al crear el curso');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCurso?.idCurso) return;
    
    try {
      // Validaciones
      if (!formData.nombre.trim()) {
        setError("El nombre del curso es obligatorio");
        return;
      }
      if (formData.nombre.length < 3) {
        setError("El nombre debe tener al menos 3 caracteres");
        return;
      }
      if (formData.nombre.length > 100) {
        setError("El nombre no puede tener más de 100 caracteres");
        return;
      }

      if (!formData.codigoCurso.trim()) {
        setError("El código del curso es obligatorio");
        return;
      }
      if (formData.codigoCurso.length < 2) {
        setError("El código debe tener al menos 2 caracteres");
        return;
      }
      if (formData.codigoCurso.length > 20) {
        setError("El código no puede tener más de 20 caracteres");
        return;
      }

      if (formData.creditos < 1 || formData.creditos > 10) {
        setError("Los créditos deben estar entre 1 y 10");
        return;
      }

      if (formData.descripcion && formData.descripcion.length > 500) {
        setError("La descripción no puede tener más de 500 caracteres");
        return;
      }

      setLoading(true);
      const updatedCurso = {
        ...selectedCurso,
        ...formData,
        idCurso: selectedCurso.idCurso
      };
      await CursoService.actualizar(updatedCurso);
      setSuccess('Curso actualizado exitosamente');
      setShowEditModal(false);
      resetForm();
      await loadData();
    } catch (error) {
      console.error('Error al actualizar curso:', error);
      setError('Error al actualizar el curso');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCurso?.idCurso) return;
    
    try {
      setLoading(true);
      await CursoService.eliminar(selectedCurso.idCurso);
      setSuccess('Curso eliminado exitosamente');
      setShowDeleteModal(false);
      setSelectedCurso(null);
      await loadData();
    } catch (error) {
      console.error('Error al eliminar curso:', error);
      setError('Error al eliminar el curso');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (curso: Curso) => {
    setSelectedCurso(curso);
    
    // Intentar obtener idDocente de múltiples fuentes
    let docenteId: number | undefined = undefined;
    
    // Opción 1: Si viene directamente en curso.idDocente
    if (curso.idDocente !== undefined) {
      docenteId = curso.idDocente;
    } 
    // Opción 2: Si viene dentro del objeto docente
    else if (typeof curso.docente === 'object' && curso.docente && 'idDocente' in curso.docente) {
      docenteId = curso.docente.idDocente as number;
    }
    
    setFormData({
      nombre: curso.nombre,
      codigoCurso: (curso.codigoCurso as string) || '',
      descripcion: (curso.descripcion as string) || '',
      creditos: (curso.creditos as number) || 1,
      activo: curso.activo !== undefined ? curso.activo : true,
      idDocente: docenteId
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (curso: Curso) => {
    setSelectedCurso(curso);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      codigoCurso: '',
      descripcion: '',
      creditos: 1,
      activo: true,
      idDocente: undefined
    });
    setSelectedCurso(null);
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    resetForm();
  };

  const getDocenteNombre = (curso: Curso): string => {
    // Opción 1: Si el docente viene como objeto completo
    if (typeof curso.docente === 'object' && curso.docente && 'nombres' in curso.docente && 'apellidos' in curso.docente) {
      return `${curso.docente.nombres} ${curso.docente.apellidos}`;
    }
    
    // Opción 2: Si solo viene idDocente, buscarlo en el array de docentes
    if (curso.idDocente !== undefined && curso.idDocente !== null) {
      const docente = docentes.find(d => d.idDocente === curso.idDocente);
      if (docente) {
        return `${docente.nombres} ${docente.apellidos}`;
      }
    }
    
    return 'Sin asignar';
  };

  const getDocenteEspecialidad = (curso: Curso): string | null => {
    // Opción 1: Si el docente viene como objeto completo con especialidad
    if (typeof curso.docente === 'object' && curso.docente && 'especialidad' in curso.docente) {
      return curso.docente.especialidad as string;
    }
    
    // Opción 2: Si solo viene idDocente, buscarlo en el array de docentes
    if (curso.idDocente !== undefined && curso.idDocente !== null) {
      const docente = docentes.find(d => d.idDocente === curso.idDocente);
      if (docente && docente.especialidad) {
        return docente.especialidad;
      }
    }
    
    return null;
  };

  const filteredCursos = cursos.filter(curso => {
    const matchesSearch = 
      curso.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (curso.codigoCurso as string)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (curso.descripcion as string)?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDocente = !filterDocente || getDocenteNombre(curso).toLowerCase().includes(filterDocente.toLowerCase());
    
    return matchesSearch && matchesDocente;
  });

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
    <div className="curso-management">
      <div className="management-header">
        <h2>Gestión de Cursos</h2>
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar cursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <input
            type="text"
            placeholder="Filtrar por docente..."
            value={filterDocente}
            onChange={(e) => setFilterDocente(e.target.value)}
            className="filter-input"
          />
          <button
            onClick={openCreateModal}
            className="btn-primary"
            disabled={loading}
          >
            + Nuevo Curso
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando cursos...</p>
        </div>
      ) : filteredCursos.length === 0 ? (
        <div className="empty-state">
          <h3>No se encontraron cursos</h3>
          <p>
            {searchTerm || filterDocente 
              ? 'No hay cursos que coincidan con los filtros aplicados.' 
              : 'Aún no hay cursos registrados en el sistema.'
            }
          </p>
        </div>
      ) : (
        <div className="cursos-grid">
          {filteredCursos.map((curso) => (
            <div key={curso.idCurso} className="curso-card">
              <div className="curso-header">
                <div className="curso-title">
                  <h3>{curso.nombre}</h3>
                  <span className="curso-codigo">{(curso.codigoCurso as string) || 'Sin código'}</span>
                </div>
                <div className="curso-creditos">
                  <span className="creditos-badge">{(curso.creditos as number) || 0} créditos</span>
                </div>
              </div>
              
              <div className="curso-content">
                <div className="curso-descripcion">
                  <p>{(curso.descripcion as string) || 'Sin descripción disponible'}</p>
                </div>
                
                <div className="curso-docente">
                  <div className="docente-info">
                    <span className="docente-label">👨‍🏫 Docente:</span>
                    <span className="docente-nombre">{getDocenteNombre(curso)}</span>
                  </div>
                  {getDocenteEspecialidad(curso) && (
                    <div className="especialidad">
                      <span>📚 {getDocenteEspecialidad(curso)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="curso-stats">
                <div className="stat-item">
                  <span className="stat-icon">👥</span>
                  <span className="stat-text">Estudiantes inscritos</span>
                  <span className="stat-number">
                    {loadingStats ? '...' : (estadisticasCursos.get(curso.idCurso!)?.estudiantesInscritos || 0)}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-icon">📝</span>
                  <span className="stat-text">Notas registradas</span>
                  <span className="stat-number">
                    {loadingStats ? '...' : (estadisticasCursos.get(curso.idCurso!)?.notasRegistradas || 0)}
                  </span>
                </div>
              </div>

              <div className="curso-actions">
                <button
                  onClick={() => openEditModal(curso)}
                  className="btn-edit"
                  disabled={loading}
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => openDeleteModal(curso)}
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

      {/* Modal para crear curso */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header create-header">
              <h3>
                <i className="bi bi-journal-plus"></i>
                Crear Nuevo Curso
              </h3>
              <button onClick={closeModals} className="modal-close">×</button>
            </div>
            <form onSubmit={handleCreate} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre del Curso *</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    required
                    disabled={loading}
                    placeholder="Ej: Matemáticas Avanzadas"
                  />
                </div>
                <div className="form-group">
                  <label>Código del Curso *</label>
                  <input
                    type="text"
                    value={formData.codigoCurso}
                    onChange={(e) => setFormData({...formData, codigoCurso: e.target.value})}
                    required
                    disabled={loading}
                    placeholder="Ej: MAT101"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Créditos *</label>
                  <input
                    type="number"
                    value={formData.creditos}
                    onChange={(e) => setFormData({...formData, creditos: parseInt(e.target.value) || 1})}
                    required
                    min="1"
                    max="10"
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label>Docente Asignado</label>
                  <select
                    value={formData.idDocente || ''}
                    onChange={(e) => setFormData({...formData, idDocente: e.target.value ? parseInt(e.target.value) : undefined})}
                    disabled={loading}
                  >
                    <option value="">Sin asignar</option>
                    {docentes.map(docente => (
                      <option key={docente.idDocente} value={docente.idDocente}>
                        {docente.nombres} {docente.apellidos} - {docente.especialidad}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group full-width">
                <label>Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  disabled={loading}
                  placeholder="Descripción del curso..."
                  rows={4}
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={closeModals} className="btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Creando...' : 'Crear Curso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para editar curso */}
      {showEditModal && selectedCurso && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header edit-header">
              <h3>
                <i className="bi bi-pencil-square"></i>
                Editar Curso
              </h3>
              <button onClick={closeModals} className="modal-close">×</button>
            </div>
            <form onSubmit={handleEdit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre del Curso *</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label>Código del Curso *</label>
                  <input
                    type="text"
                    value={formData.codigoCurso}
                    onChange={(e) => setFormData({...formData, codigoCurso: e.target.value})}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Créditos *</label>
                  <input
                    type="number"
                    value={formData.creditos}
                    onChange={(e) => setFormData({...formData, creditos: parseInt(e.target.value) || 1})}
                    required
                    min="1"
                    max="10"
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label>Docente Asignado</label>
                  <select
                    value={formData.idDocente || ''}
                    onChange={(e) => setFormData({...formData, idDocente: e.target.value ? parseInt(e.target.value) : undefined})}
                    disabled={loading}
                  >
                    <option value="">Sin asignar</option>
                    {docentes.map(docente => (
                      <option key={docente.idDocente} value={docente.idDocente}>
                        {docente.nombres} {docente.apellidos} - {docente.especialidad}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group full-width">
                <label>Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  disabled={loading}
                  rows={4}
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={closeModals} className="btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Actualizando...' : 'Actualizar Curso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para eliminar curso */}
      {showDeleteModal && selectedCurso && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header delete-header">
              <h3>
                <i className="bi bi-trash-fill"></i>
                Eliminar Curso
              </h3>
              <button onClick={closeModals} className="modal-close">×</button>
            </div>
            <div className="modal-body">
              <p>¿Estás seguro de que deseas eliminar este curso?</p>
              <div className="delete-info">
                <strong>{selectedCurso.nombre}</strong>
                <p>{(selectedCurso.codigoCurso as string)} - {(selectedCurso.creditos as number)} créditos</p>
                <p>Docente: {getDocenteNombre(selectedCurso)}</p>
              </div>
              <p className="warning">Esta acción eliminará también todas las notas asociadas a este curso.</p>
            </div>
            <div className="modal-actions">
              <button onClick={closeModals} className="btn-secondary">
                Cancelar
              </button>
              <button onClick={handleDelete} className="btn-danger" disabled={loading}>
                {loading ? 'Eliminando...' : 'Eliminar Curso'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CursoManagement;