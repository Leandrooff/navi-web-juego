<?php

namespace App\Support;

use Illuminate\Auth\Access\AuthorizationException;

class Access
{
    public const ROLE_NINO = 'nino';
    public const ROLE_TUTOR = 'tutor';
    public const ROLE_DOCENTE = 'docente';
    public const ROLE_EDUCADOR = 'educador';
    public const ROLE_ADMIN = 'admin';

    /**
     * Roles permitidos para autoregistro público.
     * El rol admin NO se expone al registro público (se asigna por seeders o consola autorizada).
     */
    public const PUBLIC_ROLES = [
        self::ROLE_TUTOR,
        self::ROLE_DOCENTE,
        self::ROLE_EDUCADOR,
    ];

    /**
     * Valida si un rol puede registrarse desde el formulario público.
     */
    public static function canRegisterRole(?string $role): bool
    {
        if (!$role) {
            return false;
        }

        return in_array(strtolower(trim($role)), self::PUBLIC_ROLES, true);
    }

    /**
     * Verifica acceso a panel de administración (solo admin).
     */
    public static function canAccessAdminPanel($user): bool
    {
        if (!$user) {
            return false;
        }

        return strtolower($user->role ?? '') === self::ROLE_ADMIN;
    }

    /**
     * Verifica si un tutor es propietario del perfil infantil (Gabriela - Módulo 12).
     */
    public static function canAccessChildProfile($user, $childProfile): bool
    {
        if (!$user || !$childProfile) {
            return false;
        }

        if (self::canAccessAdminPanel($user)) {
            return true;
        }

        $tutorId = is_array($childProfile)
            ? ($childProfile['tutor_id'] ?? null)
            : ($childProfile->tutor_id ?? null);

        return (int) $user->id === (int) $tutorId;
    }

    /**
     * Verifica acceso a reportes e informes con soporte de consentimiento (Ruth Serrano - Módulo 09).
     * El docente solo puede ver si existe consentimiento activo otorgado por el tutor.
     */
    public static function canAccessReport($user, $childProfile, bool $hasActiveConsent = true): bool
    {
        if (!$user || !$childProfile) {
            return false;
        }

        if (self::canAccessAdminPanel($user)) {
            return true;
        }

        // Si es el tutor propietario, siempre tiene acceso
        if (self::canAccessChildProfile($user, $childProfile)) {
            return true;
        }

        // Si es docente / educador, requiere consentimiento activo que no haya sido revocado
        $isTeacher = in_array(strtolower($user->role ?? ''), [self::ROLE_DOCENTE, self::ROLE_EDUCADOR], true);
        if ($isTeacher && $hasActiveConsent) {
            return true;
        }

        return false;
    }

    /**
     * Verifica acceso al aula escolar.
     */
    public static function canAccessClassroom($user, $classroom): bool
    {
        if (!$user) {
            return false;
        }

        if (self::canAccessAdminPanel($user)) {
            return true;
        }

        $isTeacher = in_array(strtolower($user->role ?? ''), [self::ROLE_DOCENTE, self::ROLE_EDUCADOR], true);
        if (!$isTeacher) {
            return false;
        }

        $teacherId = is_array($classroom)
            ? ($classroom['teacher_id'] ?? $classroom['user_id'] ?? null)
            : ($classroom->teacher_id ?? $classroom->user_id ?? null);

        return $teacherId === null || (int) $user->id === (int) $teacherId;
    }

    /**
     * Lanza excepción 403 Forbidden si la condición no se cumple.
     */
    public static function denyUnless(bool $condition, string $message = 'Acceso denegado: no tienes permisos para realizar esta operación'): void
    {
        if (!$condition) {
            abort(403, $message);
        }
    }
}
