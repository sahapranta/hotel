<?php

namespace App\Http\Controllers;

use App\Enums\BookingStatus;
use App\Models\Booking;
use App\Models\Hotel;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BookingController extends Controller
{
    public function index()
    {
        $bookings = Booking::with(['user', 'hotel', 'rooms'])->latest()->paginate(10);

        return Inertia::render('Bookings/Index', [
            'bookings' => $bookings,
        ]);
    }

    public function create()
    {
        return Inertia::render('Bookings/Create', [
            'hotels' => Hotel::with('rooms')->inRandomOrder()->limit(10)->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'hotel_id'   => 'required|exists:hotels,id',
            'room_ids'   => 'required|array',
            'room_ids.*' => 'exists:rooms,id',
            'check_in'   => 'required|date|after_or_equal:today',
            'check_out'  => 'required|date|after:check_in',
            'guests'     => 'required|integer|min:1',
        ]);

        $booking = Booking::create([
            'user_id'     => $request->user()->id,
            'hotel_id'    => $validated['hotel_id'],
            'check_in'    => $validated['check_in'],
            'check_out'   => $validated['check_out'],
            'guests'      => $validated['guests'],
            'status'      => 'pending',
            'total_price' => 0,
        ]);

        $total = 0;
        foreach ($validated['room_ids'] as $roomId) {
            $room = Room::find($roomId);
            $nights = (new \DateTime($validated['check_in']))->diff(new \DateTime($validated['check_out']))->days;
            $price = $room->price * $nights;
            $booking->rooms()->attach($room->id, [
                'price'  => $price,
                'guests' => $validated['guests'],
            ]);
            $total += $price;
        }

        $booking->update(['total_price' => $total]);

        return redirect()->route('admin.bookings.index')->with('success', 'Booking created successfully.');
    }

    public function show(Booking $booking)
    {
        $booking->load(['user', 'hotel', 'rooms']);

        return Inertia::render('Bookings/Show', [
            'booking' => $booking,
        ]);
    }

    public function edit(Booking $booking)
    {
        $booking->load('rooms');

        return Inertia::render('Bookings/Edit', [
            'booking' => $booking,
            'hotels'  => Hotel::with('rooms')->inRandomOrder()->limit(10)->get(),
        ]);
    }

    public function update(Request $request, Booking $booking)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled,completed',
        ]);

        $booking->update($validated);

        return redirect()->route('admin.bookings.index')->with('success', 'Booking updated successfully.');
    }

    public function destroy(Booking $booking)
    {
        abort_if(!Auth::user() || !Auth::user()->is_admin, 403, 'Unauthorized');

        if ($booking->status != BookingStatus::PENDING) {
            return back()->withErrors('error', 'Cannot delete a confirmed booking.');
        }

        if ($booking->rooms()->exists()) {
            $booking->rooms()->detach();
        }

        $booking->delete();

        return redirect()->route('admin.bookings.index')->with('success', 'Booking deleted successfully.');
    }
}
