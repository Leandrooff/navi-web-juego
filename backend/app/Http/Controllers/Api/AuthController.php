<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\Access;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Registro de nuevo usuario.
     * Solo permite roles públicos (tutor, docente/educador).
     * Rechaza correos duplicados y roles no permitidos como admin.
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:120',
            'email'    => 'required|email|max:160|unique:users,email',
            'password' => 'required|string|min:6',
            'role'     => 'required|string',
        ], [
            'email.unique' => 'El correo electrónico ya se encuentra registrado en el sistema.',
            'password.min' => 'La contraseña debe contener al menos 6 caracteres.',
        ]);

        // Verificación estricta de asignación de roles públicos
        if (!Access::canRegisterRole($validated['role'])) {
            return response()->json([
                'message' => 'No está permitido registrarse directamente con este rol (solo cuentas tutor o docente/educador).'
            ], 403);
        }

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => strtolower(trim($validated['email'])),
            'password' => Hash::make($validated['password']),
            'role'     => strtolower(trim($validated['role'])),
        ]);

        $token = method_exists($user, 'createToken')
            ? $user->createToken('auth-token')->plainTextToken
            : null;

        return response()->json([
            'message' => 'Usuario registrado con éxito',
            'user'    => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $user->role,
            ],
            'token'   => $token,
        ], 201);
    }

    /**
     * Inicio de sesión.
     * Valida credenciales y genera sesión web / token Sanctum.
     */
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', strtolower(trim($credentials['email'])))->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'message' => 'Credenciales incorrectas. Verifique su correo o contraseña.'
            ], 401);
        }

        $token = method_exists($user, 'createToken')
            ? $user->createToken('auth-token')->plainTextToken
            : null;

        return response()->json([
            'message' => 'Inicio de sesión exitoso',
            'user'    => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $user->role,
            ],
            'token'   => $token,
        ], 200);
    }

    /**
     * Devuelve los datos del usuario autenticado (para recarga de página).
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Sesión no iniciada o token no válido'
            ], 401);
        }

        return response()->json([
            'user' => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $user->role,
            ]
        ], 200);
    }

    /**
     * Cierre de sesión. Revoca tokens y destruye sesión activa.
     */
    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user) {
            if (method_exists($user, 'currentAccessToken') && $user->currentAccessToken()) {
                $user->currentAccessToken()->delete();
            }

            if (Auth::guard('web')->check()) {
                Auth::guard('web')->logout();
            }
        }

        return response()->json([
            'message' => 'Sesión cerrada correctamente'
        ], 200);
    }

    /**
     * Cambio de contraseña para usuarios autenticados.
     */
    public function changePassword(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'No autorizado'], 401);
        }

        $request->validate([
            'current_password' => 'required|string',
            'new_password'     => 'required|string|min:6|confirmed',
        ], [
            'new_password.min'       => 'La nueva contraseña debe tener mínimo 6 caracteres.',
            'new_password.confirmed' => 'La confirmación de la nueva contraseña no coincide.',
        ]);

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'La contraseña actual ingresada es incorrecta.'
            ], 422);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json([
            'message' => 'Contraseña actualizada con éxito.'
        ], 200);
    }
}
