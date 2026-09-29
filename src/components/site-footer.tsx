import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-8 border-t border-border/80">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>Original study materials for speaking practice. A1 to C1.</p>
        <p>
          <Link href="/levels" className="underline-offset-4 hover:underline">
            Pick a level
          </Link>
          <span aria-hidden="true"> · </span>
          <Link href="/search" className="underline-offset-4 hover:underline">
            Search the shelf
          </Link>
        </p>
      </div>
    </footer>
  );
}
