"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Dialogue } from "@/lib/content/types";

export function PracticeSession({ dialogue }: { dialogue: Dialogue }) {
  const [role, setRole] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const turn = dialogue.turns[index];
  const mine = role !== null && turn?.role === role;
  const visible = mine || revealed[index];

  if (!role) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl">Which role will you play?</h2>
        <p className="max-w-xl leading-7 text-muted-foreground">
          Your lines stay visible. The other role stays covered until you reveal it.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {dialogue.roles.map((name) => {
            const lines = dialogue.turns.filter((item) => item.role === name).length;
            return (
              <Card key={name}>
                <CardHeader>
                  <CardTitle className="text-xl">{name}</CardTitle>
                  <CardDescription>
                    {lines} {lines === 1 ? "line" : "lines"} in this dialogue
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    type="button"
                    onClick={() => {
                      setRole(name);
                      setIndex(0);
                      setRevealed({});
                    }}
                  >
                    Play this role
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  if (!turn) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>This dialogue has no lines yet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The situation is here, but the turns array is empty.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm">
          You are <span className="font-semibold">{role}</span>
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setRole(null);
            setIndex(0);
            setRevealed({});
          }}
        >
          Change role
        </Button>
      </div>
      <div>
        <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Turn {index + 1} of {dialogue.turns.length}
          </span>
          <span>{mine ? "Your line" : "Partner"}</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary"
            style={{ width: `${((index + 1) / dialogue.turns.length) * 100}%` }}
          />
        </div>
      </div>
      <Card className="min-h-52">
        <CardHeader>
          <CardDescription className="tracking-wide uppercase">
            {mine ? "Your line" : turn.role}
          </CardDescription>
          <CardTitle className="text-2xl leading-snug sm:text-3xl">
            {visible
              ? turn.text
              : "Their line is covered. Answer first, then reveal what they said."}
          </CardTitle>
        </CardHeader>
        {!mine && !visible ? (
          <CardContent>
            <Button
              type="button"
              onClick={() => setRevealed((current) => ({ ...current, [index]: true }))}
            >
              Reveal line
            </Button>
          </CardContent>
        ) : null}
      </Card>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={index === 0}
          onClick={() => setIndex((current) => current - 1)}
        >
          Previous
        </Button>
        <Button
          type="button"
          disabled={index >= dialogue.turns.length - 1}
          onClick={() => setIndex((current) => current + 1)}
        >
          Next turn
        </Button>
      </div>
      <Tabs defaultValue="follow">
        <TabsList>
          <TabsTrigger value="follow">Follow-ups</TabsTrigger>
          <TabsTrigger value="phrases">Useful phrases</TabsTrigger>
        </TabsList>
        <TabsContent value="follow" className="pt-3">
          {dialogue.followUps.length === 0 ? (
            <p className="text-muted-foreground">No follow-up questions for this dialogue.</p>
          ) : (
            <ul className="list-disc space-y-2 pl-5 leading-7">
              {dialogue.followUps.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </TabsContent>
        <TabsContent value="phrases" className="pt-3">
          {dialogue.usefulPhrases.length === 0 ? (
            <p className="text-muted-foreground">No phrases saved with this dialogue.</p>
          ) : (
            <ul className="space-y-2">
              {dialogue.usefulPhrases.map((item) => (
                <li key={item} className="rounded-lg bg-muted px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
