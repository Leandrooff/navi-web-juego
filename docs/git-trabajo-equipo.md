# Trabajo en equipo con Git y GitHub

## Reglas principales

- La rama `main` solo debe contener avances revisados.
- Nadie debe subir directamente a `main`.
- Cada pareja trabaja en una rama propia.
- Cada avance se sube mediante Pull Request.
- Antes de empezar a trabajar, siempre actualizar el repositorio.

## Clonar el repositorio

```bash
git clone URL_DEL_REPOSITORIO
cd navi-web-juego
```

## Crear rama de modulo

Ejemplos:

```bash
git checkout -b modulo-01-diseno-ui
git checkout -b modulo-02-frontend-juego
git checkout -b modulo-03-backend-api
git checkout -b modulo-04-panel-admin
git checkout -b modulo-05-base-datos
git checkout -b modulo-06-reportes
git checkout -b modulo-07-integracion-qa
```

## Guardar avances

```bash
git status
git add .
git commit -m "Avance modulo 02 motor de cuentos"
git push origin nombre-de-la-rama
```

## Pedir integracion

1. Entrar a GitHub.
2. Abrir Pull Request desde la rama del modulo hacia `main`.
3. Explicar que se hizo.
4. Adjuntar capturas si aplica.
5. Esperar revision.

## Antes de trabajar cada dia

```bash
git checkout main
git pull origin main
git checkout nombre-de-tu-rama
git merge main
```

## Mensajes de commit recomendados

```text
Agregar pantalla de biblioteca
Crear modelo de cuentos y escenas
Documentar endpoints de autenticacion
Agregar diagrama entidad relacion
Corregir validacion de rutas incompletas
```

## Que no hacer

- No subir contrasenas.
- No subir archivos `.env`.
- No borrar carpetas de otros modulos.
- No cambiar archivos de otro modulo sin avisar.
- No hacer commits gigantes sin explicacion.

