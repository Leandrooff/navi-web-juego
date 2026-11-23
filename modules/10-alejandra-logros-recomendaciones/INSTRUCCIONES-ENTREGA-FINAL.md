# Alejandra Quiroga · Logros y recomendaciones

## Punto de partida

El PR #9 aporta una pantalla y funciones demo. La integración registra el primer encuentro, las huellas y los finales en el cuaderno.

**Dónde trabajar** · frontend/src/game/Journal.jsx, backend/app/Http/Controllers/Api/GameSessionController.php, backend/app/Http/Controllers/Api/ProgressController.php y backend/tests/Feature/JourneyTest.php.

## Trabajo pendiente

1. Especifica cada logro y recomendación que pida la rúbrica, qué evento lo activa, en qué pantalla aparece y quién puede verlo. Contrasta las reglas con los reconocimientos ya persistidos.
2. Prueba el primer encuentro, la participación, los tres finales, una vuelta a jugar y un cierre repetido. Confirma que los reconocimientos esperados se conservan al recargar.
3. Si falta una recomendación evaluable, impleméntala con progreso real y texto educativo, breve y constructivo. Define el estado para perfiles que aún no tienen historial.
4. Coordina los resultados con Gabriela y Ruth Serrano para que el cuaderno y el informe muestren los mismos datos de la partida.

## Qué subir al PR

Sube las reglas pendientes, componentes o lógica conectados y pruebas con los eventos que disparan cada reconocimiento.

En el PR incluye los pasos para reproducir la prueba, el resultado observado y cualquier dependencia que deba integrarse primero. Si la función ya cumple lo pedido, registra la evidencia en tu carpeta sin duplicar la implementación.

## Criterio de aceptación

El usuario entiende qué obtuvo y por qué. Repetir una petición o una ruta conserva el histórico sin incrementar premios de forma indebida.

## Referencias de trabajo

- [Guía general de entrega](../ENTREGA-FINAL.md)
- [Instalación](../../docs/INSTALACION.md)
- [Pruebas existentes](../../docs/PRUEBAS.md)
