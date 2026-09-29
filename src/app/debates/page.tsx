import type { Metadata } from "next";
import { StudyShelf } from "@/components/study-shelf";
import type { QueryValue } from "@/lib/content/query";

export const metadata: Metadata = {
  title: "Debates",
  description: "Motions with points for and against.",
};

export default async function DebatesPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: QueryValue; domain?: QueryValue; page?: QueryValue }>;
}) {
  const params = await searchParams;
  return (
    <StudyShelf
      kind="debate"
      eyebrow="Debates"
      title="A motion you can argue"
      intro="Each motion has a few points on each side and phrases you can actually say when you disagree."
      pathname="/debates"
      searchParams={params}
      noun="motions"
    />
  );
}
