# Sistema de Gestión de Notas

Un sistema web moderno para la gestión académica que permite a docentes administrar estudiantes, cursos y calificaciones, mientras que los estudiantes pueden consultar su información académica de manera intuitiva.

## **Descripción del Proyecto**

Sistema integral de gestión de notas educativas desarrollado con React + TypeScript, diseñado para facilitar la administración académica en instituciones educativas. El sistema cuenta con roles diferenciados para docentes y estudiantes, ofreciendo una experiencia personalizada según el tipo de usuario.

## **Características Principales**

### **Sistema de Autenticación** (Próximamente)
- **Login diferenciado** por roles (Docente/Estudiante)
- **Registro de usuarios** con validación de roles
- **Sesiones seguras** con persistencia local

### **Panel de Docentes**
- **Gestión de Estudiantes**: Crear, editar, eliminar y listar estudiantes
- **Gestión de Cursos**: Administrar materias y asignaturas
- **Registro de Notas**: Asignar calificaciones a estudiantes por curso
- **Dashboard Estadístico**: Visualización de rendimiento académico
- **Reportes y Análisis**: Promedios, estadísticas de excelencia académica

### **Panel de Estudiantes** (Próximamente)
- **Consulta de Notas**: Ver calificaciones por curso
- **Promedio Académico**: Cálculo automático de rendimiento
- **Información de Cursos**: Detalles de materias inscritas
- **Perfil Personal**: Gestión de información básica

### **Gestión de Datos**
- **localStorage**: Persistencia local sin necesidad de backend
- **Datos de Prueba**: Inicialización automática con información de ejemplo
- **Reinicio de Datos**: Comandos para resetear la información
- **Preparado para Backend**: Arquitectura lista para migración a APIs

## **Tecnologías Utilizadas**

### **Frontend**
- **React 19.1.0** - Biblioteca principal de UI
- **TypeScript** - Tipado estático para mayor robustez
- **Vite** - Bundler moderno y rápido
- **Bootstrap 5.3.6** - Framework CSS para diseño responsive
- **Framer Motion 12.23.3** - Animaciones y transiciones fluidas
- **React Router Dom 7.6.2** - Navegación SPA
- **Axios 1.10.0** - Cliente HTTP (preparado para APIs futuras)

### **UI/UX**
- **Bootstrap Icons 1.13.1** - Iconografía consistente
- **React Bootstrap 2.10.10** - Componentes React + Bootstrap
- **Animaciones personalizadas** con Framer Motion
- **Diseño responsive** adaptable a todos los dispositivos

### **Desarrollo**
- **ESLint** - Linting y calidad de código
- **TypeScript** - Tipado estático y mejor DX
- **Vite HMR** - Hot Module Replacement para desarrollo ágil

## **Estructura del Proyecto**

```
src/
├── api/                    # Servicios de datos
│   ├── CursoService.ts     # CRUD de cursos
│   ├── EstudianteService.ts # CRUD de estudiantes
│   ├── NotaService.ts      # CRUD de notas
│   └── DashboardService.ts # Estadísticas y análisis
├── localStorage/           # Persistencia local
│   ├── LocalStorageService.ts # Servicio genérico CRUD
│   ├── DataInitializer.ts     # Datos por defecto
│   └── index.ts              # Exports centralizados
├── components/             # Componentes reutilizables
│   ├── Forms/              # Formularios de entrada
│   ├── Lists/              # Listas y tablas de datos
│   ├── Dashboard/          # Componentes de estadísticas
│   ├── Layout/             # Estructura base
│   └── Modals/             # Ventanas modales
├── interfaces/             # Tipos TypeScript
│   ├── Curso.ts
│   ├── Estudiante.ts
│   ├── Nota.ts
│   └── Dashboard.ts
├── pages/                  # Páginas principales
│   ├── Home.tsx            # Dashboard principal
│   ├── Estudiantes.tsx     # Gestión de estudiantes
│   ├── Cursos.tsx          # Gestión de cursos
│   └── Notas.tsx           # Gestión de notas
└── routes/                 # Configuración de rutas
    └── router.tsx
```

## **Instalación y Configuración**

### **Prerrequisitos**
- **Node.js** >= 18.0.0
- **npm** >= 8.0.0 (o **yarn** >= 1.22.0)
- **Git** para clonado del repositorio

### **Pasos de Instalación**

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/JBriam/gestion-notas-frontend.git
   cd gestion-notas-frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o si usas yarn
   yarn install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   # o si usas yarn
   yarn dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:5173
   ```

### **Scripts Disponibles**

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Genera build optimizado
npm run preview      # Preview del build de producción

# Calidad de Código
npm run lint         # Ejecuta ESLint para verificar código
```

## **Datos de Prueba**

El sistema incluye datos de ejemplo que se cargan automáticamente:

### **Estudiantes (5)**
- Juan Carlos Pérez García
- María Elena González López
- Luis Fernando Martínez Rodríguez
- Ana Sofía Hernández Silva
- Carlos Eduardo López Torres

### **Cursos (7)**
- Matemáticas, Español, Ciencias Naturales
- Historia, Inglés, Educación Física, Arte

### **Notas (5)**
- Calificaciones distribuidas entre estudiantes y cursos
- Promedios calculados automáticamente
- Niveles de rendimiento visuales

## **Gestión de Datos localStorage**

### **Reiniciar Datos**
Abre la consola del navegador (F12) y ejecuta:

```javascript
// Reiniciar con datos por defecto
window.reiniciarLocalStorage()

// Limpiar todos los datos
window.limpiarLocalStorage()

// Solo agregar datos iniciales
window.inicializarDatos()
```

### **Verificar Estado**
```javascript
// Ver cantidad de datos almacenados
console.log('Estudiantes:', JSON.parse(localStorage.getItem('estudiantes') || '[]').length)
console.log('Cursos:', JSON.parse(localStorage.getItem('cursos') || '[]').length)
console.log('Notas:', JSON.parse(localStorage.getItem('notas') || '[]').length)
```

## **Funcionalidades Actuales**

### **Implementado**
- [x] Gestión completa de estudiantes (CRUD)
- [x] Gestión completa de cursos (CRUD)
- [x] Gestión completa de notas (CRUD)
- [x] Dashboard con estadísticas en tiempo real
- [x] Persistencia local con localStorage
- [x] Interfaz responsive con Bootstrap
- [x] Animaciones fluidas con Framer Motion
- [x] Navegación SPA con React Router
- [x] Tipado estático con TypeScript

### **En Desarrollo**
- [ ] Sistema de autenticación (Login/Registro)
- [ ] Roles de usuario (Docente/Estudiante)
- [ ] Panel específico para estudiantes
- [ ] Autenticación con JWT
- [ ] Integración con backend/API

### **Planificado**
- [ ] Reportes en PDF
- [ ] Gráficos avanzados de rendimiento
- [ ] Notificaciones push
- [ ] Modo offline completo
- [ ] Sincronización multi-dispositivo

## **Arquitectura de Roles** (Próximamente)

### **Docente**
```
Acceso Completo:
├── Dashboard estadístico
├── Gestión de estudiantes
├── Gestión de cursos
├── Registro de notas
├── Reportes y análisis
└── Configuración del sistema
```

### **Estudiante**
```
Acceso Limitado:
├── Ver sus notas
├── Ver sus cursos
├── Ver su promedio
├── Información personal
└── Dashboard personal
```

## **Migración a Backend**

El proyecto está arquitectónicamente preparado para migración gradual:

### **Actual**
```typescript
// localStorage
export const EstudianteService = {
  async listar(): Promise<Estudiante[]> {
    return await estudianteStorage.getAll();
  }
}
```

### **Futuro**
```typescript
// API Backend
export const EstudianteService = {
  async listar(): Promise<Estudiante[]> {
    const res = await api.get("/estudiantes");
    return res.data;
  }
}
```

**Los componentes NO necesitan cambios**

## **Capturas de Pantalla**

*(Próximamente se agregarán capturas del sistema funcionando)*

## **Contribución**

### **Flujo de Trabajo**
1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

### **Estándares de Código**
- Usar **TypeScript** para tipado estático
- Seguir convenciones de **ESLint**
- Comentar código complejo
- Mantener componentes pequeños y reutilizables

## **Licencia**

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
