# Reparto individual para 13 personas

El proyecto se trabajara de forma individual. Cada persona debe subir funciones, pantallas o archivos utiles dentro de su carpeta en `modules/`.

La idea es que todos avancen partes reales del sistema. Alejandro se encargara de fusionar, corregir e integrar todo al final.

## Regla principal

- Cada persona trabaja solo en su carpeta.
- Cada persona debe entregar una pantalla, funcion, componente, endpoint o base real segun su modulo.
- No se pide documentacion larga ni pruebas formales.
- Si necesitan explicar algo, que sea corto y dentro de `base-avance/avance.md`.
- Alejandro no necesita que todo venga integrado; el lo unira despues.

## 01 Alcides Diseno UI

Carpeta: `modules/01-alcides-diseno-ui`

Debe crear la base visual del juego.

Pantallas:

- Pantalla de inicio.
- Pantalla de seleccion de aventura.
- Pantalla de cuento jugando.
- Pantalla de resultado final.

Funciones:

- Definir colores principales.
- Definir botones principales y secundarios.
- Definir tarjetas para cuentos.
- Definir estados visuales: activo, bloqueado, completado y error.
- Crear estilo infantil, claro y seguro.

## 02 Benjamin Biblioteca y navegacion

Carpeta: `modules/02-benjamin-biblioteca-navegacion`

Debe crear la pantalla donde el nino elige cuentos.

Pantallas:

- Biblioteca de aventuras.
- Menu principal.
- Filtro por categoria.
- Detalle corto del cuento antes de jugar.

Funciones:

- Mostrar lista de cuentos.
- Filtrar cuentos por categoria.
- Marcar cuento como nuevo, en progreso o completado.
- Boton para iniciar cuento.
- Navegacion entre inicio, biblioteca y juego.

## 03 Brayan Motor de cuentos

Carpeta: `modules/03-brayan-motor-cuentos`

Debe crear la logica jugable del cuento.

Pantallas:

- Escena actual del cuento.
- Opciones de decision.
- Resultado despues de elegir.
- Final bueno, intermedio o malo.

Funciones:

- Leer escenas desde JSON.
- Mostrar texto, imagen o icono de escena.
- Mostrar opciones.
- Cambiar de escena segun la opcion.
- Sumar puntos.
- Calcular final del cuento.
- Reiniciar cuento.

## 04 Fabian Componentes frontend

Carpeta: `modules/04-fabian-componentes-frontend`

Debe crear piezas reutilizables para que los demas armen pantallas.

Pantallas:

- Galeria de componentes.
- Vista responsive para celular.
- Vista responsive para computadora.

Funciones:

- Componente boton.
- Componente tarjeta de cuento.
- Componente barra de progreso.
- Componente opcion de decision.
- Componente modal o alerta.
- Layout base con sidebar o menu.
- Adaptacion a celular.

## 05 Josué Login y roles

Carpeta: `modules/05-josue-backend-auth-roles`

Debe crear el acceso de usuarios y roles.

Pantallas:

- Login.
- Registro simple.
- Seleccion de rol.
- Pantalla de usuario logueado.

Funciones:

- Login con email y password.
- Registro de usuario.
- Cerrar sesion.
- Roles: nino, tutor, educador y administrador.
- Proteger rutas segun rol.
- Guardar usuario activo.

## 06 Luis API de cuentos

Carpeta: `modules/06-luis-api-cuentos`

Debe crear la forma en que el frontend pedira cuentos y guardara decisiones.

Pantallas:

- Vista simple para probar respuestas.

Funciones:

- Listar cuentos.
- Obtener detalle de un cuento.
- Obtener escenas de un cuento.
- Guardar decision tomada.
- Guardar puntaje final.
- Devolver recomendaciones basicas por resultado.

## 07 Oscar Panel administrador

Carpeta: `modules/07-oscar-panel-admin`

Debe crear la pantalla para administrar cuentos.

Pantallas:

- Panel principal admin.
- Lista de cuentos.
- Crear/editar cuento.
- Crear/editar escena.
- Crear/editar opcion de decision.

Funciones:

- Crear cuento.
- Editar cuento.
- Eliminar o desactivar cuento.
- Crear escenas.
- Ordenar escenas.
- Crear opciones con puntaje y siguiente escena.
- Cambiar estado: borrador o publicado.

## 08 Ruth Mariela Base de datos y datos

Carpeta: `modules/08-ruth-mariela-base-datos`

Debe crear la estructura de datos que usara el juego.

Pantallas:

- Vista simple de tablas o datos cargados.

Funciones:

- Tabla de usuarios.
- Tabla de cuentos.
- Tabla de escenas.
- Tabla de opciones.
- Tabla de decisiones del nino.
- Tabla de puntajes.
- Tabla de logros.
- Datos iniciales para probar el juego.

## 09 Ruth Serrano Reportes de progreso

Carpeta: `modules/09-ruth-serrano-reportes`

Debe crear pantallas de seguimiento para tutor o educador.

Pantallas:

- Resumen del progreso del nino.
- Historial de cuentos jugados.
- Decisiones tomadas.
- Temas que necesita reforzar.

Funciones:

- Mostrar porcentaje de avance.
- Mostrar puntos y estrellas.
- Mostrar cuentos completados.
- Mostrar errores frecuentes.
- Mostrar recomendacion para tutor.
- Filtrar por nino o cuento.

## 10 Alejandra Quiroga Logros y recomendaciones

Carpeta: `modules/10-alejandra-logros-recomendaciones`

Debe crear el sistema de recompensas y consejos.

Pantallas:

- Pantalla de logros.
- Pantalla de resultado con estrellas.
- Pantalla de recomendacion final.

Funciones:

- Calcular estrellas segun puntaje.
- Desbloquear logros.
- Mostrar mensaje positivo.
- Mostrar recomendacion segun decision.
- Guardar logro obtenido.
- Mostrar progreso de insignias.

## 11 Alvaro Rosas Accesibilidad y audio

Carpeta: `modules/11-alvaro-accesibilidad-audio`

Debe mejorar que el juego sea facil de usar para ninos.

Pantallas:

- Panel de accesibilidad.
- Controles de audio.
- Modo lectura.

Funciones:

- Boton para leer texto en voz alta.
- Boton para repetir escena.
- Control de volumen.
- Activar/desactivar sonido.
- Cambiar tamano de letra.
- Modo alto contraste.
- Boton de ayuda.

## 12 Gabriela Peñaranda Perfil y progreso

Carpeta: `modules/12-gabriela-perfil-progreso`

Debe crear la zona personal del usuario.

Pantallas:

- Perfil del nino.
- Progreso personal.
- Cuentos guardados.
- Ultima actividad.

Funciones:

- Mostrar nombre y rol.
- Mostrar avatar o icono.
- Mostrar cuentos completados.
- Mostrar estrellas acumuladas.
- Mostrar logros recientes.
- Boton para continuar ultima aventura.
- Configurar datos basicos del perfil.

## 13 Alejandro Integracion y fusion final

Carpeta: `modules/13-alejandro-integracion`

Alejandro no tiene que crear un modulo aislado como los demas. Su parte es juntar todo.

Funciones:

- Revisar lo que suba cada persona.
- Ordenar carpetas y archivos.
- Corregir conflictos.
- Unir pantallas, componentes, datos y funciones.
- Decidir que entra en la version final.
- Hacer que el proyecto completo corra.
