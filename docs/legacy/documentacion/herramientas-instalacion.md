# Herramientas e instalacion

Este documento indica que debe instalar cada integrante antes de empezar a trabajar.

## Herramientas obligatorias

### 1. Git

Sirve para controlar versiones y subir avances a GitHub.

Descarga:

```text
https://git-scm.com/downloads
```

Verificar instalacion:

```bash
git --version
```

Configurar nombre y correo:

```bash
git config --global user.name "Nombre Apellido"
git config --global user.email "correo@example.com"
```

### 2. Visual Studio Code

Editor recomendado para todo el equipo.

Descarga:

```text
https://code.visualstudio.com/
```

Extensiones recomendadas:

- GitLens
- Prettier
- ESLint
- PHP Intelephense
- Laravel Extra Intellisense
- Tailwind CSS IntelliSense

### 3. Node.js LTS

Necesario para React, Vite y Tailwind CSS.

Descarga:

```text
https://nodejs.org/
```

Verificar:

```bash
node -v
npm -v
```

### 4. PHP y Composer

Necesarios para Laravel.

Descarga PHP:

```text
https://windows.php.net/download/
```

Descarga Composer:

```text
https://getcomposer.org/download/
```

Verificar:

```bash
php -v
composer -V
```

### 5. Base de datos

Opcion recomendada para clase:

- XAMPP con MySQL, si quieren algo facil en Windows.
- PostgreSQL, si quieren una base de datos mas robusta.

Para empezar rapido se recomienda MySQL con XAMPP.

### 6. Postman o Insomnia

Sirve para probar las rutas del backend.

Opciones:

```text
https://www.postman.com/downloads/
https://insomnia.rest/download
```

### 7. Figma

Sirve para disenar pantallas antes de programar.

```text
https://www.figma.com/
```

## Comandos iniciales del proyecto

Cuando el repositorio ya este clonado:

```bash
git clone URL_DEL_REPOSITORIO
cd navi-web-juego
git checkout -b nombre-persona-modulo
```

## Estructura tecnica recomendada para desarrollo

Cuando se implemente el codigo, se recomienda crear:

```text
frontend/   React + Vite + Tailwind CSS
backend/    Laravel API + Filament
database/   diagramas, migraciones y datos de prueba
docs/       documentacion del equipo
```

## Comandos sugeridos para crear el frontend

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install tailwindcss @tailwindcss/vite
npm run dev
```

## Comandos sugeridos para crear el backend

```bash
composer create-project laravel/laravel backend
cd backend
composer require laravel/sanctum
composer require filament/filament
php artisan serve
```

## Nota importante

Si una persona no tiene todavia el backend listo, debe usar datos de ejemplo en JSON. Si una persona no tiene frontend listo, debe subir una pantalla simple, una funcion demo o un archivo de datos que Alejandro pueda integrar despues.
