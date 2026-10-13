<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller {
    public function register(Request $request) {
        $v=$request->validate(['name'=>'required|string|max:120','email'=>'required|email|max:160|unique:users,email',
            'password'=>['required','confirmed',Password::min(10)->letters()->numbers()], 'role'=>'required|in:tutor,docente']);
        $user = User::create(['name'=>$v['name'],'email'=>strtolower($v['email']),'password'=>$v['password'],
            'role_id'=>DB::table('roles')->where('name',$v['role'])->value('id'),'status'=>'active']);
        Auth::login($user); $request->session()->regenerate();
        return response()->json(['data'=>$user->publicProfile()],201);
    }
    public function login(Request $request) {
        $v=$request->validate(['email'=>'required|email','password'=>'required|string']);
        if (!Auth::attempt(['email'=>strtolower($v['email']),'password'=>$v['password'],'status'=>'active'])) {
            throw ValidationException::withMessages(['email'=>'El correo o la contraseña no coinciden.']);
        }
        $request->session()->regenerate();
        return ['data'=>$request->user()->publicProfile()];
    }
    public function me(Request $r) { return ['data'=>$r->user()->publicProfile()]; }
    public function logout(Request $r) {
        Auth::guard('web')->logout(); $r->session()->invalidate(); $r->session()->regenerateToken();
        return response()->noContent();
    }
    public function password(Request $r) {
        $v=$r->validate(['current_password'=>'required|current_password:web','password'=>['required','confirmed',Password::min(10)->letters()->numbers()]]);
        $r->user()->update(['password'=>$v['password']]);
        $r->session()->regenerate();
        // Las demás sesiones dejan de estar autorizadas después de un cambio de contraseña.
        DB::table('sessions')->where('user_id',$r->user()->id)->where('id','!=',$r->session()->getId())->delete();
        return ['data'=>['message'=>'Contraseña actualizada.']];
    }
}
