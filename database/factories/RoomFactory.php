<?php

namespace Database\Factories;

use App\Enums\RoomType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Hotel>
 */
class RoomFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->word(),
            'description' => $this->faker->paragraph(),
            'price' => $this->faker->randomFloat(2, 50, 500),
            'type' => $this->faker->randomElement(RoomType::cases())->value,
            'is_available' => $this->faker->boolean(80), // 80% chance of being available
            'amenities' => $this->faker->randomElements(['WiFi', 'TV', 'Mini-bar', 'Air Conditioning', 'Room Service'], 3),
            'capacity' => $this->faker->numberBetween(1, 4),            
            'user_id' => 1,
        ];
    }
}
