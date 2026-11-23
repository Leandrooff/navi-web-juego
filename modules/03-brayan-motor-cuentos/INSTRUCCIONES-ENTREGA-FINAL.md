# Brayan · Motor de cuentos

## Punto de partida

El PR #4 tiene un motor y una demo independiente. La integración ya incluye el motor y la historia de 34 escenas y tres finales.

**Dónde trabajar** · frontend/src/engine/motor-cuentos.js, frontend/src/services/storyAdapter.js, frontend/src/hooks/useAdventure.js y frontend/tests/adventure.test.mjs.

## Trabajo pendiente

1. Ejecuta npm test en frontend y revisa con Luis la secuencia de guardar decisión, mostrar consecuencia, continuar y cerrar. Documenta qué conserva el motor y qué confirma el servidor.
2. Verifica los tres finales y que la consecuencia aparezca exactamente una vez. Corta la conexión durante una decisión, reintenta y comprueba que no avance antes de recibir la confirmación.
3. Recarga con una consecuencia pendiente y verifica que la partida restaure el punto correcto. Revisa también doble clic, navegación de vuelta y reanudación desde el mapa.
4. Por cada defecto reproducible añade una prueba de regresión. Si cambia el contenido, ejecuta la validación del grafo y verifica destinos, escenas finales e ilustraciones junto a Luis.

## Qué subir al PR

Sube correcciones al motor activo y pruebas o evidencia de que el motor existente cumple los casos asignados.

En el PR incluye los pasos para reproducir la prueba, el resultado observado y cualquier dependencia que deba integrarse primero. Si la función ya cumple lo pedido, registra la evidencia en tu carpeta sin duplicar la implementación.

## Criterio de aceptación

Todos los recorridos del grafo terminan. Los tres finales representativos se guardan y recargar o reintentar conserva la partida sin duplicados.

## Referencias de trabajo

- [Guía general de entrega](../ENTREGA-FINAL.md)
- [Instalación](../../docs/INSTALACION.md)
- [Pruebas existentes](../../docs/PRUEBAS.md)
