# Ruth Serrano · Reportes

## Punto de partida

El PR #6 tiene un panel con datos ficticios. La integración documenta informes, filtros, impresión y CSV.

**Dónde trabajar** · frontend/src/adult/Report.jsx, frontend/src/adult/Classroom.jsx, frontend/src/adult/Family.jsx y backend/app/Http/Controllers/Api/ProgressController.php.

## Trabajo pendiente

1. Genera con cuentas sintéticas una partida incompleta y otra finalizada. Contrasta decisiones, recuerdos, fechas, finales y totales con el cuaderno del perfil y el API.
2. Prueba filtros, paginación, impresión y CSV con datos vacíos y varias partidas. Confirma que las filas y encabezados coinciden con el filtro activo y que los caracteres en español se conservan.
3. Comprueba que el docente accede solo después del consentimiento del tutor. Revoca el vínculo, recarga el informe y verifica que los datos autorizados anteriormente ya no se muestran.
4. Acuerda con Gabriela y Alejandra qué significa cada cifra o reconocimiento. Reporta diferencias con el perfil, incluyendo pasos y datos sintéticos.

## Qué subir al PR

Sube correcciones de informes y exportación, pruebas y un ejemplo de reporte con datos sintéticos.

En el PR incluye los pasos para reproducir la prueba, el resultado observado y cualquier dependencia que deba integrarse primero. Si la función ya cumple lo pedido, registra la evidencia en tu carpeta sin duplicar la implementación.

## Criterio de aceptación

Los informes y exportaciones reflejan partidas reales y respetan la autorización vigente.

## Referencias de trabajo

- [Guía general de entrega](../ENTREGA-FINAL.md)
- [Instalación](../../docs/INSTALACION.md)
- [Pruebas existentes](../../docs/PRUEBAS.md)
