import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SearchForm({
  defaultQuery = "",
  kind,
}: {
  defaultQuery?: string;
  kind?: string;
}) {
  return (
    <form action="/search" method="get" className="flex flex-col gap-2 sm:flex-row">
      {kind ? <input type="hidden" name="kind" value={kind} /> : null}
      <Input
        name="q"
        defaultValue={defaultQuery}
        placeholder="Titles, situations, words, motions"
        aria-label="Search the shelf"
        className="h-10"
      />
      <Button type="submit" className="h-10">
        Search
      </Button>
    </form>
  );
}
