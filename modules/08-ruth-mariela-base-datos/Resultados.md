# NAVI — Resultados de las pruebas del módulo de base de datos

**Responsable:** Ruth Mariela Zeballos Ojeda  
**Módulo:** 08 — Base de datos  
**Fecha:** 23 de noviembre de 2026  
**Rama:** `mariela-pruebas-finales`

## 1. Entorno de pruebas

- Sistema operativo: Windows.
- PHP: 8.2.34.
- Laravel: 12.69.3.
- Composer: 2.10.3.
- MariaDB: 10.4.32.
- Puerto de MariaDB: 3306.
- Base para instalación limpia: `navi_mariela_limpia`.
- Base para actualización: `navi_mariela_20261123_upgrade_test`.

Las pruebas se efectuaron en bases locales y con cuentas y perfiles ficticios. No se utilizaron datos personales de estudiantes reales.

## 2. Instalación limpia

Se ejecutaron los siguientes comandos desde `backend`:

```powershell
composer install --prefer-dist --no-interaction
php artisan key:generate
php artisan config:clear
php artisan navi:doctor
php artisan migrate --seed
php artisan migrate:status
```

**Resultado observado:** las nueve migraciones se ejecutaron correctamente. El sembrado finalizó sin errores y el diagnóstico confirmó la presencia de las tablas principales.

La base contenía una historia, 34 escenas y 53 opciones de decisión.

## 3. Repetición del sembrado

Se volvió a ejecutar:

```powershell
php artisan db:seed --class=NaviStorySeeder
```

Se compararon los identificadores de `stories`, `scenes` y `choices` antes y después.

**Resultado observado:** los identificadores permanecieron iguales. No se detectaron diferencias en los conjuntos de IDs examinados.

## 4. Actualización sin pérdida de datos

Se utilizó el procedimiento automatizado:

```powershell
php scripts/verify-upgrade.php navi_mariela_20261123_upgrade_test
```

**Resultado observado:** `PASS`. El script confirmó la conservación de cuentas, perfiles, identificadores, decisiones, consecuencias y sesión, así como la repetición del sembrado sin duplicación.

Esta prueba se realizó sobre datos sintéticos, no sobre una base de producción.

## 5. Comprobación desde la aplicación

Se registró una cuenta familiar ficticia y se creó el perfil infantil «Luna», de 8 años. Se completó la aventura «Me perdí en el parque», cuyo final fue «Mi voz encontró un camino».

El sistema mostró 17 decisiones durante el recorrido. Se verificaron el cuaderno, la colección, las insignias y las huellas de la aventura.

Los conteos consultados mediante Laravel fueron:

| Tabla | Registros |
|---|---:|
| users | 1 |
| child_profiles | 1 |
| game_sessions | 1 |
| progress | 1 |
| scores | 1 |

Tras cerrar sesión y volver a ingresar, el perfil y su progreso continuaron disponibles.

## 6. Vinculación y revocación docente

Se creó una cuenta docente ficticia y el grupo «2.º A».

Antes de la autorización del tutor, el panel registraba cero perfiles vinculados. Tras autorizar a Luna, mostró un perfil vinculado, uno con actividad y una aventura completada.

Cuando el tutor retiró la autorización, Luna dejó de aparecer en el panel docente.

**Resultado observado:** la interfaz respetó los cambios de autorización. Queda como comprobación complementaria verificar la denegación de acceso mediante peticiones directas a la API.

## 7. Incidencia de compatibilidad

El comando `php artisan db:show --counts` presentó un error al consultar `performance_schema.session_status` en MariaDB 10.4.32. Para verificar los registros se utilizó Laravel Tinker, obteniendo correctamente los conteos de las tablas.

Esta incidencia no impidió completar las migraciones ni las pruebas documentadas.

## 8. Conclusión de las pruebas

La base de datos se instaló correctamente desde cero mediante migraciones. Las verificaciones de sembrado y actualización conservaron los identificadores y datos evaluados. Las pruebas desde NAVI confirmaron el guardado y recuperación del progreso, junto con el funcionamiento de la autorización y revocación desde la interfaz.

Los resultados corresponden al entorno local y a los escenarios de prueba descritos.