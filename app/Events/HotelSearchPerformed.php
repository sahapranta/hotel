<?php

namespace App\Events;

use App\DTOs\HotelSearchCriteria;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;

class HotelSearchPerformed
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public HotelSearchCriteria $criteria,
        public int $resultsCount
    ) {}
}
