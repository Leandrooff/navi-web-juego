# Evidencia y Entrega Final - Módulo 05: Josué
## Autenticación, Ciclo de Sesiones y Permisos por Rol

Este documento contiene el registro de evidencias, casos de prueba y descripción del Pull Request según lo exigido en `INSTRUCCIONES-ENTREGA-FINAL.md`.

---

## 1. Cuentas Sintéticas para Pruebas

Para validar los flujos de autenticación y autorización se configuraron las siguientes cuentas de prueba:

| Rol | Nombre | Correo Electrónico | Contraseña | Alcance / Permisos |
| :--- | :--- | :--- | :--- | :--- |
| **`tutor`** | Elena - Mamá de Nico | `tutor@navi.test` | `password123` | Gestión de perfiles infantiles propios. Sin acceso a panel admin. |
| **`docente`** | Prof. Marcos García | `docente@navi.test` | `password123` | Gestión de aula y consulta de reportes con consentimiento activo. |
| **`admin`** | Admin NAVI | `admin@navi.test` | `adminsecure456` | Acceso irrestricto al panel administrativo y gestión de cuentos. |

---

## 2. Dónde se Trabajó (Archivos Entregados)

1. **`backend/app/Support/Access.php`**:
   - Clase central de autorización con las constantes de roles (`ROLE_NINO`, `ROLE_TUTOR`, `ROLE_DOCENTE`, `ROLE_ADMIN`).
   - `canRegisterRole()`: Protege el registro público para admitir solo `tutor` y `docente`/`educador`. Bloquea la creación no autorizada de `admin`.
   - `canAccessChildProfile()`: Asegura el aislamiento de perfiles de niños entre tutores (`tutor_id === user.id`).
   - `canAccessReport()`: Requiere consentimiento activo del tutor para que el docente pueda consultar informes. Si fue revocado, deniega el acceso.
   - `canAccessAdminPanel()`: Restricción estricta al rol `admin`.
2. **`backend/app/Http/Controllers/Api/AuthController.php`**:
   - Métodos: `register()`, `login()`, `me()`, `logout()`, `changePassword()`.
   - Manejo de respuestas HTTP estándar: `201 Created`, `200 OK`, `401 Unauthorized`, `403 Forbidden`, `422 Unprocessable Entity`.
3. **`backend/routes/api.php`**:
   - Rutas públicas y protegidas con Sanctum y middleware de autorización.
4. **`frontend/src/adult/Auth.jsx`**:
   - Formulario de inicio de sesión y registro de adultos.
   - Botones de acceso rápido con las cuentas sintéticas.
   - Persistencia de sesión ante recarga (`localStorage` / `/me`).
   - Manejo y aviso explícito al usuario cuando su sesión expira.
   - Formulario para cambio de contraseña y prueba interactiva de acceso denegado (403).
5. **`backend/tests/Feature/AuthAndRolesTest.php`**:
   - Suite de 9 pruebas automatizadas en Laravel que verifican cada uno de los requisitos.

---

## 3. Pasos para Reproducir las Pruebas y Resultados Observados

### Prueba 1: Registro de usuario y validaciones
* **Paso 1 (Registro exitoso)**: Enviar `POST /api/register` con nombre, correo nuevo, contraseña de 6+ caracteres y rol `tutor` o `docente`.
  * *Resultado observado*: `HTTP 201 Created`, retorna datos de usuario y token de sesión.
* **Paso 2 (Correo duplicado)**: Intentar registrar el mismo correo anterior.
  * *Resultado observado*: `HTTP 422 Unprocessable Entity` con mensaje *"El correo electrónico ya se encuentra registrado en el sistema."*
* **Paso 3 (Intento de registro como admin)**: Enviar `POST /api/register` con `role: "admin"`.
  * *Resultado observado*: `HTTP 403 Forbidden` con mensaje *"No está permitido registrarse directamente con este rol (solo cuentas tutor o docente/educador)."*

### Prueba 2: Inicio de sesión, recarga y expiración
* **Paso 1 (Credenciales incorrectas)**: Intentar login con contraseña incorrecta.
  * *Resultado observado*: `HTTP 401 Unauthorized` con mensaje *"Credenciales incorrectas. Verifique su correo o contraseña."*
* **Paso 2 (Inicio exitoso)**: Iniciar sesión con `tutor@navi.test` y `password123`.
  * *Resultado observado*: `HTTP 200 OK`. Se guarda el usuario en sesión y se muestra el panel activo con el badge **ROL: TUTOR**.
* **Paso 3 (Recarga de página)**: Presionar `F5` / Recargar el navegador.
  * *Resultado observado*: La sesión se mantiene intacta gracias a la sincronización con `localStorage` y `/api/me`.
* **Paso 4 (Expiración de sesión)**: Hacer clic en "Simular expiración de sesión".
  * *Resultado observado*: La sesión se destruye y la interfaz muestra una alerta destacada: *"Aviso de seguridad: Tu sesión ha expirado por inactividad. Por favor, vuelve a iniciar sesión para continuar de forma segura."*
* **Paso 5 (Cierre de sesión / Logout)**: Iniciar sesión y hacer clic en "Cerrar sesión".
  * *Resultado observado*: `HTTP 200 OK`. Tokens revocados y retorno seguro al formulario de login.

### Prueba 3: Cambio de contraseña
* **Paso 1**: Desde la sesión activa, ingresar contraseña actual correcta y nueva contraseña de 6+ caracteres con confirmación coincidente.
  * *Resultado observado*: `HTTP 200 OK`. Se actualiza el hash en base de datos. Si la clave actual es incorrecta o no coincide la confirmación, se rechaza con `422`.

### Prueba 4: Autorización y Control de Acceso (Roles)
* **Paso 1 (Aislamiento de tutor - Gabriela)**: Tutor autenticado intenta consultar el perfil de un niño con otro `tutor_id`.
  * *Resultado observado*: `HTTP 403 Forbidden` con mensaje *"Acceso denegado: este perfil infantil no pertenece a tu cuenta de tutor."*
* **Paso 2 (Consentimiento de reporte - Ruth Serrano)**: Docente intenta consultar reporte con consentimiento revocado (`X-Consent-Active: false`).
  * *Resultado observado*: `HTTP 403 Forbidden` con mensaje *"Acceso denegado: no cuentas con el consentimiento activo del tutor."*
* **Paso 3 (Panel de administración - Óscar)**: Tutor o docente intentan acceder a `/api/admin/dashboard`.
  * *Resultado observado*: `HTTP 403 Forbidden` *"Acceso denegado: se requieren permisos de administrador para este panel."*
* **Paso 4 (Acceso admin legítimo)**: Usuario con rol `admin` accede a `/api/admin/dashboard`.
  * *Resultado observado*: `HTTP 200 OK`, panel accesible.

---

## 4. Coordinaciones Realizadas con el Equipo

* **Con Óscar (Módulo 07 - Panel Admin):**
  * Se acordó que el rol `admin` no puede autogenerarse desde el registro de la web pública. Se mantiene restringido a un proceso autorizado (seeders de Laravel o consola administrativa `artisan`). El panel responde `403` a tutores y docentes.
* **Con Gabriela (Módulo 12 - Perfil y Progreso):**
  * Se implementó el control de propiedad en `Access::canAccessChildProfile()`, garantizando que ningún tutor pueda leer ni alterar perfiles o partidas de niños pertenecientes a otra familia.
* **Con Ruth Serrano (Módulo 09 - Reportes):**
  * Se integró la regla de consentimiento activo en `Access::canAccessReport()`. Si un tutor revoca el vínculo o el consentimiento, el docente pierde el acceso al reporte de forma inmediata.

---

## 5. Plantilla de Pull Request

```markdown
### PR Módulo 05: Josué - Autenticación y Permisos

#### Descripción
Implementación y validación del ciclo completo de autenticación y control de acceso basado en roles para la plataforma NAVI.

#### Cambios incluidos
- `backend/app/Support/Access.php`: Reglas de autorización para perfiles, reportes con consentimiento y panel admin.
- `backend/app/Http/Controllers/Api/AuthController.php`: Registro con roles restringidos, login, me, logout y cambio de password.
- `backend/routes/api.php`: Rutas públicas y protegidas con Sanctum.
- `frontend/src/adult/Auth.jsx`: Componente React para inicio de sesión, registro, recarga, guía ante expiración y pruebas de roles.
- `backend/tests/Feature/AuthAndRolesTest.php`: 9 pruebas automatizadas para todos los casos de éxito y acceso denegado (401, 403, 422).
- `modules/05-josue-backend-auth-roles/base-avance/avance.md`: Evidencias de pruebas y cuentas sintéticas.

#### Pasos para reproducir
1. Ejecutar las pruebas de Laravel: `php artisan test --filter=AuthAndRolesTest`
2. En frontend, ingresar a `Auth.jsx` y usar los botones de cuentas sintéticas para probar login como Tutor, Docente y Admin.
3. Probar el botón "Simular expiración de sesión" para comprobar la guía visual al usuario.
4. Probar el botón "Probar acceso a Panel Admin" con cuenta Tutor para verificar la respuesta HTTP 403 Forbidden.

#### Criterio de aceptación
Sesiones se abren y cierran correctamente, la persistencia ante recarga funciona y las operaciones de perfil, aula y administración respetan rigurosamente el rol asignado.
```
