<?php

namespace App\Enums;

enum BookingStatus: string
{
    case PENDING = 'pending';
    case RESERVED = 'reserved';
    case CONFIRMED = 'confirmed';
    case CANCELLED = 'cancelled';
    case COMPLETED = 'completed';
}
