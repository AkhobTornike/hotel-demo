"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type GeoFont = "noto-sans-geo" | "noto-serif-geo" | "firago";
export type LatinFont = "geist" | "jakarta" | "ibm-plex";

interface FontContextValue {
  geoFont: GeoFont;
  latinFont: LatinFont;
  setGeoFont: (f: GeoFont) => void;
  setLatinFont: (f: LatinFont) => void;
}

const FontContext = createContext<FontContextValue>({
  geoFont: "noto-sans-geo",
  latinFont: "geist",
  setGeoFont: () => {},
  setLatinFont: () => {},
});

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

export function FontProvider({ children }: { children: React.ReactNode }) {
  const [geoFont, setGeoFontState] = useState<GeoFont>("noto-sans-geo");
  const [latinFont, setLatinFontState] = useState<LatinFont>("geist");

  useEffect(() => {
    const savedGeo = localStorage.getItem("font-geo") as GeoFont | null;
    const savedLatin = localStorage.getItem("font-latin") as LatinFont | null;
    if (savedGeo) setGeoFontState(savedGeo);
    if (savedLatin) setLatinFontState(savedLatin);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--font-ui", GEO_VAR[geoFont]);
  }, [geoFont]);

  useEffect(() => {
    document.documentElement.style.setProperty("--font-latin", LATIN_VAR[latinFont]);
  }, [latinFont]);

  function setGeoFont(f: GeoFont) {
    setGeoFontState(f);
    localStorage.setItem("font-geo", f);
  }
  function setLatinFont(f: LatinFont) {
    setLatinFontState(f);
    localStorage.setItem("font-latin", f);
  }

  return (
    <FontContext.Provider value={{ geoFont, latinFont, setGeoFont, setLatinFont }}>
      {children}
    </FontContext.Provider>
  );
}

export function useFont() {
  return useContext(FontContext);
}
