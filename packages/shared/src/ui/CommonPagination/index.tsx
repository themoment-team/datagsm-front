import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Skeleton,
} from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';

interface CommonPaginationProps {
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const CommonPagination = ({
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
}: CommonPaginationProps) => {
  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center gap-2')}>
        <Skeleton className={cn('h-9 w-24')} />
        <Skeleton className={cn('h-9 w-9')} />
        <Skeleton className={cn('h-9 w-9')} />
        <Skeleton className={cn('h-9 w-9')} />
        <Skeleton className={cn('h-9 w-24')} />
      </div>
    );
  }

  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisiblePages = 3;
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 0) onPageChange(currentPage - 1);
              }}
              className={cn(
                currentPage === 0 ? 'pointer-events-none opacity-50' : 'cursor-pointer',
              )}
            />
          </PaginationItem>
          {pageNumbers.map((pageNum) => (
            <PaginationItem key={pageNum}>
              <PaginationLink
                href="#"
                isActive={pageNum === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(pageNum);
                }}
              >
                {pageNum + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages - 1) onPageChange(currentPage + 1);
              }}
              className={cn(
                currentPage >= totalPages - 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer',
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default CommonPagination;
