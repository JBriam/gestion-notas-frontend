/**
 * Hook personalizado para manejar validaciones en formularios
 * Simplifica el uso del sistema de validaciones en componentes React
 */

import { useState, useCallback, useMemo } from 'react';
import type { ValidationSchema } from './types';
import { validateForm, validateField, getFieldErrors, isFormValid } from './validator';

interface UseValidationOptions {
  mode?: 'onChange' | 'onBlur' | 'onSubmit';
  revalidateMode?: 'onChange' | 'onBlur';
  validateOnMount?: boolean;
}

interface UseValidationReturn<T> {
  // Estados
  errors: Record<keyof T, string>;
  touched: Record<keyof T, boolean>;
  isValid: boolean;
  isValidating: boolean;

  // Funciones
  validateField: (fieldName: keyof T, value: any) => string;
  validateForm: () => boolean;
  setFieldTouched: (fieldName: keyof T, isTouched?: boolean) => void;
  setError: (fieldName: keyof T, error: string) => void;
  clearError: (fieldName: keyof T) => void;
  clearAllErrors: () => void;
  reset: () => void;

  // Handlers para inputs
  getFieldProps: (fieldName: keyof T) => {
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    className: string;
  };
}

export function useValidation<T extends Record<string, any>>(
  schema: ValidationSchema,
  formData: T,
  options: UseValidationOptions = {}
): UseValidationReturn<T> {
  const {
    mode = 'onBlur',
    revalidateMode = 'onChange',
    validateOnMount = false
  } = options;

  const [errors, setErrors] = useState<Record<keyof T, string>>({} as Record<keyof T, string>);
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);
  const [isValidating, setIsValidating] = useState(false);

  // Validar un campo específico
  const validateSingleField = useCallback((fieldName: keyof T, value: any): string => {
    const fieldValidation = schema[fieldName as string];
    if (!fieldValidation) return '';
    
    return validateField(value, fieldValidation.rules, formData);
  }, [schema, formData]);

  // Validar todo el formulario
  const validateFullForm = useCallback((): boolean => {
    setIsValidating(true);
    
    const result = validateForm(formData, schema);
    setErrors(result.errors as Record<keyof T, string>);
    
    // Marcar todos los campos como tocados
    const allTouched = Object.keys(schema).reduce((acc, key) => {
      acc[key as keyof T] = true;
      return acc;
    }, {} as Record<keyof T, boolean>);
    setTouched(allTouched);
    
    setIsValidating(false);
    return result.isValid;
  }, [formData, schema]);

  // Verificar si el formulario es válido
  const formIsValid = useMemo(() => {
    return isFormValid(formData, schema);
  }, [formData, schema]);

  // Marcar un campo como tocado
  const setFieldTouched = useCallback((fieldName: keyof T, isTouched = true) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: isTouched
    }));
  }, []);

  // Establecer error en un campo
  const setError = useCallback((fieldName: keyof T, error: string) => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  }, []);

  // Limpiar error de un campo
  const clearError = useCallback((fieldName: keyof T) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  // Limpiar todos los errores
  const clearAllErrors = useCallback(() => {
    setErrors({} as Record<keyof T, string>);
  }, []);

  // Reset del formulario
  const reset = useCallback(() => {
    setErrors({} as Record<keyof T, string>);
    setTouched({} as Record<keyof T, boolean>);
  }, []);

  // Handlers para inputs
  const getFieldProps = useCallback((fieldName: keyof T) => {
    return {
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
        
        // Validar en onChange si el modo lo permite o si ya fue tocado y estamos en revalidateMode
        if (mode === 'onChange' || (touched[fieldName] && revalidateMode === 'onChange')) {
          const error = validateSingleField(fieldName, value);
          if (error) {
            setError(fieldName, error);
          } else {
            clearError(fieldName);
          }
        }
      },
      
      onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
        
        // Marcar como tocado
        setFieldTouched(fieldName, true);
        
        // Validar en onBlur si el modo lo permite
        if (mode === 'onBlur' || mode === 'onChange') {
          const error = validateSingleField(fieldName, value);
          if (error) {
            setError(fieldName, error);
          } else {
            clearError(fieldName);
          }
        }
      },
      
      className: errors[fieldName] ? 'input-error' : ''
    };
  }, [mode, revalidateMode, touched, validateSingleField, setError, clearError, setFieldTouched, errors]);

  // Validar en mount si se requiere
  useState(() => {
    if (validateOnMount) {
      validateFullForm();
    }
  });

  return {
    // Estados
    errors,
    touched,
    isValid: formIsValid,
    isValidating,

    // Funciones
    validateField: validateSingleField,
    validateForm: validateFullForm,
    setFieldTouched,
    setError,
    clearError,
    clearAllErrors,
    reset,
    getFieldProps
  };
}

/**
 * Hook simplificado para validación básica
 */
export function useFormValidation<T extends Record<string, any>>(
  schema: ValidationSchema,
  formData: T
) {
  return useValidation(schema, formData, {
    mode: 'onBlur',
    revalidateMode: 'onChange'
  });
}