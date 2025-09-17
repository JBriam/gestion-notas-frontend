# 🔄 Cómo Reiniciar el localStorage

## 📋 Opciones disponibles

### **Opción 1: Desde la consola del navegador (MÁS FÁCIL)**

1. **Abre las herramientas de desarrollador** en tu navegador:
   - **Chrome/Edge**: `F12` o `Ctrl+Shift+I`
   - **Firefox**: `F12` o `Ctrl+Shift+K`

2. **Ve a la pestaña "Console" (Consola)**

3. **Ejecuta uno de estos comandos:**

   ```javascript
   // Para reiniciar con datos por defecto
   window.reiniciarLocalStorage()
   
   // Para limpiar completamente (sin datos)
   window.limpiarLocalStorage()
   
   // Para solo agregar datos por defecto (si está vacío)
   window.inicializarDatos()
   ```

4. **Recarga la página** (`F5` o `Ctrl+R`)

### **Opción 2: Manualmente desde las herramientas de desarrollador**

1. **Abre las herramientas de desarrollador** (`F12`)

2. **Ve a la pestaña "Application" (o "Almacenamiento")**

3. **En el panel izquierdo, busca "Local Storage"**

4. **Haz clic en tu dominio** (ej: `http://localhost:5173`)

5. **Selecciona las claves que quieras eliminar:**
   - `cursos`
   - `estudiantes` 
   - `notas`

6. **Haz clic derecho → "Delete" o presiona `Delete`**

7. **Recarga la página** para que se generen datos nuevos

### **Opción 3: Borrar todo el localStorage del navegador**

1. **Chrome/Edge:**
   - Ve a `Configuración` → `Privacidad y seguridad` → `Borrar datos de navegación`
   - Selecciona "Datos de sitios web almacenados"
   - Elige el rango de tiempo
   - Haz clic en "Borrar datos"

2. **Firefox:**
   - Ve a `Configuración` → `Privacidad y seguridad`
   - En "Cookies y datos del sitio" → `Borrar datos`

## 🎯 Comandos rápidos para la consola

```javascript
// Ver qué datos tienes actualmente
console.log('Estudiantes:', JSON.parse(localStorage.getItem('estudiantes') || '[]').length)
console.log('Cursos:', JSON.parse(localStorage.getItem('cursos') || '[]').length)  
console.log('Notas:', JSON.parse(localStorage.getItem('notas') || '[]').length)

// Reiniciar todo (RECOMENDADO)
window.reiniciarLocalStorage()

// Solo limpiar
window.limpiarLocalStorage()
```

## ⚡ Después de reiniciar

Cuando reinicies el localStorage, tendrás:

- **5 estudiantes** de ejemplo
- **7 cursos** de ejemplo  
- **5 notas** de ejemplo
- **Dashboard funcional** con estadísticas reales

## 🔄 Si algo no funciona

1. **Asegúrate de recargar la página** después de ejecutar los comandos
2. **Verifica que no hay errores en la consola**
3. **Si persisten problemas**, limpia completamente y recarga:
   ```javascript
   localStorage.clear()
   // Luego recarga la página
   ```

¡El sistema se reiniciará automáticamente con datos frescos! 🎉