export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
}) {
  return (
    <header className="mb-6 max-w-2xl">
      {eyebrow ? (
        <p className="text-sm font-medium tracking-[0.16em] text-primary uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="mt-1 text-3xl text-balance sm:text-4xl">{title}</h1>
      {intro ? (
        <p className="mt-3 text-base leading-7 text-muted-foreground">{intro}</p>
      ) : null}
    </header>
  );
}
