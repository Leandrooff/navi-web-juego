# Avance del Módulo: Login y Roles (Josué)

## Usuarios Demo Creados
Se agregaron 4 usuarios base en `demo/usuarios-demo.json`:
- **Niño:** `nino@navi.com` | Contraseña: `123`
- **Tutor:** `tutor@navi.com` | Contraseña: `123`
- **Educador:** `educador@navi.com` | Contraseña: `123`
- **Administrador:** `admin@navi.com` | Contraseña: `123`

## Funciones Implementadas
1. **Inicio de sesión:** Validación con mensajes de error ante credenciales erróneas.
2. **Registro de usuarios:** Permite registrar un nuevo usuario especificando nombre, correo, clave y rol.
3. **Persistencia de Sesión:** Manejo de usuario activo mediante `localStorage`.
4. **Cierre de Sesión:** Limpieza de datos en sesión activa.
5. **Validación y Protección de Roles:**
   - Redirección y acceso denegado si el rol del usuario activo no cuenta con los permisos necesarios.
   - El rol `admin` cuenta con permisos de acceso global.

## Pasos para probar este avance
1. Abrir `src/login.html` en el navegador.
2. Ingresar con una cuenta de prueba (ej: `nino@navi.com`).
3. Intentar acceder a un módulo diferente (ej: Módulo Admin) para comprobar la pantalla de **Acceso Denegado**.
4. Ir a `src/registro.html` para crear un nuevo usuario con un rol a elección.

## Pendiente por conectar
- Conexión con Backend real (API REST / Node.js o Python).
- Encriptación de contraseñas.
- Manejo de Tokens JWT para autenticación segura.
