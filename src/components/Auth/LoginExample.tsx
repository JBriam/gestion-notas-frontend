/**
 * EJEMPLO DE CÓMO USAR EL SISTEMA DE VALIDACIONES CENTRALIZADO
 * 
 * Este archivo muestra cómo refactorizar el Login.tsx para usar
 * el nuevo sistema de validaciones reutilizable
 */

import React, { useState } from 'react';
import { AuthService } from '../../api/AuthService';
import { useAuth } from '../../hooks/useAuth';
import type { LoginRequest } from '../../interfaces/Auth';
import { useFormValidation, schemas } from '../../utils/validation';
import './Auth.css';

interface LoginProps {
  onSwitchToRegister: () => void;
}

export const LoginWithValidation: React.FC<LoginProps> = ({ onSwitchToRegister }) => {
  const { login, setLoading, state } = useAuth();
  const [formData, setFormData] = useState<LoginRequest>({
    username: '',
    password: '',
  });
  const [error, setError] = useState<string>('');

  // 🎯 PASO 1: Usar el sistema de validaciones centralizado
  const {
    errors: validationErrors,     // Errores de validación automáticos
    touched,                      // Campos que el usuario ha tocado
    isValid,                      // Si todo el formulario es válido
    validateForm,                 // Función para validar todo el form
    getFieldProps                 // Props automáticos para inputs
  } = useFormValidation(schemas.loginSchema, formData);

  // 🎯 PASO 2: Manejar cambios en los inputs (SIMPLIFICADO)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Actualizar el valor
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del servidor cuando el usuario empiece a escribir
    if (error) {
      setError('');
    }
  };

  // 🎯 PASO 3: Envío del formulario (SIMPLIFICADO)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar usando el sistema centralizado
    if (!validateForm()) {
      return; // Los errores se muestran automáticamente
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await AuthService.login(formData);
      
      if (response.success && response.usuario) {
        login(response.usuario, response.perfilEstudiante, response.perfilDocente);
      } else {
        setError(response.message || 'Usuario o contraseña incorrectos');
      }
    } catch (err) {
      setError('Error de conexión. Intenta nuevamente.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 🎯 PASO 4: Verificar si el formulario se puede enviar
  const canSubmit = isValid && formData.username.trim() && formData.password;

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Iniciar Sesión - Con Validaciones Centralizadas</h2>
          <p>Ejemplo usando el nuevo sistema de validaciones</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* 🎯 Campo Usuario - Con validaciones automáticas */}
          <div className="form-group">
            <label htmlFor="username">Usuario *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              // Combinar nuestro handler con el del sistema de validación
              onChange={(e) => {
                handleInputChange(e);
                getFieldProps('username').onChange(e);
              }}
              // Usar el onBlur del sistema de validación
              onBlur={getFieldProps('username').onBlur}
              // Aplicar clases automáticas de error
              className={`form-input ${getFieldProps('username').className}`}
              placeholder="Ingresa tu usuario"
              disabled={state.loading}
              autoComplete="username"
            />
            {/* Mostrar errores automáticamente */}
            {touched.username && validationErrors.username && (
              <div className="field-error">
                <span className="error-icon">⚠</span>
                {validationErrors.username}
              </div>
            )}
          </div>

          {/* 🎯 Campo Contraseña - Con validaciones automáticas */}
          <div className="form-group">
            <label htmlFor="password">Contraseña *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={(e) => {
                handleInputChange(e);
                getFieldProps('password').onChange(e);
              }}
              onBlur={getFieldProps('password').onBlur}
              className={`form-input ${getFieldProps('password').className}`}
              placeholder="Ingresa tu contraseña"
              disabled={state.loading}
              autoComplete="current-password"
            />
            {touched.password && validationErrors.password && (
              <div className="field-error">
                <span className="error-icon">⚠</span>
                {validationErrors.password}
              </div>
            )}
          </div>

          {/* Error del servidor */}
          {error && (
            <div className="server-error">
              <span className="error-icon">❌</span>
              {error}
            </div>
          )}

          {/* 🎯 Botón automáticamente habilitado/deshabilitado */}
          <button
            type="submit"
            className={`auth-button ${!canSubmit ? 'disabled' : ''}`}
            disabled={!canSubmit || state.loading}
          >
            {state.loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>

          <div className="auth-footer">
            <p>
              ¿No tienes cuenta?{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="auth-link"
                disabled={state.loading}
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </form>

        {/* 🎯 Información de desarrollo */}
        <div className="debug-info" style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <h4>Estado de Validación (Solo para desarrollo)</h4>
          <p><strong>Formulario válido:</strong> {isValid ? '✅' : '❌'}</p>
          <p><strong>Puede enviar:</strong> {canSubmit ? '✅' : '❌'}</p>
          <p><strong>Campos tocados:</strong> {JSON.stringify(touched)}</p>
          <p><strong>Errores:</strong> {JSON.stringify(validationErrors)}</p>
        </div>
      </div>
    </div>
  );
};