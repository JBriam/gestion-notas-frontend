/**
 * Motor de validación principal
 * Ejecuta las validaciones y devuelve los resultados
 */

import type { ValidationSchema, ValidationResult, ValidationOptions } from './types';

/**
 * Valida un solo campo con sus reglas
 */
export const validateField = (
  value: any,
  rules: any[],
  formData?: any
): string => {
  for (const rule of rules) {
    if (rule.validator && !rule.validator(value, formData)) {
      return rule.message;
    }
  }
  return '';
};

/**
 * Valida un objeto completo contra un schema
 */
export const validateForm = (
  data: Record<string, any>,
  schema: ValidationSchema,
  options: ValidationOptions = {}
): ValidationResult => {
  const errors: Record<string, string> = {};
  const { abortEarly = false, stripEmptyValues = false } = options;

  // Limpiar valores vacíos si se requiere
  const cleanData = stripEmptyValues
    ? Object.fromEntries(
        Object.entries(data).filter(([, value]) => 
          value !== null && value !== undefined && value !== ''
        )
      )
    : data;

  // Validar cada campo según el schema
  for (const [fieldName, fieldValidation] of Object.entries(schema)) {
    const value = cleanData[fieldName];
    
    // Validar campo requerido
    if (fieldValidation.required) {
      if (value === null || value === undefined || 
          (typeof value === 'string' && value.trim() === '')) {
        errors[fieldName] = 'Este campo es obligatorio';
        if (abortEarly) break;
        continue;
      }
    }

    // Validar reglas
    const error = validateField(value, fieldValidation.rules, cleanData);
    if (error) {
      errors[fieldName] = error;
      if (abortEarly) break;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Valida solo los campos que han sido "tocados"
 */
export const validateTouchedFields = (
  data: Record<string, any>,
  schema: ValidationSchema,
  touched: Record<string, boolean>,
  options?: ValidationOptions
): ValidationResult => {
  const touchedSchema: ValidationSchema = {};
  
  // Solo incluir campos tocados en el schema
  for (const [fieldName, fieldValidation] of Object.entries(schema)) {
    if (touched[fieldName]) {
      touchedSchema[fieldName] = fieldValidation;
    }
  }

  return validateForm(data, touchedSchema, options);
};

/**
 * Obtiene los errores de validación para mostrar en tiempo real
 */
export const getFieldErrors = (
  data: Record<string, any>,
  schema: ValidationSchema,
  touched: Record<string, boolean>
): Record<string, string> => {
  const result = validateTouchedFields(data, schema, touched);
  return result.errors;
};

/**
 * Verifica si un formulario es válido para envío
 */
export const isFormValid = (
  data: Record<string, any>,
  schema: ValidationSchema
): boolean => {
  const result = validateForm(data, schema);
  return result.isValid;
};

/**
 * Obtiene los campos requeridos de un schema
 */
export const getRequiredFields = (schema: ValidationSchema): string[] => {
  return Object.entries(schema)
    .filter(([, fieldValidation]) => fieldValidation.required)
    .map(([fieldName]) => fieldName);
};

/**
 * Verifica si todos los campos requeridos tienen valor
 */
export const hasRequiredFields = (
  data: Record<string, any>,
  schema: ValidationSchema
): boolean => {
  const requiredFields = getRequiredFields(schema);
  
  return requiredFields.every(fieldName => {
    const value = data[fieldName];
    if (typeof value === 'string') return value.trim().length > 0;
    return value !== null && value !== undefined && value !== '';
  });
};