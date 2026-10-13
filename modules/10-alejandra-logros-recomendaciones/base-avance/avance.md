# Avanza Alejandra

## Que debes subir

- Pantalla de logros: hecha (`src/logros.html` y `src/logros.css`). Muestra las insignias ganadas y el progreso de las que faltan.
- Cálculo de estrellas: hecho (`calcularEstrellas` en `src/logros.js`). 0 a 9 puntos = 1 estrella, 10 a 19 = 2 estrellas, 20 o más = 3 estrellas.
- Mensajes positivos: la función está hecha (`mensajePositivo`, con los textos en `demo/logros-demo.json`). Aún no se muestra en una pantalla de resultado.
- Recomendaciones: la función está hecha (`recomendar`). Da un refuerzo positivo por cada decisión segura y un consejo amable por cada decisión no segura, en las categorías perderse, desconocidos, cruzar calle y emergencia. Aún no se muestra en una pantalla de recomendación final.

## Como verlo

Abrir `src/logros.html` con Live Server en VS Code (necesita servidor local porque lee `demo/logros-demo.json`). Los logros que existen son: Primer paso, Estrella brillante, Decisión segura, Pido ayuda, Pequeño lector y Coleccionista de estrellas. Cada uno tiene nombre, descripción, condición e icono en el archivo demo. Las funciones de cálculo están en `src/logros.js`.

## Falta

- Conectar con el puntaje del cuento: el módulo de cuentos debe guardar la sesión final en `sessionStorage` con la clave `navi_sesion_actual` (formato en el campo `sesion` de `demo/logros-demo.json`). Por ahora se usa una sesión demo.
- Pantalla de resultado, tarjeta de logro desbloqueada y recomendación final: quedan para una siguiente entrega.
- Guardar los logros en la base de datos por perfil infantil (hoy se guardan en `localStorage`).
