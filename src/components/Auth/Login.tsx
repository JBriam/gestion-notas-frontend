import React, { useState } from 'react';
import { AuthService } from '../../api/AuthService';
import { useAuth } from '../../hooks/useAuth';
import { useValidation, schemas } from '../../utils/validation';
import type { LoginRequest } from '../../interfaces/Auth';
import './Auth.css';

interface LoginProps {
  onSwitchToRegister: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSwitchToRegister }) => {
  const { login, setLoading, state } = useAuth();
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');

  // Integrar sistema de validaciones
  const validation = useValidation(schemas.loginSchema, formData, {
    mode: 'onBlur',
    revalidateMode: 'onChange'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError(''); // Limpiar error del servidor al escribir
    
    // Ejecutar validación del campo
    validation.getFieldProps(name as keyof LoginRequest).onChange(e);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validar formulario antes de enviar
    if (!validation.validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await AuthService.login(formData);
      
      if (response.success && response.usuario) {
        login(response.usuario, response.perfilEstudiante, response.perfilDocente);
      } else {
        setError(response.message || 'Error en el login');
      }
    } catch {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Verificar si el formulario puede ser enviado
  const canSubmit = validation.isValid && formData.email && formData.password;

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <img src="/src/assets/logos/Logo_Colegio_sin_fondo.png" alt="Logo Colegio" className="auth-logo" />
          <h2>Iniciar Sesión</h2>
          <p>Accede a tu cuenta del sistema de gestión de notas</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={validation.getFieldProps('email').onBlur}
              required
              placeholder="Ingresa tu email"
              disabled={state.loading}
              className={validation.errors.email ? 'input-error' : ''}
            />
            {validation.errors.email && (
              <div className="field-error">{validation.errors.email}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onBlur={validation.getFieldProps('password').onBlur}
              required
              placeholder="Ingresa tu contraseña"
              disabled={state.loading}
              className={validation.errors.password ? 'input-error' : ''}
            />
            {validation.errors.password && (
              <div className="field-error">{validation.errors.password}</div>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="auth-button"
            disabled={state.loading || !canSubmit}
          >
            {state.loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            ¿No tienes una cuenta?{' '}
            <button 
              type="button" 
              className="link-button"
              onClick={onSwitchToRegister}
              disabled={state.loading}
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};