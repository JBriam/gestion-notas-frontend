import React, { useState } from "react";
import { AuthService } from "../../api/AuthService";
import { useValidation, schemas } from "../../utils/validation";
import type { RegisterRequest } from "../../interfaces/Auth";

// Interfaz extendida para incluir confirmPassword en el formulario
interface RegisterFormData extends RegisterRequest {
  confirmPassword: string;
}

interface RegisterProps {
  onSwitchToLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    nombres: "",
    apellidos: "",
    email: "",
    password: "",
    telefono: "",
    rol: "ESTUDIANTE", // Por defecto estudiante
    confirmPassword: "",
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Integrar sistema de validaciones
  const validation = useValidation(schemas.registerSchema, formData, {
    mode: 'onBlur',
    revalidateMode: 'onChange'
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  // Helper para combinar handlers
  const getFieldProps = (fieldName: keyof RegisterFormData) => {
    const validationProps = validation.getFieldProps(fieldName);
    return {
      ...validationProps,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        handleInputChange(e);
        validationProps.onChange(e);
      }
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validar formulario antes de enviar
    if (!validation.validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Crear objeto sin confirmPassword para enviar al backend
      const { confirmPassword, ...registerData } = formData;
      const response = await AuthService.register(registerData);

      if (response.success) {
        setSuccess(
          "Usuario registrado exitosamente. Ahora puedes iniciar sesión."
        );
        setFormData({
          nombres: "",
          apellidos: "",
          email: "",
          password: "",
          telefono: "",
          rol: "ESTUDIANTE",
          confirmPassword: "",
        });
        // Cambiar automáticamente al login después de 2 segundos
        setTimeout(() => {
          onSwitchToLogin();
        }, 2000);
      } else {
        setError(response.message);
      }
    } catch {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  // Verificar si el formulario puede ser enviado
  const canSubmit = validation.isValid && 
    formData.nombres && 
    formData.apellidos && 
    formData.email && 
    formData.password && 
    formData.confirmPassword;

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <img
            src="/assets/logos/Logo_Colegio_sin_fondo.png"
            alt="Logo Colegio"
            className="auth-logo"
          />
          <h2>Registro</h2>
          <p>Crea tu cuenta para acceder al sistema</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombres">Nombres *</label>
              <input
                type="text"
                id="nombres"
                name="nombres"
                value={formData.nombres}
                {...getFieldProps('nombres')}
                required
                disabled={loading}
                className={validation.errors.nombres ? 'input-error' : ''}
              />
              {validation.errors.nombres && (
                <div className="field-error">{validation.errors.nombres}</div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="apellidos">Apellidos *</label>
              <input
                type="text"
                id="apellidos"
                name="apellidos"
                value={formData.apellidos}
                {...getFieldProps('apellidos')}
                required
                disabled={loading}
                className={validation.errors.apellidos ? 'input-error' : ''}
              />
              {validation.errors.apellidos && (
                <div className="field-error">{validation.errors.apellidos}</div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="rol">Tipo de Usuario</label>
              <select
                id="rol"
                name="rol"
                value={formData.rol}
                {...getFieldProps('rol')}
                disabled={loading}
                className={validation.errors.rol ? 'input-error' : ''}
              >
                <option value="ESTUDIANTE">Estudiante</option>
                <option value="DOCENTE">Docente</option>
              </select>
              {validation.errors.rol && (
                <div className="field-error">{validation.errors.rol}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input
                type="text"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                {...getFieldProps('telefono')}
                placeholder="999-999-999"
                disabled={loading}
                className={validation.errors.telefono ? 'input-error' : ''}
              />
              {validation.errors.telefono && (
                <div className="field-error">{validation.errors.telefono}</div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              {...getFieldProps('email')}
              required
              placeholder="tu@email.com"
              disabled={loading}
              maxLength={100}
              className={validation.errors.email ? 'input-error' : ''}
            />
            {validation.errors.email && (
              <div className="field-error">{validation.errors.email}</div>
            )}
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
                  {...getFieldProps('password')}
                  required
                  placeholder="Mínimo 6 caracteres"
                  disabled={loading}
                  minLength={6}
                  className={validation.errors.password ? 'input-error' : ''}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  disabled={loading}
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

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña *</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  {...getFieldProps('confirmPassword')}
                  required
                  placeholder="Repite tu contraseña"
                  disabled={loading}
                  className={validation.errors.confirmPassword ? 'input-error' : ''}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  disabled={loading}
                >
                  {showConfirmPassword ? (
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
              {validation.errors.confirmPassword && (
                <div className="field-error">{validation.errors.confirmPassword}</div>
              )}
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button type="submit" className="auth-button" disabled={loading || !canSubmit}>
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            ¿Ya tienes una cuenta?{" "}
            <button
              type="button"
              className="link-button"
              onClick={onSwitchToLogin}
              disabled={loading}
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
