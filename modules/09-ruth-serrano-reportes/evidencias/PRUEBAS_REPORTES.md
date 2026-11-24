# Evidencias del módulo 09 — Reportes

Responsable: Ruth Serrano Nina.
Pruebas realizadas el 23 y 24 de noviembre de 2026.
Rama de trabajo: entrega/ruth-serrano-reportes.
Base de trabajo: integracion-navi-aventura-mejoras.

## Datos de prueba

Se utilizaron cuentas y un perfil creados para las pruebas
en la instalación local de NAVI.

- Perfil infantil Ruth, de 8 años, ID 2.
- Cuenta familiar ID 4.
- Cuenta docente ID 5.
- Grupo docente 3 A.
- Cuento Me perdí en el parque.

| Partida | Estado | Decisiones | Recuerdos |
|---|---|---:|---:|
| ID 2 | Completada | 15 | 17 |
| ID 3 | En curso | 4 | 5 |

El reporte muestra una aventura completada, una estrella
y dos recorridos iniciados.

## Procedimiento y resultados

| Prueba | Procedimiento | Resultado observado |
|---|---|---|
| Perfil vacío | Crear un perfil y consultar su reporte antes de jugar. | Cero aventuras, estrellas y recorridos. |
| Partida incompleta | Jugar, recargar y consultar el reporte y la API. | La partida aparece en curso y conserva las decisiones. |
| Reanudación | Continuar la partida ID 2 y guardar el final. | Conserva las 11 decisiones iniciales y termina con 15 decisiones y 17 recuerdos. |
| Finalización | Comparar reporte, progreso e historial de la API. | Coinciden los totales y el final Siempre puedo cambiar de rumbo, identificado como regreso. |
| Varios recorridos | Iniciar otra partida del mismo cuento. | Aparecen una partida completada y otra en curso. |
| Filtro con resultados | Seleccionar el 23/11/2026. | Aparecen los dos recorridos. |
| Filtro vacío | Seleccionar el 24/11/2026. | Aparecen cero recorridos y se deshabilita el CSV. |
| Exportación corregida | Descargar el CSV del historial filtrado. | Seis columnas y 19 filas, con 4 decisiones en curso y 15 completadas. Conserva los acentos y muestra horas de Bolivia. |
| Impresión corregida | Pulsar Imprimir informe y guardar como PDF. | Tres páginas con 19 decisiones, 22 recuerdos, período seleccionado y horas de Bolivia. |
| Sin consentimiento | Consultar el historial desde la cuenta docente antes de vincular el perfil. | La API responde Perfil no disponible. |
| Con consentimiento | Autorizar desde la cuenta familiar y entrar como docente. | Ruth aparece en el grupo y permite consultar su reporte. |
| Revocación | Retirar la autorización y volver a entrar como docente. | Ruth desaparece del grupo y la API responde Perfil no disponible. |
| Compilación | Ejecutar npm.cmd --prefix frontend run build. | Compilación finalizada correctamente. |
| Año inválido | Introducir un año de cinco dígitos en Desde. | Aparece el aviso de fecha inválida y se deshabilitan impresión y CSV. |
Las pruebas entre cuentas se realizaron cerrando e iniciando
sesión. Se verificó la identidad activa mediante /api/auth/me.

## Consultas utilizadas

- /api/child-profiles/2/progress
- /api/child-profiles/2/history
- /api/child-profiles/2/enrollments
- /api/auth/me

## Correcciones de Report.jsx

- Sustitución de {name} por el alias del perfil.
- Mensaje específico para filtros sin resultados.
- Fechas de Bolivia y estados en español en el CSV.
- Separador punto y coma y codificación UTF-8.
- Período seleccionado y fecha de finalización en el informe.
- Ajuste de los saltos y espacios de impresión.
- Limpieza de los datos al rechazarse una consulta.
- Comprobación del permiso antes de imprimir o exportar.

## Archivos de ejemplo

- reporte-ejemplo.csv
- reporte-ejemplo.pdf

Ambos corresponden al perfil de prueba Ruth.

## Comprobaciones pendientes

- Paginación manual con más de 20 recorridos.
- Retirada de los datos en un reporte que permanece abierto
  durante la revocación. Este caso se comprobó con API simulada.
- Filtros con partidas próximas a la medianoche de Bolivia.
- Acordar con Gabriela y Alejandra las definiciones de las
  cifras y los reconocimientos mostrados.

## Dependencias

Se requiere la aplicación integrada, sus migraciones y datos
iniciales, autenticación y controles de autorización de Laravel.