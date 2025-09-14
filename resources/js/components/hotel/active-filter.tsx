import { search } from "@/routes";
import { Filters } from "@/types/hotel";
import { router } from "@inertiajs/react";
import { XIcon } from "lucide-react";
import { ReactNode } from "react";

interface ActiveFilterProps {
    localFilters: Filters;
}

const FilterTag: React.FC<{ children: ReactNode, onClick: () => void }> = ({ onClick, children }) => (
    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
        {children}
        <button
            onClick={onClick}
            className="ml-1 hover:text-blue-900"
        >
            <XIcon className="h-3 w-3" />
        </button>
    </span>
);

const ActiveFilter: React.FC<ActiveFilterProps> = ({ localFilters }) => {
    const onRemove = (type: 'stars' | 'city' | 'country') => {
        localFilters[type] = undefined;
        router.get(search().url, { ...localFilters }, { preserveScroll: true, replace: true });
    };

    return (
        <div className="mt-4 flex flex-wrap gap-2">
            {localFilters.stars &&
                <FilterTag
                    onClick={() => onRemove('stars')}
                >
                    {localFilters.stars}+ stars
                </FilterTag>

            }
            {localFilters.city &&
                <FilterTag
                    onClick={() => onRemove('city')}
                >
                    {localFilters.city}
                </FilterTag>}
            {localFilters.country &&
                <FilterTag
                    onClick={() => onRemove('country')}
                >
                    {localFilters.country}
                </FilterTag>}
        </div >
    );
}

export default ActiveFilter;