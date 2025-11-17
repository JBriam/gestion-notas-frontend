/**
 * Schemas de validación predefinidos para formularios comunes
 * Usa estas configuraciones como base para tus formularios
 */

import type { ValidationSchema } from './types';
import * as rules from './rules';

/**
 * ============================================
 * SCHEMAS DE AUTENTICACIÓN
 * ============================================
 */

export const loginSchema: ValidationSchema = {
  email: {
    required: true,
    rules: [
      rules.required('El email es obligatorio'),
      rules.email('Ingresa un email válido'),
      rules.maxLength(100, 'El email no puede tener más de 100 caracteres')
    ]
  },
  password: {
    required: true,
    rules: [
      rules.required('La contraseña es obligatoria'),
      rules.minLength(6, 'La contraseña debe tener al menos 6 caracteres'),
      rules.maxLength(100, 'La contraseña no puede tener más de 100 caracteres')
    ]
  }
};

export const registerSchema: ValidationSchema = {
  nombres: {
    required: true,
    rules: [
      rules.required('Los nombres son obligatorios'),
      rules.minLength(2, 'Los nombres deben tener al menos 2 caracteres'),
      rules.maxLength(50, 'Los nombres no pueden tener más de 50 caracteres'),
      rules.alphabetic('Los nombres solo pueden contener letras y espacios')
    ]
  },
  apellidos: {
    required: true,
    rules: [
      rules.required('Los apellidos son obligatorios'),
      rules.minLength(2, 'Los apellidos deben tener al menos 2 caracteres'),
      rules.maxLength(50, 'Los apellidos no pueden tener más de 50 caracteres'),
      rules.alphabetic('Los apellidos solo pueden contener letras y espacios')
    ]
  },
  email: {
    required: true,
    rules: [
      rules.required('El email es obligatorio'),
      rules.email('Ingresa un email válido'),
      rules.maxLength(100, 'El email no puede tener más de 100 caracteres')
    ]
  },
  telefono: {
    required: false,
    rules: [
      rules.phonePeruvian('Ingresa un teléfono válido de 9 dígitos que empiece con 9 (ej: 987654321)')
    ]
  },
  password: {
    required: true,
    rules: [
      rules.required('La contraseña es obligatoria'),
      rules.minLength(6, 'La contraseña debe tener al menos 6 caracteres'),
      rules.maxLength(100, 'La contraseña no puede tener más de 100 caracteres')
    ]
  },
  confirmPassword: {
    required: true,
    rules: [
      rules.required('Confirma tu contraseña'),
      rules.confirmPassword('password', 'Las contraseñas no coinciden')
    ]
  },
  rol: {
    required: true,
    rules: [
      rules.required('Selecciona un tipo de usuario')
    ]
  }
};

/**
 * ============================================
 * SCHEMAS DE ESTUDIANTES
 * ============================================
 */

export const estudianteSchema: ValidationSchema = {
  nombres: {
    required: true,
    rules: [
      rules.required('Los nombres son obligatorios'),
      rules.minLength(2, 'Los nombres deben tener al menos 2 caracteres'),
      rules.maxLength(100, 'Los nombres no pueden tener más de 100 caracteres'),
      rules.alphabetic('Solo se permiten letras y espacios')
    ]
  },
  apellidos: {
    required: true,
    rules: [
      rules.required('Los apellidos son obligatorios'),
      rules.minLength(2, 'Los apellidos deben tener al menos 2 caracteres'),
      rules.maxLength(100, 'Los apellidos no pueden tener más de 100 caracteres'),
      rules.alphabetic('Solo se permiten letras y espacios')
    ]
  },
  email: {
    required: true,
    rules: [
      rules.required('El email es obligatorio'),
      rules.email('Ingresa un email válido')
    ]
  },
  codigoEstudiante: {
    required: true,
    rules: [
      rules.required('El código de estudiante es obligatorio'),
      rules.codigoEstudiante('El código debe tener formato EST seguido de números (ej: EST001)')
    ]
  },
  telefono: {
    required: false,
    rules: [
      rules.phone('Ingresa un teléfono válido')
    ]
  },
  fechaNacimiento: {
    required: false,
    rules: [
      rules.dateFormat('Formato de fecha inválido'),
      rules.pastDate('La fecha de nacimiento debe ser anterior a hoy'),
      rules.minAge(5, 'El estudiante debe tener al menos 5 años'),
      rules.maxAge(80, 'Edad no válida')
    ]
  },
  distrito: {
    required: false,
    rules: [
      rules.alphabetic('Solo se permiten letras y espacios')
    ]
  }
};

/**
 * ============================================
 * SCHEMAS DE DOCENTES
 * ============================================
 */

export const docenteSchema: ValidationSchema = {
  nombres: {
    required: true,
    rules: [
      rules.required('Los nombres son obligatorios'),
      rules.minLength(2, 'Los nombres deben tener al menos 2 caracteres'),
      rules.maxLength(100, 'Los nombres no pueden tener más de 100 caracteres'),
      rules.alphabetic('Solo se permiten letras y espacios')
    ]
  },
  apellidos: {
    required: true,
    rules: [
      rules.required('Los apellidos son obligatorios'),
      rules.minLength(2, 'Los apellidos deben tener al menos 2 caracteres'),
      rules.maxLength(100, 'Los apellidos no pueden tener más de 100 caracteres'),
      rules.alphabetic('Solo se permiten letras y espacios')
    ]
  },
  email: {
    required: true,
    rules: [
      rules.required('El email es obligatorio'),
      rules.email('Ingresa un email válido')
    ]
  },
  especialidad: {
    required: true,
    rules: [
      rules.required('La especialidad es obligatoria'),
      rules.minLength(2, 'La especialidad debe tener al menos 2 caracteres'),
      rules.maxLength(100, 'La especialidad no puede tener más de 100 caracteres')
    ]
  },
  telefono: {
    required: false,
    rules: [
      rules.phone('Ingresa un teléfono válido')
    ]
  },
  fechaContratacion: {
    required: false,
    rules: [
      rules.dateFormat('Formato de fecha inválido'),
      rules.pastDate('La fecha de contratación debe ser anterior a hoy')
    ]
  },
  distrito: {
    required: false,
    rules: [
      rules.alphabetic('Solo se permiten letras y espacios')
    ]
  }
};

/**
 * ============================================
 * SCHEMAS DE CURSOS
 * ============================================
 */

export const cursoSchema: ValidationSchema = {
  nombre: {
    required: true,
    rules: [
      rules.required('El nombre del curso es obligatorio'),
      rules.minLength(3, 'El nombre debe tener al menos 3 caracteres'),
      rules.maxLength(100, 'El nombre no puede tener más de 100 caracteres')
    ]
  },
  descripcion: {
    required: false,
    rules: [
      rules.maxLength(500, 'La descripción no puede tener más de 500 caracteres')
    ]
  },
  creditos: {
    required: true,
    rules: [
      rules.required('Los créditos son obligatorios'),
      rules.numeric('Solo se permiten números'),
      rules.minValue(1, 'Debe tener al menos 1 crédito'),
      rules.maxValue(10, 'No puede tener más de 10 créditos')
    ]
  }
};

/**
 * ============================================
 * SCHEMAS DE NOTAS
 * ============================================
 */

export const notaSchema: ValidationSchema = {
  nota: {
    required: true,
    rules: [
      rules.required('La nota es obligatoria'),
      rules.decimal('Ingresa un número válido'),
      rules.minValue(0, 'La nota mínima es 0'),
      rules.maxValue(20, 'La nota máxima es 20')
    ]
  },
  tipoEvaluacion: {
    required: true,
    rules: [
      rules.required('El tipo de evaluación es obligatorio'),
      rules.oneOf(['Examen', 'Tarea', 'Proyecto', 'Participación'], 'Tipo de evaluación no válido')
    ]
  },
  fecha: {
    required: true,
    rules: [
      rules.required('La fecha es obligatoria'),
      rules.dateFormat('Formato de fecha inválido')
    ]
  },
  observaciones: {
    required: false,
    rules: [
      rules.maxLength(255, 'Las observaciones no pueden tener más de 255 caracteres')
    ]
  }
};

/**
 * ============================================
 * SCHEMAS DE PERFIL
 * ============================================
 */

export const perfilSchema: ValidationSchema = {
  nombres: {
    required: true,
    rules: [
      rules.required('Los nombres son obligatorios'),
      rules.alphabetic('Solo se permiten letras y espacios')
    ]
  },
  apellidos: {
    required: true,
    rules: [
      rules.required('Los apellidos son obligatorios'),
      rules.alphabetic('Solo se permiten letras y espacios')
    ]
  },
  telefono: {
    required: false,
    rules: [
      rules.phone('Ingresa un teléfono válido')
    ]
  },
  distrito: {
    required: false,
    rules: [
      rules.alphabetic('Solo se permiten letras y espacios')
    ]
  }
};

export const cambiarPasswordSchema: ValidationSchema = {
  currentPassword: {
    required: true,
    rules: [
      rules.required('La contraseña actual es obligatoria')
    ]
  },
  newPassword: {
    required: true,
    rules: [
      rules.required('La nueva contraseña es obligatoria'),
      rules.password.medium('La contraseña debe tener al menos 8 caracteres, una mayúscula y un número')
    ]
  },
  confirmPassword: {
    required: true,
    rules: [
      rules.required('Confirma la nueva contraseña'),
      rules.confirmPassword('newPassword', 'Las contraseñas no coinciden')
    ]
  }
};