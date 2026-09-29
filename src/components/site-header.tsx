"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const NAV_LINKS = [
  { href: "/levels", label: "Levels" },
  { href: "/topics", label: "Topics" },
  { href: "/practice", label: "Practice" },
  { href: "/flashcards", label: "Cards" },
  { href: "/read", label: "Read" },
  { href: "/listen", label: "Listen" },
  { href: "/debates", label: "Debates" },
  { href: "/search", label: "Search" },
  { href: "/favorites", label: "Saved" },
] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <ul className="flex flex-col gap-1 md:flex-row md:flex-wrap md:items-center md:gap-0.5">
      {NAV_LINKS.map((link) => {
        const active = isActive(pathname, link.href);
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onNavigate}
              className={cn(
                "block rounded-md px-2.5 py-2 text-sm font-medium md:py-1.5",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/80 hover:bg-muted hover:text-foreground",
              )}
              aria-current={active ? "page" : undefined}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="min-w-0">
          <span className="block font-heading text-xl leading-none tracking-tight">
            English Corner
          </span>
          <span className="mt-1 block text-xs tracking-widest text-muted-foreground">
            英语角 · study room
          </span>
        </Link>
        <nav className="hidden md:block" aria-label="Main">
          <NavLinks />
        </nav>
        <Dialog key={pathname}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="md:hidden"
              aria-label="Open menu"
            >
              <MenuIcon />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className="font-heading text-lg">
                English Corner
              </DialogTitle>
            </DialogHeader>
            <nav aria-label="Mobile">
              <NavLinks />
            </nav>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
