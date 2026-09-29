import type { Metadata } from "next";
import Link from "next/link";
import { FavoriteButton } from "@/components/favorite-button";
import { LevelBadge } from "@/components/level-badge";
import { MissingState } from "@/components/missing-state";
import { QuestionList } from "@/components/question-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DOMAIN_META } from "@/lib/content/labels";
import { getListening } from "@/lib/content/load";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const piece = getListening(id);
  return { title: piece?.title ?? "Script not found" };
}

export default async function ListeningDetailPage({ params }: Params) {
  const { id } = await params;
  const piece = getListening(id);
  if (!piece) {
    return <MissingState kind="script" id={id} href="/listen" action="All scripts" />;
  }

  return (
    <article className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/listen">All scripts</Link>
        </Button>
        <LevelBadge level={piece.level} />
        <Badge variant="secondary">{DOMAIN_META[piece.domain].label}</Badge>
        {piece.roles.map((role) => (
          <Badge key={role} variant="outline">
            {role}
          </Badge>
        ))}
        <div className="ml-auto">
          <FavoriteButton
            item={{
              id: piece.id,
              kind: "listening",
              title: piece.title,
              href: `/listen/${piece.id}`,
            }}
          />
        </div>
      </div>
      <header className="max-w-2xl">
        <h1 className="text-3xl text-balance sm:text-4xl">{piece.title}</h1>
        <p className="mt-3 leading-7 text-muted-foreground">
          Read this aloud or shadow it with a partner. There is no audio file — the script
          is the material.
        </p>
        {piece.source ? (
          <p className="mt-2 text-sm text-muted-foreground">Source: {piece.source}</p>
        ) : null}
      </header>
      <Tabs defaultValue="script">
        <TabsList>
          <TabsTrigger value="script">Script</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
        </TabsList>
        <TabsContent value="script" className="pt-4">
          {piece.script.length === 0 ? (
            <p className="text-muted-foreground">This script has no lines yet.</p>
          ) : (
            <ol className="max-w-2xl space-y-3">
              {piece.script.map((turn, index) => (
                <li key={`${turn.role}-${index}`} className="rounded-xl bg-card px-4 py-3 ring-1 ring-foreground/10">
                  <p className="text-xs font-medium tracking-wide text-primary uppercase">
                    {turn.role}
                  </p>
                  <p className="mt-1 text-lg leading-7">{turn.text}</p>
                </li>
              ))}
            </ol>
          )}
        </TabsContent>
        <TabsContent value="questions" className="pt-4">
          <QuestionList questions={piece.questions} />
        </TabsContent>
      </Tabs>
    </article>
  );
}
