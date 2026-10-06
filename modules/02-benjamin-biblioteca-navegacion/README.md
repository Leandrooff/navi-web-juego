# Módulo 02 — Benjamin — Biblioteca y Navegación

## Objetivo

Crear la biblioteca donde el niño elige qué cuento jugar y moverse entre las secciones principales.

Leer también `INSTRUCCIONES.md` dentro de esta misma carpeta para ver exactamente qué debes subir.

---

## Pantallas a desarrollar

- Biblioteca de cuentos.
- Menú principal.
- Pantalla de detalle corto del cuento.
- Filtro por categoría.
- Vista de cuento en progreso.

---

## Funciones necesarias

- Mostrar una lista de cuentos con imagen, título, categoría y estado.
- Filtrar cuentos por categoría: seguridad, casa, calle, escuela u otra.
- Buscar cuento por nombre.
- Mostrar estado: nuevo, en progreso o completado.
- Botón para iniciar aventura.
- Botón para continuar aventura si ya fue iniciada.
- Navegar entre inicio, biblioteca, perfil y progreso.

---

## Datos demo sugeridos

Crear un archivo `demo/cuentos-demo.json` con mínimo 5 cuentos.

Cada cuento debe tener:

- `id`
- `titulo`
- `categoria`
- `descripcion`
- `estado`
- `imagen`

---

## Estructura del módulo

```
modules/02-benjamin-biblioteca-navegacion/
  README.md
  INSTRUCCIONES.md
  base-avance/
    avance.md
  src/
    biblioteca.html
    biblioteca.css
    biblioteca.js
  demo/
    cuentos-demo.json
```

---

## Cómo probar

1. Abrir el archivo `src/biblioteca.html` directamente en el navegador.
2. No se necesita servidor. Los datos de cuentos se cargan automáticamente.
3. Si `fetch()` falla al abrir desde el sistema de archivos local, la aplicación usa datos de respaldo integrados.

---

## Entrega esperada

La pantalla de biblioteca con datos demo. Implementado en HTML5, CSS3 y JavaScript vanilla. Maqueta navegable y funcional.
