"use client";

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore } from "react";

export type GeoFont = "noto-sans-geo" | "noto-serif-geo" | "firago";
export type LatinFont = "geist" | "jakarta" | "ibm-plex";

interface FontContextValue {
  geoFont: GeoFont;
  latinFont: LatinFont;
  setGeoFont: (f: GeoFont) => void;
  setLatinFont: (f: LatinFont) => void;
}

const GEO_VAR: Record<GeoFont, string> = {
  "noto-sans-geo": "var(--font-noto-sans-geo)",
  "noto-serif-geo": "var(--font-noto-serif-geo)",
  "firago": "var(--font-firago)",
};

const LATIN_VAR: Record<LatinFont, string> = {
  "geist": "var(--font-geist)",
  "jakarta": "var(--font-jakarta)",
  "ibm-plex": "var(--font-ibm-plex)",
};

const DEFAULT_GEO: GeoFont = "noto-sans-geo";
const DEFAULT_LATIN: LatinFont = "geist";

const FontContext = createContext<FontContextValue>({
  geoFont: DEFAULT_GEO,
  latinFont: DEFAULT_LATIN,
  setGeoFont: () => {},
  setLatinFont: () => {},
});

/* ── localStorage-backed store ──
   Read through useSyncExternalStore rather than a setState-in-effect, so the persisted
   choice is picked up on mount without a cascading render or a hydration mismatch. */
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

function read<T extends string>(key: string, allowed: Record<T, string>, fallback: T): T {
  const saved = localStorage.getItem(key);
  return saved && saved in allowed ? (saved as T) : fallback;
}

const getGeo = () => read("font-geo", GEO_VAR, DEFAULT_GEO);
const getLatin = () => read("font-latin", LATIN_VAR, DEFAULT_LATIN);
const getServerGeo = () => DEFAULT_GEO;
const getServerLatin = () => DEFAULT_LATIN;

function setGeoFont(f: GeoFont) {
  localStorage.setItem("font-geo", f);
  listeners.forEach((l) => l());
}

function setLatinFont(f: LatinFont) {
  localStorage.setItem("font-latin", f);
  listeners.forEach((l) => l());
}

export function FontProvider({ children }: { children: React.ReactNode }) {
  const geoFont = useSyncExternalStore(subscribe, getGeo, getServerGeo);
  const latinFont = useSyncExternalStore(subscribe, getLatin, getServerLatin);

  useEffect(() => {
    const root = document.documentElement.style;
    root.setProperty("--font-ui", GEO_VAR[geoFont]);
    root.setProperty("--font-latin", LATIN_VAR[latinFont]);
  }, [geoFont, latinFont]);

  const value = useMemo(
    () => ({ geoFont, latinFont, setGeoFont, setLatinFont }),
    [geoFont, latinFont],
  );

  return <FontContext.Provider value={value}>{children}</FontContext.Provider>;
}

export function useFont() {
  return useContext(FontContext);
}
