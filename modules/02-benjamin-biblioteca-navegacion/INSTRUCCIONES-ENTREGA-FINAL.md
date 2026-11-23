# Benjamín · Biblioteca y navegación

## Punto de partida

El PR #1 tiene búsqueda y filtros con datos demo. El mapa integrado ya consume el catálogo y presenta la aventura principal.

**Dónde trabajar** · frontend/src/game/World.jsx, frontend/src/App.jsx, frontend/src/services/api.js y backend/app/Http/Controllers/Api/StoryController.php.

## Trabajo pendiente

1. Comprueba el flujo mapa → ficha → jugar o continuar → final → mapa con datos de Laravel. Conserva el prólogo de la primera visita y las asignaciones del aula.
2. Si la rúbrica pide una biblioteca con varios cuentos, adapta la búsqueda por título y el filtro por categoría al catálogo real. Define con Luis qué campos entrega la API y con Ruth Mariela cómo se cargan los cuentos publicados.
3. Muestra estados de carga, lista vacía, búsqueda sin coincidencias y error con reintento. Identifica cuentos comenzados y completados a partir del progreso del perfil activo.
4. Verifica que un cuento extra tenga escenas, decisiones y cierre jugables antes de mostrarlo. Prueba regresar al mapa y abrir un cuento diferente sin arrastrar la sesión anterior.

## Qué subir al PR

Sube vistas React, los cambios coordinados del contrato y evidencia de catálogo y navegación con datos reales.

En el PR incluye los pasos para reproducir la prueba, el resultado observado y cualquier dependencia que deba integrarse primero. Si la función ya cumple lo pedido, registra la evidencia en tu carpeta sin duplicar la implementación.

## Criterio de aceptación

Una aventura publicada abre la ficha y partida correctas. Los filtros y la recuperación ante errores funcionan cuando aplican.

## Referencias de trabajo

- [Guía general de entrega](../ENTREGA-FINAL.md)
- [Instalación](../../docs/INSTALACION.md)
- [Pruebas existentes](../../docs/PRUEBAS.md)
