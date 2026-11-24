# Instrucciones detalladas de entrega por modulo

Este archivo explica exactamente que debe subir cada persona. La idea no es que todo venga perfecto ni integrado. Cada integrante debe subir piezas utiles para que Alejandro pueda unirlas despues.

## Reglas para todos

Cada persona debe trabajar dentro de su carpeta en `modules/`.

Cada entrega debe tener:

- Un archivo principal que se pueda abrir o revisar.
- Datos demo si la pantalla necesita informacion.
- Nombres de archivos claros.
- Una explicacion corta en `base-avance/avance.md`.
- Todo dentro de su modulo, sin tocar carpetas de otros.

Estructura recomendada dentro de cada modulo:

```text
modules/numero-nombre-modulo/
  README.md
  base-avance/
    avance.md
  src/
    archivos-del-modulo
  demo/
    datos-o-pantallas-demo
  assets/
    imagenes-iconos-audios-si-hay
```

Si no saben programar React todavia, pueden subir HTML, CSS, JS simple, JSON, imagenes o capturas. Lo importante es que sea claro y util.

## 01 Alcides - Diseno UI

Carpeta:

```text
modules/01-alcides-diseno-ui/
```

Debe subir la propuesta visual del juego.

Estructura sugerida:

```text
modules/01-alcides-diseno-ui/
  README.md
  base-avance/avance.md
  src/
    pantalla-inicio.html
    pantalla-biblioteca.html
    pantalla-juego.html
    pantalla-resultado.html
    estilos-ui.css
  assets/
    logo-navi.png
    icono-cuento.png
    icono-estrella.png
```

Debe incluir:

- Pantalla de inicio con titulo NAVI, boton comenzar, boton biblioteca y espacio para perfil.
- Pantalla de biblioteca con tarjetas de cuentos.
- Pantalla de juego con imagen de escena, texto, opciones y puntos.
- Pantalla final con estrellas, mensaje positivo y boton volver.
- Paleta de colores.
- Estilo de botones.
- Estilo de tarjetas.
- Estilo de alertas o mensajes.

Debe cuidar:

- Que se vea infantil pero ordenado.
- Que los botones sean grandes.
- Que el texto sea facil de leer.
- Que los colores no sean demasiado oscuros.

En `avance.md` debe escribir:

- Que pantallas subio.
- Que colores recomienda.
- Que archivo se debe abrir primero.

## 02 Benjamin - Biblioteca y navegacion

Carpeta:

```text
modules/02-benjamin-biblioteca-navegacion/
```

Debe subir la parte donde el usuario elige cuentos y navega.

Estructura sugerida:

```text
modules/02-benjamin-biblioteca-navegacion/
  README.md
  base-avance/avance.md
  src/
    biblioteca.html
    biblioteca.css
    biblioteca.js
  demo/
    cuentos-demo.json
```

Debe incluir:

- Lista de cuentos.
- Tarjeta por cada cuento.
- Filtro por categoria.
- Buscador por nombre.
- Boton `Jugar`.
- Boton `Continuar` si el cuento esta en progreso.
- Menu para ir a Inicio, Biblioteca, Perfil y Progreso.

Datos minimos en `cuentos-demo.json`:

```json
[
  {
    "id": 1,
    "titulo": "Me perdi en el parque",
    "categoria": "seguridad",
    "estado": "nuevo",
    "descripcion": "Aprende que hacer si te separas de tu tutor"
  }
]
```

En `avance.md` debe escribir:

- Que filtros funcionan.
- Que archivo abre la biblioteca.
- Que datos demo uso.

## 03 Brayan - Motor de cuentos

Carpeta:

```text
modules/03-brayan-motor-cuentos/
```

Debe subir la logica principal del juego.

Estructura sugerida:

```text
modules/03-brayan-motor-cuentos/
  README.md
  base-avance/avance.md
  src/
    motor-cuentos.js
    demo-juego.html
  demo/
    cuento-demo.json
```

Debe incluir:

- Cargar cuento desde JSON.
- Mostrar escena actual.
- Mostrar opciones.
- Avanzar a otra escena al elegir opcion.
- Sumar puntos.
- Guardar decisiones tomadas.
- Mostrar final segun puntaje.
- Boton para reiniciar.

Formato minimo del cuento:

```json
{
  "id": "cuento-parque",
  "titulo": "Me perdi en el parque",
  "escenaInicial": "inicio",
  "escenas": [
    {
      "id": "inicio",
      "texto": "No ves a tu tutor. Que haces?",
      "opciones": [
        {
          "texto": "Buscar ayuda en una caseta",
          "puntos": 10,
          "siguiente": "ayuda"
        }
      ]
    }
  ]
}
```

En `avance.md` debe escribir:

- Como se ejecuta el demo.
- Cuantas escenas tiene.
- Como calcula puntos.

## 04 Fabian - Componentes frontend

Carpeta:

```text
modules/04-fabian-componentes-frontend/
```

Debe subir componentes reutilizables.

Estructura sugerida:

```text
modules/04-fabian-componentes-frontend/
  README.md
  base-avance/avance.md
  src/
    Button.jsx
    StoryCard.jsx
    ProgressBar.jsx
    ChoiceButton.jsx
    Modal.jsx
    componentes.css
  demo/
    componentes-demo.html
```

Debe incluir:

- Boton principal.
- Boton secundario.
- Tarjeta de cuento.
- Tarjeta de logro.
- Barra de progreso.
- Boton de opcion para decisiones.
- Modal de confirmacion.
- Mensaje de alerta.

Cada componente debe tener:

- Nombre claro.
- Ejemplo de uso.
- Estados: normal, activo, deshabilitado y error cuando aplique.

En `avance.md` debe escribir:

- Que componentes subio.
- Donde estan los ejemplos.
- Si estan en React, HTML o ambos.

## 05 Josué - Login y roles

Carpeta:

```text
modules/05-josue-backend-auth-roles/
```

Debe subir el acceso de usuarios y roles.

Estructura sugerida:

```text
modules/05-josue-backend-auth-roles/
  README.md
  base-avance/avance.md
  src/
    login.html
    registro.html
    auth.js
    roles.js
  demo/
    usuarios-demo.json
```

Debe incluir:

- Pantalla de login.
- Pantalla de registro.
- Funcion para iniciar sesion.
- Funcion para cerrar sesion.
- Usuario activo.
- Roles: nino, tutor, educador y admin.
- Validacion basica de correo y password.
- Mensaje de error si los datos estan mal.

Datos minimos:

```json
[
  {
    "id": 1,
    "nombre": "Nino demo",
    "email": "nino@demo.com",
    "password": "123456",
    "rol": "nino"
  }
]
```

En `avance.md` debe escribir:

- Que usuarios demo existen.
- Como iniciar sesion.
- Que roles creo.

## 06 Luis - API de cuentos

Carpeta:

```text
modules/06-luis-api-cuentos/
```

Debe subir funciones o endpoints para que el frontend pida cuentos.

Estructura sugerida:

```text
modules/06-luis-api-cuentos/
  README.md
  base-avance/avance.md
  src/
    api-cuentos.js
    routes.md
  demo/
    respuesta-listar-cuentos.json
    respuesta-detalle-cuento.json
    respuesta-guardar-decision.json
```

Debe incluir:

- Funcion para listar cuentos.
- Funcion para traer detalle de cuento.
- Funcion para traer escenas.
- Funcion para guardar decision.
- Funcion para guardar puntaje.
- Funcion para devolver recomendacion.

Rutas sugeridas:

```text
GET /api/stories
GET /api/stories/:id
GET /api/stories/:id/scenes
POST /api/decisions
POST /api/scores
GET /api/recommendations/:userId
```

En `avance.md` debe escribir:

- Que rutas hizo.
- Que JSON devuelve cada una.
- Que falta conectar.

## 07 Oscar - Panel administrador

Carpeta:

```text
modules/07-oscar-panel-admin/
```

Debe subir el panel para administrar contenidos.

Estructura sugerida:

```text
modules/07-oscar-panel-admin/
  README.md
  base-avance/avance.md
  src/
    admin-dashboard.html
    cuentos-form.html
    escenas-form.html
    admin.js
    admin.css
  demo/
    cuentos-admin-demo.json
```

Debe incluir:

- Dashboard administrador.
- Lista de cuentos.
- Formulario crear cuento.
- Formulario editar cuento.
- Formulario crear escena.
- Formulario crear opcion.
- Estado borrador/publicado.
- Boton guardar.
- Boton cancelar.

Campos minimos de cuento:

- Titulo.
- Categoria.
- Descripcion.
- Imagen.
- Edad recomendada.
- Estado.

En `avance.md` debe escribir:

- Que formularios subio.
- Que datos demo uso.
- Que botones funcionan.

## 08 Ruth Mariela - Base de datos y datos

Carpeta:

```text
modules/08-ruth-mariela-base-datos/
```

Debe subir la estructura de datos.

Estructura sugerida:

```text
modules/08-ruth-mariela-base-datos/
  README.md
  base-avance/avance.md
  src/
    schema.sql
    relaciones.md
  demo/
    datos-demo.sql
    datos-demo.json
```

Debe incluir tablas o colecciones para:

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

Cada tabla debe tener:

- Id.
- Campos principales.
- Relacion con otra tabla si corresponde.
- Datos demo.

En `avance.md` debe escribir:

- Que tablas creo.
- Que archivo tiene datos demo.
- Como se relacionan cuentos, escenas y opciones.

## 09 Ruth Serrano - Reportes de progreso

Carpeta:

```text
modules/09-ruth-serrano-reportes/
```

Debe subir pantallas de seguimiento.

Estructura sugerida:

```text
modules/09-ruth-serrano-reportes/
  README.md
  base-avance/avance.md
  src/
    dashboard-progreso.html
    reporte-detalle.html
    reportes.js
    reportes.css
  demo/
    progreso-demo.json
```

Debe incluir:

- Resumen del nino.
- Cuentos completados.
- Puntaje total.
- Estrellas acumuladas.
- Decisiones correctas e incorrectas.
- Temas que necesita reforzar.
- Recomendacion para tutor.
- Filtro por cuento.

Datos demo minimos:

- Nombre del nino.
- Lista de cuentos jugados.
- Puntaje por cuento.
- Decisiones tomadas.
- Recomendaciones.

En `avance.md` debe escribir:

- Que reportes se pueden ver.
- Que filtros funcionan.
- Donde estan los datos demo.

## 10 Alejandra Quiroga - Logros y recomendaciones

Carpeta:

```text
modules/10-alejandra-logros-recomendaciones/
```

Debe subir recompensas y recomendaciones.

Estructura sugerida:

```text
modules/10-alejandra-logros-recomendaciones/
  README.md
  base-avance/avance.md
  src/
    logros.html
    resultado.html
    logros.js
    logros.css
  demo/
    logros-demo.json
```

Debe incluir:

- Pantalla de resultado.
- Calculo de estrellas.
- Lista de logros.
- Logro desbloqueado.
- Mensajes positivos.
- Recomendaciones segun puntaje.
- Recomendaciones segun decision tomada.

Regla sugerida:

- 0 a 9 puntos: 1 estrella.
- 10 a 19 puntos: 2 estrellas.
- 20 o mas puntos: 3 estrellas.

En `avance.md` debe escribir:

- Como calcula estrellas.
- Que logros existen.
- Que recomendaciones muestra.

## 11 Alvaro Rosas - Accesibilidad y audio

Carpeta:

```text
modules/11-alvaro-accesibilidad-audio/
```

Debe subir funciones para que el juego sea mas facil de usar.

Estructura sugerida:

```text
modules/11-alvaro-accesibilidad-audio/
  README.md
  base-avance/avance.md
  src/
    accesibilidad.html
    audio-controls.js
    accesibilidad.css
  assets/
    sonidos-demo/
```

Debe incluir:

- Boton leer texto en voz alta.
- Boton repetir escena.
- Boton activar/desactivar sonido.
- Control de volumen.
- Cambiar tamano de letra.
- Modo alto contraste.
- Boton de ayuda.
- Indicador visual de audio activo.

Funciones sugeridas:

- `leerTexto(texto)`
- `detenerAudio()`
- `cambiarVolumen(valor)`
- `aumentarLetra()`
- `activarContraste()`
- `mostrarAyuda()`

En `avance.md` debe escribir:

- Que controles funcionan.
- Si usa audio real o demo.
- Que archivo se abre primero.

## 12 Gabriela Peñaranda - Perfil y progreso

Carpeta:

```text
modules/12-gabriela-perfil-progreso/
```

Debe subir la zona personal del nino.

Estructura sugerida:

```text
modules/12-gabriela-perfil-progreso/
  README.md
  base-avance/avance.md
  src/
    perfil.html
    progreso-personal.html
    perfil.js
    perfil.css
  demo/
    perfil-demo.json
```

Debe incluir:

- Nombre del usuario.
- Rol.
- Avatar o icono.
- Cuentos completados.
- Estrellas acumuladas.
- Logros recientes.
- Ultima aventura jugada.
- Boton continuar ultima aventura.
- Configuracion basica del perfil.

Datos minimos:

```json
{
  "nombre": "Nino demo",
  "rol": "nino",
  "estrellas": 8,
  "cuentosCompletados": 3,
  "ultimaAventura": "Me perdi en el parque"
}
```

En `avance.md` debe escribir:

- Que datos muestra.
- Que botones funcionan.
- Como se podria conectar con login y reportes.

## 13 Alejandro - Integracion y fusion final

Carpeta:

```text
modules/13-alejandro-integracion/
```

Alejandro debe fusionar todo lo que suban los demas.

Estructura sugerida:

```text
modules/13-alejandro-integracion/
  README.md
  base-avance/
    avance.md
    pendientes-integracion.md
    checklist-modulos.md
```

Debe encargarse de:

- Revisar cada Pull Request.
- Ver que cada persona haya subido en su carpeta.
- Copiar o adaptar lo util al frontend final.
- Conectar pantallas entre si.
- Conectar datos demo.
- Unificar estilos.
- Corregir rutas rotas.
- Resolver conflictos.
- Dejar una version final presentable.

Checklist recomendado:

- Alcides: estilos y pantallas base revisadas.
- Benjamin: biblioteca conectada.
- Brayan: motor de cuento funcionando.
- Fabian: componentes reutilizables adaptados.
- Josué: login y roles conectados.
- Luis: API o datos de cuentos conectados.
- Oscar: admin conectado o dejado como demo.
- Ruth Mariela: datos cargados.
- Ruth Serrano: reportes visibles.
- Alejandra: logros y recomendaciones conectados.
- Alvaro: accesibilidad/audio integrado.
- Gabriela: perfil/progreso conectado.

En `avance.md` debe escribir:

- Que modulos ya reviso.
- Que modulos ya integro.
- Que queda pendiente.
- Que version es la ultima estable.
