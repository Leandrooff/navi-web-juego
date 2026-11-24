# Validación de perfil y progreso integrado

Fecha: 24 de noviembre de 2026. Base: PR 14, revisión 653fd91. Se usaron cuentas ficticias y una base MariaDB temporal independiente.

## Resultados observados

- Creación de perfiles con edades 6 y 10; rechazo de edades 5 y 11 en la API. Edición de alias, edad, emblema, color y acompañamiento comprobada en la prueba del servidor; edición de alias y color comprobada en navegador.
- Dos perfiles de una familia: al avanzar con Luna, Sol abre su propia aventura desde el principio. Al volver a elegir a Luna después de recargar, se recupera la consecuencia pendiente.
- El servidor conserva la sesión activa del perfil correcto y rechaza que otro tutor acceda a progreso, modifique un perfil o consulte una sesión ajena. Las pruebas existentes también verifican historial y recuerdos frente a otro tutor.
- En navegador se completaron tres recorridos, se observaron los finales, logros y recuerdos, y se consultó el informe familiar. Tras cerrar sesión y volver a entrar, el informe conservó las tres partidas. También se probó consentimiento, acceso docente y revocación.
- Cinco pruebas del motor y la compilación del frontend pasaron. En Laravel pasaron 14 pruebas con 643 aserciones, incluida la prueba nueva para dos perfiles.

## Reproducción

Preparar una base aislada terminada en `_test`, configurar el backend y cargar migraciones y datos de prueba siguiendo `docs/INSTALACION.md`. Ejecutar `php artisan test` desde `backend`, y `npm test` y `npm run build` desde `frontend`. Con backend y frontend iniciados, ejecutar `node e2e/profile-isolation.mjs`, `npm run test:ux` y `npm run test:e2e` desde `frontend`; estas pruebas requieren Playwright y Chromium.

## Pendiente de coordinación

Contrastar el contenido de logros y recuerdos con Alejandra, los informes con Ruth Serrano y la prueba de aislamiento con Josué. Las pruebas técnicas aquí registradas no sustituyen esa revisión conjunta. La prueba de dos perfiles incluye recarga y reanudación; el cierre y nuevo inicio de sesión se comprobó en el recorrido general de un perfil.
