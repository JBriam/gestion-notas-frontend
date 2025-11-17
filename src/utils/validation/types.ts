/**
 * Tipos y interfaces para el sistema de validaciones
 */

export interface ValidationRule {
  type: string;
  message: string;
  value?: unknown;
  pattern?: RegExp;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validator?: (value: any, formData?: any) => boolean;
}

export interface FieldValidation {
  rules: ValidationRule[];
  required?: boolean;
}

export interface ValidationSchema {
  [fieldName: string]: FieldValidation;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface ValidationOptions {
  abortEarly?: boolean; // Parar en el primer error
  stripEmptyValues?: boolean; // Quitar valores vacíos antes de validar
  customMessages?: Record<string, string>; // Mensajes personalizados
}