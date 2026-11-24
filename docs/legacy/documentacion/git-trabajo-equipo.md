# Trabajo en equipo con Git y GitHub

## Reglas principales

- La rama `main` solo debe contener avances revisados.
- Nadie debe subir directamente a `main`.
- Cada persona trabaja en una rama propia.
- Cada persona trabaja dentro de su carpeta asignada en `modules/`.
- Cada avance se sube mediante Pull Request.
- Antes de empezar a trabajar, siempre actualizar el repositorio.

## Clonar el repositorio

```bash
git clone https://github.com/Leandrooff/navi-web-juego.git
cd navi-web-juego
```

## Crear rama personal

Ejemplos:

```bash
git checkout -b alcides-diseno-ui
git checkout -b benjamin-biblioteca
git checkout -b brayan-motor-cuentos
git checkout -b fabian-componentes
git checkout -b josue-backend-auth
git checkout -b luis-api-cuentos
git checkout -b oscar-panel-admin
git checkout -b ruth-mariela-base-datos
git checkout -b ruth-serrano-reportes
git checkout -b alejandra-logros
git checkout -b alvaro-accesibilidad-audio
git checkout -b gabriela-perfil-progreso
git checkout -b alejandro-integracion
```

## Guardar avances

```bash
git status
git add .
git commit -m "Avance personal del modulo"
git push origin nombre-de-la-rama
```

## Pedir integracion

1. Entrar a GitHub.
2. Abrir Pull Request desde la rama personal hacia `main`.
3. Explicar que se hizo.
4. Adjuntar capturas si aplica.
5. Esperar revision de Alejandro.

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
Crear JSON de cuento demo
Crear login y roles
Agregar datos demo de cuentos
Crear pantalla de perfil
Actualizar avance personal
```

## Que no hacer

- No subir contrasenas.
- No subir archivos `.env`.
- No borrar carpetas de otros modulos.
- No cambiar archivos de otro modulo sin avisar.
- No hacer commits gigantes sin explicacion.

