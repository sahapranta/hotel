<?php

namespace App\Repositories;

use App\Models\Hotel;
use App\Repositories\Contracts\HotelRepositoryInterface;
use App\DTOs\HotelSearchCriteria;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class HotelRepository implements HotelRepositoryInterface
{
    public function __construct(
        protected Hotel $model
    ) {}

    /**
     * Elasticsearch search with multiple conditions
     */
    public function searchWithElasticsearch(HotelSearchCriteria $criteria): LengthAwarePaginator
    {
        $searchQuery = $this->buildElasticsearchQuery($criteria);
        
        return $this->model::search($this->buildSearchQuery($criteria))
            ->options($searchQuery['options'])
            ->query(function ($builder) use ($criteria) {
                // Add eager loading for rooms count
                $builder->withCount(['rooms' => function ($query) {
                    $query->where('is_available', true);
                }]);

                // Apply additional database filters if needed
                if ($criteria->minPrice || $criteria->maxPrice) {
                    $builder->whereHas('rooms', function ($query) use ($criteria) {
                        if ($criteria->minPrice) {
                            $query->where('price', '>=', $criteria->minPrice);
                        }
                        if ($criteria->maxPrice) {
                            $query->where('price', '<=', $criteria->maxPrice);
                        }
                    });
                }
            })
            ->paginate($criteria->perPage);
    }

    private function buildSearchQuery(HotelSearchCriteria $criteria): string
    {
        $searchTerms = [];

        if (!empty($criteria->query)) {
            $searchTerms[] = $criteria->query;
        }

        if (!empty($criteria->city)) {
            $searchTerms[] = "city:{$criteria->city}";
        }

        if (!empty($criteria->country)) {
            $searchTerms[] = "country:{$criteria->country}";
        }

        if (!empty($criteria->stars)) {
            $searchTerms[] = "stars:{$criteria->stars}";
        }

        return empty($searchTerms) ? '*' : implode(' ', $searchTerms);
    }


    protected function buildElasticsearchQuery(HotelSearchCriteria $criteria): array
    {
        $must = [];
        $should = [];
        $filter = [];
      
        if ($criteria->query) {
            $should[] = [
                'multi_match' => [
                    'query' => $criteria->query,
                    'fields' => [
                        'name^3',        // Boost name matches
                        'description^2', // Medium boost for description
                        'city^2',        // Medium boost for city
                        'address',       // Normal weight for address
                    ],
                    'type' => 'best_fields',
                    'fuzziness' => 'AUTO',
                ]
            ];
        }

        // Location filters with fuzzy matching
        if ($criteria->city) {
            $must[] = [
                'match' => [
                    'city' => [
                        'query' => $criteria->city,
                        'fuzziness' => 'AUTO',
                    ]
                ]
            ];
        }

        if ($criteria->country) {
            $must[] = [
                'match' => [
                    'country' => [
                        'query' => $criteria->country,
                        'fuzziness' => 'AUTO',
                    ]
                ]
            ];
        }

        // Stars filter - greater than or equal
        if ($criteria->stars) {
            $filter[] = [
                'range' => [
                    'stars' => [
                        'gte' => $criteria->stars
                    ]
                ]
            ];
        }

        // Combine query parts
        $query = [];
        if (!empty($must) || !empty($should) || !empty($filter)) {
            $query = [
                'bool' => array_filter([
                    'must' => $must ?: null,
                    'should' => $should ?: null,
                    'filter' => $filter ?: null,
                    'minimum_should_match' => !empty($should) ? 1 : null,
                ])
            ];
        }

        return [
            'query' => empty($query) ? '*' : ['query' => $query],
            'options' => [
                'body' => [
                    'query' => $query ?: ['match_all' => (object)[]]
                ]
            ]
        ];
    }

    /**
     * Fallback database search with optimized queries
     */
    public function searchWithDatabase(HotelSearchCriteria $criteria): LengthAwarePaginator
    {
        $query = $this->model::query()
            ->withCount(['rooms' => function ($query) {
                $query->where('is_available', true);
            }]);

        // Apply search filters
        $this->applyDatabaseFilters($query, $criteria);

        $query = $this->applySorting($query, $criteria);

        return $query->paginate($criteria->perPage);
    }

    /**
     * Apply database filters
     */
    protected function applyDatabaseFilters($query, HotelSearchCriteria $criteria): void
    {
        if ($criteria->query) {
            $query->where(function ($q) use ($criteria) {
                $q->where('name', 'LIKE', "%{$criteria->query}%")
                    ->orWhere('description', 'LIKE', "%{$criteria->query}%")
                    ->orWhere('address', 'LIKE', "%{$criteria->query}%");
            });
        }

        if ($criteria->city) {
            $query->where('city', 'LIKE', "%{$criteria->city}%");
        }

        if ($criteria->country) {
            $query->where('country', 'LIKE', "%{$criteria->country}%");
        }

        // Stars - greater than or equal
        if ($criteria->stars) {
            $query->where('stars', '>=', $criteria->stars);
        }

        // Price range filter through rooms
        if ($criteria->minPrice || $criteria->maxPrice) {
            $query->whereHas('rooms', function ($q) use ($criteria) {
                if ($criteria->minPrice) {
                    $q->where('price', '>=', $criteria->minPrice);
                }
                if ($criteria->maxPrice) {
                    $q->where('price', '<=', $criteria->maxPrice);
                }
            });
        }
    }

    /**
     * Apply sorting logic
     */
    protected function applySorting($query, HotelSearchCriteria $criteria)
    {
        switch ($criteria->sortBy) {
            case 'price_asc':
                return $query->select('hotels.*')
                    ->leftJoin('rooms', 'hotels.id', '=', 'rooms.hotel_id')
                    ->groupBy('hotels.id')
                    ->orderBy(DB::raw('MIN(rooms.price)'), 'asc');

            case 'price_desc':
                return $query->select('hotels.*')
                    ->leftJoin('rooms', 'hotels.id', '=', 'rooms.hotel_id')
                    ->groupBy('hotels.id')
                    ->orderBy(DB::raw('MIN(rooms.price)'), 'desc');

            case 'stars':
                return $query->orderBy('stars', 'desc');

            case 'name':
                return $query->orderBy('name', 'asc');

            default:
                return $query->latest();
        }
    }

    /**
     * Find hotel with available rooms
     */
    public function findWithAvailableRooms(int $id)
    {
        return $this->model::with(['rooms' => function ($query) {
            $query->where('is_available', true);
        }])
            ->withCount(['rooms' => function ($query) {
                $query->where('is_available', true);
            }])
            ->findOrFail($id);
    }

    /**
     * Get available rooms count for a hotel
     */
    public function getAvailableRoomsCount(int $hotelId): int
    {
        return Cache::remember(
            "hotel_{$hotelId}_available_rooms",
            now()->addMinutes(5),
            function () use ($hotelId) {
                return $this->model::find($hotelId)
                    ->rooms()
                    ->where('is_available', true)
                    ->count();
            }
        );
    }
}
