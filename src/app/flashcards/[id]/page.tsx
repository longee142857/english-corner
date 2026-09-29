import type { Metadata } from "next";
import Link from "next/link";
import { FavoriteButton } from "@/components/favorite-button";
import { FlashcardSession } from "@/components/flashcard-session";
import { LevelBadge } from "@/components/level-badge";
import { MissingState } from "@/components/missing-state";
import { Button } from "@/components/ui/button";
import { getPack } from "@/lib/content/load";
import { one, type QueryValue } from "@/lib/content/query";

type Params = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ card?: QueryValue }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const pack = getPack(id);
  return { title: pack?.title ?? "Pack not found" };
}

export default async function FlashcardPackPage({ params, searchParams }: Params) {
  const { id } = await params;
  const card = one((await searchParams).card);
  const pack = getPack(id);
  if (!pack) {
    return <MissingState kind="pack" id={id} href="/flashcards" action="All packs" />;
  }

  return (
    <article className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/flashcards">All packs</Link>
        </Button>
        <LevelBadge level={pack.level} />
        <div className="ml-auto">
          <FavoriteButton
            item={{
              id: pack.id,
              kind: "vocab",
              title: pack.title,
              href: `/flashcards/${pack.id}`,
            }}
          />
        </div>
      </div>
      <header>
        <h1 className="text-3xl text-balance sm:text-4xl">{pack.title}</h1>
        <p className="mt-2 text-muted-foreground">
          Theme: {pack.theme}. {pack.entries.length}{" "}
          {pack.entries.length === 1 ? "card" : "cards"}.
        </p>
      </header>
      <FlashcardSession pack={pack} initialCardId={card} />
    </article>
  );
}
