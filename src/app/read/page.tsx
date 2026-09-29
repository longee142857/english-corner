import type { Metadata } from "next";
import { StudyShelf } from "@/components/study-shelf";
import type { QueryValue } from "@/lib/content/query";

export const metadata: Metadata = {
  title: "Reading",
  description: "Short reading passages with questions.",
};

export default async function ReadPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: QueryValue; domain?: QueryValue; page?: QueryValue }>;
}) {
  const params = await searchParams;
  return (
    <StudyShelf
      kind="reading"
      eyebrow="Read"
      title="A passage, then the questions"
      intro="Read once for the gist, then again for the lines the questions point at. The passages are original study texts."
      pathname="/read"
      searchParams={params}
      noun="passages"
    />
  );
}
