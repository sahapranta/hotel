export interface Hotel {
    id: number;
    name: string;
    address: string;
    city: string;
    country: string;
    stars: number;
    description: string;
    location: string;
    available_rooms_count?: number;
    price_range?: {
        min: number;
        max: number;
        currency: string;
    };
    images?: Array<{
        url: string;
        alt?: string;
    }>;
    amenities?: string[];
    rating?: {
        average: number;
        count: number;
    };
}

export interface Filters {
    query?: string;
    city?: string;
    country?: string;
    stars?: number;
    min_price?: number;
    max_price?: number;
    sort_by?: string;
    amenities?: string[];
}

export interface Pagination {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    from: number;
    to: number;
    next_page_url?: string;
    prev_page_url?: string;
    data?: T[];
}

export interface Metadata {
    search_method?: string;
    is_fallback?: boolean;
    success?: boolean;
    has_results?: boolean;
}