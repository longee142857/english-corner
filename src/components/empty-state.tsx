import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EmptyState({
  title,
  body,
  href,
  action,
}: {
  title: string;
  body: string;
  href?: string;
  action?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="max-w-xl leading-7 text-muted-foreground">{body}</p>
        {href && action ? (
          <Button asChild>
            <Link href={href}>{action}</Link>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
