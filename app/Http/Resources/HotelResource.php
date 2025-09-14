<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HotelResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'address' => $this->address,
            'city' => $this->city,
            'country' => $this->country,
            'stars' => $this->stars,
            'description' => $this->description,
            'location' => $this->city . ', ' . $this->country,
            'available_rooms_count' => $this->when(
                isset($this->rooms_count),
                $this->rooms_count
            ),
            'price_range' => $this->when(
                $this->relationLoaded('rooms') && $this->rooms->isNotEmpty(),
                fn() => [
                    'min' => $this->rooms->min('price'),
                    'max' => $this->rooms->max('price'),
                    'currency' => 'USD',
                ]
            ),
        ];
    }
}
