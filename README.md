# NAVI · El Parque de los Faroles

Proyecto implementado directamente sobre **NAVI_AVENTURA.zip**. React 19 + Vite, Laravel 12 y MariaDB/MySQL. Interfaz en español.

## La misión completa

- Apertura con viaje de NAVI, encuentro personalizado y conexión directa con el parque.
- **34 escenas, 53 elecciones y 26 ilustraciones nuevas**, además del mundo y el personaje NAVI existentes.
- Tres finales distintos: **La luz que nos reunió**, **Mi voz encontró un camino** y **Siempre puedo cambiar de rumbo**.
- Cada recorrido contiene de 12 a 21 elecciones; el grafo admite 2.784 combinaciones completas.
- El niño decide. NAVI presenta el mundo y después ofrece pistas opcionales.
- Cada elección genera una huella con texto propio y fecha/hora, incluso cuando enseña a rectificar. Inicio, pistas y cierre también se registran.
- Primer encuentro, insignias y finales en el cuaderno del perfil; historial paginado con fechas.
- Guardado real, reanudación de consecuencias pendientes y protección frente a peticiones duplicadas.
- Familia y aula conservadas: autenticación, perfiles, informes, consentimiento, grupos y asignaciones.
- Voces preparadas por identificador de diálogo y ruta opcional. **No se generaron voces, archivos de sonido ni síntesis.**

## Ejecutar

Sigue [INSTALACION.md](docs/INSTALACION.md). Requiere PHP 8.2+, Composer, Node 22.12+ y MariaDB/MySQL.

Después de instalar dependencias, configurar la base y ejecutar las migraciones:
1. En backend: `php artisan serve --host=127.0.0.1 --port=8000`.
2. En frontend: `npm run dev`.
3. Abre http://127.0.0.1:5173.
4. Crea una cuenta de familia, crea el perfil infantil y pulsa **Abrir su mundo**. La primera entrada lleva directamente al prólogo y a la misión.
5. En entradas posteriores puedes continuar la partida desde el mapa. Al terminar, pulsa **Guardar mi final**.

No se incluyen cuentas compartidas ni datos infantiles de ejemplo. Las dependencias se restauran con Composer y npm; el código, las migraciones, el contenido y las ilustraciones están completos.

## Documentación

- [Instalación y actualización sin perder datos](docs/INSTALACION.md)
- [Guion completo: todas las escenas, decisiones y aprendizajes](docs/GUION_MISION.md)
- [Arquitectura y persistencia](docs/ARQUITECTURA.md)
- [Arte y futura integración de voces](docs/ARTE_Y_VOCES.md)
- [Pruebas y capturas actuales](docs/PRUEBAS.md)
- [Auditoría de la entrega](docs/AUDITORIA.md)

La aplicación actual está en frontend/ y backend/. modules/ y docs/legacy/ conservan material anterior; no sustituyen la aplicación ni su guardado.

Las escenas e imágenes antiguas se conservan para las partidas previas. La actualización añade una revisión interna del contenido; no borra decisiones ni reinicia perfiles. Las credenciales .env, las bases con registros, las sesiones de prueba, los logs y las dependencias reinstalables no se distribuyen.
