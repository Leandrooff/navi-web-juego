# Gabriela Peñaranda · Perfil y progreso

## Punto de partida

El PR #13 aporta pantallas demo. La versión integrada maneja perfiles, asignaciones, historial, partidas activas y progreso de Laravel.

**Dónde trabajar** · frontend/src/App.jsx, frontend/src/adult/Family.jsx, frontend/src/game/Journal.jsx y backend/app/Http/Controllers/Api/ChildProfileController.php.

## Trabajo pendiente

1. Prueba alta y edición de perfil, validación de edad y preferencias de personalización. Crea dos perfiles sintéticos de la misma familia y juega con uno.
2. Comprueba que la opción de continuar abre la sesión pendiente del perfil seleccionado, que el progreso permanece tras cerrar sesión y que cambiar de perfil limpia la vista del anterior.
3. Revisa estados sin partidas, partida activa, cuento completado y varios finales. Contrasta logros y recuerdos con Alejandra e informes con Ruth Serrano.
4. Coordina con Josué la prueba de aislamiento entre tutores. Conserva en el PR solo los archivos del módulo y los cambios funcionales acordados.

## Qué subir al PR

Sube correcciones del perfil activo y pruebas o evidencia de persistencia, aislamiento y reanudación.

En el PR incluye los pasos para reproducir la prueba, el resultado observado y cualquier dependencia que deba integrarse primero. Si la función ya cumple lo pedido, registra la evidencia en tu carpeta sin duplicar la implementación.

## Criterio de aceptación

Cada perfil muestra sus propios datos al cambiar de niño, volver a iniciar sesión o reanudar una partida.

## Referencias de trabajo

- [Guía general de entrega](../ENTREGA-FINAL.md)
- [Instalación](../../docs/INSTALACION.md)
- [Pruebas existentes](../../docs/PRUEBAS.md)
