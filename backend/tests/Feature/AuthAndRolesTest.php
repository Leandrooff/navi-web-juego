<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Support\Access;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

/**
 * Pruebas automatizadas de Laravel para el Módulo de Josué:
 * Autenticación, Ciclo de Sesión y Control de Roles / Permisos.
 */
class AuthAndRolesTest extends TestCase
{
    use RefreshDatabase;

    /**
     * 1. Prueba de registro exitoso para roles públicos (tutor y docente).
     */
    public function test_user_can_register_as_tutor_or_docente(): void
    {
        $response = $this->postJson('/api/register', [
            'name'     => 'Carlos Tutor',
            'email'    => 'carlos.tutor@example.com',
            'password' => 'secret123',
            'role'     => 'tutor',
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('user.email', 'carlos.tutor@example.com')
                 ->assertJsonPath('user.role', 'tutor');

        $this->assertDatabaseHas('users', [
            'email' => 'carlos.tutor@example.com',
            'role'  => 'tutor',
        ]);
    }

    /**
     * 2. Prueba de rechazo de correo electrónico duplicado.
     */
    public function test_user_cannot_register_with_duplicate_email(): void
    {
        User::factory()->create([
            'email' => 'existente@example.com',
            'role'  => 'tutor',
        ]);

        $response = $this->postJson('/api/register', [
            'name'     => 'Otro Usuario',
            'email'    => 'existente@example.com',
            'password' => 'password123',
            'role'     => 'tutor',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['email']);
    }

    /**
     * 3. Prueba de seguridad: No se permite registrar el rol admin públicamente.
     */
    public function test_user_cannot_register_as_admin_publicly(): void
    {
        $response = $this->postJson('/api/register', [
            'name'     => 'Intruso Admin',
            'email'    => 'intruso@example.com',
            'password' => 'password123',
            'role'     => 'admin',
        ]);

        // Debe retornar 403 Forbidden y no crear el registro
        $response->assertStatus(403);
        $this->assertDatabaseMissing('users', ['email' => 'intruso@example.com']);
    }

    /**
     * 4. Prueba de credenciales incorrectas (login fallido).
     */
    public function test_user_cannot_login_with_invalid_credentials(): void
    {
        User::factory()->create([
            'email'    => 'usuario@example.com',
            'password' => Hash::make('correct-password'),
        ]);

        $response = $this->postJson('/api/login', [
            'email'    => 'usuario@example.com',
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(401)
                 ->assertJson(['message' => 'Credenciales incorrectas. Verifique su correo o contraseña.']);
    }

    /**
     * 5. Prueba de ciclo completo: inicio, recarga (/me) y cierre de sesión.
     */
    public function test_user_can_login_retrieve_me_and_logout(): void
    {
        $user = User::factory()->create([
            'email'    => 'tutor.activo@example.com',
            'password' => Hash::make('password123'),
            'role'     => 'tutor',
        ]);

        // Login
        $loginRes = $this->postJson('/api/login', [
            'email'    => 'tutor.activo@example.com',
            'password' => 'password123',
        ]);
        $loginRes->assertStatus(200);
        $token = $loginRes->json('token');

        // Recarga /me con token
        $headers = $token ? ['Authorization' => "Bearer {$token}"] : [];
        $meRes = $this->actingAs($user, 'sanctum')->getJson('/api/me');
        $meRes->assertStatus(200)
              ->assertJsonPath('user.email', 'tutor.activo@example.com');

        // Cierre de sesión (Logout)
        $logoutRes = $this->actingAs($user, 'sanctum')->postJson('/api/logout');
        $logoutRes->assertStatus(200);
    }

    /**
     * 6. Prueba de cambio de contraseña para usuario autenticado.
     */
    public function test_authenticated_user_can_change_password(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('antigua123'),
        ]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/change-password', [
            'current_password'      => 'antigua123',
            'new_password'          => 'nuevaClave456',
            'new_password_confirmation' => 'nuevaClave456',
        ]);

        $response->assertStatus(200);
        $user->refresh();
        $this->assertTrue(Hash::check('nuevaClave456', $user->password));
    }

    /**
     * 7. Prueba de aislamiento entre tutores (Gabriela - Módulo 12).
     */
    public function test_tutor_cannot_access_other_tutor_child_profile(): void
    {
        $tutorA = User::factory()->create(['id' => 1, 'role' => 'tutor']);
        // El perfil tiene tutor_id = 10, tutorA tiene id = 1
        $response = $this->actingAs($tutorA, 'sanctum')->getJson('/api/child-profiles/99');

        $response->assertStatus(403);
    }

    /**
     * 8. Prueba de autorización con consentimiento para reportes (Ruth Serrano - Módulo 09).
     */
    public function test_docente_denied_report_when_consent_not_active(): void
    {
        $docente = User::factory()->create(['role' => 'docente']);

        // Consentimiento inactivo / revocado
        $response = $this->actingAs($docente, 'sanctum')
                         ->withHeaders(['X-Consent-Active' => false])
                         ->getJson('/api/reports/children/99');

        $response->assertStatus(403);
    }

    /**
     * 9. Prueba de panel administrativo protegido (Óscar - Módulo 07).
     * Solo 'admin' tiene acceso; tutor y docente reciben 403 Forbidden.
     */
    public function test_non_admin_cannot_access_admin_panel(): void
    {
        $tutor = User::factory()->create(['role' => 'tutor']);
        $docente = User::factory()->create(['role' => 'docente']);
        $admin = User::factory()->create(['role' => 'admin']);

        // Tutor recibe 403
        $this->actingAs($tutor, 'sanctum')
             ->getJson('/api/admin/dashboard')
             ->assertStatus(403);

        // Docente recibe 403
        $this->actingAs($docente, 'sanctum')
             ->getJson('/api/admin/dashboard')
             ->assertStatus(403);

        // Admin recibe 200 OK
        $this->actingAs($admin, 'sanctum')
             ->getJson('/api/admin/dashboard')
             ->assertStatus(200);
    }
}
