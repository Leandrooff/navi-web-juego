<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'No autenticado.',
            ], 401);
        }

        // Soporta columna/atributo 'role' en 'admin' (bloquea 'tutor', 'docente' o cualquier otro)
        if (($user->role ?? null) !== 'admin') {
            return response()->json([
                'message' => 'Acceso denegado: solo el rol administrador puede usar el panel.',
            ], 403);
        }

        return $next($request);
    }
}