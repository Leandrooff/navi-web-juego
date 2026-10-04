# Instrucciones para Benjamin - Biblioteca y navegacion

## Objetivo exacto

Crear la parte donde el nino elige cuentos y navega entre las secciones principales.

## Estructura que debes seguir

```text
modules/02-benjamin-biblioteca-navegacion/
  README.md
  INSTRUCCIONES.md
  base-avance/
    avance.md
  src/
    biblioteca.html
    biblioteca.css
    biblioteca.js
  demo/
    cuentos-demo.json
```

## Pantallas que debes subir

- Biblioteca de cuentos.
- Menu principal.
- Pantalla de detalle corto del cuento.
- Filtro por categoria.
- Vista de cuento en progreso.

## Funciones que debe tener

- Mostrar lista de cuentos.
- Mostrar una tarjeta por cuento.
- Filtrar por categoria.
- Buscar cuento por nombre.
- Mostrar estado: nuevo, en progreso o completado.
- Boton `Jugar`.
- Boton `Continuar` si el cuento ya empezo.
- Navegar entre inicio, biblioteca, perfil y progreso.

## Datos demo obligatorios

Crear `demo/cuentos-demo.json` con minimo 5 cuentos. Cada cuento debe tener:

- `id`
- `titulo`
- `categoria`
- `estado`
- `descripcion`
- `imagen`

## Que escribir en avance.md

- Que archivo abre la biblioteca.
- Que filtros funcionan.
- Cuantos cuentos demo subiste.
- Que falta conectar.
