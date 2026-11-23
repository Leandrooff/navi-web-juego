<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Support\Access;

/*
|--------------------------------------------------------------------------
| API Routes - NAVI Web Juego
| Responsable: Josué (Autenticación y Permisos / Roles)
| Integración con: Gabriela (Perfiles), Ruth Serrano (Reportes), Óscar (Admin)
|--------------------------------------------------------------------------
*/

// --- 1. Rutas públicas de Autenticación ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// --- 2. Rutas protegidas por Autenticación (Sanctum / Sesión) ---
Route::middleware('auth:sanctum')->group(function () {

    // Gestión de Sesión y Cuenta
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);

    // --- 3. Perfiles Infantiles (Gabriela - Módulo 12) ---
    // Aislamiento entre tutores: un tutor solo ve y edita perfiles de sus propios niños.
    Route::prefix('child-profiles')->group(function () {
        Route::get('/', function (Request $request) {
            // Tutores ven sus propios perfiles creados
            return response()->json([
                'profiles' => []
            ]);
        });

        Route::get('/{profileId}', function (Request $request, $profileId) {
            // Ejemplo de validación de propiedad de perfil:
            $dummyProfile = ['id' => $profileId, 'tutor_id' => 10, 'name' => 'Perfil sintético'];
            Access::denyUnless(
                Access::canAccessChildProfile($request->user(), $dummyProfile),
                'Acceso denegado: este perfil infantil no pertenece a tu cuenta de tutor'
            );

            return response()->json(['profile' => $dummyProfile]);
        });
    });

    // --- 4. Reportes y Aulas (Ruth Serrano - Módulo 09) ---
    // El docente solo accede con consentimiento del tutor; si es revocado, se niega el acceso.
    Route::prefix('reports')->group(function () {
        Route::get('/children/{childId}', function (Request $request, $childId) {
            $dummyProfile = ['id' => $childId, 'tutor_id' => 10];
            $hasActiveConsent = (bool) $request->header('X-Consent-Active', true);

            Access::denyUnless(
                Access::canAccessReport($request->user(), $dummyProfile, $hasActiveConsent),
                'Acceso denegado: no cuentas con el consentimiento activo del tutor para consultar este informe'
            );

            return response()->json(['report' => 'Datos de progreso y decisiones']);
        });
    });

    // --- 5. Panel Administrativo (Óscar - Módulo 07) ---
    // Solo accesible por usuarios con rol 'admin'. Tutores y docentes reciben 403 Forbidden.
    Route::prefix('admin')->group(function () {
        Route::get('/dashboard', function (Request $request) {
            Access::denyUnless(
                Access::canAccessAdminPanel($request->user()),
                'Acceso denegado: se requieren permisos de administrador para este panel'
            );

            return response()->json([
                'status' => 'ok',
                'panel'  => 'Panel administrativo NAVI - Gestión de cuentos y escenas'
            ]);
        });
    });
});
