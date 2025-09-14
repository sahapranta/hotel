
import React from "react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from "@/components/ui/pagination";
import { Pagination as PaginationInterface } from '@/types/hotel';

interface PaginationProps {
    pagination: PaginationInterface;
    onPageChange: (id: number) => void;
}

const PaginationLinks: React.FC<PaginationProps> = ({ pagination, onPageChange: handlePageChange }) => {
    return <Pagination>
        <PaginationContent>
            {/* Previous */}
            <PaginationItem>
                <PaginationPrevious
                    onClick={() => handlePageChange(pagination.current_page - 1)}
                    disabled={pagination.current_page === pagination.last_page}
                />
            </PaginationItem>

            {/* First page */}
            {pagination.current_page > 3 && (
                <>
                    <PaginationItem>
                        <PaginationLink onClick={() => handlePageChange(1)}>
                            1
                        </PaginationLink>
                    </PaginationItem>
                    {pagination.current_page > 4 && <PaginationEllipsis />}
                </>
            )}

            {/* Pages around current */}
            {Array.from(
                { length: 5 },
                (_, i) => pagination.current_page - 2 + i
            )
                .filter(
                    (page) => page > 0 && page <= pagination.last_page
                )
                .map((page) => (
                    <PaginationItem key={page}>
                        <PaginationLink
                            onClick={() => handlePageChange(page)}
                            isActive={pagination.current_page === page}
                        >
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                ))}

            {/* Last page */}
            {pagination.current_page < pagination.last_page - 2 && (
                <>
                    {pagination.current_page < pagination.last_page - 3 && (
                        <PaginationEllipsis />
                    )}
                    <PaginationItem>
                        <PaginationLink
                            onClick={() => handlePageChange(pagination.last_page)}
                        >
                            {pagination.last_page}
                        </PaginationLink>
                    </PaginationItem>
                </>
            )}

            {/* Next */}
            <PaginationItem>
                <PaginationNext
                    onClick={() => handlePageChange(pagination.current_page + 1)}
                    disabled={pagination.current_page === pagination.last_page}
                />
            </PaginationItem>
        </PaginationContent>
    </Pagination>
}
export default PaginationLinks;