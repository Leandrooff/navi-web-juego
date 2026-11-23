# Álvaro Rosas · Accesibilidad y audio

## Punto de partida

El PR #3 incorpora controles de una demo. En el PR #14 la reproducción está preparada por diálogo, sin archivos de voz.

**Dónde trabajar** · frontend/public/audio/, frontend/src/hooks/useVoice.js, frontend/src/game/StoryStage.jsx, docs/voice-lines.json y backend/database/content/park.json.

## Trabajo pendiente

1. Usa los identificadores del manifiesto y acuerda con el equipo qué diálogos se narran. Prepara los MP3 aprobados y asócialos mediante audio_path siguiendo la guía de la rama.
2. Verifica en el navegador reproducir y pausar sin autoplay, detener el audio al cambiar escena y recuperar el control tras un error. La lectura en pantalla debe seguir disponible con audio ausente.
3. Prueba que el control solo se ofrezca donde corresponde y que todos los audios declarados existan después de npm run build. Mantén el texto y el audio ligados al diálogo correcto.
4. Ejecuta npm run test:ux y prueba teclado, Escape, retorno de foco, letra grande, movimiento reducido y 360 px. Coordina los ajustes con Fabián y Alcides.

## Qué subir al PR

Sube los audios aprobados, su asociación con escenas y decisiones, los cambios de interfaz y evidencia de las pruebas de audio y accesibilidad.

En el PR incluye los pasos para reproducir la prueba, el resultado observado y cualquier dependencia que deba integrarse primero. Si la función ya cumple lo pedido, registra la evidencia en tu carpeta sin duplicar la implementación.

## Criterio de aceptación

Los diálogos con voz se pueden escuchar y controlar, y el usuario puede completar la aventura mediante lectura y teclado.

## Referencias de trabajo

- [Guía general de entrega](../ENTREGA-FINAL.md)
- [Instalación](../../docs/INSTALACION.md)
- [Pruebas existentes](../../docs/PRUEBAS.md)
