"use client";

import { useCallback, useEffect, useState } from "react";

export interface Favorite {
  id: string;
  kind: string;
  title: string;
  href: string;
}

export const FAVORITES_KEY = "english-corner-favorites";
const CHANGE_EVENT = "english-corner-favorites-change";

function isFavorite(value: unknown): value is Favorite {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.kind === "string" &&
    typeof item.title === "string" &&
    typeof item.href === "string" &&
    item.href.startsWith("/") &&
    !item.href.startsWith("//")
  );
}

export function readFavorites(): Favorite[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(FAVORITES_KEY);
  if (!raw) return [];
  try {
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return [];
    return data.filter(isFavorite);
  } catch {
    return [];
  }
}

function sameFavorite(a: Favorite, b: Pick<Favorite, "id" | "kind" | "href">) {
  return a.id === b.id && a.kind === b.kind && a.href === b.href;
}

export function writeFavorites(items: Favorite[]) {
  window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useFavorites() {
  const [items, setItems] = useState<Favorite[] | null>(null);

  useEffect(() => {
    const sync = () => setItems(readFavorites());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(CHANGE_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(CHANGE_EVENT, sync);
    };
  }, []);

  const toggle = useCallback((item: Favorite) => {
    const current = readFavorites();
    const exists = current.some((favorite) => sameFavorite(favorite, item));
    const next = exists
      ? current.filter((favorite) => !sameFavorite(favorite, item))
      : [...current, item];
    writeFavorites(next);
    setItems(next);
  }, []);

  const isSaved = useCallback(
    (item: Pick<Favorite, "id" | "kind" | "href">) =>
      (items ?? []).some((favorite) => sameFavorite(favorite, item)),
    [items],
  );

  return { items, toggle, isSaved };
}
