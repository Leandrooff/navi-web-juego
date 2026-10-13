<?php
namespace App\Providers;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
class AppServiceProvider extends ServiceProvider {
    public function register(): void {}
    public function boot(): void {
        RateLimiter::for('navi-login',fn(Request $r)=>Limit::perMinute(10)->by($r->ip().'|'.strtolower((string)$r->input('email'))));
        RateLimiter::for('navi-register',fn(Request $r)=>Limit::perMinute(6)->by($r->ip()));
        RateLimiter::for('navi-api',fn(Request $r)=>Limit::perMinute(180)->by($r->user()?->id??$r->ip()));
        RateLimiter::for('navi-password',fn(Request $r)=>Limit::perMinute(5)->by($r->user()?->id??$r->ip()));
        RateLimiter::for('navi-enrollment',fn(Request $r)=>Limit::perMinute(10)->by($r->user()?->id??$r->ip()));
    }
}
