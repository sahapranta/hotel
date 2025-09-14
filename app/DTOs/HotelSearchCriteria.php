<?php

namespace App\DTOs;

use Illuminate\Http\Request;

class HotelSearchCriteria
{
    public function __construct(
        public readonly ?string $query = null,
        public readonly ?string $city = null,
        public readonly ?string $country = null,
        public readonly ?int $stars = null,
        public readonly ?float $minPrice = null,
        public readonly ?float $maxPrice = null,
        public readonly string $sortBy = 'relevance',
        public readonly int $perPage = 15,        
    ) {}

    /**
     * Create from request
     */
    public static function fromRequest(Request $request): self
    {
        $validated = $request->validate([
            'query' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'stars' => 'nullable|integer|min:1|max:5',
            'min_price' => 'nullable|numeric|min:0',
            'max_price' => 'nullable|numeric|min:0',
            'sort_by' => 'nullable|string|in:relevance,price_asc,price_desc,stars,name',
            'per_page' => 'nullable|integer|min:1|max:50',            
        ]);

        return new self(
            query: $validated['query'] ?? null,
            city: $validated['city'] ?? null,
            country: $validated['country'] ?? null,
            stars: $validated['stars'] ?? null,
            minPrice: $validated['min_price'] ?? null,
            maxPrice: $validated['max_price'] ?? null,
            sortBy: $validated['sort_by'] ?? 'relevance',
            perPage: $validated['per_page'] ?? 15,            
        );
    }

    /**
     * Check if any search criteria is provided
     */
    public function hasSearchCriteria(): bool
    {
        return $this->query || $this->city || $this->country ||
            $this->stars || $this->minPrice || $this->maxPrice;
    }

    /**
     * Convert to array
     */
    public function toArray(): array
    {
        return [
            'query' => $this->query,
            'city' => $this->city,
            'country' => $this->country,
            'stars' => $this->stars,
            'min_price' => $this->minPrice,
            'max_price' => $this->maxPrice,
            'sort_by' => $this->sortBy,
            'per_page' => $this->perPage,
        ];
    }
}
