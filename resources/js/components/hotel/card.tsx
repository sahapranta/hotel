import React from "react";
import {
    Heart as HeartIcon,
    MapPin as MapPinIcon,
    Share as ShareIcon,
    BedDouble as BedDoubleIcon,
} from "lucide-react";
import { Hotel } from '@/types/hotel';
import Star from "@/components/star";
const DEFAULT_HOTEL_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Cg fill='%239ca3af' opacity='0.5'%3E%3Cpath d='M160 120h80v100h-80z'/%3E%3Cpath d='M140 160h120v60H140z'/%3E%3Cpath d='M180 100h40v20h-40z'/%3E%3Cpath d='M190 80h20v20h-20z'/%3E%3C/g%3E%3Ctext x='200' y='250' font-family='Arial' font-size='14' fill='%236b7280' text-anchor='middle'%3ENo Image Available%3C/text%3E%3C/svg%3E";

const HotelCard = ({
    hotel,
    viewMode,
    favorites,
    toggleFavorite,
}: {
    hotel: Hotel;
    viewMode: "list" | "grid";
    favorites: number[];
    toggleFavorite: (id: number) => void;
}) => {
    const isFavorite = favorites.includes(hotel.id);
    const imageUrl = hotel.images?.[0]?.url || DEFAULT_HOTEL_IMAGE;

    const FavoriteButton = (
        <button
            onClick={() => toggleFavorite(hotel.id)}
            className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition-colors"
        >
            <HeartIcon
                className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                    }`}
            />
        </button>
    );

    const PriceBlock = hotel.price_range && (
        <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
                ${hotel.price_range.min}
            </div>
            <div className="text-sm text-gray-500">per night</div>
        </div>
    );

    if (viewMode === "list") {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row">
                    <div className="md:w-72 h-48 md:h-56 relative">
                        <img
                            src={imageUrl}
                            alt={hotel.name}
                            className="w-full h-full object-cover"
                            onError={(e) =>
                                ((e.target as HTMLImageElement).src = DEFAULT_HOTEL_IMAGE)
                            }
                        />
                        {FavoriteButton}
                    </div>
                    <div className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                    {hotel.name}
                                </h3>
                                <div className="flex items-center gap-4">
                                    <Star rating={hotel.stars} />
                                    {hotel.rating && (
                                        <div className="flex items-center gap-1 text-sm">
                                            <span className="font-semibold text-gray-700">
                                                {hotel.rating.average}
                                            </span>
                                            <span className="text-gray-500">
                                                ({hotel.rating.count} reviews)
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {PriceBlock}
                        </div>

                        <div className="flex items-center text-gray-600 mb-3">
                            <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="text-sm">{hotel.location}</span>
                        </div>

                        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                            {hotel.description}
                        </p>

                        {hotel.available_rooms_count !== undefined && (
                            <div className="flex items-center gap-2 mb-4">
                                <BedDoubleIcon className="h-4 w-4 text-green-600" />
                                <span className="text-sm text-green-600 font-medium">
                                    {hotel.available_rooms_count} rooms available
                                </span>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                                View Details
                            </button>
                            <button className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                <ShareIcon className="h-5 w-5 text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-48 sm:h-56">
                <img
                    src={imageUrl}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                    onError={(e) =>
                        ((e.target as HTMLImageElement).src = DEFAULT_HOTEL_IMAGE)
                    }
                />
                {FavoriteButton}
                {hotel.available_rooms_count !== undefined &&
                    hotel.available_rooms_count <= 5 && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            Only {hotel.available_rooms_count} left
                        </div>
                    )}
            </div>
            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 flex-1">
                        {hotel.name}
                    </h3>
                    <Star rating={hotel.stars} />
                </div>

                <div className="flex items-center text-gray-600 mb-3">
                    <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm truncate">{hotel.location}</span>
                </div>

                <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                    {hotel.description}
                </p>

                {hotel.rating && (
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-semibold text-gray-700">
                            {hotel.rating.average}
                        </span>
                        <span className="text-xs text-gray-500">
                            ({hotel.rating.count} reviews)
                        </span>
                    </div>
                )}

                {hotel.price_range && (
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <span className="text-2xl font-bold text-gray-900">
                                ${hotel.price_range.min}
                            </span>
                            <span className="text-sm text-gray-500 ml-1">/night</span>
                        </div>
                        {hotel.available_rooms_count !== undefined && (
                            <span className="text-xs text-green-600 font-medium">
                                {hotel.available_rooms_count} available
                            </span>
                        )}
                    </div>
                )}

                <button className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    View Details
                </button>
            </div>
        </div>
    );
};

export default HotelCard;
