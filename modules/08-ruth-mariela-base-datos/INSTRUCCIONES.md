# Instrucciones para Ruth Mariela - Base de datos y datos

## Objetivo exacto

Crear la estructura de datos del proyecto para usuarios, cuentos, escenas, decisiones, puntajes y logros.

## Estructura que debes seguir

```text
modules/08-ruth-mariela-base-datos/
  README.md
  INSTRUCCIONES.md
  base-avance/
    avance.md
  src/
    schema.sql
    relaciones.md
  demo/
    datos-demo.sql
    datos-demo.json
```

## Tablas o colecciones necesarias

- Usuarios.
- Roles.
- Cuentos.
- Categorias.
- Escenas.
- Opciones.
- Decisiones.
- Puntajes.
- Logros.
- Progreso.

## Cada tabla debe tener

- Id.
- Campos principales.
- Relaciones.
- Datos demo.

## Relaciones importantes

- Cuento tiene muchas escenas.
- Escena tiene muchas opciones.
- Opcion puede apuntar a otra escena.
- Usuario tiene progreso.
- Usuario tiene puntajes.
- Usuario puede desbloquear logros.

## Que escribir en avance.md

- Que tablas creaste.
- Que archivo tiene datos demo.
- Como se relacionan cuentos, escenas y opciones.
- Que falta definir.
