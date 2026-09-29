import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-3xl">That page is not in the study room</h1>
      <p className="leading-7 text-muted-foreground">
        The address does not match a shelf. Start from the levels, or search for a title.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <Link href="/">Back to the corner</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/search">Search</Link>
        </Button>
      </div>
    </div>
  );
}
