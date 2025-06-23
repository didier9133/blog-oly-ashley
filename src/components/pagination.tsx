import {
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
  Pagination,
} from "@/components/ui/pagination";

export async function PaginationComponent({
  pageParam = "1",
  PAGE_SIZE = 10,
  total,
}: {
  pageParam?: string;
  PAGE_SIZE?: number;
  total: number;
}) {
  const page = parseInt(pageParam, 10);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <Pagination className="mb-10">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={`?page=${page - 1}`}
            className={page === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        {/* Pagination logic */}
        {totalPages <= 4 ? (
          // Show all pages if 4 or less
          Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink href={`?page=${i + 1}`} isActive={page === i + 1}>
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))
        ) : (
          // More than 4 pages
          <>
            {page <= 2 && (
              <>
                {[1, 2, 3].map((p) => (
                  <PaginationItem key={p}>
                    <PaginationLink href={`?page=${p}`} isActive={page === p}>
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    href={`?page=${totalPages}`}
                    isActive={page === totalPages}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}
            {page === 3 && (
              <>
                {[2, 3, 4].map((p) => (
                  <PaginationItem key={p}>
                    <PaginationLink href={`?page=${p}`} isActive={page === p}>
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    href={`?page=${totalPages}`}
                    isActive={page === totalPages}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}
            {page > 3 && page < totalPages - 2 && (
              <>
                <PaginationItem>
                  <PaginationLink href={`?page=${page - 1}`}>
                    {page - 1}
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href={`?page=${page}`} isActive>
                    {page}
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href={`?page=${page + 1}`}>
                    {page + 1}
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href={`?page=${totalPages}`}>
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}
            {page >= totalPages - 2 && (
              <>
                {Array.from({ length: 4 }, (_, i) => totalPages - 3 + i).map(
                  (p) => (
                    <PaginationItem key={p}>
                      <PaginationLink href={`?page=${p}`} isActive={page === p}>
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
              </>
            )}
          </>
        )}
        <PaginationItem>
          <PaginationNext
            href={`?page=${page + 1}`}
            className={
              page === totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
