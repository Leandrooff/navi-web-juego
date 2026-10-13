# Flujo logico del proyecto NAVI Web Juego

## Flujo del nino

1. El nino entra a la pagina.
2. Selecciona su perfil o avatar.
3. Ve una biblioteca de aventuras disponibles.
4. Elige un cuento.
5. El sistema muestra la primera escena con imagen, texto y audio.
6. El nino toma una decision entre dos o tres opciones.
7. La opcion elegida lleva a otra escena o a un final.
8. El sistema guarda la decision tomada.
9. Al terminar, el sistema muestra estrellas, logro y recomendacion.
10. El progreso queda disponible para tutor o educador.

## Flujo del tutor

1. El tutor inicia sesion.
2. Crea o selecciona un perfil infantil.
3. Revisa cuentos jugados.
4. Consulta decisiones tomadas.
5. Revisa recomendaciones por tema de seguridad.

## Flujo del educador

1. El educador inicia sesion.
2. Revisa perfiles autorizados.
3. Asigna cuentos o actividades.
4. Consulta resultados individuales y grupales.
5. Identifica temas que necesitan refuerzo.

## Flujo del administrador

1. El administrador inicia sesion en el panel.
2. Crea categorias de seguridad.
3. Crea cuentos.
4. Agrega escenas con texto, imagen y audio.
5. Agrega opciones de decision.
6. Conecta cada opcion con otra escena o final.
7. Revisa que no existan rutas incompletas.
8. Publica el cuento.

## Flujo tecnico de una partida

```text
Perfil infantil
  -> selecciona cuento
  -> crea sesion de juego
  -> carga escena inicial
  -> muestra opciones
  -> registra decision
  -> carga siguiente escena
  -> repite hasta final
  -> calcula resultado
  -> guarda logro y recomendacion
```

## Datos minimos que debe guardar el sistema

- Usuario.
- Rol.
- Perfil infantil.
- Categoria de seguridad.
- Cuento.
- Escena.
- Opcion de decision.
- Resultado de cada decision.
- Sesion de juego.
- Puntaje.
- Logro.
- Recomendacion.

## Regla principal del juego

Cada cuento debe ser un grafo de escenas. Una escena puede tener varias opciones. Cada opcion debe apuntar a otra escena o a un final. Un cuento no puede publicarse si tiene escenas sin conexion, opciones sin destino o archivos faltantes.

