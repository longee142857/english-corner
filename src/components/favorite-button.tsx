"use client";

import { StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites, type Favorite } from "@/lib/favorites";

export function FavoriteButton({ item }: { item: Favorite }) {
  const { items, toggle, isSaved } = useFavorites();
  const saved = isSaved(item);

  return (
    <Button
      type="button"
      variant={saved ? "default" : "outline"}
      size="sm"
      onClick={() => toggle(item)}
      aria-pressed={saved}
      disabled={items === null}
    >
      <StarIcon className={saved ? "fill-current" : undefined} />
      {saved ? "Saved" : "Save"}
    </Button>
  );
}
