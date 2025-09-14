<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Hotel extends Model implements HasMedia
{
    /** @use HasFactory<\Database\Factories\HotelFactory> */
    use HasFactory;
    use Searchable;
    use InteractsWithMedia;

    protected $fillable = [
        'name',
        'address',
        'city',
        'country',
        'stars',
        'description',
        'user_id',
    ];

    public function toSearchableArray()
    {
        $array = [
            'name' => $this->name,
            'address' => $this->address,
            'city' => $this->city,
            'country' => $this->country,
            'stars' => $this->stars,
            'description' => $this->description,
        ];

        if ($this->relationLoaded('rooms')) {
            $array['price_min'] = $this->rooms->min('price');
            $array['price_max'] = $this->rooms->max('price');
            $array['available_rooms'] = $this->rooms->where('is_available', true)->count();
        }

        return $array;
    }

    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function rooms(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Room::class);
    }

    public function bookings(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function scopeWithAvailableRooms($query)
    {
        return $query->whereHas(
            'rooms',
            fn($q) => $q->where('is_available', true)
        );
    }

    public function scopeInPriceRange($query, $min = null, $max = null)
    {
        return $query->whereHas('rooms', function ($q) use ($min, $max) {
            if ($min) $q->where('price', '>=', $min);
            if ($max) $q->where('price', '<=', $max);
        });
    }

    public function scopeMinimumStars($query, $stars)
    {
        return $query->where('stars', '>=', $stars);
    }
}
