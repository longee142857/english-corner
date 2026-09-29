import type { Metadata } from "next";
import { StudyShelf } from "@/components/study-shelf";
import type { QueryValue } from "@/lib/content/query";

export const metadata: Metadata = {
  title: "Listen",
  description: "Roleplay scripts to read aloud.",
};

export default async function ListenPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: QueryValue; domain?: QueryValue; page?: QueryValue }>;
}) {
  const params = await searchParams;
  return (
    <StudyShelf
      kind="listening"
      eyebrow="Listen"
      title="Scripts you can speak"
      intro="These are roleplay scripts, not audio files. Read them aloud, or take one role while a partner reads the other."
      pathname="/listen"
      searchParams={params}
      noun="scripts"
    />
  );
}
