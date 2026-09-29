import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";

export function MissingState({
  kind,
  id,
  href,
  action,
}: {
  kind: string;
  id: string;
  href: string;
  action: string;
}) {
  return (
    <div className="space-y-4">
      <EmptyState
        title={`This ${kind} is not on the shelf`}
        body={`Nothing with the id “${id}” is loaded. Check the spelling, or add the JSON file under content/ and refresh.`}
        href={href}
        action={action}
      />
      <Button variant="outline" asChild>
        <Link href="/search">Search the shelf</Link>
      </Button>
    </div>
  );
}
