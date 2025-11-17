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
  const [showPassword, setShowPassword] = useState(false);

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
          <img src="/assets/logos/Logo_Colegio_sin_fondo.png" alt="Logo Colegio" className="auth-logo" />
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
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
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
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                disabled={state.loading}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
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