<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stories', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('category');
            $table->text('description')->nullable();
            $table->string('cover_image')->nullable();
            $table->string('status')->default('draft'); // draft | published | inactive
            $table->unsignedInteger('revision')->default(1);
            $table->foreignId('parent_story_id')->nullable()->constrained('stories')->nullOnDelete();
            $table->unsignedBigInteger('initial_scene_id')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stories');
    }
};