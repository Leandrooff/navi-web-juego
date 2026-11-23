# Fabián · Componentes React

## Punto de partida

El PR #10 aporta componentes JSX. La integración ya contiene componentes compartidos en el frontend activo.

**Dónde trabajar** · frontend/src/components/, frontend/src/game/StoryStage.jsx y frontend/src/adult/.

## Trabajo pendiente

1. Identifica las pantallas que usan botones, alertas, tarjetas, progreso y modales. Conserva la API de los componentes que ya funcionan.
2. Revisa etiquetas accesibles, tipos de botón, estado ocupado, error recuperable y mensajes vacíos. En acciones de guardado, haz visible el estado y evita repetir el envío desde la interfaz.
3. Revisa apertura, navegación, Escape y devolución del foco de los modales. Coordina con Alcides los estilos compartidos y con Álvaro la interacción por teclado.
4. Prueba los componentes dentro de las pantallas de juego, familia y aula. Ejecuta npm test y npm run build desde frontend.

## Qué subir al PR

Sube componentes usados por las pantallas reales, cambios de integración y evidencia visual o de teclado.

En el PR incluye los pasos para reproducir la prueba, el resultado observado y cualquier dependencia que deba integrarse primero. Si la función ya cumple lo pedido, registra la evidencia en tu carpeta sin duplicar la implementación.

## Criterio de aceptación

La misma acción tiene comportamiento coherente en las pantallas que la usan y las acciones bloqueadas o fallidas muestran un estado comprensible.

## Referencias de trabajo

- [Guía general de entrega](../README.md)
- [Instalación](https://github.com/Leandrooff/navi-web-juego/blob/integracion-navi-aventura-mejoras/docs/INSTALACION)
- [Pruebas existentes](https://github.com/Leandrooff/navi-web-juego/blob/integracion-navi-aventura-mejoras/docs/PRUEBAS)
