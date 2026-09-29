export default function LoadingBlock({
  label = "Opening the shelf…",
}: {
  label?: string;
}) {
  return (
    <div className="space-y-4" aria-busy="true" aria-live="polite">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="h-9 w-56 animate-pulse rounded-md bg-muted" />
      <div className="h-4 w-full max-w-xl animate-pulse rounded-md bg-muted" />
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-36 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    </div>
  );
}
