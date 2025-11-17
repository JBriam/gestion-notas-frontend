/**
 * Reglas de validación reutilizables
 * Sistema robusto para validar formularios en toda la aplicación
 */

import type { ValidationRule } from './types';

/**
 * ============================================
 * VALIDACIONES BÁSICAS
 * ============================================
 */

export const required = (message = 'Este campo es obligatorio'): ValidationRule => ({
  type: 'required',
  message,
  validator: (value: unknown) => {
    if (typeof value === 'string') return value.trim().length > 0;
    return value !== null && value !== undefined && value !== '';
  }
});

export const minLength = (min: number, message?: string): ValidationRule => ({
  type: 'minLength',
  message: message || `Debe tener al menos ${min} caracteres`,
  value: min,
  validator: (value: string) => !value || value.length >= min
});

export const maxLength = (max: number, message?: string): ValidationRule => ({
  type: 'maxLength',
  message: message || `No puede tener más de ${max} caracteres`,
  value: max,
  validator: (value: string) => !value || value.length <= max
});

export const minValue = (min: number, message?: string): ValidationRule => ({
  type: 'minValue',
  message: message || `El valor mínimo es ${min}`,
  value: min,
  validator: (value: number) => !value || Number(value) >= min
});

export const maxValue = (max: number, message?: string): ValidationRule => ({
  type: 'maxValue',
  message: message || `El valor máximo es ${max}`,
  value: max,
  validator: (value: number) => !value || Number(value) <= max
});

/**
 * ============================================
 * VALIDACIONES DE FORMATO
 * ============================================
 */

export const email = (message = 'Ingresa un email válido'): ValidationRule => ({
  type: 'email',
  message,
  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  validator: (value: string) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
});

export const phone = (message = 'Ingresa un teléfono válido'): ValidationRule => ({
  type: 'phone',
  message,
  pattern: /^[+]?[\d\s\-()]{7,15}$/,
  validator: (value: string) => !value || /^[+]?[\d\s\-()]{7,15}$/.test(value)
});

export const phonePeruvian = (message = 'Ingresa un teléfono válido de 9 dígitos (ej: 987654321)'): ValidationRule => ({
  type: 'phonePeruvian',
  message,
  pattern: /^9\d{8}$/,
  validator: (value: string) => {
    if (!value) return true;
    // Remover espacios, guiones y paréntesis para validar solo dígitos
    const cleanPhone = value.replace(/[\s\-()]/g, '');
    // Debe tener exactamente 9 dígitos y empezar con 9
    return /^9\d{8}$/.test(cleanPhone);
  }
});

export const username = (message = 'Solo letras, números, puntos, guiones y guiones bajos'): ValidationRule => ({
  type: 'username',
  message,
  pattern: /^[a-zA-Z0-9._-]+$/,
  validator: (value: string) => !value || /^[a-zA-Z0-9._-]+$/.test(value)
});

export const alphanumeric = (message = 'Solo se permiten letras y números'): ValidationRule => ({
  type: 'alphanumeric',
  message,
  pattern: /^[a-zA-Z0-9]+$/,
  validator: (value: string) => !value || /^[a-zA-Z0-9]+$/.test(value)
});

export const alphabetic = (message = 'Solo se permiten letras'): ValidationRule => ({
  type: 'alphabetic',
  message,
  pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
  validator: (value: string) => !value || /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)
});

export const validFullName = (message = 'Ingresa un nombre válido (mínimo 3 letras por palabra)'): ValidationRule => ({
  type: 'validFullName',
  message,
  validator: (value: string) => {
    if (!value) return true;
    // Eliminar espacios extras y dividir en palabras
    const words = value.trim().split(/\s+/);
    // Cada palabra debe tener al menos 3 letras y no tener patrones repetitivos sospechosos
    return words.every(word => {
      // Mínimo 3 letras
      if (word.length < 3) return false;
      // Solo letras válidas
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/.test(word)) return false;
      // No permitir más de 2 letras consecutivas iguales (ej: "aaa", "sss")
      if (/(.)\1{2,}/.test(word)) return false;
      // Debe tener al menos una vocal
      if (!/[aeiouáéíóúAEIOUÁÉÍÓÚ]/.test(word)) return false;
      return true;
    });
  }
});

export const noNumbers = (message = 'No se permiten números'): ValidationRule => ({
  type: 'noNumbers',
  message,
  validator: (value: string) => !value || !/\d/.test(value)
});

export const numeric = (message = 'Solo se permiten números'): ValidationRule => ({
  type: 'numeric',
  message,
  pattern: /^\d+$/,
  validator: (value: string) => !value || /^\d+$/.test(value)
});

export const decimal = (message = 'Ingresa un número válido'): ValidationRule => ({
  type: 'decimal',
  message,
  pattern: /^\d+(\.\d+)?$/,
  validator: (value: string) => !value || /^\d+(\.\d+)?$/.test(value)
});

/**
 * ============================================
 * VALIDACIONES ESPECÍFICAS
 * ============================================
 */

export const dni = (message = 'DNI debe tener 8 dígitos'): ValidationRule => ({
  type: 'dni',
  message,
  pattern: /^\d{8}$/,
  validator: (value: string) => !value || /^\d{8}$/.test(value)
});

export const ruc = (message = 'RUC debe tener 11 dígitos'): ValidationRule => ({
  type: 'ruc',
  message,
  pattern: /^\d{11}$/,
  validator: (value: string) => !value || /^\d{11}$/.test(value)
});

export const codigoEstudiante = (message = 'Formato: EST seguido de números'): ValidationRule => ({
  type: 'codigoEstudiante',
  message,
  pattern: /^EST\d{3,6}$/,
  validator: (value: string) => !value || /^EST\d{3,6}$/.test(value)
});

export const codigoDocente = (message = 'Formato: DOC seguido de números'): ValidationRule => ({
  type: 'codigoDocente',
  message,
  pattern: /^DOC\d{3,6}$/,
  validator: (value: string) => !value || /^DOC\d{3,6}$/.test(value)
});

/**
 * ============================================
 * VALIDACIONES DE FECHA
 * ============================================
 */

export const dateFormat = (message = 'Formato de fecha inválido'): ValidationRule => ({
  type: 'dateFormat',
  message,
  validator: (value: string) => {
    if (!value) return true;
    const date = new Date(value);
    return !Number.isNaN(date.getTime());
  }
});

export const addressFormat = (message = 'Ingresa una dirección válida'): ValidationRule => ({
  type: 'addressFormat',
  message,
  validator: (value: string) => {
    if (!value) return true;
    // Debe tener al menos 5 caracteres y contener letras
    return value.length >= 5 && /[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(value);
  }
});

export const minAge = (age: number, message?: string): ValidationRule => ({
  type: 'minAge',
  message: message || `Debe ser mayor de ${age} años`,
  value: age,
  validator: (value: string) => {
    if (!value) return true;
    const birthDate = new Date(value);
    const today = new Date();
    const ageInYears = today.getFullYear() - birthDate.getFullYear();
    return ageInYears >= age;
  }
});

export const maxAge = (age: number, message?: string): ValidationRule => ({
  type: 'maxAge',
  message: message || `Debe ser menor de ${age} años`,
  value: age,
  validator: (value: string) => {
    if (!value) return true;
    const birthDate = new Date(value);
    const today = new Date();
    const ageInYears = today.getFullYear() - birthDate.getFullYear();
    return ageInYears <= age;
  }
});

export const pastDate = (message = 'La fecha debe ser anterior a hoy'): ValidationRule => ({
  type: 'pastDate',
  message,
  validator: (value: string) => {
    if (!value) return true;
    const date = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  }
});

export const futureDate = (message = 'La fecha debe ser posterior a hoy'): ValidationRule => ({
  type: 'futureDate',
  message,
  validator: (value: string) => {
    if (!value) return true;
    const date = new Date(value);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return date > today;
  }
});

/**
 * ============================================
 * VALIDACIONES DE CONTRASEÑA
 * ============================================
 */

export const password = {
  basic: (message = 'La contraseña debe tener al menos 6 caracteres'): ValidationRule => ({
    type: 'passwordBasic',
    message,
    validator: (value: string) => !value || value.length >= 6
  }),

  medium: (message = 'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número'): ValidationRule => ({
    type: 'passwordMedium',
    message,
    validator: (value: string) => {
      if (!value) return true;
      return value.length >= 8 && 
             /[A-Z]/.test(value) && 
             /\d/.test(value);
    }
  }),

  strong: (message = 'La contraseña debe tener al menos 8 caracteres, mayúscula, minúscula, número y símbolo'): ValidationRule => ({
    type: 'passwordStrong',
    message,
    validator: (value: string) => {
      if (!value) return true;
      return value.length >= 8 && 
             /[A-Z]/.test(value) && 
             /[a-z]/.test(value) && 
             /\d/.test(value) && 
             /[!@#$%^&*(),.?":{}|<>]/.test(value);
    }
  })
};

export const confirmPassword = (passwordField = 'password', message = 'Las contraseñas no coinciden'): ValidationRule => ({
  type: 'confirmPassword',
  message,
  validator: (value: unknown, formData?: Record<string, unknown>) => {
    if (!value || !formData || typeof value !== 'string') return true;
    return value === formData[passwordField];
  }
});

/**
 * ============================================
 * VALIDACIONES PERSONALIZADAS
 * ============================================
 */

export const custom = (
  validator: (value: unknown, formData?: Record<string, unknown>) => boolean,
  message: string
): ValidationRule => ({
  type: 'custom',
  message,
  validator
});

export const oneOf = (allowedValues: unknown[], message?: string): ValidationRule => ({
  type: 'oneOf',
  message: message || `Debe ser uno de: ${allowedValues.join(', ')}`,
  value: allowedValues,
  validator: (value: unknown) => !value || allowedValues.includes(value)
});

export const url = (message = 'Ingresa una URL válida'): ValidationRule => ({
  type: 'url',
  message,
  validator: (value: string) => {
    if (!value) return true;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }
});

/**
 * ============================================
 * VALIDACIONES CONDICIONALES
 * ============================================
 */

export const requiredIf = (
  condition: (formData: Record<string, unknown>) => boolean,
  message = 'Este campo es obligatorio'
): ValidationRule => ({
  type: 'requiredIf',
  message,
  validator: (value: unknown, formData?: Record<string, unknown>) => {
    if (!formData || !condition(formData)) return true;
    if (typeof value === 'string') return value.trim().length > 0;
    return value !== null && value !== undefined && value !== '';
  }
});

export const requiredIfField = (
  fieldName: string,
  fieldValue: unknown,
  message = 'Este campo es obligatorio'
): ValidationRule => ({
  type: 'requiredIfField',
  message,
  validator: (value: unknown, formData?: Record<string, unknown>) => {
    if (!formData || formData[fieldName] !== fieldValue) return true;
    if (typeof value === 'string') return value.trim().length > 0;
    return value !== null && value !== undefined && value !== '';
  }
});