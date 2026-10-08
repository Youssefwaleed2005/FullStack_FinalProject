import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";

type CoursePaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

// Pages to show: first, last and the ones around the current page. null means "…"
function getPageItems(page: number, totalPages: number): (number | null)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: (number | null)[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  if (start > 2) items.push(null);
  for (let current = start; current <= end; current++) items.push(current);
  if (end < totalPages - 1) items.push(null);

  items.push(totalPages);
  return items;
}

function CoursePagination({
  page,
  totalPages,
  onPageChange,
}: CoursePaginationProps) {
  return (
    <Pagination>
      <PaginationContent className="gap-1">
        <PaginationItem>
          <Button
            variant="ghost"
            size="lg"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            aria-label="Go to previous page"
          >
            <ChevronLeft data-icon="inline-start" />
            <span className="hidden sm:block">Previous</span>
          </Button>
        </PaginationItem>

        {getPageItems(page, totalPages).map((item, index) => (
          <PaginationItem key={item ?? `ellipsis-${index}`}>
            {item === null ? (
              <PaginationEllipsis />
            ) : (
              <Button
                variant={item === page ? "default" : "ghost"}
                size="icon-lg"
                aria-label={`Go to page ${item}`}
                aria-current={item === page ? "page" : undefined}
                onClick={() => onPageChange(item)}
              >
                {item}
              </Button>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <Button
            variant="ghost"
            size="lg"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            aria-label="Go to next page"
          >
            <span className="hidden sm:block">Next</span>
            <ChevronRight data-icon="inline-end" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default CoursePagination;
