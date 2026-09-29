import { Badge } from "@/components/ui/badge";
import { LEVEL_CLASS } from "@/lib/content/labels";
import type { Level } from "@/lib/content/types";

export function LevelBadge({ level }: { level: Level }) {
  return (
    <Badge variant="outline" className={LEVEL_CLASS[level]}>
      {level}
    </Badge>
  );
}
