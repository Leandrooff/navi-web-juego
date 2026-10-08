# Paleta de colores · NAVI

Estos son los colores oficiales del juego. Están definidos como variables CSS en `estilos-ui.css` (bajo `:root`). Usar siempre la variable, no el hex suelto.

## Marca

| Uso | Color | Hex | Variable |
|-----|-------|-----|----------|
| Principal (acciones, botones) | 🟦 Azul NAVI | `#2356d8` | `--navi-blue` |
| Títulos / hover | 🔵 Azul oscuro | `#16327e` | `--navi-blue-ink` |
| Fondo suave azul | ⬜ | `#e8f1fd` | `--navi-blue-soft` |

## Recompensa

| Uso | Color | Hex | Variable |
|-----|-------|-----|----------|
| Estrellas, recompensas | 🟨 Sol | `#ffc43d` | `--sun` |
| Fondo recompensa | ⬜ | `#fff2cf` | `--sun-soft` |

## Estados (mensajes y tarjetas)

| Estado | Color | Hex | Variable |
|--------|-------|-----|----------|
| Positivo / completado | 🟩 Menta | `#1fa971` | `--mint` |
| Advertencia / en progreso | 🟧 Ámbar | `#e09112` | `--amber` |
| Error / peligro / bloqueado | 🟥 Coral | `#e5484d` | `--coral` |
| Logros | 🟪 Violeta | `#7a5af8` | `--violet` |

## Neutros

| Uso | Hex | Variable |
|-----|-----|----------|
| Texto principal | `#14293d` | `--ink` |
| Texto secundario | `#5e7183` | `--muted` |
| Bordes | `#d7e3ee` | `--line` |
| Fondo de pantalla | `#f3f8fc` | `--bg` |
| Tarjetas / paneles | `#ffffff` | `--surface` |

## Tipografías

- **Títulos:** `Baloo 2` (redondeada, amigable) → `--font-display`
- **Texto / botones:** `Nunito` → `--font-body`
- Si no hay internet, cae a fuentes redondeadas del sistema automáticamente.

## Regla

Botón principal = azul. Secundario = blanco con borde azul. Recompensa = amarillo.
Nunca usar rojo para botones normales; el coral es solo para peligro/error.
