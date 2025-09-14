<?php

use App\Http\Middleware\AdminUser;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::name('admin.')
    ->prefix('admin')
    ->middleware(['auth', 'verified', AdminUser::class])
    ->group(function () {
        Route::get('dashboard', function () {
            return Inertia::render('dashboard');
        })->name('dashboard');

        Route::get('hotels', [\App\Http\Controllers\HotelController::class, 'index'])->name('hotels.index');
        Route::post('hotels', [\App\Http\Controllers\HotelController::class, 'store'])->name('hotels.store');
        Route::put('hotels/{hotel}', [\App\Http\Controllers\HotelController::class, 'update'])->name('hotels.edit');
        Route::delete('hotels/{hotel}', [\App\Http\Controllers\HotelController::class, 'destroy'])->name('hotels.delete');

        Route::resource('bookings', \App\Http\Controllers\BookingController::class);
    });

Route::get('/search', [\App\Http\Controllers\HotelController::class, 'search'])->name('search');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
