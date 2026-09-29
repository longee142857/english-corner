"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LevelBadge } from "@/components/level-badge";
import type { VocabPack } from "@/lib/content/types";

export function FlashcardSession({
  pack,
  initialCardId,
}: {
  pack: VocabPack;
  initialCardId?: string;
}) {
  const initialIndex = Math.max(
    0,
    pack.entries.findIndex((entry) => entry.id === initialCardId),
  );
  const [order, setOrder] = useState(() => pack.entries.map((_, index) => index));
  const [cursor, setCursor] = useState(initialIndex);
  const [flipped, setFlipped] = useState(false);
  const missingCard = Boolean(initialCardId) && !pack.entries.some((entry) => entry.id === initialCardId);
  const entry = pack.entries[order[cursor] ?? 0];

  const progress = useMemo(() => {
    if (pack.entries.length === 0) return 0;
    return ((cursor + 1) / pack.entries.length) * 100;
  }, [cursor, pack.entries.length]);

  if (!entry) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>This pack has no cards</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Add entries to the pack JSON and refresh.</p>
        </CardContent>
      </Card>
    );
  }

  function shuffle() {
    const next = pack.entries.map((_, index) => index);
    for (let index = next.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(Math.random() * (index + 1));
      const current = next[index];
      next[index] = next[swap];
      next[swap] = current;
    }
    setOrder(next);
    setCursor(0);
    setFlipped(false);
  }

  return (
    <div className="mx-auto max-w-xl space-y-4">
      {missingCard ? (
        <p className="text-sm text-muted-foreground">
          That card is not in this pack. Starting from the first one.
        </p>
      ) : null}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Card {cursor + 1} of {pack.entries.length}
        </span>
        <span>{flipped ? "Headword" : "Definition"}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
      </div>
      <Card className="min-h-64">
        <CardHeader>
          <CardDescription className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{entry.type}</Badge>
            <LevelBadge level={entry.level} />
            {entry.pos ? <span>{entry.pos}</span> : null}
          </CardDescription>
          <CardTitle className="text-2xl leading-snug sm:text-3xl">
            {flipped ? entry.headword : entry.definition || "No definition yet"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {flipped && entry.example ? (
            <p className="leading-7 text-muted-foreground">{entry.example}</p>
          ) : null}
          {flipped && entry.collocations.length > 0 ? (
            <p className="text-sm">
              <span className="text-muted-foreground">Also say: </span>
              {entry.collocations.join(" · ")}
            </p>
          ) : null}
          <Button type="button" onClick={() => setFlipped((current) => !current)}>
            {flipped ? "Show definition" : "Show headword"}
          </Button>
        </CardContent>
      </Card>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={cursor === 0}
          onClick={() => {
            setCursor((current) => current - 1);
            setFlipped(false);
          }}
        >
          Previous
        </Button>
        <Button
          type="button"
          disabled={cursor >= pack.entries.length - 1}
          onClick={() => {
            setCursor((current) => current + 1);
            setFlipped(false);
          }}
        >
          Next card
        </Button>
        <Button type="button" variant="outline" onClick={shuffle}>
          Shuffle
        </Button>
      </div>
    </div>
  );
}
