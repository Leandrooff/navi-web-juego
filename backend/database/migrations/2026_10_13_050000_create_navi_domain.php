<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (DB::getDriverName() !== 'mysql') {
            throw new RuntimeException('NAVI requiere MariaDB/MySQL. No se ejecutarán migraciones en otro motor.');
        }
        // El esquema académico reducido carece de AUTO_INCREMENT y no es una base desplegada compatible.
        foreach (['users', 'child_profiles', 'stories', 'scenes', 'choices'] as $name) {
            if (Schema::hasTable($name)) {
                $id = DB::selectOne("SHOW COLUMNS FROM `$name` WHERE Field = 'id'");
                if (!$id || !str_contains(strtolower($id->Type), 'unsigned') || !str_contains($id->Extra, 'auto_increment')) {
                    throw new RuntimeException("Esquema legado incompatible en $name: trabaje sobre una copia y consulte docs/INSTALACION.md. No se han eliminado datos.");
                }
            }
        }
        // Fuente relacional del módulo 08. Se preservan tablas e identificadores ya existentes.
        $sql = file_get_contents(database_path('schema/navi-domain.sql'));
        foreach (explode(';', $sql) as $statement) {
            if (trim($statement)) DB::unprepared($statement);
        }
    }

    public function down(): void
    {
        throw new RuntimeException('Migración de adopción no destructiva: restaure una copia de seguridad para revertir.');
    }
};
