import type { Metadata } from "next";
import Link from "next/link";
import { FavoriteButton } from "@/components/favorite-button";
import { LevelBadge } from "@/components/level-badge";
import { MissingState } from "@/components/missing-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DOMAIN_META } from "@/lib/content/labels";
import { getTopic } from "@/lib/content/load";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const topic = getTopic(id);
  return { title: topic?.title ?? "Topic not found" };
}

function BulletList({ items, empty }: { items: string[]; empty: string }) {
  if (items.length === 0) return <p className="text-muted-foreground">{empty}</p>;
  return (
    <ul className="list-disc space-y-2 pl-5 leading-7">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default async function TopicDetailPage({ params }: Params) {
  const { id } = await params;
  const topic = getTopic(id);
  if (!topic) {
    return <MissingState kind="topic" id={id} href="/topics" action="All topics" />;
  }

  return (
    <article className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/topics">All topics</Link>
        </Button>
        <LevelBadge level={topic.level} />
        <Badge variant="secondary">{DOMAIN_META[topic.domain].label}</Badge>
        {topic.themes.map((theme) => (
          <Badge key={theme} variant="outline">
            {theme}
          </Badge>
        ))}
        <div className="ml-auto">
          <FavoriteButton
            item={{
              id: topic.id,
              kind: "topic",
              title: topic.title,
              href: `/topics/${topic.id}`,
            }}
          />
        </div>
      </div>
      <header className="max-w-2xl">
        <h1 className="text-3xl text-balance sm:text-4xl">{topic.title}</h1>
        {topic.summary ? (
          <p className="mt-3 text-lg leading-8 text-muted-foreground">{topic.summary}</p>
        ) : null}
      </header>
      <section>
        <h2 className="mb-3 text-xl">You can</h2>
        <BulletList items={topic.canDo} empty="No can-do statements yet." />
      </section>
      <Tabs defaultValue="outline">
        <TabsList>
          <TabsTrigger value="outline">Outline</TabsTrigger>
          <TabsTrigger value="prompts">Prompts</TabsTrigger>
          <TabsTrigger value="language">Language</TabsTrigger>
        </TabsList>
        <TabsContent value="outline" className="pt-4">
          <BulletList items={topic.lessonOutline} empty="No lesson outline yet." />
        </TabsContent>
        <TabsContent value="prompts" className="pt-4">
          <BulletList items={topic.conversationPrompts} empty="No conversation prompts yet." />
        </TabsContent>
        <TabsContent value="language" className="space-y-6 pt-4">
          <div>
            <h2 className="mb-2 text-lg">Grammar focus</h2>
            <BulletList items={topic.grammarFocus} empty="No grammar focus yet." />
          </div>
          <div>
            <h2 className="mb-2 text-lg">Functions</h2>
            <BulletList items={topic.functions} empty="No functions listed yet." />
          </div>
        </TabsContent>
      </Tabs>
      <Button variant="outline" asChild>
        <Link href={`/practice?level=${topic.level}&domain=${topic.domain}`}>
          Practice a dialogue at this level
        </Link>
      </Button>
    </article>
  );
}
