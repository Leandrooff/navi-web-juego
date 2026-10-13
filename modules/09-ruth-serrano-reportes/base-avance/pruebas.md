# Pruebas del módulo de reportes

Comprobadas el 13/10/2026 con navegador Chromium y datos demo.
Se comprobaron las interacciones de ambas pantallas y se revisaron capturas en
pantalla de escritorio (1440 px) y móvil (390 px). No sustituyen las pruebas de
integración con el backend ni una auditoría completa de accesibilidad.

| Caso | Resultado esperado y comprobado |
| --- | --- |
| Seleccionar Sofía | Avance 67 %, 2 cuentos completados, 30 puntos, 5 estrellas, 3 decisiones correctas y 1 incorrecta. |
| Filtrar «Me perdí en el parque» | Un cuento en el historial, una recomendación y el tema «Seguridad ante desconocidos». El puntaje general sigue en 30. |
| Abrir su detalle | Dos decisiones: una correcta y una incorrecta. |
| Volver a reportes | Se conserva Sofía y el filtro del parque. |
| Ver todos los cuentos | Se muestran los dos cuentos de Sofía. |
| Seleccionar Mateo | Avance 33 %, 1 cuento completado, 20 puntos, 3 estrellas. Otro cuento figura en progreso. |
| Abrir el cuento en progreso | Se informa que todavía no hay decisiones registradas. |
| Seleccionar Valentina | Avance y totales en 0; mensajes de historial, logros y decisiones sin actividad. |
| Diseño compartido | Se carga el azul NAVI #2356d8 y las clases de paneles, botones y logros. |
| Vista móvil | El contenido cabe en 390 px; la tabla admite desplazamiento horizontal. |
| Enlace a un niño/cuento inexistente | Mensaje de reporte no encontrado; el detalle queda oculto y se puede volver. |
| JSON vacío, inválido o respuesta 404 | Mensaje visible de error; los selectores permanecen deshabilitados. |

Las pruebas no registraron errores de JavaScript sin manejar.

## Repetir manualmente

1. Iniciar el servidor según README.md y abrir el dashboard.
2. Comprobar los resultados de Sofía y probar el filtro del parque.
3. Abrir «Ver detalle», revisar sus decisiones y volver al dashboard.
4. Usar «Ver todos los cuentos» y cambiar a Mateo; revisar el cuento en progreso.
5. Cambiar a Valentina y comprobar los mensajes de falta de actividad.
6. Reducir el ancho de la ventana y comprobar la distribución y el desplazamiento de la tabla.
7. Navegar con Tab: comprobar que los selectores, botones y enlaces tienen foco visible.

Pendiente: probar autenticación, permisos y datos de la API real cuando se integren.
