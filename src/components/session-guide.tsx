"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function SessionGuide() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" type="button">
          How a session runs
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">A 25-minute corner</DialogTitle>
          <DialogDescription>
            Three short steps. Say the lines out loud, even if you are alone.
          </DialogDescription>
        </DialogHeader>
        <ol className="list-decimal space-y-3 pl-5 leading-7">
          <li>Pick a level you can survive, not the one you wish you had.</li>
          <li>Read the topic outline once, then open a dialogue and take a role.</li>
          <li>
            Keep your partner&apos;s lines covered until you have tried to answer. Save the
            phrases that stuck.
          </li>
        </ol>
      </DialogContent>
    </Dialog>
  );
}
