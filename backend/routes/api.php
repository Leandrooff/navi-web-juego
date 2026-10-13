<?php
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\{AuthController,ChildProfileController,StoryController,GameSessionController,ProgressController,ClassroomController};

Route::get('/csrf',fn()=>response()->json(['token'=>csrf_token()]));
Route::post('/auth/register',[AuthController::class,'register'])->middleware('throttle:navi-register');
Route::post('/auth/login',[AuthController::class,'login'])->middleware('throttle:navi-login');
Route::get('/stories',[StoryController::class,'index']);
Route::get('/stories/{id}',[StoryController::class,'show']);
Route::middleware(['auth:web','throttle:navi-api'])->group(function(){
    Route::get('/auth/me',[AuthController::class,'me']);
    Route::post('/auth/logout',[AuthController::class,'logout']);
    Route::put('/auth/password',[AuthController::class,'password'])->middleware('throttle:navi-password');
    Route::get('/child-profiles',[ChildProfileController::class,'index']);
    Route::post('/child-profiles',[ChildProfileController::class,'store']);
    Route::put('/child-profiles/{id}',[ChildProfileController::class,'update']);
    Route::get('/child-profiles/{id}/progress',[ProgressController::class,'index']);
    Route::get('/child-profiles/{id}/history',[ProgressController::class,'history']);
    Route::get('/child-profiles/{id}/assignments',[ChildProfileController::class,'assignments']);
    Route::post('/game-sessions',[GameSessionController::class,'store']);
    Route::get('/game-sessions/{id}',[GameSessionController::class,'show']);
    Route::post('/game-sessions/{id}/decisions',[GameSessionController::class,'decision']);
    Route::post('/game-sessions/{id}/continue',[GameSessionController::class,'advance']);
    Route::post('/game-sessions/{id}/hint',[GameSessionController::class,'hint']);
    Route::get('/child-profiles/{id}/memories',[ProgressController::class,'memories']);
    Route::post('/game-sessions/{id}/finish',[GameSessionController::class,'finish']);
    Route::get('/classrooms',[ClassroomController::class,'index']);
    Route::post('/classrooms',[ClassroomController::class,'store']);
    Route::get('/classrooms/{id}',[ClassroomController::class,'show']);
    Route::post('/classrooms/{id}/rotate-code',[ClassroomController::class,'rotate']);
    Route::post('/classrooms/{id}/assignments',[ClassroomController::class,'assign']);
    Route::delete('/classrooms/{id}/assignments/{assignment}',[ClassroomController::class,'unassign']);
    Route::post('/enrollments/lookup',[ClassroomController::class,'lookup'])->middleware('throttle:10,1');
    Route::post('/enrollments',[ClassroomController::class,'enroll']);
    Route::get('/child-profiles/{id}/enrollments',[ClassroomController::class,'links']);
    Route::delete('/enrollments/{id}',[ClassroomController::class,'revoke']);
});
