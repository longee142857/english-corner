import Link from "next/link";
import { Button } from "@/components/ui/button";
import { withParams } from "@/lib/content/query";

export function PaginationBar({
  pathname,
  page,
  pageCount,
  params,
}: {
  pathname: string;
  page: number;
  pageCount: number;
  params: Record<string, string | undefined>;
}) {
  if (pageCount <= 1) return null;
  const prev =
    page > 1
      ? withParams(pathname, params, { page: page === 2 ? undefined : String(page - 1) })
      : undefined;
  const next =
    page < pageCount
      ? withParams(pathname, params, { page: String(page + 1) })
      : undefined;

  return (
    <nav className="mt-6 flex items-center justify-between gap-3" aria-label="Pagination">
      {prev ? (
        <Button variant="outline" asChild>
          <Link href={prev}>Previous</Link>
        </Button>
      ) : (
        <Button variant="outline" disabled>
          Previous
        </Button>
      )}
      <p className="text-sm text-muted-foreground">
        Page {page} of {pageCount}
      </p>
      {next ? (
        <Button variant="outline" asChild>
          <Link href={next}>Next</Link>
        </Button>
      ) : (
        <Button variant="outline" disabled>
          Next
        </Button>
      )}
    </nav>
  );
}
