<?php
namespace App\Support;
use App\Models\ChildProfile;
use App\Models\User;
use Illuminate\Support\Facades\DB;

final class Access {
    public static function role(User $user, string $role): void {
        abort_unless($user->roleName() === $role && $user->status === 'active', 403, 'Este espacio pertenece a otro tipo de cuenta.');
    }
    public static function child(User $user, int $id, bool $write = false): ChildProfile {
        $child = ChildProfile::findOrFail($id);
        $owner = $user->roleName() === 'tutor' && (int)$child->tutor_id === (int)$user->id;
        $teacher = !$write && $user->roleName() === 'docente' && DB::table('class_enrollments as e')
            ->join('class_groups as g', 'g.id', '=', 'e.class_group_id')
            ->where('e.child_profile_id', $id)->where('g.teacher_id', $user->id)->whereNull('e.revoked_at')->exists();
        abort_unless($user->status === 'active' && ($owner || $teacher), 404, 'Perfil no disponible.');
        return $child;
    }
    public static function group(User $user, int $id): object {
        self::role($user, 'docente');
        return DB::table('class_groups')->where('id',$id)->where('teacher_id',$user->id)->firstOrFail();
    }
}
