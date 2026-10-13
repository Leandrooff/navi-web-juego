# Avance — Benjamin — Biblioteca y Navegación

## Archivo que abre la biblioteca

La biblioteca se abre desde:

```
src/biblioteca.html
```

Abrir ese archivo directamente en el navegador es suficiente para probar el módulo completo.
No se necesita servidor. El JavaScript incluye un fallback de datos por si fetch() falla al abrir desde el sistema de archivos.

---

## Filtros que funcionan

- **Búsqueda por nombre:** campo de texto que filtra en tiempo real por el título del cuento.
- **Filtro por categoría:** botones que filtran por: Todas, Seguridad, Casa, Calle, Escuela, Otra.
- Los dos filtros funcionan combinados al mismo tiempo.

---

## Cuentos demo subidos

**Total: 7 cuentos** en `demo/cuentos-demo.json`

| # | Título                     | Categoría  | Estado       |
|---|----------------------------|------------|--------------|
| 1 | El semáforo valiente       | calle      | nuevo        |
| 2 | La cocina y sus secretos   | casa       | en progreso  |
| 3 | El extraño en la puerta    | seguridad  | completado   |
| 4 | Amigos en el recreo        | escuela    | nuevo        |
| 5 | El parque seguro           | otra       | en progreso  |
| 6 | ¡Fuego, fuego!             | casa       | nuevo        |
| 7 | El camino a la escuela     | calle      | completado   |

---

## Pantallas implementadas

- [x] Inicio (con estadísticas de cuentos)
- [x] Biblioteca de cuentos (tarjetas con imagen, título, categoría, descripción, estado)
- [x] Detalle corto del cuento
- [x] Filtro por categoría
- [x] Vista de cuento en progreso (demostrativa — barra de progreso + navegación)
- [x] Perfil (vista demostrativa)
- [x] Progreso (vista demostrativa con lista de estados)

## Funciones implementadas

- [x] Lista de cuentos cargada desde JSON
- [x] Tarjeta por cuento con imagen, título, categoría, descripción y estado
- [x] Búsqueda por nombre en tiempo real
- [x] Filtro por categoría sin recargar la página
- [x] Estado: nuevo → botón "Jugar"
- [x] Estado: en progreso → botón "Continuar"
- [x] Estado: completado → indicador "Completado"
- [x] Detalle del cuento al seleccionar una tarjeta
- [x] Vista de cuento en progreso con barra de progreso demo
- [x] Navegación entre: Inicio, Biblioteca, Perfil, Progreso

---

## Qué falta conectar

- **Motor real de cuentos:** La vista de cuento en progreso es demostrativa. El motor completo de historias, escenas y decisiones corresponde al módulo de **Brayan (Módulo 03)**.
- **Perfil real del niño:** La vista de Perfil es demostrativa. La implementación real corresponde al módulo de **Gabriela (Módulo 12)**.
- **Reportes de progreso reales:** La vista de Progreso es demostrativa. Los reportes corresponden al módulo de **Ruth Serrano (Módulo 09)**.
- **API real de cuentos:** Los cuentos se cargan desde un JSON demo. La API real corresponde al módulo de **Luis (Módulo 06)**.
- **Integración final:** El responsable del proyecto realizará la fusión de módulos en la integración final.

---

## Actualización — Botones Jugar y Continuar con ID de cuento

- Los botones **Jugar** y **Continuar** ahora utilizan el **ID único del cuento** (`id` del JSON) como identificador.  
  No dependen del título, posición en el array ni ningún otro campo de texto.

- Se agregaron las funciones `jugarCuento(id)` y `continuarCuento(id)` en `src/biblioteca.js`,  
  preparadas como **punto de integración con el Motor de Cuentos del Módulo 03 (Brayan)**.

- Cuando el usuario pulsa **Jugar** (estado `nuevo`), se llama a `jugarCuento(id)` con el ID del cuento.  
  Cuando pulsa **Continuar** (estado `en progreso`), se llama a `continuarCuento(id)` con el ID del cuento.

- La implementación actual es **temporal**: registra el ID en consola y muestra la vista de progreso  
  como demo de navegación, igual que antes.

- **La conexión real con el motor de cuentos está pendiente.**  
  Brayan (Módulo 03) deberá reemplazar el cuerpo de `jugarCuento(id)` y `continuarCuento(id)`  
  con la llamada correspondiente a su motor, por ejemplo:  
  `motorDeCuentos.iniciar(id)` y `motorDeCuentos.continuar(id)`.

