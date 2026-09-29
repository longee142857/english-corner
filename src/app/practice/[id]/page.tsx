import type { Metadata } from "next";
import Link from "next/link";
import { FavoriteButton } from "@/components/favorite-button";
import { LevelBadge } from "@/components/level-badge";
import { MissingState } from "@/components/missing-state";
import { PracticeSession } from "@/components/practice-session";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DOMAIN_META } from "@/lib/content/labels";
import { getDialogue } from "@/lib/content/load";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const dialogue = getDialogue(id);
  return { title: dialogue?.title ?? "Dialogue not found" };
}

export default async function PracticeDetailPage({ params }: Params) {
  const { id } = await params;
  const dialogue = getDialogue(id);
  if (!dialogue) {
    return <MissingState kind="dialogue" id={id} href="/practice" action="All dialogues" />;
  }

  return (
    <article className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/practice">All dialogues</Link>
        </Button>
        <LevelBadge level={dialogue.level} />
        <Badge variant="secondary">{DOMAIN_META[dialogue.domain].label}</Badge>
        <div className="ml-auto">
          <FavoriteButton
            item={{
              id: dialogue.id,
              kind: "dialogue",
              title: dialogue.title,
              href: `/practice/${dialogue.id}`,
            }}
          />
        </div>
      </div>
      <header className="max-w-2xl">
        <h1 className="text-3xl text-balance sm:text-4xl">{dialogue.title}</h1>
        {dialogue.situation ? (
          <p className="mt-3 text-lg leading-8">{dialogue.situation}</p>
        ) : null}
        {dialogue.source ? (
          <p className="mt-2 text-sm text-muted-foreground">Source: {dialogue.source}</p>
        ) : null}
      </header>
      <PracticeSession dialogue={dialogue} />
    </article>
  );
}
