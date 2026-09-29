import type { Metadata } from "next";
import { StudyShelf } from "@/components/study-shelf";
import type { QueryValue } from "@/lib/content/query";

export const metadata: Metadata = {
  title: "Practice",
  description: "Dialogue practice for English Corner sessions.",
};

export default async function PracticePage({
  searchParams,
}: {
  searchParams: Promise<{ level?: QueryValue; domain?: QueryValue; page?: QueryValue }>;
}) {
  const params = await searchParams;
  return (
    <StudyShelf
      kind="dialogue"
      eyebrow="Practice"
      title="Say one role out loud"
      intro="Choose a dialogue, pick the role you want to speak, and keep the other role covered until you are ready to hear it."
      pathname="/practice"
      searchParams={params}
      noun="dialogues"
    />
  );
}
