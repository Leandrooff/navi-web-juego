# Óscar · Panel administrador

## Punto de partida

El PR #8 aporta un prototipo HTML y JSON. Las rutas integradas revisadas no exponen administración de cuentos.

**Dónde trabajar** · backend/routes/api.php, backend/app/Models/Story.php, backend/app/Models/Scene.php, backend/app/Models/Choice.php y frontend/src/adult/.

## Trabajo pendiente

1. Confirma con Alejandro y Sebastián si el panel se evalúa. Si entra en alcance, acuerda con Josué la autorización y con Luis y Ruth Mariela el modelo para publicar una revisión de cuento.
2. Conecta formularios de cuento, escena y opciones con persistencia en Laravel. Incluye campos requeridos, errores comprensibles y guardado de borrador cuando corresponda.
3. Valida una escena inicial, destinos del mismo cuento y finales alcanzables antes de publicar. Protege las historias que tienen partidas guardadas mediante el esquema de revisiones acordado.
4. Prueba como administrador la creación, edición y publicación. Comprueba que tutor y docente quedan fuera del panel y que la aventura publicada realmente aparece y se puede terminar.

## Qué subir al PR

Sube panel, operaciones Laravel y pruebas de publicación y roles si se evalúa. Si queda fuera, registra la decisión de alcance con Alejandro.

En el PR incluye los pasos para reproducir la prueba, el resultado observado y cualquier dependencia que deba integrarse primero. Si la función ya cumple lo pedido, registra la evidencia en tu carpeta sin duplicar la implementación.

## Criterio de aceptación

Si se entrega el panel, un administrador publica una historia válida desde la interfaz y una familia puede jugarla de inicio a fin.

## Referencias de trabajo

- [Guía general de entrega](../ENTREGA-FINAL.md)
- [Instalación](../../docs/INSTALACION.md)
- [Pruebas existentes](../../docs/PRUEBAS.md)
