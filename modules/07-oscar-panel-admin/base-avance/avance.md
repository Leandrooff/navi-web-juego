# Avance del Módulo Administrador

**Formularios subidos:**
- `admin-dashboard.html`: Panel principal con la lista de cuentos y botón de eliminación.
- `cuentos-form.html`: Formulario para crear/editar los detalles base del cuento (Título, Categoría, Estado, etc.).
- `escenas-form.html`: Formulario para estructurar escenas, asignar orden y crear o borrar opciones de decisión dinámicas.

**Datos demo usados:**
- Se integró `cuentos-admin-demo.json` para llenar automáticamente la tabla del dashboard usando Fetch API, mostrando estados de "borrador" o "publicado".

**Botones que funcionan:**
- Navegación entre el dashboard y los formularios (Crear Cuento, Editar, Escenas).
- Botón dinámico "+ Añadir Opción" y "✕ Eliminar" en el gestor de escenas.
- Botón "Borrar" cuento directamente desde la tabla con mensaje de confirmación.
- Previsualización (Simulada con un popup).

**Qué falta guardar:**
- Falta la conexión con el backend/base de datos (peticiones DELETE, POST y PUT reales). Actualmente las eliminaciones ocurren dinámicamente en el DOM de la vista.