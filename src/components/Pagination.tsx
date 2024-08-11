import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationComponentProps {
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  maxPages?: number;
}

export default function PaginationComponent({
  totalPages,
  currentPage,
  setCurrentPage,
  maxPages = 5,
}: PaginationComponentProps) {
  // Generate pagination items dynamically
  const paginationItems = [];

  // Calculate the start page and end page based on currentPage and totalPages
  let startPage = 1;
  let endPage = totalPages;

  if (totalPages > maxPages) {
    startPage = Math.max(currentPage - Math.floor(maxPages / 2), 1);
    endPage = startPage + maxPages - 1;

    // Adjust endPage if it exceeds totalPages
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = endPage - maxPages + 1;
    }
  }

  // Dynamically generate pagination items
  for (let i = startPage; i <= endPage; i++) {
    paginationItems.push(
      <PaginationItem key={i}>
        <PaginationLink
          onClick={() => setCurrentPage(i)}
          className={
            currentPage === i
              ? "bg-black text-white hover:bg-black hover:text-white"
              : ""
          }
        >
          {i}
        </PaginationLink>
      </PaginationItem>
    );
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          />
        </PaginationItem>

        {paginationItems}

        <PaginationItem>
          <PaginationNext
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
