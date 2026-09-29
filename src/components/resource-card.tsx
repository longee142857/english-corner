import Link from "next/link";
import { FavoriteButton } from "@/components/favorite-button";
import { LevelBadge } from "@/components/level-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DOMAIN_META, kindLabel } from "@/lib/content/labels";
import type { IndexRecord } from "@/lib/content/types";

export function ResourceCard({ record }: { record: IndexRecord }) {
  const detail =
    record.situation ||
    record.motion ||
    record.themes.slice(0, 3).join(" · ");

  return (
    <Card className="h-full">
      <CardHeader>
        <CardDescription>{kindLabel(record.kind, record.headword)}</CardDescription>
        <CardTitle className="text-lg">
          <Link href={record.href} className="hover:underline">
            {record.title}
          </Link>
        </CardTitle>
        <CardAction>
          <FavoriteButton
            item={{
              id: record.id,
              kind: record.kind,
              title: record.title,
              href: record.href,
            }}
          />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-2">
        <LevelBadge level={record.level} />
        {record.domain ? (
          <Badge variant="secondary">{DOMAIN_META[record.domain].label}</Badge>
        ) : null}
        {detail ? (
          <p className="w-full text-sm leading-6 text-muted-foreground">{detail}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
