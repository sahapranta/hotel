import {
    ChevronDownIcon,
    ChevronUpIcon,
} from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import Star from '@/components/star';
import React, { useEffect, useRef, useState } from 'react';
import { Filters } from '@/types/hotel';

interface FilterSidebarProps {
    handleFilterChange: (key: keyof Filters, value: any) => void;
    localFilters: Filters;
    setLocalFilters: (filters: Filters) => void;
    applyFilters: (filters: Filters) => void;
    setSearchQuery: (query: string) => void;
}

interface ExpandedFiltersProps {
    price: boolean;
    rating: boolean;
    stars: boolean;
    amenities: boolean;
}

interface FilterSectionProps {
    title: string;
    children: React.ReactNode;
    filterKey: keyof ExpandedFiltersProps;
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, children, filterKey }) => {
    const [expandedFilters, setExpandedFilters] = useState<ExpandedFiltersProps>({
        price: true,
        rating: true,
        stars: true,
        amenities: false,
    });

    return (
        <div className="border-b border-gray-200 py-4">
            <button
                onClick={() => setExpandedFilters(prev => ({
                    ...prev,
                    [filterKey]: !prev[filterKey]
                }))}
                className="flex items-center justify-between w-full text-left"
            >
                <h3 className="font-semibold text-gray-900">{title}</h3>
                {expandedFilters[filterKey] ? (
                    <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                ) : (
                    <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                )}
            </button>
            {expandedFilters[filterKey] && (
                <div className="mt-4">{children}</div>
            )}
        </div>
    )
};

const popularAmenities = [
    'WiFi', 'Parking', 'Pool', 'Gym', 'Spa',
    'Restaurant', 'Bar', 'Pet Friendly', 'Airport Shuttle'
];

const FilterSidebar: React.FC<FilterSidebarProps> = ({ handleFilterChange, localFilters, setLocalFilters, applyFilters, setSearchQuery }) => {
    const [priceRange, setPriceRange] = useState({
        min: localFilters.min_price || 0,
        max: localFilters.max_price || 1000,
    });

    const isFirstRender = useRef(true);

    const [country, setCountry] = useState(localFilters.country || '');
    const [city, setCity] = useState(localFilters.city || '');

    useEffect(() => {
        if (city === localFilters.city) return;
        if (isFirstRender.current) return;

        const debounceFn = setTimeout(() => handleFilterChange("city", city || undefined), 700);
        return () => clearTimeout(debounceFn);
    }, [city, localFilters.city]);

    useEffect(() => {
        if (country === localFilters.country) return;
        if (isFirstRender.current) return;

        const debounceFn = setTimeout(() => handleFilterChange("country", country || undefined), 700);
        return () => clearTimeout(debounceFn);
    }, [country, localFilters.country]);

    const handlePriceRangeChange = () => {
        const newFilters = {
            ...localFilters,
            min_price: priceRange.min,
            max_price: priceRange.max,
        };
        setLocalFilters(newFilters);
        applyFilters(newFilters);
    };

    const clearAllFilters = () => {
        const clearedFilters: Filters = { query: '' };
        setLocalFilters(clearedFilters);
        setPriceRange({ min: 0, max: 1000 });
        setCity('');
        setCountry('');
        setSearchQuery('');
        applyFilters(clearedFilters);
    };

    useEffect(() => {
        isFirstRender.current = false;
    }, []);

    return (
        <div className="w-full lg:w-80 bg-white rounded-lg shadow-sm border border-gray-200 h-fit">
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                    <button
                        onClick={clearAllFilters}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Clear all
                    </button>
                </div>

                {/* Price Range Filter */}
                <FilterSection title="Price Range" filterKey="price">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>${priceRange.min}</span>
                            <span>${priceRange.max}</span>
                        </div>
                        <div className="space-y-2">
                            <Slider
                                min={0}
                                max={1000}
                                step={10}
                                defaultValue={[50, 100]}
                                minStepsBetweenThumbs={10}
                                value={[priceRange.min, priceRange.max]}
                                onValueChange={([min, max]) => setPriceRange({ min, max })}
                            />
                        </div>
                        <button
                            onClick={handlePriceRangeChange}
                            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                            Apply Price Filter
                        </button>
                    </div>
                </FilterSection>

                {/* Star Rating Filter */}
                <FilterSection title="Star Rating" filterKey="stars">
                    <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((stars) => (
                            <label key={stars} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                                <input
                                    type="radio"
                                    name="stars"
                                    value={stars}
                                    checked={localFilters.stars === stars}
                                    onChange={(e) => handleFilterChange('stars', parseInt(e.target.value))}
                                    className="mr-3"
                                />
                                <div className="flex items-center gap-2">
                                    <Star rating={stars} />
                                    <span className="text-sm text-gray-600">& up</span>
                                </div>
                            </label>
                        ))}
                        <button
                            onClick={() => handleFilterChange('stars', undefined)}
                            className="text-sm text-blue-600 hover:text-blue-700 mt-2"
                        >
                            Any rating
                        </button>
                    </div>
                </FilterSection>

                {/* Location Filters */}
                <div className="border-b border-gray-200 py-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Location</h3>
                    <div className="space-y-3">
                        <input
                            type="search"
                            placeholder="City"
                            value={city || ''}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                        <input
                            type="search"
                            placeholder="Country"
                            value={country || ''}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                    </div>
                </div>

                {/* Amenities Filter */}
                <FilterSection title="Amenities" filterKey="amenities">
                    <div className="space-y-2">
                        {popularAmenities.map((amenity) => (
                            <label key={amenity} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                                <input
                                    type="checkbox"
                                    checked={localFilters.amenities?.includes(amenity) || false}
                                    onChange={(e) => {
                                        const newAmenities = e.target.checked
                                            ? [...(localFilters.amenities || []), amenity]
                                            : localFilters.amenities?.filter(a => a !== amenity) || [];
                                        handleFilterChange('amenities', newAmenities);
                                    }}
                                    className="mr-3"
                                />
                                <span className="text-sm text-gray-700">{amenity}</span>
                            </label>
                        ))}
                    </div>
                </FilterSection>
            </div>
        </div>
    )
};

export default FilterSidebar;