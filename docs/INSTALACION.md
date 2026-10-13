# Instalación en Windows, PowerShell y XAMPP

## 1. Antes de empezar

Descomprime el ZIP. Abre la carpeta **NAVI_AVENTURA** en Visual Studio Code.
Los comandos siguientes parten de esa carpeta. No ejecutes instrucciones antiguas de los módulos históricos.

Necesitas:
- Node.js 22.12 o posterior (se verificó con Node 24).
- PHP 8.2 o posterior con curl, fileinfo, mbstring, openssl, pdo_mysql y zip.
- Composer 2.
- MariaDB/MySQL. Se verificó con MariaDB 10.4.32.
- Dos terminales PowerShell.

Comprueba:

```powershell
node --version
npm.cmd --version
php --version
composer --version
```

**Atención al PHP de XAMPP:** durante las pruebas se encontró PHP 8.0.30 en XAMPP. Ese PHP no ejecuta Laravel 12. Se utilizó PHP 8.2.34 separado, manteniendo MariaDB de XAMPP. Si tu terminal muestra PHP 8.0, configura una instalación PHP 8.2+ en PATH; no ignores la comprobación de versión de Composer. No se modificó tu instalación XAMPP.

## 2. Base nueva

Inicia **MySQL** desde el panel de XAMPP. En phpMyAdmin crea:
- Base: `navi_db`.
- Intercalación: `utf8mb4_unicode_ci`.
- Usuario local para esta base, por ejemplo `navi`, con una contraseña propia.
- Permisos sobre `navi_db` (las migraciones requieren crear y modificar tablas).

No importes SQL manualmente para una instalación nueva: las migraciones crean la estructura.

En la primera terminal:

```powershell
cd backend
composer install
Copy-Item .env.example .env
```

Abre `backend/.env` y coloca los datos reales:

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=navi_db
DB_USERNAME=navi
DB_PASSWORD="TU_CONTRASEÑA_LOCAL"
```

3306 es el puerto habitual. Si XAMPP usa otro puerto, cámbialo en DB_PORT. No cambies el puerto de una base que ya utiliza otro proyecto.

```powershell
php artisan key:generate
php artisan navi:doctor
php artisan migrate --seed
php artisan serve --host=127.0.0.1 --port=8000
```

Deja abierta esta terminal. `migrate --seed` crea la historia y sus recursos relacionados; no crea cuentas, contraseñas ni perfiles de ejemplo.

En una segunda terminal desde NAVI_AVENTURA:

```powershell
cd frontend
npm.cmd ci
npm.cmd run dev
```

Abre **http://127.0.0.1:5173**. Mantén ese mismo host durante la sesión; no alternes localhost y 127.0.0.1.

La aplicación conecta `/api` al backend en 8000 mediante Vite. No necesitas abrir CORS a cualquier sitio. Si cambias el puerto del backend, establece NAVI_API_URL (por ejemplo http://127.0.0.1:8001) antes de iniciar Vite. NAVI_PORT permite cambiar 5173.

## 3. Crear las cuentas y jugar

1. Pulsa «Familias y docentes».
2. Elige «Crear una cuenta de familia o docente».
3. Para la familia, selecciona «Familiar o tutor» y usa tu propio correo y contraseña (10 caracteres, letras y números).
4. Crea el perfil infantil: alias, edad de 6 a 10, emblema, color de NAVI y nivel de acompañamiento.
5. Pulsa «Abrir su mundo».
6. La primera vez, el prólogo empieza directamente y enlaza con el encuentro y el parque. Si ya conociste a NAVI, el mapa te permite continuar.
7. Lee, elige y continúa. Si la conexión falla, reintenta; el juego no avanza sin confirmación del servidor.
8. En el cierre, pulsa «Guardar mi final». La pantalla de recompensa aparece después de guardar.
9. Regresa al mapa o explora otra ruta. Una misma historia conserva una sola estrella.

NAVI utiliza un protagonista ilustrado estable para contar el cuento. El perfil personaliza alias, emblema y el color de NAVI durante la aventura y en el mapa; no reemplaza a los personajes pintados en cada escena.

Cierra sesión y vuelve a entrar para comprobar la persistencia. No hay correo de recuperación de contraseña ni envío de emails simulado. El cambio de contraseña está en «Mi cuenta».

## 4. Aula y autorización

1. Crea otra cuenta seleccionando «Docente».
2. Crea un grupo.
3. Comparte su código con los tutores por tu medio habitual.
4. El tutor entra en NAVI Familias, selecciona el niño e introduce el código.
5. Revisa el nombre del docente y grupo; marca la autorización y confirma.
6. El docente verá ese perfil y podrá consultar su actividad o asignar la aventura al grupo.
7. Las asignaciones aparecen en «Mis descubrimientos», dentro del juego.
8. El tutor puede retirar la autorización; el docente pierde el acceso desde la siguiente consulta.
9. «Renovar código» invalida el código anterior para nuevas vinculaciones; no revoca las ya aprobadas.

El registro docente crea una cuenta real, pero no verifica por sí mismo la identidad laboral de una persona. El tutor debe comprobar a quién autoriza.

## 5. Actualizar una base existente sin perder datos

**Primero exporta una copia de seguridad completa** desde phpMyAdmin, incluyendo estructura y datos. Prueba la actualización sobre una copia, sin sustituir tu base original.

Se verificó la actualización del esquema del módulo 08, el relacional completo con IDs BIGINT UNSIGNED AUTO_INCREMENT. Se preservaron usuarios, perfiles, IDs de escenas y opciones, decisiones y sesiones.

1. Copia el código actualizado a una nueva carpeta.
2. Conserva tu .env y APP_KEY de la instalación existente; **no vuelvas a generar APP_KEY**.
3. Configura DB_DATABASE para apuntar a la copia de pruebas.
4. Instala las dependencias y ejecuta:

```powershell
cd backend
composer install
php artisan config:clear
php artisan navi:doctor
php artisan migrate
php artisan db:seed --class=NaviStorySeeder
```

Las migraciones anteriores ahora comprueban si las tablas ya existen. Las nuevas agregan columnas y relaciones; no eliminan el historial. El seeder añade la revisión ampliada con IDs propios. Las escenas antiguas mantienen sus IDs; las sesiones previas recuperan su revisión original. Los historiales no se mezclan con el nuevo guion. Las consecuencias históricas se guardan como texto antes de actualizar el contenido.

Los usuarios históricos con role_id válido conservan su rol. Una cuenta antigua sin rol no recibe privilegios automáticamente. El responsable de la instalación puede asignarlo explícitamente:

```powershell
php artisan navi:assign-role correo-de-la-cuenta tutor
```

Sustituye el correo por el real. Los roles admitidos son tutor, docente y admin; admin no tiene una nueva interfaz editorial en esta entrega.

**Esquema académico reducido:** el antiguo archivo raíz database/schema.sql del ZIP original usaba IDs sin AUTO_INCREMENT y omitía columnas. No se convierte automáticamente una base basada únicamente en ese esquema, porque requeriría resolver tipos y claves con datos reales. `navi:doctor` lo identifica y detiene la actualización. Usa el esquema relacional del módulo 08 o solicita una conversión sobre una copia de esa base concreta. El original se conserva en docs/legacy/schema-basico-original.sql. No se verificó ninguna base de datos personal ajena a las bases aisladas de prueba.

No uses migrate:fresh, db:wipe ni imports que recreen tablas sobre tu base existente. Las migraciones de adopción impiden rollback destructivo; la reversión se hace restaurando una copia.

## 6. Pruebas reproducibles

Frontend:

```powershell
cd frontend
npm.cmd ci
npm.cmd test
npm.cmd run build
```

Backend: crea una base **separada**, llamada navi_test. Copia `.env.testing.example` a `.env.testing`, introduce sus credenciales y genera su clave:

```powershell
cd backend
Copy-Item .env.testing.example .env.testing
php artisan key:generate --env=testing
php artisan migrate --env=testing --seed
php artisan test
```

Las pruebas usan transacciones y requieren que el nombre termine en _test. No utilizan SQLite ni borran tablas.

Prueba de actualización sobre una base vacía nueva (requiere permiso para crear esa base):

```powershell
php scripts/verify-upgrade.php navi_revision_upgrade_test
```

El script se niega a usar una base que ya tenga tablas. Elige otro nombre terminado en _upgrade_test para repetir.

Prueba del navegador: con los servidores encendidos y una **base de desarrollo**, desde frontend:

```powershell
npm.cmd run test:e2e
```

Se utiliza Chrome instalado en Windows. En otro entorno, instala Chromium con `npx playwright install chromium` o configura `NAVI_BROWSER_PATH`. Las pruebas crean cuentas sintéticas @example.test y perfiles de prueba; no las ejecutes sobre producción. Guardan las capturas actuales en docs/evidencias-mision. Ejecuta también npm.cmd run test:ux para verificar accesibilidad, CSRF y recuperación de imágenes.

## 7. Compilación y publicación futura

`npm.cmd run build` genera frontend/dist. Este ZIP no se ha publicado en Internet.

Para un servidor real, usa HTTPS, APP_ENV=production, APP_DEBUG=false y SESSION_SECURE_COOKIE=true. Sirve frontend/dist y reenvía /api al public/index.php de Laravel bajo el mismo origen. La raíz web de PHP debe ser backend/public; no expongas modules, docs, .env ni el directorio backend completo. Instala Composer sin paquetes de desarrollo en producción. Configura una cuenta MariaDB con los permisos necesarios y respalda los datos.

`database/schema.sql` es una exportación de estructura final sin datos, útil para inspección. La instalación recomendada usa migraciones; no mezcles ambos procedimientos sin revisar el registro migrations.
