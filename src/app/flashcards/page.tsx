import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/empty-state";
import { FavoriteButton } from "@/components/favorite-button";
import { FilterBar } from "@/components/filter-bar";
import { LevelBadge } from "@/components/level-badge";
import { PageHeader } from "@/components/page-header";
import { PaginationBar } from "@/components/pagination-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCatalog } from "@/lib/content/load";
import { one, paginate, withParams, type QueryValue } from "@/lib/content/query";
import { isLevel } from "@/lib/content/types";

export const metadata: Metadata = {
  title: "Flashcards",
  description: "Flip from a definition to the headword.",
};

export default async function FlashcardsPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: QueryValue; theme?: QueryValue; page?: QueryValue }>;
}) {
  const params = await searchParams;
  const levelParam = one(params.level);
  const theme = one(params.theme);
  const level = isLevel(levelParam) ? levelParam : undefined;
  const allPacks = getCatalog().packs;
  const themes = [...new Set(allPacks.map((pack) => pack.theme))].sort((a, b) =>
    a.localeCompare(b),
  );
  const filtered = allPacks
    .filter((pack) => (level ? pack.level === level : true))
    .filter((pack) => (theme ? pack.theme === theme : true))
    .sort((a, b) => a.level.localeCompare(b.level) || a.title.localeCompare(b.title));
  const result = paginate(filtered, one(params.page));
  const query = { level, theme };

  return (
    <div>
      <PageHeader
        eyebrow="Cards"
        title="Definition, then the word"
        intro="Pick a pack. The front of the card is the meaning. Say the headword before you flip it."
      />
      <FilterBar pathname="/flashcards" level={level} showDomains={false} />
      {themes.length > 0 && themes.length <= 24 ? (
        <div className="mb-6">
          <p className="mb-2 text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
            Theme
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            <Button variant={theme ? "outline" : "default"} size="sm" asChild>
              <Link href={withParams("/flashcards", query, { theme: undefined, page: undefined })}>
                All
              </Link>
            </Button>
            {themes.map((item) => (
              <Button key={item} variant={theme === item ? "default" : "outline"} size="sm" asChild>
                <Link href={withParams("/flashcards", query, { theme: item, page: undefined })}>
                  {item}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      ) : null}
      {result.total === 0 ? (
        <EmptyState
          title={allPacks.length === 0 ? "No packs on the shelf yet" : "No packs match this filter"}
          body={
            allPacks.length === 0
              ? "Add a JSON file under content/vocabulary/packs/ and refresh."
              : "Clear the level or theme to see the other packs."
          }
          href={allPacks.length === 0 ? undefined : "/flashcards"}
          action={allPacks.length === 0 ? undefined : "Clear filters"}
        />
      ) : (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            {result.total} {result.total === 1 ? "pack" : "packs"}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {result.items.map((pack) => (
              <Card key={pack.id} className="h-full">
                <CardHeader>
                  <CardDescription>{pack.theme}</CardDescription>
                  <CardTitle className="text-lg">
                    <Link href={pack.href} className="hover:underline">
                      {pack.title}
                    </Link>
                  </CardTitle>
                  <CardAction>
                    <FavoriteButton
                      item={{
                        id: pack.id,
                        kind: "vocab",
                        title: pack.title,
                        href: pack.href,
                      }}
                    />
                  </CardAction>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center gap-2">
                  <LevelBadge level={pack.level} />
                  <Badge variant="secondary">
                    {pack.entryCount} {pack.entryCount === 1 ? "card" : "cards"}
                  </Badge>
                  <Button size="sm" asChild>
                    <Link href={pack.href}>Start session</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <PaginationBar
            pathname="/flashcards"
            page={result.page}
            pageCount={result.pageCount}
            params={query}
          />
        </>
      )}
    </div>
  );
}
