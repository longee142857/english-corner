import {
  type Domain,
  type IndexRecord,
  type Kind,
  type Level,
} from "@/lib/content/types";

export type QueryValue = string | string[] | undefined;

export function one(value: QueryValue): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

const LEVEL_RANK: Record<Level, number> = {
  A1: 0,
  A2: 1,
  B1: 2,
  B2: 3,
  C1: 4,
};

export function sortRecords(records: IndexRecord[]): IndexRecord[] {
  return [...records].sort((a, b) => {
    const byLevel = LEVEL_RANK[a.level] - LEVEL_RANK[b.level];
    if (byLevel !== 0) return byLevel;
    return a.title.localeCompare(b.title);
  });
}

export function filterRecords(
  records: IndexRecord[],
  query: {
    kind?: Kind;
    level?: Level;
    domain?: Domain;
    q?: string;
  },
): IndexRecord[] {
  const needle = query.q?.trim().toLowerCase();
  return records.filter((record) => {
    if (query.kind && record.kind !== query.kind) return false;
    if (query.level && record.level !== query.level) return false;
    if (query.domain && record.domain !== query.domain) return false;
    if (!needle) return true;
    const haystack = [
      record.title,
      record.situation,
      record.headword,
      record.motion,
      ...record.themes,
    ]
      .filter((part): part is string => Boolean(part))
      .join("\n")
      .toLowerCase();
    return haystack.includes(needle);
  });
}

export function paginate<T>(items: T[], pageParam: string | undefined, pageSize = 12) {
  const parsed = Number(pageParam);
  const requested = Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize) || 1);
  const page = Math.min(requested, pageCount);
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    page,
    pageCount,
    total,
  };
}

export function withParams(
  pathname: string,
  current: Record<string, string | undefined>,
  updates: Record<string, string | undefined>,
) {
  const next = { ...current, ...updates };
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(next)) {
    if (value) params.set(key, value);
  }
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}
