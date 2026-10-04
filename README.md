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

## Vista previa ejecutable

La carpeta `preview/` tiene una demo que ya se puede abrir y probar. Muestra pantallas separadas para cada persona/modulo.

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
    reparto-13-personas.md
    git-trabajo-equipo.md
    avance-base-modulos.md
  modules/
    01-alcides-diseno-ui/
    02-benjamin-biblioteca-navegacion/
    03-brayan-motor-cuentos/
    04-fabian-componentes-frontend/
    05-josue-backend-auth-roles/
    06-luis-api-cuentos/
    07-oscar-panel-admin/
    08-ruth-mariela-base-datos/
    09-ruth-serrano-reportes/
    10-alejandra-logros-recomendaciones/
    11-alvaro-qa-pruebas/
    12-gabriela-documentacion/
    13-alejandro-integracion/
```

Cada carpeta dentro de `modules/` corresponde a una persona y a una responsabilidad individual.

## Reparto individual

1. Alcides: Diseno UI.
2. Benjamin: Biblioteca y navegacion.
3. Brayan: Motor de cuentos.
4. Fabian: Componentes frontend.
5. Josué: Backend autenticacion y roles.
6. Luis: API de cuentos.
7. Oscar: Panel administrador.
8. Ruth Mariela: Base de datos.
9. Ruth Serrano: Reportes.
10. Alejandra Quiroga: Logros y recomendaciones.
11. Alvaro Rosas: QA y pruebas.
12. Gabriela Peñaranda: Documentacion.
13. Alejandro: Integracion y coordinacion final.

## Reglas de trabajo

- Nadie debe trabajar directamente sobre la rama `main`.
- Cada persona debe crear su propia rama.
- Cada persona trabaja solo dentro de su carpeta asignada.
- Los avances van dentro de `base-avance/`.
- Los cambios se integran mediante Pull Request.
- Cada modulo debe poder revisarse con capturas, datos de ejemplo o instrucciones claras.

## Primer paso para el equipo

Leer estos archivos en orden:

1. `docs/herramientas-instalacion.md`
2. `docs/flujo-logico.md`
3. `docs/reparto-13-personas.md`
4. `docs/git-trabajo-equipo.md`
5. `docs/avance-base-modulos.md`
6. El `README.md` de la carpeta personal asignada dentro de `modules/`
