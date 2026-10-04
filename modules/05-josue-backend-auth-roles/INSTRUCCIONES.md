# Instrucciones para Josué - Login y roles

## Objetivo exacto

Crear el acceso de usuarios y roles para nino, tutor, educador y administrador.

## Estructura que debes seguir

```text
modules/05-josue-backend-auth-roles/
  README.md
  INSTRUCCIONES.md
  base-avance/
    avance.md
  src/
    login.html
    registro.html
    auth.js
    roles.js
  demo/
    usuarios-demo.json
```

## Pantallas que debes subir

- Login.
- Registro.
- Seleccion o muestra de rol.
- Pantalla de usuario logueado.
- Pantalla o mensaje de acceso denegado.

## Funciones que debe tener

- Registrar usuario.
- Iniciar sesion.
- Cerrar sesion.
- Guardar usuario activo.
- Validar rol.
- Redirigir segun rol.
- Proteger pantalla segun rol.
- Mostrar mensaje de error si el login falla.

## Datos demo obligatorios

Crear `demo/usuarios-demo.json` con usuarios de ejemplo para los roles:

- `nino`
- `tutor`
- `educador`
- `admin`

## Que escribir en avance.md

- Que usuarios demo existen.
- Como iniciar sesion.
- Que roles creaste.
- Que falta conectar.
