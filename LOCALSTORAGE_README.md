# Sistema de Gestión con localStorage

## 🚀 Funcionalidades Implementadas

Este sistema ahora funciona completamente con **localStorage** en lugar de una API backend, permitiendo realizar operaciones CRUD sin necesidad de servidor.

### ✅ Entidades Disponibles:
- **Estudiantes**: Crear, listar, editar y eliminar estudiantes
- **Cursos**: Crear, listar, editar y eliminar cursos
- **Notas**: Crear, listar, editar y eliminar notas (con relaciones)

## 🛠️ Arquitectura

### Servicios Implementados:
1. **LocalStorageService**: Clase genérica para manejar operaciones CRUD
2. **CursoService**: Operaciones específicas para cursos
3. **EstudianteService**: Operaciones específicas para estudiantes  
4. **NotaService**: Operaciones específicas para notas (maneja relaciones)

### Datos por Defecto:
- La aplicación se inicializa automáticamente con datos de prueba
- Incluye 7 cursos, 5 estudiantes y 5 notas de ejemplo

## 🎯 Uso del Sistema

### Operaciones Disponibles:

#### Estudiantes:
- ✅ Ver lista de estudiantes
- ✅ Agregar nuevo estudiante
- ✅ Editar estudiante existente
- ✅ Eliminar estudiante

#### Cursos:
- ✅ Ver lista de cursos
- ✅ Agregar nuevo curso
- ✅ Editar curso existente
- ✅ Eliminar curso

#### Notas:
- ✅ Ver lista de notas con estudiante y curso asociados
- ✅ Registrar nueva nota (seleccionando estudiante y curso)
- ✅ Editar nota existente
- ✅ Eliminar nota

## 🔧 Funciones Auxiliares

Para resetear o limpiar datos desde la consola del navegador:

\`\`\`javascript
// Importar funciones auxiliares (solo en desarrollo)
import { limpiarTodosLosDatos, reiniciarDatos } from './src/api/DataInitializer';

// Limpiar todos los datos
limpiarTodosLosDatos();

// Reiniciar con datos por defecto
reiniciarDatos();
\`\`\`

## 📂 Estructura de Datos en localStorage

El sistema utiliza las siguientes claves en localStorage:
- \`cursos\`: Array de objetos Curso
- \`estudiantes\`: Array de objetos Estudiante  
- \`notas\`: Array de objetos Nota (con objetos completos de estudiante y curso)

## 🔄 Migración Futura a API

El diseño permite una migración sencilla a APIs reales:

1. **Mantener interfaces**: Los tipos TypeScript permanecen iguales
2. **Actualizar servicios**: Reemplazar localStorage por llamadas HTTP
3. **Sin cambios en componentes**: Los componentes seguirán funcionando igual

### Ejemplo de migración:
\`\`\`typescript
// Actual (localStorage)
export const CursoService = {
  async listar(): Promise<Curso[]> {
    return await cursoStorage.getAll();
  }
}

// Futuro (API)
export const CursoService = {
  async listar(): Promise<Curso[]> {
    const res = await api.get("/cursos");
    return res.data;
  }
}
\`\`\`

## 💡 Ventajas de Esta Implementación

1. **Sin dependencias de backend**: Funciona completamente offline
2. **Persistencia**: Los datos se mantienen entre sesiones del navegador
3. **Fácil testing**: Ideal para pruebas y desarrollo frontend
4. **Transición gradual**: Permite desarrollar el frontend mientras se construye el backend
5. **Simulación realista**: Comportamiento similar a una API real (async/await)

## ⚠️ Limitaciones Temporales

- Los datos solo persisten en el navegador actual
- No hay sincronización entre dispositivos
- Capacidad limitada de localStorage (~5-10MB)
- No hay validación de servidor ni autenticación

Estas limitaciones se resolverán cuando se implemente el backend real.