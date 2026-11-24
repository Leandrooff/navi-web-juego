<?php

use App\Http\Controllers\AdminStoryController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')
    ->middleware(['auth:sanctum', 'admin'])
    ->group(function () {
        Route::get('/stories', [AdminStoryController::class, 'index']);
        Route::post('/stories', [AdminStoryController::class, 'storeStory']);
        Route::put('/stories/{story}', [AdminStoryController::class, 'updateStory']);
        Route::get('/stories/{story}/preview', [AdminStoryController::class, 'preview']);
        Route::post('/stories/{story}/publish', [AdminStoryController::class, 'publish']);
        Route::patch('/stories/{story}/status', [AdminStoryController::class, 'setStatus']);

        Route::post('/stories/{story}/scenes', [AdminStoryController::class, 'storeScene']);
        Route::put('/scenes/{scene}', [AdminStoryController::class, 'updateScene']);
        Route::post('/stories/{story}/scenes/reorder', [AdminStoryController::class, 'reorderScenes']);

        Route::post('/scenes/{scene}/choices', [AdminStoryController::class, 'storeChoice']);
    });