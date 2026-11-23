# Luis · API de cuentos y partidas

## Punto de partida

Los PR #7 y #12 apuntan al mismo commit del avance en JavaScript. El producto integrado utiliza Laravel y MariaDB.

**Dónde trabajar** · backend/routes/api.php, backend/app/Http/Controllers/Api/StoryController.php, backend/app/Http/Controllers/Api/GameSessionController.php y backend/api-contrato.md.

## Trabajo pendiente

1. Revisa las rutas reales de catálogo, detalle, sesión, decisión, continuación, pista y final. Actualiza el contrato con ejemplos sintéticos y con los errores que maneja el frontend.
2. Verifica lectura de historias publicadas, persistencia de decisiones y progreso, recuperación de sesión y cierre. Coordina identificadores y formatos con Benjamín, Brayan y Ruth Mariela.
3. Prueba reintentos de decisión y cierre, envío concurrente cuando el caso aplica y rechazo de decisiones fuera de la escena vigente. Preserva la versión de las partidas antiguas.
4. Si hay cuentos adicionales, verifica el grafo y la visibilidad de cada uno. Alinea con Óscar qué datos se publican desde el panel si entra en alcance.

## Qué subir al PR

Sube cambios de Laravel y del contrato, ejemplos de respuesta y pruebas feature. Enlaza ambos PR históricos desde la explicación del aporte.

En el PR incluye los pasos para reproducir la prueba, el resultado observado y cualquier dependencia que deba integrarse primero. Si la función ya cumple lo pedido, registra la evidencia en tu carpeta sin duplicar la implementación.

## Criterio de aceptación

Una partida iniciada desde la interfaz guarda y reanuda sus decisiones en MariaDB y el cierre repetido mantiene una sola recompensa.

## Referencias de trabajo

- [Guía general de entrega](../ENTREGA-FINAL.md)
- [Instalación](../../docs/INSTALACION.md)
- [Pruebas existentes](../../docs/PRUEBAS.md)
