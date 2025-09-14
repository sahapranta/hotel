<?php

namespace App\Http\Controllers;

use App\Services\HotelSearchService;
use App\DTOs\HotelSearchCriteria;
use App\Http\Requests\Hotel\CreateRequest;
use App\Http\Resources\HotelResource;
use App\Http\Requests\Hotel\SearchRequest;
use App\Models\Hotel;
use Illuminate\Support\Facades\Auth;

class HotelController extends Controller
{
    public function __construct(
        protected HotelSearchService $hotelSearchService
    ) {}

    public function search(SearchRequest $request)
    {
        $criteria = HotelSearchCriteria::fromRequest($request);

        $searchResult = $this->hotelSearchService->search($criteria);

        return inertia('hotel/search', [
            'hotels' => HotelResource::collection($searchResult->hotels),
            'filters' => $searchResult->criteria->toArray(),
            'pagination' => $searchResult->getPaginationData(),
            'metadata' => $searchResult->getMetadata(),
        ]);
    }

    public function index()
    {
        $hotels = Hotel::latest()
            ->with('rooms')
            ->withCount(['rooms' => fn($q) => $q->where('is_available', true)])
            ->paginate(10);

        return inertia('hotel/index', [
            'hotels' => HotelResource::collection($hotels),
            'pagination' => [
                'current_page' => $hotels->currentPage(),
                'last_page' => $hotels->lastPage(),
                'total' => $hotels->total(),
                'per_page' => $hotels->perPage(),
                'from' => $hotels->firstItem(),
                'to' => $hotels->lastItem(),
            ],
        ]);
    }

    public function store(CreateRequest $request)
    {
        abort_if(!Auth::user() || !Auth::user()->is_admin, 403, 'Unauthorized');

        Hotel::create($request->validated() + ['user_id' => Auth::id()]);

        return back()->with('success', 'Hotel created successfully');
    }

    public function update(CreateRequest $request, Hotel $hotel)
    {
        abort_if(!Auth::user() || !Auth::user()->is_admin, 403, 'Unauthorized');

        $hotel->update($request->validated());

        return back()->with('success', 'Hotel updated successfully');
    }

    public function destroy(Hotel $hotel)
    {
        abort_if(!Auth::user() || !Auth::user()->is_admin, 403, 'Unauthorized');

        // Prevent if hotel has rooms
        if ($hotel->rooms()->exists()) {
            return back()->withErrors(['error' => 'Cannot delete hotel with associated rooms']);
        }

        $hotel->delete();

        return back()->with('success', 'Hotel deleted successfully');
    }
}
