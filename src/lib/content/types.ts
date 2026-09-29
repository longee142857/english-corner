export const LEVELS = ["A1", "A2", "B1", "B2", "C1"] as const;
export type Level = (typeof LEVELS)[number];

export const DOMAINS = [
  "daily-life",
  "campus",
  "travel",
  "academic",
  "career",
  "culture",
  "exam",
  "interview",
  "debate",
] as const;
export type Domain = (typeof DOMAINS)[number];

export const KINDS = [
  "topic",
  "dialogue",
  "vocab",
  "reading",
  "listening",
  "debate",
] as const;
export type Kind = (typeof KINDS)[number];

export const ENTRY_TYPES = ["word", "phrase", "collocation", "idiom"] as const;
export type EntryType = (typeof ENTRY_TYPES)[number];

export interface IndexRecord {
  id: string;
  title: string;
  level: Level;
  domain?: Domain;
  kind: Kind;
  themes: string[];
  headword?: string;
  situation?: string;
  motion?: string;
  href: string;
  sourceFile?: string;
  packId?: string;
}

export interface PackSummary {
  id: string;
  title: string;
  theme: string;
  level: Level;
  entryCount: number;
  href: string;
  sourceFile?: string;
}

export interface Counts {
  topics: number;
  dialogues: number;
  vocabEntries: number;
  packs: number;
  readings: number;
  listenings: number;
  debates: number;
  byLevel: Record<Level, number>;
  byDomain: Record<Domain, number>;
}

export interface Catalog {
  records: IndexRecord[];
  packs: PackSummary[];
  counts: Counts;
  source: "index" | "scan";
}

export interface Topic {
  id: string;
  level: Level;
  domain: Domain;
  themes: string[];
  title: string;
  summary: string;
  canDo: string[];
  lessonOutline: string[];
  conversationPrompts: string[];
  grammarFocus: string[];
  functions: string[];
}

export interface DialogueTurn {
  role: string;
  text: string;
}

export interface Dialogue {
  id: string;
  title: string;
  level: Level;
  domain: Domain;
  themes: string[];
  situation: string;
  roles: string[];
  turns: DialogueTurn[];
  followUps: string[];
  usefulPhrases: string[];
  source: string;
}

export interface VocabEntry {
  id: string;
  type: EntryType;
  headword: string;
  pos: string;
  definition: string;
  example: string;
  level: Level;
  theme: string;
  collocations: string[];
}

export interface VocabPack {
  id: string;
  theme: string;
  level: Level;
  title: string;
  entries: VocabEntry[];
}

export interface StudyQuestion {
  id: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface ReadingPiece {
  id: string;
  kind: "reading";
  title: string;
  level: Level;
  domain: Domain;
  themes: string[];
  passage: string;
  questions: StudyQuestion[];
  source: string;
}

export interface ListeningPiece {
  id: string;
  kind: "listening";
  title: string;
  level: Level;
  domain: Domain;
  themes: string[];
  roles: string[];
  script: DialogueTurn[];
  questions: StudyQuestion[];
  source: string;
}

export interface DebateMotion {
  id: string;
  kind: "debate";
  title: string;
  level: Level;
  domain: Domain;
  themes: string[];
  motion: string;
  forPoints: string[];
  againstPoints: string[];
  usefulPhrases: string[];
  followUps: string[];
  source: string;
}

export function isLevel(value: string | undefined): value is Level {
  return !!value && (LEVELS as readonly string[]).includes(value);
}

export function isDomain(value: string | undefined): value is Domain {
  return !!value && (DOMAINS as readonly string[]).includes(value);
}

export function isKind(value: string | undefined): value is Kind {
  return !!value && (KINDS as readonly string[]).includes(value);
}
