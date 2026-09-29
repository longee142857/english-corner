import type { Metadata } from "next";
import Link from "next/link";
import { FavoriteButton } from "@/components/favorite-button";
import { LevelBadge } from "@/components/level-badge";
import { MissingState } from "@/components/missing-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DOMAIN_META } from "@/lib/content/labels";
import { getDebate } from "@/lib/content/load";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const motion = getDebate(id);
  return { title: motion?.title ?? "Motion not found" };
}

function Points({ items, empty }: { items: string[]; empty: string }) {
  if (items.length === 0) return <p className="text-muted-foreground">{empty}</p>;
  return (
    <ul className="list-disc space-y-2 pl-5 leading-7">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default async function DebateDetailPage({ params }: Params) {
  const { id } = await params;
  const motion = getDebate(id);
  if (!motion) {
    return <MissingState kind="motion" id={id} href="/debates" action="All motions" />;
  }

  return (
    <article className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/debates">All motions</Link>
        </Button>
        <LevelBadge level={motion.level} />
        <Badge variant="secondary">{DOMAIN_META[motion.domain].label}</Badge>
        <div className="ml-auto">
          <FavoriteButton
            item={{
              id: motion.id,
              kind: "debate",
              title: motion.title,
              href: `/debates/${motion.id}`,
            }}
          />
        </div>
      </div>
      <header className="max-w-2xl space-y-4">
        <h1 className="text-3xl text-balance sm:text-4xl">{motion.title}</h1>
        <blockquote className="border-l-4 border-primary pl-4 text-2xl leading-snug">
          {motion.motion}
        </blockquote>
        {motion.source ? (
          <p className="text-sm text-muted-foreground">Source: {motion.source}</p>
        ) : null}
      </header>
      <Tabs defaultValue="for">
        <TabsList>
          <TabsTrigger value="for">For</TabsTrigger>
          <TabsTrigger value="against">Against</TabsTrigger>
          <TabsTrigger value="say">Say it</TabsTrigger>
        </TabsList>
        <TabsContent value="for" className="pt-4">
          <Points items={motion.forPoints} empty="No points for the motion yet." />
        </TabsContent>
        <TabsContent value="against" className="pt-4">
          <Points items={motion.againstPoints} empty="No points against the motion yet." />
        </TabsContent>
        <TabsContent value="say" className="space-y-6 pt-4">
          <div>
            <h2 className="mb-2 text-lg">Useful phrases</h2>
            <Points items={motion.usefulPhrases} empty="No phrases yet." />
          </div>
          <div>
            <h2 className="mb-2 text-lg">Follow-ups</h2>
            <Points items={motion.followUps} empty="No follow-up questions yet." />
          </div>
        </TabsContent>
      </Tabs>
    </article>
  );
}
