# Sebastián Gómez · Validación final

## Punto de partida

La rama integrada incluye evidencias anteriores, pruebas automatizadas y scripts de navegador. La validación debe repetirse sobre el candidato que indique Alejandro.

**Dónde trabajar** · docs/PRUEBAS.md, docs/INSTALACION.md, frontend/e2e/ y backend/tests/Feature/.

## Trabajo pendiente

1. Registra SHA, fecha, sistema, versiones de Node, PHP y MariaDB y navegador. En un entorno limpio prepara una base aislada y cuentas sintéticas siguiendo la instalación del repositorio.
2. Ejecuta `php artisan test` en backend usando la base de pruebas documentada. En frontend ejecuta `npm test`, `npm run build`, `npm run test:e2e` y `npm run test:ux` con sus servicios y configuración de pruebas. Guarda resultados y recuentos.
3. Prueba familia → perfil → aventura → decisión → recarga → continuar → guardar final → volver a entrar. Recorre los tres finales representativos, comprueba que los premios no se duplican y cambia entre dos perfiles para verificar aislamiento.
4. Prueba docente → aula → consentimiento del tutor → asignación → informe → revocación. Comprueba recuperación ante error de red, teclado y móvil de 360 px. Valida audio y, según el alcance registrado, administración, catálogo y recomendaciones.
5. Por cada fallo registra módulo, pasos, resultado esperado, resultado observado, impacto y evidencia sintética. Vincula el PR de corrección y repite la prueba en el SHA candidato final. Marca cada caso como aprobado, fallido, bloqueado o fuera de alcance con su motivo.

## Qué subir al PR

Sube `docs/VALIDACION-FINAL.md` y enlázalo en tu PR. Incluye el SHA, comandos, tabla de casos, resultados, enlaces a correcciones y evidencia de una ejecución real sin datos personales.

## Criterio de aceptación

El commit identificado coincide con el que se presenta, pasan los flujos evaluables y no quedan fallos que bloqueen instalar, iniciar sesión, jugar, guardar o consultar informes autorizados.

## Referencias de trabajo

- [Guía general de entrega](../README.md)
- [Instalación](https://github.com/Leandrooff/navi-web-juego/blob/integracion-navi-aventura-mejoras/docs/INSTALACION.md)
- [Pruebas existentes](https://github.com/Leandrooff/navi-web-juego/blob/integracion-navi-aventura-mejoras/docs/PRUEBAS.md)
