<?php

namespace App\Http\Controllers;

use App\Models\Hotel;
use Illuminate\Http\Request;
use App\Http\Resources\HotelResource;
use Illuminate\Support\Facades\Log;

class HotelController extends Controller
{
    /**
     * Search hotels using Elasticsearch via Laravel Scout
     * Filters by hotel name, location (city, country), and description
     */
    public function search(Request $request)
    {
        $validated = $request->validate([
            'query' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'stars' => 'nullable|integer|min:1|max:5',
            'per_page' => 'nullable|integer|min:1|max:50'
        ]);

        $query = $validated['query'] ?? '';
        $city = $validated['city'] ?? '';
        $country = $validated['country'] ?? '';
        $stars = $validated['stars'] ?? null;
        $perPage = $validated['per_page'] ?? 15;

        try {
            // If no search parameters provided, return all hotels
            if ($this->hasNoSearchCriteria($query, $city, $country, $stars)) {
                $hotels = Hotel::paginate($perPage);
            } else {
                // Perform search using Laravel Scout with Elasticsearch
                $hotels = $this->performElasticsearchSearch($query, $city, $country, $stars, $perPage);
            }

            return inertia('hotel/search', [
                'hotels' => HotelResource::collection($hotels),
                'filters' => compact('query', 'city', 'country', 'stars'),
                'pagination' => [
                    'current_page' => $hotels->currentPage(),
                    'last_page' => $hotels->lastPage(),
                    'total' => $hotels->total(),
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Hotel search failed', [
                'error' => $e->getMessage(),
                'filters' => compact('query', 'city', 'country', 'stars')
            ]);

            // Fallback to database search if Elasticsearch fails
            return $this->fallbackSearch($validated);
        }
    }

    /**
     * Check if any search criteria is provided
     */
    private function hasNoSearchCriteria(?string $query, ?string $city, ?string $country, ?int $stars): bool
    {
        return empty($query) && empty($city) && empty($country) && empty($stars);
    }

    /**
     * Perform Elasticsearch search using Laravel Scout
     *
     * @param string|null $query Search query for hotel name/description
     * @param string|null $city City filter
     * @param string|null $country Country filter
     * @param int|null $stars Star rating filter
     * @param int $perPage Results per page
     * @return \Illuminate\Pagination\LengthAwarePaginator
     * @throws \InvalidArgumentException
     */
    private function performElasticsearchSearch(
        ?string $query,
        ?string $city,
        ?string $country,
        ?int $stars,
        int $perPage = 15
    ) {
        try {
            return Hotel::search($query)
                ->where('city', "%{$city}%")
                ->paginate($perPage);
        } catch (\Exception $e) {
            Log::error('Elasticsearch query failed: ' . $e->getMessage());
            return new \Illuminate\Pagination\LengthAwarePaginator([], 0, $perPage);
        }
    }

    /**
     * Fallback search using database queries if Elasticsearch fails
     */
    private function fallbackSearch(array $validated)
    {
        $query = $validated['query'] ?? '';
        $city = $validated['city'] ?? '';
        $country = $validated['country'] ?? '';
        $stars = $validated['stars'] ?? null;
        $perPage = $validated['per_page'] ?? 15;

        $hotels = Hotel::query()
            ->when($query, fn($q) => $q->where('name', 'LIKE', "%{$query}%")
                ->orWhere('description', 'LIKE', "%{$query}%"))
            ->when($city, fn($q, $v) => $q->where('city', 'LIKE', "%{$v}%"))
            ->when($country, fn($q) => $q->where('country', 'LIKE', "%{$country}%"))
            ->when($stars, fn($q) => $q->where('stars', $stars))
            ->paginate($perPage);

        return inertia('hotel/search', [
            'hotels' => HotelResource::collection($hotels),
            'filters' => compact('query', 'city', 'country', 'stars'),
            'pagination' => [
                'current_page' => $hotels->currentPage(),
                'last_page' => $hotels->lastPage(),
                'total' => $hotels->total(),
            ],
            'fallback' => true // Indicate fallback was used
        ]);
    }
}
