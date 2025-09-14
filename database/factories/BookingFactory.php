<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Hotel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Booking>
 */
class BookingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $checkIn = $this->faker->dateTimeBetween('now', '+1 month');
        $checkOut = (clone $checkIn)->modify('+' . rand(1, 7) . ' days');
        return [
            'user_id' => User::inRandomOrder()->first()->id ?? User::factory(),
            'hotel_id' => Hotel::inRandomOrder()->first()->id ?? Hotel::factory(),
            'check_in' => $checkIn,
            'check_out' => $checkOut,
            'guests' => $this->faker->numberBetween(1, 4),
            'status' => $this->faker->randomElement(['pending', 'confirmed', 'cancelled', 'completed']),
            'total_price' => $this->faker->randomFloat(2, 100, 2000),
        ];
    }
}
