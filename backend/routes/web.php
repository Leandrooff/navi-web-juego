<?php
use Illuminate\Support\Facades\Route;
// Mismo origen, cookies HttpOnly y protección CSRF de Laravel para toda la API.
Route::prefix('api')->group(base_path('routes/api.php'));
Route::get('/',fn()=>response()->json(['application'=>'NAVI','frontend'=>'http://localhost:5173']));
