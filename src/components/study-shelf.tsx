import { EmptyState } from "@/components/empty-state";
import { FilterBar } from "@/components/filter-bar";
import { PageHeader } from "@/components/page-header";
import { PaginationBar } from "@/components/pagination-bar";
import { ResourceCard } from "@/components/resource-card";
import { getCatalog } from "@/lib/content/load";
import { filterRecords, one, paginate, sortRecords, type QueryValue } from "@/lib/content/query";
import { isDomain, isLevel, type Kind } from "@/lib/content/types";

export function StudyShelf({
  kind,
  eyebrow,
  title,
  intro,
  pathname,
  searchParams,
  noun,
}: {
  kind: Kind;
  eyebrow: string;
  title: string;
  intro: string;
  pathname: string;
  searchParams: {
    level?: QueryValue;
    domain?: QueryValue;
    page?: QueryValue;
  };
  noun: string;
}) {
  const level = one(searchParams.level);
  const domain = one(searchParams.domain);
  const activeLevel = isLevel(level) ? level : undefined;
  const activeDomain = isDomain(domain) ? domain : undefined;
  const all = getCatalog().records.filter((record) => record.kind === kind);
  const filtered = sortRecords(
    filterRecords(all, { level: activeLevel, domain: activeDomain }),
  );
  const result = paginate(filtered, one(searchParams.page));

  return (
    <div>
      <PageHeader eyebrow={eyebrow} title={title} intro={intro} />
      <FilterBar pathname={pathname} level={activeLevel} domain={activeDomain} />
      {result.total === 0 ? (
        <EmptyState
          title={all.length === 0 ? `No ${noun} on the shelf yet` : `No ${noun} match this filter`}
          body={
            all.length === 0
              ? "Add JSON under content/ and refresh. Sample pieces keep a sample- id until you delete them."
              : "Clear the level or domain to see the rest of the shelf."
          }
          href={all.length === 0 ? undefined : pathname}
          action={all.length === 0 ? undefined : "Clear filters"}
        />
      ) : (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            {result.total} {noun}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {result.items.map((record) => (
              <ResourceCard key={record.href} record={record} />
            ))}
          </div>
          <PaginationBar
            pathname={pathname}
            page={result.page}
            pageCount={result.pageCount}
            params={{ level: activeLevel, domain: activeDomain }}
          />
        </>
      )}
    </div>
  );
}
