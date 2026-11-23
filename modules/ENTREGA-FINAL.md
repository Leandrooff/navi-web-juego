# NAVI · Instrucciones de entrega para 14 integrantes

La base funcional es [el PR #14](https://github.com/Leandrooff/navi-web-juego/pull/14), en la rama `integracion-navi-aventura-mejoras`. Sigue la [instalación vigente](../docs/INSTALACION.md) y consulta [las pruebas existentes](../docs/PRUEBAS.md). Cada guía indica qué revisar, qué implementar si falta, qué subir y cómo demostrar que funciona.

- [Alcides · Diseño visual](01-alcides-diseno-ui/INSTRUCCIONES-ENTREGA-FINAL.md)
- [Benjamín · Biblioteca y navegación](02-benjamin-biblioteca-navegacion/INSTRUCCIONES-ENTREGA-FINAL.md)
- [Brayan · Motor de cuentos](03-brayan-motor-cuentos/INSTRUCCIONES-ENTREGA-FINAL.md)
- [Fabián · Componentes React](04-fabian-componentes-frontend/INSTRUCCIONES-ENTREGA-FINAL.md)
- [Josué · Autenticación y permisos](05-josue-backend-auth-roles/INSTRUCCIONES-ENTREGA-FINAL.md)
- [Luis · API de cuentos y partidas](06-luis-api-cuentos/INSTRUCCIONES-ENTREGA-FINAL.md)
- [Óscar · Panel administrador](07-oscar-panel-admin/INSTRUCCIONES-ENTREGA-FINAL.md)
- [Ruth Mariela · Base de datos](08-ruth-mariela-base-datos/INSTRUCCIONES-ENTREGA-FINAL.md)
- [Ruth Serrano · Reportes](09-ruth-serrano-reportes/INSTRUCCIONES-ENTREGA-FINAL.md)
- [Alejandra Quiroga · Logros y recomendaciones](10-alejandra-logros-recomendaciones/INSTRUCCIONES-ENTREGA-FINAL.md)
- [Álvaro Rosas · Accesibilidad y audio](11-alvaro-accesibilidad-audio/INSTRUCCIONES-ENTREGA-FINAL.md)
- [Gabriela Peñaranda · Perfil y progreso](12-gabriela-perfil-progreso/INSTRUCCIONES-ENTREGA-FINAL.md)
- [Alejandro · Integración y entrega](13-alejandro-integracion/INSTRUCCIONES-ENTREGA-FINAL.md)
- [Sebastián Gómez · Validación final](14-sebastian-gomez-validacion-final/README.md)

## Cómo trabajar en GitHub

1. Actualiza las referencias con `git fetch origin`. Crea una rama de trabajo personal a partir de la rama integrada con `git switch -c entrega/nombre-modulo origin/integracion-navi-aventura-mejoras` o sigue la rama equivalente acordada con Alejandro.
2. Trabaja en el producto activo en `frontend/` o `backend/` según tu guía. Usa tu carpeta de `modules/` para instrucciones, notas y evidencias. Acuerda con los demás responsables los cambios en archivos compartidos.
3. Ejecuta las pruebas de tu módulo con datos sintéticos. Revisa los archivos que vas a publicar y excluye configuraciones privadas, dependencias, volcados de bases y archivos locales del editor.
4. Sube tu rama y abre un PR con base en la rama integrada. Describe qué se corrigió, los pasos para probarlo, los resultados, qué PR necesita primero y qué punto queda abierto. Alejandro revisa e integra los cambios.
5. Alejandro registra qué exige la rúbrica para administración, catálogo de varios cuentos y recomendaciones. Si una función forma parte de la evaluación, la versión entregada incluye el flujo funcional y su prueba.

## Orden de integración y salida

1. Coordinar autenticación, migraciones y contratos de Laravel. Validar una instalación limpia y una actualización compatible.
2. Completar los recorridos de mapa, motor, partida, audio, perfil y aula. Conectar los módulos adicionales incluidos en el alcance.
3. Sebastián valida en otro entorno un SHA candidato. La evidencia incluye las pruebas automáticas y la demostración de los recorridos de familia, docente y juego.
4. Alejandro entrega el commit validado, con el README de instalación, el resultado de pruebas y los enlaces a los PR. Los flujos evaluables deben poder ejecutarse de principio a fin.

Los documentos de esta carpeta son el plan de entrega. Las guías no registran pruebas futuras como aprobadas.
