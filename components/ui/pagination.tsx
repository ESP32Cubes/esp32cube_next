import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    baseUrl?: string;
}

export function Pagination({ currentPage, totalPages, baseUrl = '/' }: PaginationProps) {
    if (totalPages <= 1) {
        return null;
    }

    const generatePageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            // If total pages are less than or equal to max visible pages, show all page numbers
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Otherwise, show partial page numbers
            if (currentPage <= 3) {
                // If current page is in the first 3 pages, show first 5 pages
                for (let i = 1; i <= 5; i++) {
                    pages.push(i);
                }
                if (totalPages > 5) {
                    pages.push('...');
                    pages.push(totalPages);
                }
            } else if (currentPage >= totalPages - 2) {
                // If current page is in the last 3 pages, show last 5 pages
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                // If current page is in the middle, show 2 pages before and after current page
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const getPageUrl = (page: number) => {
        if (page === 1) {
            return baseUrl;
        }
        return `${baseUrl}?page=${page}`;
    };

    const pageNumbers = generatePageNumbers();

    return (
        <div className="flex items-center justify-center space-x-2 mt-8">
            {/* Previous button */}
            {currentPage > 1 && (
                <Link href={getPageUrl(currentPage - 1)}>
                    <Button variant="outline" size="sm">
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                    </Button>
                </Link>
            )}

            {/* Page numbers */}
            {pageNumbers.map((page, index) => (
                <div key={index}>
                    {page === '...' ? (
                        <span className="px-3 py-2 text-sm text-muted-foreground">...</span>
                    ) : (
                        <Link href={getPageUrl(page as number)}>
                            <Button
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                className="min-w-[40px]"
                            >
                                {page}
                            </Button>
                        </Link>
                    )}
                </div>
            ))}

            {/* Next button */}
            {currentPage < totalPages && (
                <Link href={getPageUrl(currentPage + 1)}>
                    <Button variant="outline" size="sm">
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </Link>
            )}
        </div>
    );
} 