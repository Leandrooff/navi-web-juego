# Ruth Mariela · Base de datos

## Punto de partida

El PR #2 aporta esquema y datos de muestra. El PR #14 incluye migraciones, sembrado y revisiones de contenido.

**Dónde trabajar** · backend/database/migrations/, backend/database/seeders/, backend/database/content/ y backend/scripts/verify-upgrade.php.

## Trabajo pendiente

1. Prepara una base desechable para instalación limpia y otra para una actualización con datos sintéticos. Verifica la estructura siguiendo docs/INSTALACION.md.
2. Ejecuta las migraciones con el sembrado y comprueba catálogo, opciones, perfiles, partidas y permisos desde la aplicación. Repite el sembrado y confirma que los identificadores y registros esperados se mantienen.
3. Usa el procedimiento de actualización documentado para comprobar que una partida previa conserva su escena, decisiones e historial. Coordina los cambios de datos con Luis, Óscar y Álvaro.
4. Documenta versión de MariaDB, comandos, resultados y cualquier ajuste de las variables de entorno mediante ejemplos sin secretos.

## Qué subir al PR

Sube migraciones o semillas pendientes, ajustes de documentación y evidencia de instalación y actualización con datos sintéticos.

En el PR incluye los pasos para reproducir la prueba, el resultado observado y cualquier dependencia que deba integrarse primero. Si la función ya cumple lo pedido, registra la evidencia en tu carpeta sin duplicar la implementación.

## Criterio de aceptación

Una base vacía queda utilizable y una actualización preserva cuentas, perfiles y partidas guardadas.

## Referencias de trabajo

- [Guía general de entrega](../ENTREGA-FINAL.md)
- [Instalación](../../docs/INSTALACION.md)
- [Pruebas existentes](../../docs/PRUEBAS.md)
