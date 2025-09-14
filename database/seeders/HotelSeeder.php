<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class HotelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Hotel::factory()
            ->count(100)
            ->has(\App\Models\Room::factory()->count(rand(5, 10)))
            ->create();
    }
}
