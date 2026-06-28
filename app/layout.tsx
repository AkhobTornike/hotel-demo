import type { Metadata } from "next";
import {
  Noto_Sans_Georgian,
  Noto_Serif_Georgian,
  IBM_Plex_Sans,
  Plus_Jakarta_Sans,
  Geist,
} from "next/font/google";
import { FontProvider } from "@/contexts/FontContext";
import "./globals.css";

/* ── Georgian fonts ── */
const notoSansGeo = Noto_Sans_Georgian({
  subsets: ["georgian"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto-sans-geo",
  display: "swap",
});
const notoSerifGeo = Noto_Serif_Georgian({
  subsets: ["georgian"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto-serif-geo",
  display: "swap",
});
/* ── Latin/English fonts ── */
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});
const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});
const ibmPlex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-ibm-plex",
  display: "swap",
});

export const metadata: Metadata = {
  title: "სასტუმრო OS",
  description: "Hotel Property Management System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fontVars = [
    notoSansGeo.variable,
    notoSerifGeo.variable,
    geist.variable,
    jakartaSans.variable,
    ibmPlex.variable,
  ].join(" ");

  return (
    <html lang="ka" className={fontVars}>
      <body>
        <FontProvider>{children}</FontProvider>
      </body>
    </html>
  );
}
