import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { MapPinIcon, SearchIcon, StarIcon } from 'lucide-react';
import { search } from '@/routes';

interface Hotel {
    id: number;
    name: string;
    address: string;
    city: string;
    country: string;
    stars: number;
    description: string;
    location: string;
}

interface Filters {
    query: string;
    city: string;
    country: string;
    stars?: number;
}

interface Pagination {
    current_page: number;
    last_page: number;
    total: number;
}

interface Props {
    hotels: { data: Hotel[] };
    filters: Filters;
    pagination: Pagination;
}

export default function Search({ hotels, filters, pagination }: Props) {
    const [searchForm, setSearchForm] = useState<Filters>(filters);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = () => {
        setIsLoading(true);
        router.get(search().url, { ...searchForm }, {
            preserveState: true,
            onFinish: () => setIsLoading(false),
        });
    };

    const handleInputChange = (field: keyof Filters, value: string | number | undefined) => {
        setSearchForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    star <= rating ? (
                        <StarIcon key={star} className="h-4 w-4 text-amber-500 fill-amber-500" />
                    ) : (
                        <StarIcon key={star} className="h-4 w-4 text-gray-300" />
                    )
                ))}
            </div>
        );
    };

    const handlePageChange = (page: number) => {
        setIsLoading(true);
        router.get(search().url, { ...searchForm, page }, {
            preserveState: true,
            onFinish: () => setIsLoading(false),
        });
    };

    return (
        <>
            <Head title="Search Hotels" />

            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Search Form */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Search Hotels
                                </label>
                                <div className="relative">
                                    <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Hotel name or description"
                                        value={searchForm.query}
                                        onChange={(e) => handleInputChange('query', e.target.value)}
                                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    City
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter city"
                                    value={searchForm.city}
                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Country
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter country"
                                    value={searchForm.country}
                                    onChange={(e) => handleInputChange('country', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Star Rating
                                </label>
                                <select
                                    value={searchForm.stars || ''}
                                    onChange={(e) => handleInputChange('stars', e.target.value ? Number(e.target.value) : undefined)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Any rating</option>
                                    <option value="1">1 Star</option>
                                    <option value="2">2 Stars</option>
                                    <option value="3">3 Stars</option>
                                    <option value="4">4 Stars</option>
                                    <option value="5">5 Stars</option>
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={handleSearch}
                            disabled={isLoading}
                            className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? 'Searching...' : 'Search Hotels'}
                        </button>
                    </div>

                    {/* Results Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Search Results ({pagination.total} hotels found)
                        </h1>
                    </div>

                    {/* Hotel Results */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {hotels.data.map((hotel) => (
                            <div key={hotel.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
                                            {hotel.name}
                                        </h3>
                                        {renderStars(hotel.stars)}
                                    </div>

                                    <div className="flex items-center text-gray-600 mb-3">
                                        <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                                        <span className="text-sm">{hotel.location}</span>
                                    </div>

                                    <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                                        {hotel.description}
                                    </p>

                                    <div className="text-xs text-gray-500 mb-4">
                                        {hotel.address}
                                    </div>

                                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {hotels.data.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-500 text-lg mb-4">No hotels found</div>
                            <p className="text-gray-400">Try adjusting your search criteria</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.last_page > 1 && (
                        <div className="flex justify-center items-center space-x-2">
                            <button
                                onClick={() => handlePageChange(pagination.current_page - 1)}
                                disabled={pagination.current_page === 1 || isLoading}
                                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>

                            <span className="px-3 py-2 text-sm text-gray-700">
                                Page {pagination.current_page} of {pagination.last_page}
                            </span>

                            <button
                                onClick={() => handlePageChange(pagination.current_page + 1)}
                                disabled={pagination.current_page === pagination.last_page || isLoading}
                                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}