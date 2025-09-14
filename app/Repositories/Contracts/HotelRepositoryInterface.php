<?php

namespace App\Repositories\Contracts;

use Illuminate\Pagination\LengthAwarePaginator;
use App\DTOs\HotelSearchCriteria;

interface HotelRepositoryInterface
{
    public function searchWithElasticsearch(HotelSearchCriteria $criteria): LengthAwarePaginator;
    public function searchWithDatabase(HotelSearchCriteria $criteria): LengthAwarePaginator;
    public function findWithAvailableRooms(int $id);
    public function getAvailableRoomsCount(int $hotelId): int;
}
