import React, { useState, useRef } from 'react';
import { FotoService } from '../../api/FotoService';
import './ActualizarFotoModal.css';

interface ActualizarFotoModalProps {
  isOpen: boolean;
  usuarioId: number;
  tipoUsuario: 'estudiante' | 'docente';
  fotoActual?: string;
  onClose: () => void;
  onFotoActualizada: (nuevaFoto: string) => void;
}

export const ActualizarFotoModal: React.FC<ActualizarFotoModalProps> = ({
  isOpen,
  usuarioId,
  tipoUsuario,
  onClose,
  onFotoActualizada,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar archivo
    const validacion = FotoService.validarImagen(file);
    if (!validacion.valid) {
      setError(validacion.message);
      setSelectedFile(null);
      setPreview(null);
      return;
    }

    setError(null);
    setSelectedFile(file);

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (file) {
      const input = fileInputRef.current;
      if (input) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;

        const event = new Event('change', { bubbles: true });
        input.dispatchEvent(event);
      }
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Por favor selecciona una imagen');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let response;

      if (tipoUsuario === 'estudiante') {
        response = await FotoService.actualizarFotoEstudiante(
          usuarioId,
          selectedFile
        );
      } else {
        response = await FotoService.actualizarFotoDocente(usuarioId, selectedFile);
      }

      if (response.success) {
        // La nueva foto URL viene en response.data.foto
        if (response.data.foto) {
          onFotoActualizada(response.data.foto);
          setSelectedFile(null);
          setPreview(null);
          onClose();
        }
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError('Error al actualizar la foto');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Cambiar Foto de Perfil</h2>
          <button
            type="button"
            className="modal-close"
            onClick={handleCancel}
            aria-label="Cerrar modal"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          <div
            className="drag-drop-area"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <p>Arrastra una imagen aquí o haz clic para seleccionar</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <button
              type="button"
              className="select-file-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
            >
              📁 Seleccionar Imagen
            </button>
          </div>

          {preview && (
            <div className="preview-container">
              <h3>Vista Previa</h3>
              <img src={preview} alt="Preview" className="preview-image" />
            </div>
          )}

          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-cancel"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn-save"
            onClick={handleSubmit}
            disabled={!selectedFile || loading}
          >
            {loading ? 'Actualizando...' : 'Guardar Foto'}
          </button>
        </div>
      </div>
    </div>
  );
};
