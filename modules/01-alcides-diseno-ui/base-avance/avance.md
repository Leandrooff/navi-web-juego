# Avance Alcides · Diseño UI

## Qué subí
- `src/estilos-ui.css` → sistema de diseño completo (colores, tipografía, botones, tarjetas, mensajes, estado vacío). **Es la base que todos deben reutilizar.**
- `src/pantalla-inicio.html` → inicio con título NAVI, botón comenzar, botón biblioteca y acceso a perfil.
- `src/pantalla-biblioteca.html` → tarjetas de cuento en sus 4 estados (nuevo, en progreso, completado, bloqueado) + estado vacío.
- `src/pantalla-juego.html` → escena con imagen, texto, opciones de decisión y puntos.
- `src/pantalla-resultado.html` → estrellas, mensaje positivo, logro, recomendación y botón de volver.
- `src/guia-estilos.html` → showcase de toda la UI (referencia visual para el equipo).
- `src/colores.md` → documentación de la paleta.
- `assets/` → logo e íconos en SVG (cuento, estrella, logro, usuario).

## Qué archivo se abre primero
`src/pantalla-inicio.html` (doble clic, se abre en el navegador, no necesita backend).
Para ver todos los componentes juntos: `src/guia-estilos.html`.

## Colores que recomiendo
- Principal: azul NAVI `#2356d8`
- Recompensa/estrellas: amarillo `#ffc43d`
- Positivo `#1fa971` · Advertencia `#e09112` · Error `#e5484d`
- Fondo `#f3f8fc`, texto `#14293d`. Detalle completo en `src/colores.md`.

## Funciones visuales incluidas
- Botones: principal, secundario, recompensa, fantasma y deshabilitado.
- Tarjetas de cuento con estados: nuevo, en progreso, completado, bloqueado.
- Mensajes: positivo, advertencia, error.
- Estado vacío cuando no hay cuentos.
- Íconos sugeridos para cuento, estrella, logro y usuario.

## Qué falta
- Imágenes finales de cada escena (ahora hay ilustraciones SVG de muestra).
- Pantalla de perfil detallada (la lleva el módulo de Gabriela - Perfil y progreso).
- Ajustar textos definitivos de los cuentos cuando el módulo de cuentos los entregue.
