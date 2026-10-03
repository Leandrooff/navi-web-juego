# NAVI Web Juego

NAVI Web Juego es una plataforma web educativa tipo aventura interactiva. El objetivo es que los ninos aprendan a reconocer situaciones cotidianas de riesgo mediante cuentos jugables, decisiones, consecuencias, puntajes, logros y seguimiento para tutores o educadores.

## Objetivo del proyecto

Construir una pagina web tipo juego donde el nino pueda:

- Elegir una aventura o cuento interactivo.
- Leer y escuchar escenas con imagenes.
- Tomar decisiones dentro de la historia.
- Ver consecuencias seguras y apropiadas para su edad.
- Obtener estrellas, logros y recomendaciones.
- Permitir que tutores y educadores revisen su progreso.

## Tecnologia recomendada

- Frontend: React + Vite + Tailwind CSS.
- Backend: Laravel API.
- Panel administrador: Filament para Laravel.
- Base de datos: MySQL o PostgreSQL.
- Control de versiones: Git + GitHub.
- Diseno: Figma.
- Pruebas API: Postman o Insomnia.

## Estructura del repositorio

```text
navi-web-juego/
  preview/
    index.html
    styles.css
    app.js
  frontend/
    package.json
    src/
  backend/
    api-contrato.md
  database/
    schema.sql
  docs/
    herramientas-instalacion.md
    flujo-logico.md
    reparto-14-personas.md
    git-trabajo-equipo.md
  modules/
    01-diseno-ui-juego/
    02-frontend-motor-cuentos/
    03-backend-api-auth/
    04-panel-admin-contenidos/
    05-base-datos-modelo/
    06-reportes-seguimiento/
    07-integracion-qa/
```

Cada carpeta dentro de `modules/` corresponde a un modulo independiente para una pareja de trabajo.

## Vista previa ejecutable

La carpeta `preview/` tiene una demo que ya se puede abrir y probar. Muestra el inicio del juego, cuento demo, paneles y vista de los 7 modulos.

Para correrla rapido:

```bash
cd preview
python -m http.server 5173
```

Abrir:

```text
http://127.0.0.1:5173
```

Tambien se puede abrir directo `preview/index.html` en el navegador.

## Carpetas tecnicas

- `preview/`: demo ejecutable para entender el proyecto completo.
- `frontend/`: base del frontend final con React, Vite y Tailwind CSS.
- `backend/`: base para Laravel API, Sanctum y Filament.
- `database/`: esquema inicial de tablas y relaciones.
- `modules/`: trabajo separado por grupos de 2.
- `docs/`: guias generales del proyecto.

## Modulos principales

1. Diseno UI y experiencia de juego.
2. Frontend y motor de cuentos interactivos.
3. Backend API, autenticacion y roles.
4. Panel administrador de contenidos.
5. Base de datos y modelo de informacion.
6. Reportes, seguimiento y recomendaciones.
7. Integracion, pruebas y documentacion final.

## Reglas de trabajo

- Nadie debe trabajar directamente sobre la rama `main`.
- Cada pareja debe crear su propia rama.
- Cada modulo debe tener su propio avance documentado en su carpeta.
- Los cambios se integran mediante Pull Request.
- Cada modulo debe poder probarse con datos de ejemplo aunque otros modulos aun no esten terminados.

## Primer paso para el equipo

Leer estos archivos en orden:

1. `docs/herramientas-instalacion.md`
2. `docs/flujo-logico.md`
3. `docs/reparto-14-personas.md`
4. `docs/git-trabajo-equipo.md`
5. El `README.md` del modulo asignado dentro de `modules/`
