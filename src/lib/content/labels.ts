import type { Domain, Kind, Level } from "@/lib/content/types";

export const LEVEL_META: Record<Level, { name: string; canDo: string }> = {
  A1: {
    name: "Starter",
    canDo:
      "You can greet people, ask for everyday things, and follow slow, clear speech about familiar topics.",
  },
  A2: {
    name: "Waystage",
    canDo:
      "You can handle simple travel and shopping, describe your routine, and talk about past events in short sentences.",
  },
  B1: {
    name: "Threshold",
    canDo:
      "You can keep a conversation going, explain an opinion on a familiar subject, and deal with most situations while traveling.",
  },
  B2: {
    name: "Vantage",
    canDo:
      "You can discuss abstract topics, argue a point with reasons, and follow extended speech about work or study.",
  },
  C1: {
    name: "Advanced",
    canDo:
      "You can speak fluently, structure a detailed argument, and adjust your tone for academic or professional rooms.",
  },
};

export const LEVEL_CLASS: Record<Level, string> = {
  A1: "border-transparent bg-[oklch(0.93_0.05_155)] text-[oklch(0.32_0.06_155)]",
  A2: "border-transparent bg-[oklch(0.93_0.04_210)] text-[oklch(0.32_0.06_220)]",
  B1: "border-transparent bg-[oklch(0.94_0.055_95)] text-[oklch(0.38_0.07_75)]",
  B2: "border-transparent bg-[oklch(0.93_0.055_50)] text-[oklch(0.4_0.09_45)]",
  C1: "border-transparent bg-[oklch(0.93_0.04_290)] text-[oklch(0.34_0.07_290)]",
};

export const DOMAIN_META: Record<Domain, { label: string; blurb: string }> = {
  "daily-life": {
    label: "Daily life",
    blurb: "Shops, meals, neighbors, and the small talk that fills a day.",
  },
  campus: {
    label: "Campus",
    blurb: "Classes, libraries, clubs, and asking a classmate for help.",
  },
  travel: {
    label: "Travel",
    blurb: "Tickets, hotels, directions, and what to say when a plan slips.",
  },
  academic: {
    label: "Academic",
    blurb: "Seminars, office hours, and explaining one point clearly.",
  },
  career: {
    label: "Career",
    blurb: "Meetings, feedback, and the language of getting work done.",
  },
  culture: {
    label: "Culture",
    blurb: "Habits, stories, and opinions you can actually defend.",
  },
  exam: {
    label: "Exam",
    blurb: "Timed speaking tasks and the phrases that keep you moving.",
  },
  interview: {
    label: "Interview",
    blurb: "Introducing your experience and answering a hard question.",
  },
  debate: {
    label: "Debate",
    blurb: "Motions, reasons, and polite ways to disagree.",
  },
};

export const KIND_LABELS: Record<Kind, string> = {
  topic: "Topic",
  dialogue: "Dialogue",
  vocab: "Vocabulary",
  reading: "Reading",
  listening: "Listening",
  debate: "Debate",
};

export function kindLabel(kind: Kind, headword?: string): string {
  if (kind === "vocab") return headword ? "Word" : "Pack";
  return KIND_LABELS[kind];
}
