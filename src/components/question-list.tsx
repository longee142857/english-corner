"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StudyQuestion } from "@/lib/content/types";
import { cn } from "@/lib/utils";

export function QuestionList({ questions }: { questions: StudyQuestion[] }) {
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  if (questions.length === 0) {
    return <p className="text-muted-foreground">No questions for this piece yet.</p>;
  }

  return (
    <div className="space-y-4">
      {questions.map((question, index) => {
        const choice = picked[question.id];
        const isChecked = checked[question.id];
        const correct = choice === question.answer;
        return (
          <Card key={question.id}>
            <CardHeader>
              <CardTitle className="text-lg">
                {index + 1}. {question.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-2">
                {question.options.map((option) => {
                  const selected = choice === option;
                  const showCorrect = isChecked && option === question.answer;
                  const showWrong = isChecked && selected && !correct;
                  return (
                    <Button
                      key={option}
                      type="button"
                      variant={selected ? "default" : "outline"}
                      className={cn(
                        "h-auto justify-start px-3 py-2 text-left whitespace-normal",
                        showCorrect && "bg-[oklch(0.45_0.08_155)] text-white",
                        showWrong && "bg-destructive text-white",
                      )}
                      onClick={() => {
                        setPicked((current) => ({ ...current, [question.id]: option }));
                        setChecked((current) => ({ ...current, [question.id]: false }));
                      }}
                    >
                      {option}
                    </Button>
                  );
                })}
              </div>
              <Button
                type="button"
                disabled={!choice}
                onClick={() => setChecked((current) => ({ ...current, [question.id]: true }))}
              >
                Check answer
              </Button>
              {isChecked ? (
                <p className="leading-7">
                  {correct ? "That matches the passage." : `The expected answer is “${question.answer}”.`}{" "}
                  {question.explanation}
                </p>
              ) : null}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
