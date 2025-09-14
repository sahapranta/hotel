import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
    SearchIcon,
    FilterIcon,
    XIcon,
    GridIcon,
    ListIcon,
} from 'lucide-react';
import { search } from '@/routes';
import debounce from 'lodash/debounce';
import HotelCard from '@/components/hotel/card';
import { Hotel, Filters, Pagination, Metadata } from '@/types/hotel';
import PaginationLinks from '@/components/pagination';
import FilterSidebar from '@/components/hotel/filter-sidebar';
import ActiveFilter from '@/components/hotel/active-filter';

interface Props {
    hotels: { data: Hotel[] };
    filters: Filters;
    pagination: Pagination;
    metadata?: Metadata;
}

export default function Search({ hotels, filters, pagination, metadata }: Props) {
    const [searchQuery, setSearchQuery] = useState(filters.query || '');
    const [localFilters, setLocalFilters] = useState<Filters>(filters);
    const [isLoading, setIsLoading] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [favorites, setFavorites] = useState<number[]>([]);

    const debouncedSearch = useCallback(
        debounce((query: string) => {
            applyFilters({ ...localFilters, query });
        }, 800),
        [localFilters]
    );

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (searchQuery === localFilters.query) return;
        if (isFirstRender.current) return;
        debouncedSearch(searchQuery);
    }, [searchQuery]);

    useEffect(() => {
        isFirstRender.current = false;
    }, []);

    const applyFilters = (updatedFilters?: Filters) => {
        const filtersToApply = updatedFilters || localFilters;
        setIsLoading(true);
        router.get(search().url, { ...filtersToApply }, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsLoading(false),
        });
    };

    const handleFilterChange = (field: keyof Filters, value: any) => {
        const newFilters = { ...localFilters, [field]: value };
        setLocalFilters(newFilters);

        if (field !== 'query') {
            applyFilters(newFilters);
        }
    };

    const toggleFavorite = (hotelId: number) => {
        setFavorites(prev =>
            prev.includes(hotelId)
                ? prev.filter(id => id !== hotelId)
                : [...prev, hotelId]
        );
    };

    const handlePageChange = (page: number) => {
        setIsLoading(true);
        router.get(search().url, { ...localFilters, page }, {
            preserveState: true,
            preserveScroll: false,
            onFinish: () => setIsLoading(false),
        });
    };

    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (localFilters.city) count++;
        if (localFilters.country) count++;
        if (localFilters.stars) count++;
        if (localFilters.min_price || localFilters.max_price) count++;
        if (localFilters.amenities?.length) count += localFilters.amenities.length;
        return count;
    }, [localFilters]);

    return (
        <>
            <Head title="Search Hotels" />

            <div className="min-h-screen bg-gray-50">
                {/* Top Search Bar */}
                <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 relative">
                                <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search hotels by name, description, or location..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Mobile Filter Toggle */}
                            <button
                                onClick={() => setShowMobileFilters(!showMobileFilters)}
                                className="lg:hidden flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                <FilterIcon className="h-5 w-5" />
                                <span>Filters</span>
                                {activeFiltersCount > 0 && (
                                    <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                                        {activeFiltersCount}
                                    </span>
                                )}
                            </button>

                            {/* View Mode Toggle */}
                            <div className="hidden sm:flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded ${viewMode === 'grid'
                                        ? 'bg-white shadow-sm'
                                        : 'hover:bg-gray-200'
                                        }`}
                                >
                                    <GridIcon className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded ${viewMode === 'list'
                                        ? 'bg-white shadow-sm'
                                        : 'hover:bg-gray-200'
                                        }`}
                                >
                                    <ListIcon className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Sort Dropdown */}
                            <select
                                value={localFilters.sort_by || 'relevance'}
                                onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="relevance">Relevance</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                                <option value="stars">Star Rating</option>
                                <option value="name">Name</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex gap-8">
                        {/* Desktop Filters Sidebar */}
                        <div className="hidden lg:block">
                            <FilterSidebar
                                handleFilterChange={handleFilterChange}
                                localFilters={localFilters}
                                setLocalFilters={setLocalFilters}
                                applyFilters={applyFilters}
                                setSearchQuery={setSearchQuery}
                            />
                        </div>

                        {/* Mobile Filters Sidebar */}
                        {showMobileFilters && (
                            <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
                                <div className="absolute left-0 top-0 h-full w-80 bg-white overflow-y-auto">
                                    <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                                        <h2 className="text-lg font-semibold">Filters</h2>
                                        <button
                                            onClick={() => setShowMobileFilters(false)}
                                            className="p-2 hover:bg-gray-100 rounded-lg"
                                        >
                                            <XIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                    <FilterSidebar
                                        handleFilterChange={handleFilterChange}
                                        localFilters={localFilters}
                                        setLocalFilters={setLocalFilters}
                                        applyFilters={applyFilters}
                                        setSearchQuery={setSearchQuery}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Main Content */}
                        <div className="flex-1">
                            {/* Results Header */}
                            <div className="mb-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">
                                            {pagination.total} Hotels Found
                                        </h1>
                                        {metadata?.search_method && (
                                            <p className="text-sm text-gray-500 mt-1">
                                                Showing {pagination.from}-{pagination.to} of {pagination.total} results
                                                {metadata.is_fallback && " (using backup search)"}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Active Filters Display */}
                                {activeFiltersCount > 0 && (
                                    <ActiveFilter localFilters={localFilters} />
                                )}
                            </div>

                            {/* Loading State */}
                            {isLoading && (
                                <div className="flex justify-center items-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                </div>
                            )}

                            {/* Hotel Results */}
                            {!isLoading && hotels.data.length > 0 && (
                                <div className={
                                    viewMode === 'grid'
                                        ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                                        : 'space-y-6'
                                }>
                                    {hotels.data.map((hotel) => (
                                        <HotelCard key={hotel.id} hotel={hotel} viewMode={viewMode} toggleFavorite={toggleFavorite} favorites={favorites} />
                                    ))}
                                </div>
                            )}

                            {/* Empty State */}
                            {!isLoading && hotels.data.length === 0 && (
                                <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
                                    <div className="max-w-md mx-auto">
                                        <SearchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2"></h3>
                                        <p className="text-gray-600 mb-6">
                                            No hotels found matching your criteria. Please try adjusting your search or filters.
                                        </p>
                                        <Link
                                            href={search().url}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Clear All Filters
                                        </Link>
                                    </div>
                                </div>
                            )}
                            {/* Pagination */}
                            {!isLoading && pagination.last_page > 1 && (
                                <div className="py-6">
                                    <PaginationLinks pagination={pagination} onPageChange={handlePageChange} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};