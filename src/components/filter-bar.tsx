import type { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DOMAIN_META } from "@/lib/content/labels";
import { withParams } from "@/lib/content/query";
import { DOMAINS, LEVELS, type Domain, type Level } from "@/lib/content/types";

function FilterLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Button variant={active ? "default" : "outline"} size="sm" asChild>
      <Link href={href} aria-current={active ? "page" : undefined}>
        {children}
      </Link>
    </Button>
  );
}

export function FilterBar({
  pathname,
  level,
  domain,
  showDomains = true,
}: {
  pathname: string;
  level?: Level;
  domain?: Domain;
  showDomains?: boolean;
}) {
  const current = { level, domain };

  return (
    <div className="mb-6 space-y-4">
      <div>
        <p className="mb-2 text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
          Level
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <FilterLink
            href={withParams(pathname, current, { level: undefined, page: undefined })}
            active={!level}
          >
            All
          </FilterLink>
          {LEVELS.map((item) => (
            <FilterLink
              key={item}
              href={withParams(pathname, current, { level: item, page: undefined })}
              active={level === item}
            >
              {item}
            </FilterLink>
          ))}
        </div>
      </div>
      {showDomains ? (
        <div>
          <p className="mb-2 text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
            Domain
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            <FilterLink
              href={withParams(pathname, current, { domain: undefined, page: undefined })}
              active={!domain}
            >
              All
            </FilterLink>
            {DOMAINS.map((item) => (
              <FilterLink
                key={item}
                href={withParams(pathname, current, { domain: item, page: undefined })}
                active={domain === item}
              >
                {DOMAIN_META[item].label}
              </FilterLink>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
