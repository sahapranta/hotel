<?php

namespace App\DTOs;

use Illuminate\Pagination\LengthAwarePaginator;

class HotelSearchResult
{
    public function __construct(
        public readonly LengthAwarePaginator $hotels,
        public readonly HotelSearchCriteria $criteria,
        public readonly string $searchMethod,
        public readonly bool $success,
        public readonly bool $isFallback = false,
        public readonly ?string $error = null
    ) {}

    /**
     * Get pagination data
     */
    public function getPaginationData(): array
    {
        return [
            'current_page' => $this->hotels->currentPage(),
            'last_page' => $this->hotels->lastPage(),
            'total' => $this->hotels->total(),
            'per_page' => $this->hotels->perPage(),
            'from' => $this->hotels->firstItem(),
            'to' => $this->hotels->lastItem(),
        ];
    }

    /**
     * Get metadata about the search
     */
    public function getMetadata(): array
    {
        return [
            'search_method' => $this->searchMethod,
            'is_fallback' => $this->isFallback,
            'success' => $this->success,
            'error' => $this->error,
            'has_results' => $this->hotels->total() > 0,
        ];
    }
}
