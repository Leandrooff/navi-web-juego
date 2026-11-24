<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('choices', 'consequence')) Schema::table('choices', function (Blueprint $table) {
            $table->text('consequence')
                ->nullable()
                ->after('label');
        });
    }

    public function down(): void
    {
        throw new \RuntimeException('No se eliminan consecuencias históricas.');
    }
};