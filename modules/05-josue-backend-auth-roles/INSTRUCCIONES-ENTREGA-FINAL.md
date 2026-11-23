# Josué · Autenticación y permisos

## Punto de partida

El PR #11 aporta pantallas demo. La rama integrada registra cuentas tutor y docente, utiliza sesión web y tiene controles de acceso en Laravel.

**Dónde trabajar** · backend/routes/api.php, backend/app/Http/Controllers/Api/AuthController.php, backend/app/Support/Access.php y frontend/src/adult/Auth.jsx.

## Trabajo pendiente

1. Prueba registro, duplicado de correo, credenciales incorrectas, inicio, recarga, cierre y cambio de contraseña con cuentas sintéticas. Revisa que la interfaz guíe al usuario cuando expira su sesión.
2. Comprueba autorización desde Laravel para perfil, partida, informe y aula. Coordina con Gabriela y Ruth Serrano los casos de propiedad, consentimiento y revocación.
3. Si la rúbrica exige administración, acuerda con Óscar cómo asignar el rol por un proceso autorizado y prueba los permisos del panel. Mantén el registro normal limitado a las cuentas públicas del producto.
4. Añade o actualiza pruebas de Laravel para los casos que falten. Usa respuestas de acceso denegado esperadas y verifica que las operaciones protegidas conservan el estado.

## Qué subir al PR

Sube cambios de autenticación y autorización, pruebas y pasos para verificar los roles de la entrega.

En el PR incluye los pasos para reproducir la prueba, el resultado observado y cualquier dependencia que deba integrarse primero. Si la función ya cumple lo pedido, registra la evidencia en tu carpeta sin duplicar la implementación.

## Criterio de aceptación

Las sesiones se abren y cierran correctamente y las operaciones de perfil, aula y administración respetan el rol y la autorización definidos.

## Referencias de trabajo

- [Guía general de entrega](../ENTREGA-FINAL.md)
- [Instalación](../../docs/INSTALACION.md)
- [Pruebas existentes](../../docs/PRUEBAS.md)
