import type { Metadata } from "next";
import { StudyShelf } from "@/components/study-shelf";
import type { QueryValue } from "@/lib/content/query";

export const metadata: Metadata = {
  title: "Topics",
  description: "Browse English Corner topics by level and domain.",
};

export default async function TopicsPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: QueryValue; domain?: QueryValue; page?: QueryValue }>;
}) {
  const params = await searchParams;
  return (
    <StudyShelf
      kind="topic"
      eyebrow="Topics"
      title="What you will practice"
      intro="Each topic is a short lesson: what you should be able to do, how the conversation unfolds, and prompts you can use with a partner."
      pathname="/topics"
      searchParams={params}
      noun="topics"
    />
  );
}
