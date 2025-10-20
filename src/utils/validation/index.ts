/**
 * Índice principal del sistema de validaciones
 * Exporta todas las funcionalidades para uso en la aplicación
 */

// Tipos
export type { 
  ValidationRule, 
  FieldValidation, 
  ValidationSchema, 
  ValidationResult,
  ValidationOptions
} from './types';

// Reglas de validación
export * as rules from './rules';

// Funciones del validador
export {
  validateField,
  validateForm,
  validateTouchedFields,
  getFieldErrors,
  isFormValid,
  getRequiredFields,
  hasRequiredFields
} from './validator';

// Schemas predefinidos
export * as schemas from './schemas';

// Hook personalizado
export { useValidation, useFormValidation } from './useValidation';

// Re-exportaciones para facilidad de uso
export { 
  required,
  minLength,
  maxLength,
  email,
  phone,
  username,
  alphanumeric,
  alphabetic,
  numeric,
  decimal,
  dni,
  ruc,
  dateFormat,
  minAge,
  maxAge,
  pastDate,
  futureDate,
  password,
  confirmPassword,
  custom,
  oneOf,
  url,
  requiredIf,
  requiredIfField,
  codigoEstudiante,
  codigoDocente
} from './rules';