"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-3xl">This page did not open</h1>
      <p className="leading-7 text-muted-foreground">
        The study room hit a problem while loading. If you just added a JSON file, check
        that it parses.
      </p>
      <p className="text-sm text-muted-foreground">{error.message}</p>
      <Button type="button" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
