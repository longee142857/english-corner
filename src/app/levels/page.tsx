import type { Metadata } from "next";
import Link from "next/link";
import { LevelBadge } from "@/components/level-badge";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LEVEL_META } from "@/lib/content/labels";
import { getCatalog } from "@/lib/content/load";
import { LEVELS } from "@/lib/content/types";

export const metadata: Metadata = {
  title: "Levels",
  description: "A1 to C1 can-do blurbs for an English Corner session.",
};

export default function LevelsPage() {
  const { counts } = getCatalog();

  return (
    <div>
      <PageHeader
        eyebrow="Levels"
        title="A1 to C1, said out loud"
        intro="These blurbs describe what you can do in a live conversation. They are not a test specification. Pick the level where you can already finish a sentence, then practice one step harder."
      />
      <div className="grid gap-4">
        {LEVELS.map((level) => (
          <Card key={level} id={level}>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <LevelBadge level={level} />
                <CardTitle className="text-2xl">{LEVEL_META[level].name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="max-w-2xl text-lg leading-8">{LEVEL_META[level].canDo}</p>
              <p className="text-sm text-muted-foreground">
                {counts.byLevel[level]} {counts.byLevel[level] === 1 ? "piece" : "pieces"} on the shelf
              </p>
              <div className="flex flex-wrap gap-2">
                <Button asChild>
                  <Link href={`/topics?level=${level}`}>Topics</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/practice?level=${level}`}>Dialogues</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
