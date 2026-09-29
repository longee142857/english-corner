import fs from "fs";
import path from "path";
import type {
  Catalog,
  Counts,
  DebateMotion,
  Dialogue,
  DialogueTurn,
  Domain,
  EntryType,
  IndexRecord,
  Kind,
  Level,
  ListeningPiece,
  PackSummary,
  ReadingPiece,
  StudyQuestion,
  Topic,
  VocabEntry,
  VocabPack,
} from "@/lib/content/types";
import {
  DOMAINS,
  ENTRY_TYPES,
  KINDS,
  LEVELS,
} from "@/lib/content/types";

const CONTENT_DIR = path.join(process.cwd(), "content");

const FOLDERS = [
  "curriculum",
  "dialogues",
  "vocabulary/packs",
  "reading",
  "listening",
  "debates",
] as const;

let memo: { stamp: string; catalog: Catalog } | null = null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asList(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (isRecord(value)) return [value];
  return [];
}

function text(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.trim() : fallback;
}

function textList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function parseLevel(value: unknown): Level | null {
  return typeof value === "string" && (LEVELS as readonly string[]).includes(value)
    ? (value as Level)
    : null;
}

function parseDomain(value: unknown): Domain | null {
  return typeof value === "string" && (DOMAINS as readonly string[]).includes(value)
    ? (value as Domain)
    : null;
}

function parseKind(value: unknown): Kind | null {
  return typeof value === "string" && (KINDS as readonly string[]).includes(value)
    ? (value as Kind)
    : null;
}

function parseEntryType(value: unknown): EntryType {
  return typeof value === "string" && (ENTRY_TYPES as readonly string[]).includes(value)
    ? (value as EntryType)
    : "word";
}

function hrefFor(kind: Kind, id: string, packId?: string, headword?: string): string {
  const safeId = encodeURIComponent(id);
  if (kind === "topic") return `/topics/${safeId}`;
  if (kind === "dialogue") return `/practice/${safeId}`;
  if (kind === "reading") return `/read/${safeId}`;
  if (kind === "listening") return `/listen/${safeId}`;
  if (kind === "debate") return `/debates/${safeId}`;
  if (headword && packId) {
    return `/flashcards/${encodeURIComponent(packId)}?card=${safeId}`;
  }
  return `/flashcards/${safeId}`;
}

function safeHref(value: string, fallback: string): string {
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  return fallback;
}

function insideContent(sourceFile: string): string | null {
  const root = path.resolve(CONTENT_DIR);
  const resolved = path.resolve(root, sourceFile);
  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) return null;
  return resolved;
}

function toSourceFile(file: string): string {
  return path.relative(CONTENT_DIR, file).split(path.sep).join("/");
}

function listJson(relativeDir: string): string[] {
  const dir = path.join(CONTENT_DIR, relativeDir);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .sort()
    .map((name) => path.join(dir, name));
}

function contentFiles(): string[] {
  const files = FOLDERS.flatMap((folder) => listJson(folder));
  const indexFile = path.join(CONTENT_DIR, "index.json");
  if (fs.existsSync(indexFile)) files.push(indexFile);
  return files.sort();
}

function contentStamp(): string {
  return contentFiles()
    .map((file) => {
      const stat = fs.statSync(file);
      return `${file}:${stat.mtimeMs}:${stat.size}`;
    })
    .join("|");
}

function readJson(file: string): unknown {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as unknown;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown parse error";
    throw new Error(`Could not parse ${path.relative(process.cwd(), file)}: ${message}`);
  }
}

function emptyCounts(): Counts {
  return {
    topics: 0,
    dialogues: 0,
    vocabEntries: 0,
    packs: 0,
    readings: 0,
    listenings: 0,
    debates: 0,
    byLevel: { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0 },
    byDomain: {
      "daily-life": 0,
      campus: 0,
      travel: 0,
      academic: 0,
      career: 0,
      culture: 0,
      exam: 0,
      interview: 0,
      debate: 0,
    },
  };
}

function buildCounts(records: IndexRecord[], packs: PackSummary[]): Counts {
  const counts = emptyCounts();
  counts.packs = packs.length;
  for (const record of records) {
    if (record.kind === "vocab") {
      if (record.headword) counts.vocabEntries += 1;
      continue;
    }
    counts.byLevel[record.level] += 1;
    if (record.domain) counts.byDomain[record.domain] += 1;
    if (record.kind === "topic") counts.topics += 1;
    if (record.kind === "dialogue") counts.dialogues += 1;
    if (record.kind === "reading") counts.readings += 1;
    if (record.kind === "listening") counts.listenings += 1;
    if (record.kind === "debate") counts.debates += 1;
  }
  for (const pack of packs) counts.byLevel[pack.level] += 1;
  return counts;
}

function remember(records: IndexRecord[], record: IndexRecord) {
  const exists = records.some(
    (item) =>
      item.kind === record.kind &&
      item.id === record.id &&
      item.packId === record.packId &&
      item.headword === record.headword,
  );
  if (exists) {
    console.warn(`Skipping duplicate ${record.kind} id "${record.id}"`);
    return;
  }
  records.push(record);
}

function parseTurns(value: unknown): DialogueTurn[] {
  return asList(value).flatMap((item) => {
    if (!isRecord(item)) return [];
    const role = text(item.role);
    const line = text(item.text);
    if (!role || !line) return [];
    return [{ role, text: line }];
  });
}

function parseQuestions(value: unknown): StudyQuestion[] {
  return asList(value).flatMap((item, index) => {
    if (!isRecord(item)) return [];
    const question = text(item.question);
    if (!question) return [];
    return [
      {
        id: text(item.id, `q${index + 1}`),
        question,
        options: textList(item.options),
        answer: text(item.answer),
        explanation: text(item.explanation),
      },
    ];
  });
}

export function parseTopic(value: unknown): Topic | null {
  if (!isRecord(value)) return null;
  const id = text(value.id);
  const title = text(value.title);
  const level = parseLevel(value.level);
  const domain = parseDomain(value.domain);
  if (!id || !title || !level || !domain) return null;
  return {
    id,
    title,
    level,
    domain,
    themes: textList(value.themes),
    summary: text(value.summary),
    canDo: textList(value.canDo),
    lessonOutline: textList(value.lessonOutline),
    conversationPrompts: textList(value.conversationPrompts),
    grammarFocus: textList(value.grammarFocus),
    functions: textList(value.functions),
  };
}

export function parseDialogue(value: unknown): Dialogue | null {
  if (!isRecord(value)) return null;
  const id = text(value.id);
  const title = text(value.title);
  const level = parseLevel(value.level);
  const domain = parseDomain(value.domain);
  if (!id || !title || !level || !domain) return null;
  return {
    id,
    title,
    level,
    domain,
    themes: textList(value.themes),
    situation: text(value.situation),
    roles: textList(value.roles),
    turns: parseTurns(value.turns),
    followUps: textList(value.followUps),
    usefulPhrases: textList(value.usefulPhrases),
    source: text(value.source),
  };
}

function parseEntry(value: unknown, pack: Pick<VocabPack, "level" | "theme">): VocabEntry | null {
  if (!isRecord(value)) return null;
  const id = text(value.id);
  const headword = text(value.headword);
  const level = parseLevel(value.level) ?? pack.level;
  if (!id || !headword) return null;
  return {
    id,
    type: parseEntryType(value.type),
    headword,
    pos: text(value.pos),
    definition: text(value.definition),
    example: text(value.example),
    level,
    theme: text(value.theme, pack.theme),
    collocations: textList(value.collocations),
  };
}

export function parsePack(value: unknown): VocabPack | null {
  if (!isRecord(value)) return null;
  const id = text(value.id);
  const title = text(value.title);
  const level = parseLevel(value.level);
  if (!id || !title || !level) return null;
  const theme = text(value.theme, "general");
  const draft = { level, theme };
  return {
    id,
    title,
    level,
    theme,
    entries: asList(value.entries).flatMap((item) => {
      const entry = parseEntry(item, draft);
      return entry ? [entry] : [];
    }),
  };
}

export function parseReading(value: unknown): ReadingPiece | null {
  if (!isRecord(value)) return null;
  const id = text(value.id);
  const title = text(value.title);
  const level = parseLevel(value.level);
  const domain = parseDomain(value.domain);
  if (!id || !title || !level || !domain) return null;
  return {
    id,
    kind: "reading",
    title,
    level,
    domain,
    themes: textList(value.themes),
    passage: text(value.passage),
    questions: parseQuestions(value.questions),
    source: text(value.source),
  };
}

export function parseListening(value: unknown): ListeningPiece | null {
  if (!isRecord(value)) return null;
  const id = text(value.id);
  const title = text(value.title);
  const level = parseLevel(value.level);
  const domain = parseDomain(value.domain);
  if (!id || !title || !level || !domain) return null;
  return {
    id,
    kind: "listening",
    title,
    level,
    domain,
    themes: textList(value.themes),
    roles: textList(value.roles),
    script: parseTurns(value.script),
    questions: parseQuestions(value.questions),
    source: text(value.source),
  };
}

export function parseDebate(value: unknown): DebateMotion | null {
  if (!isRecord(value)) return null;
  const id = text(value.id);
  const title = text(value.title);
  const level = parseLevel(value.level);
  const domain = parseDomain(value.domain);
  const motion = text(value.motion);
  if (!id || !title || !level || !domain || !motion) return null;
  return {
    id,
    kind: "debate",
    title,
    level,
    domain,
    themes: textList(value.themes),
    motion,
    forPoints: textList(value.forPoints),
    againstPoints: textList(value.againstPoints),
    usefulPhrases: textList(value.usefulPhrases),
    followUps: textList(value.followUps),
    source: text(value.source),
  };
}

function parseIndexRecord(value: unknown): IndexRecord | null {
  if (!isRecord(value)) return null;
  const id = text(value.id);
  const title = text(value.title);
  const level = parseLevel(value.level);
  const kind = parseKind(value.kind);
  if (!id || !title || !level || !kind) return null;
  const headword = text(value.headword) || undefined;
  const packId = text(value.packId) || undefined;
  const fallback = hrefFor(kind, id, packId, headword);
  return {
    id,
    title,
    level,
    domain: parseDomain(value.domain) ?? undefined,
    kind,
    themes: textList(value.themes),
    headword,
    situation: text(value.situation) || undefined,
    motion: text(value.motion) || undefined,
    href: safeHref(text(value.href), fallback),
    sourceFile: text(value.sourceFile) || undefined,
    packId,
  };
}

function parsePackSummary(value: unknown): PackSummary | null {
  if (!isRecord(value)) return null;
  const id = text(value.id);
  const title = text(value.title);
  const level = parseLevel(value.level);
  if (!id || !title || !level) return null;
  const entryCount = typeof value.entryCount === "number" && value.entryCount >= 0 ? value.entryCount : 0;
  return {
    id,
    title,
    theme: text(value.theme, "general"),
    level,
    entryCount,
    href: safeHref(text(value.href), `/flashcards/${encodeURIComponent(id)}`),
    sourceFile: text(value.sourceFile) || undefined,
  };
}

function packsFromRecords(records: IndexRecord[]): PackSummary[] {
  const entries = new Map<string, IndexRecord[]>();
  for (const record of records) {
    if (record.kind !== "vocab" || !record.headword || !record.packId) continue;
    const list = entries.get(record.packId) ?? [];
    list.push(record);
    entries.set(record.packId, list);
  }
  const packRecords = records.filter((record) => record.kind === "vocab" && !record.headword);
  const ids = new Set<string>([...entries.keys(), ...packRecords.map((record) => record.id)]);
  return [...ids].map((id) => {
    const group = entries.get(id) ?? [];
    const packRecord = packRecords.find((record) => record.id === id);
    const sample = group[0];
    return {
      id,
      title: packRecord?.title ?? sample?.title ?? id,
      theme: packRecord?.themes[0] ?? sample?.themes[0] ?? "general",
      level: packRecord?.level ?? sample?.level ?? "A1",
      entryCount: group.length,
      href: packRecord?.href ?? `/flashcards/${encodeURIComponent(id)}`,
      sourceFile: packRecord?.sourceFile ?? sample?.sourceFile,
    };
  });
}

function readExternalIndex(): { records: IndexRecord[]; packs: PackSummary[] } | null {
  const file = path.join(CONTENT_DIR, "index.json");
  if (!fs.existsSync(file)) return null;
  const data = readJson(file);
  if (Array.isArray(data)) {
    const records = data.flatMap((item) => {
      const record = parseIndexRecord(item);
      return record ? [record] : [];
    });
    return { records, packs: packsFromRecords(records) };
  }
  if (!isRecord(data) || !Array.isArray(data.records)) {
    // Pipeline catalogs use topics/dialogues/pieces, not the app's records array.
    // Scan the JSON files instead of failing the study pages.
    return null;
  }
  const records = data.records.flatMap((item) => {
    const record = parseIndexRecord(item);
    return record ? [record] : [];
  });
  const packs = Array.isArray(data.packs)
    ? data.packs.flatMap((item) => {
        const pack = parsePackSummary(item);
        return pack ? [pack] : [];
      })
    : packsFromRecords(records);
  return { records, packs: packs.length > 0 ? packs : packsFromRecords(records) };
}

function scanCatalog(): { records: IndexRecord[]; packs: PackSummary[] } {
  const records: IndexRecord[] = [];
  const packs: PackSummary[] = [];

  for (const file of listJson("curriculum")) {
    const sourceFile = toSourceFile(file);
    for (const item of asList(readJson(file))) {
      const topic = parseTopic(item);
      if (!topic) {
        console.warn(`Skipping a topic in ${sourceFile}`);
        continue;
      }
      remember(records, {
        id: topic.id,
        title: topic.title,
        level: topic.level,
        domain: topic.domain,
        kind: "topic",
        themes: topic.themes,
        href: hrefFor("topic", topic.id),
        sourceFile,
      });
    }
  }

  for (const file of listJson("dialogues")) {
    const sourceFile = toSourceFile(file);
    for (const item of asList(readJson(file))) {
      const dialogue = parseDialogue(item);
      if (!dialogue) {
        console.warn(`Skipping a dialogue in ${sourceFile}`);
        continue;
      }
      remember(records, {
        id: dialogue.id,
        title: dialogue.title,
        level: dialogue.level,
        domain: dialogue.domain,
        kind: "dialogue",
        themes: dialogue.themes,
        situation: dialogue.situation,
        href: hrefFor("dialogue", dialogue.id),
        sourceFile,
      });
    }
  }

  for (const file of listJson("vocabulary/packs")) {
    const sourceFile = toSourceFile(file);
    for (const item of asList(readJson(file))) {
      const pack = parsePack(item);
      if (!pack) {
        console.warn(`Skipping a vocabulary pack in ${sourceFile}`);
        continue;
      }
      packs.push({
        id: pack.id,
        title: pack.title,
        theme: pack.theme,
        level: pack.level,
        entryCount: pack.entries.length,
        href: hrefFor("vocab", pack.id),
        sourceFile,
      });
      remember(records, {
        id: pack.id,
        title: pack.title,
        level: pack.level,
        kind: "vocab",
        themes: [pack.theme],
        href: hrefFor("vocab", pack.id),
        sourceFile,
      });
      for (const entry of pack.entries) {
        remember(records, {
          id: entry.id,
          title: entry.headword,
          level: entry.level,
          kind: "vocab",
          themes: [entry.theme],
          headword: entry.headword,
          href: hrefFor("vocab", entry.id, pack.id, entry.headword),
          sourceFile,
          packId: pack.id,
        });
      }
    }
  }

  for (const file of listJson("reading")) {
    const sourceFile = toSourceFile(file);
    for (const item of asList(readJson(file))) {
      const piece = parseReading(item);
      if (!piece) {
        console.warn(`Skipping a reading in ${sourceFile}`);
        continue;
      }
      remember(records, {
        id: piece.id,
        title: piece.title,
        level: piece.level,
        domain: piece.domain,
        kind: "reading",
        themes: piece.themes,
        href: hrefFor("reading", piece.id),
        sourceFile,
      });
    }
  }

  for (const file of listJson("listening")) {
    const sourceFile = toSourceFile(file);
    for (const item of asList(readJson(file))) {
      const piece = parseListening(item);
      if (!piece) {
        console.warn(`Skipping a listening script in ${sourceFile}`);
        continue;
      }
      remember(records, {
        id: piece.id,
        title: piece.title,
        level: piece.level,
        domain: piece.domain,
        kind: "listening",
        themes: piece.themes,
        href: hrefFor("listening", piece.id),
        sourceFile,
      });
    }
  }

  for (const file of listJson("debates")) {
    const sourceFile = toSourceFile(file);
    for (const item of asList(readJson(file))) {
      const motion = parseDebate(item);
      if (!motion) {
        console.warn(`Skipping a debate motion in ${sourceFile}`);
        continue;
      }
      remember(records, {
        id: motion.id,
        title: motion.title,
        level: motion.level,
        domain: motion.domain,
        kind: "debate",
        themes: motion.themes,
        motion: motion.motion,
        href: hrefFor("debate", motion.id),
        sourceFile,
      });
    }
  }

  return { records, packs };
}

function buildCatalog(): Catalog {
  const external = readExternalIndex();
  const source = external ? "index" : "scan";
  const { records, packs } = external ?? scanCatalog();
  return {
    records,
    packs,
    counts: buildCounts(records, packs),
    source,
  };
}

export function getCatalog(): Catalog {
  const stamp = contentStamp();
  if (memo?.stamp === stamp) return memo.catalog;
  const catalog = buildCatalog();
  memo = { stamp, catalog };
  return catalog;
}

function filesFor(record: IndexRecord | PackSummary | undefined, fallback: () => string[]): string[] {
  if (record?.sourceFile) {
    const safe = insideContent(record.sourceFile);
    if (safe) return [safe, ...fallback().filter((file) => file !== safe)];
  }
  return fallback();
}

function firstMatch<T extends { id: string }>(files: string[], id: string, read: (file: string) => T[]): T | null {
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    const found = read(file).find((item) => item.id === id);
    if (found) return found;
  }
  return null;
}

export function getTopic(id: string): Topic | null {
  const record = getCatalog().records.find((item) => item.kind === "topic" && item.id === id);
  if (!record) return null;
  return firstMatch(filesFor(record, () => listJson("curriculum")), id, (file) =>
    asList(readJson(file)).flatMap((item) => {
      const topic = parseTopic(item);
      return topic ? [topic] : [];
    }),
  );
}

export function getDialogue(id: string): Dialogue | null {
  const record = getCatalog().records.find((item) => item.kind === "dialogue" && item.id === id);
  if (!record) return null;
  return firstMatch(filesFor(record, () => listJson("dialogues")), id, (file) =>
    asList(readJson(file)).flatMap((item) => {
      const dialogue = parseDialogue(item);
      return dialogue ? [dialogue] : [];
    }),
  );
}

export function getPack(id: string): VocabPack | null {
  const summary = getCatalog().packs.find((pack) => pack.id === id);
  if (!summary) return null;
  return firstMatch(filesFor(summary, () => listJson("vocabulary/packs")), id, (file) =>
    asList(readJson(file)).flatMap((item) => {
      const pack = parsePack(item);
      return pack ? [pack] : [];
    }),
  );
}

export function getReading(id: string): ReadingPiece | null {
  const record = getCatalog().records.find((item) => item.kind === "reading" && item.id === id);
  if (!record) return null;
  return firstMatch(filesFor(record, () => listJson("reading")), id, (file) =>
    asList(readJson(file)).flatMap((item) => {
      const piece = parseReading(item);
      return piece ? [piece] : [];
    }),
  );
}

export function getListening(id: string): ListeningPiece | null {
  const record = getCatalog().records.find((item) => item.kind === "listening" && item.id === id);
  if (!record) return null;
  return firstMatch(filesFor(record, () => listJson("listening")), id, (file) =>
    asList(readJson(file)).flatMap((item) => {
      const piece = parseListening(item);
      return piece ? [piece] : [];
    }),
  );
}

export function getDebate(id: string): DebateMotion | null {
  const record = getCatalog().records.find((item) => item.kind === "debate" && item.id === id);
  if (!record) return null;
  return firstMatch(filesFor(record, () => listJson("debates")), id, (file) =>
    asList(readJson(file)).flatMap((item) => {
      const motion = parseDebate(item);
      return motion ? [motion] : [];
    }),
  );
}
