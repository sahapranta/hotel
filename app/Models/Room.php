<?php

namespace App\Models;

use App\Enums\RoomType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Room extends Model
{
    /** @use HasFactory<\Database\Factories\RoomFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'type',
        'is_available',
        'amenities',
        'capacity',
        'hotel_id',
        'user_id',
    ];

    protected $casts = [
        'amenities' => 'array',
        'is_available' => 'boolean',
        'price' => 'decimal:2',
        'type' => RoomType::class,
    ];

    public function hotel(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Hotel::class);
    }

    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function bookings()
    {
        return $this->belongsToMany(Booking::class, 'booking_room')
            ->withPivot(['price', 'guests'])
            ->withTimestamps();
    }
}
