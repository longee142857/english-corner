import type { Metadata } from "next";
import Link from "next/link";
import { FavoriteButton } from "@/components/favorite-button";
import { LevelBadge } from "@/components/level-badge";
import { MissingState } from "@/components/missing-state";
import { QuestionList } from "@/components/question-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DOMAIN_META } from "@/lib/content/labels";
import { getReading } from "@/lib/content/load";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const piece = getReading(id);
  return { title: piece?.title ?? "Reading not found" };
}

export default async function ReadingDetailPage({ params }: Params) {
  const { id } = await params;
  const piece = getReading(id);
  if (!piece) {
    return <MissingState kind="reading" id={id} href="/read" action="All readings" />;
  }
  const paragraphs = piece.passage.split(/\n\n+/).filter(Boolean);

  return (
    <article className="space-y-8">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/read">All readings</Link>
        </Button>
        <LevelBadge level={piece.level} />
        <Badge variant="secondary">{DOMAIN_META[piece.domain].label}</Badge>
        <div className="ml-auto">
          <FavoriteButton
            item={{
              id: piece.id,
              kind: "reading",
              title: piece.title,
              href: `/read/${piece.id}`,
            }}
          />
        </div>
      </div>
      <header className="max-w-2xl">
        <h1 className="text-3xl text-balance sm:text-4xl">{piece.title}</h1>
        {piece.source ? (
          <p className="mt-2 text-sm text-muted-foreground">Source: {piece.source}</p>
        ) : null}
      </header>
      <div className="max-w-2xl space-y-4 text-lg leading-8">
        {paragraphs.length === 0 ? (
          <p className="text-muted-foreground">This passage is empty.</p>
        ) : (
          paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)
        )}
      </div>
      <section className="space-y-3">
        <h2 className="text-2xl">Questions</h2>
        <QuestionList questions={piece.questions} />
      </section>
    </article>
  );
}
