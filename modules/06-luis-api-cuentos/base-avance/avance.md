# Avance Luis - Módulo 06 (API de Cuentos)

## Que debes subir
- **Endpoints y funciones de cuentos:** Implementados en `src/routes/cuentos.routes.js` (`/api/stories`, `/api/stories/:id`, `/api/stories/:id/scenes`).
- **JSON de respuestas:** Definidos en `src/controllers/cuentos.controller.js` con las estructuras de respuesta para el motor de cuentos y la biblioteca.
- **Guardado de decisión:** Endpoint `POST /api/decisions` y `POST /api/progress` creados para registrar las elecciones del niño en tiempo real.
- **Guardado de puntaje:** Endpoint `POST /api/scores` configurado para recibir el puntaje acumulado y retornar el resultado educativo.

## Como verlo
- Las rutas principales están definidas en el archivo `src/routes/cuentos.routes.js`.
- Las respuestas demo en formato JSON se encuentran dentro de `src/controllers/cuentos.controller.js`.

## Falta
- Conectar los controladores con la base de datos (módulo 08 de Ruth) para persistir las decisiones y puntajes.
- Validar la autenticación y permisos con el módulo 05 (Josué).
