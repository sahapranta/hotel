<?php

namespace App\Providers;

use App\Repositories\HotelRepository;
use Illuminate\Support\ServiceProvider;
use App\Repositories\Contracts\HotelRepositoryInterface;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            HotelRepositoryInterface::class,
            HotelRepository::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
