import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { DocenteService } from '../../api/DocenteService';
import type { ActualizarPerfilDocenteRequest } from '../../interfaces/Auth';
import './Profile.css';

export const ProfileDocente: React.FC = () => {
  const { state, updateProfile } = useAuth();
  const [formData, setFormData] = useState<ActualizarPerfilDocenteRequest>({
    nombres: '',
    apellidos: '',
    telefono: '',
    direccion: '',
    distrito: '',
    foto: '',
    fechaContratacion: '',
    especialidad: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);

  // Cargar datos del perfil al montar el componente
  useEffect(() => {
    if (state.perfilDocente) {
      setFormData({
        nombres: state.perfilDocente.nombres || '',
        apellidos: state.perfilDocente.apellidos || '',
        telefono: state.perfilDocente.telefono || '',
        direccion: state.perfilDocente.direccion || '',
        distrito: state.perfilDocente.distrito || '',
        foto: state.perfilDocente.foto || '',
        fechaContratacion: state.perfilDocente.fechaContratacion || '',
        especialidad: state.perfilDocente.especialidad || '',
        email: state.perfilDocente.email || '',
      });
    }
  }, [state.perfilDocente]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.perfilDocente?.idDocente) {
      setError('No se encontró el ID del docente');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const perfilActualizado = await DocenteService.actualizarPerfil(
        state.perfilDocente.idDocente,
        formData
      );
      
      // Actualizar el contexto con los nuevos datos
      updateProfile(undefined, perfilActualizado);
      
      setSuccess('Perfil actualizado correctamente');
      setIsEditing(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Restaurar los datos originales
    if (state.perfilDocente) {
      setFormData({
        nombres: state.perfilDocente.nombres || '',
        apellidos: state.perfilDocente.apellidos || '',
        telefono: state.perfilDocente.telefono || '',
        direccion: state.perfilDocente.direccion || '',
        distrito: state.perfilDocente.distrito || '',
        foto: state.perfilDocente.foto || '',
        fechaContratacion: state.perfilDocente.fechaContratacion || '',
        especialidad: state.perfilDocente.especialidad || '',
        email: state.perfilDocente.email || '',
      });
    }
    setIsEditing(false);
    setError('');
    setSuccess('');
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
              src={formData.foto || '/assets/imgs/student.gif'}
              alt="Foto de perfil"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/assets/imgs/student.gif';
              }}
            />
          </div>
          <div className="profile-info">
            <h2>{`${formData.nombres} ${formData.apellidos}`}</h2>
            <p className="profile-role">Docente</p>
            <p className="profile-code">
              Código: {state.perfilDocente.codigoDocente || 'No asignado'}
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
                value={formData.email || ''}
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
              <input
                type="text"
                id="especialidad"
                name="especialidad"
                value={formData.especialidad}
                onChange={handleInputChange}
                disabled={!isEditing || loading}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="distrito">Distrito</label>
              <input
                type="text"
                id="distrito"
                name="distrito"
                value={formData.distrito}
                onChange={handleInputChange}
                disabled={!isEditing || loading}
              />
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
            <input
              type="text"
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
              disabled={!isEditing || loading}
              placeholder="Ingrese su dirección"
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {isEditing && (
            <div className="form-actions">
              <button
                type="submit"
                className="save-button"
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};