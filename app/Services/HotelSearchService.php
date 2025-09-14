<?php

namespace App\Services;

use App\Repositories\Contracts\HotelRepositoryInterface;
use App\DTOs\HotelSearchCriteria;
use App\DTOs\HotelSearchResult;
use Illuminate\Support\Facades\Log;
use App\Events\HotelSearchPerformed;

class HotelSearchService
{
    protected $searchStrategy;

    public function __construct(
        protected HotelRepositoryInterface $hotelRepository
    ) {
        $this->hotelRepository = $hotelRepository;
        $this->searchStrategy = config('scout.driver', 'database');
    }

    /**
     * Execute hotel search with fallback mechanism
     */
    public function search(HotelSearchCriteria $criteria): HotelSearchResult
    {
        try {
            // Try Elasticsearch first if configured
            if ($this->shouldUseElasticsearch($criteria)) {
                $hotels = $this->performElasticsearchSearch($criteria);
                $searchMethod = 'elasticsearch';
            } else {
                $hotels = $this->performDatabaseSearch($criteria);
                $searchMethod = 'database';
            }

            // Fire event for analytics
            event(new HotelSearchPerformed($criteria, $hotels->total()));

            return new HotelSearchResult(
                hotels: $hotels,
                criteria: $criteria,
                searchMethod: $searchMethod,
                success: true
            );
        } catch (\Exception $e) {
            Log::error('Hotel search failed', [
                'error' => $e->getMessage(),
                'criteria' => $criteria->toArray(),
                'trace' => $e->getTraceAsString()
            ]);

            // Fallback to database search
            return $this->fallbackSearch($criteria);
        }
    }

    /**
     * Determine if Elasticsearch should be used
     */
    protected function shouldUseElasticsearch(HotelSearchCriteria $criteria): bool
    {
        return $this->searchStrategy === 'Matchish\ScoutElasticSearch\Engines\ElasticSearchEngine'
            && ($criteria->query);
    }

    /**
     * Perform Elasticsearch search
     */
    protected function performElasticsearchSearch(HotelSearchCriteria $criteria)
    {
        return $this->hotelRepository->searchWithElasticsearch($criteria);
    }

    /**
     * Perform database search
     */
    protected function performDatabaseSearch(HotelSearchCriteria $criteria)
    {
        return $this->hotelRepository->searchWithDatabase($criteria);
    }

    /**
     * Fallback search mechanism
     */
    protected function fallbackSearch(HotelSearchCriteria $criteria): HotelSearchResult
    {
        try {
            $hotels = $this->hotelRepository->searchWithDatabase($criteria);

            return new HotelSearchResult(
                hotels: $hotels,
                criteria: $criteria,
                searchMethod: 'database_fallback',
                success: true,
                isFallback: true
            );
        } catch (\Exception $e) {
            Log::critical('Both search methods failed', [
                'error' => $e->getMessage(),
                'criteria' => $criteria->toArray()
            ]);

            // Return empty result
            return new HotelSearchResult(
                hotels: new \Illuminate\Pagination\LengthAwarePaginator([], 0, $criteria->perPage),
                criteria: $criteria,
                searchMethod: 'none',
                success: false,
                error: 'Search service is currently unavailable'
            );
        }
    }
}
