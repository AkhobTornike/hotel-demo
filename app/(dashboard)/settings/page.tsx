"use client";

import { useFont, GeoFont, LatinFont } from "@/contexts/FontContext";
import { CheckCircle } from "@phosphor-icons/react";

const GEO_FONTS: { id: GeoFont; name: string; desc: string; cssVar: string }[] = [
  {
    id: "noto-sans-geo",
    name: "Noto Sans Georgian",
    desc: "Clean, neutral — ყველაზე გავრცელებული",
    cssVar: "var(--font-noto-sans-geo)",
  },
  {
    id: "noto-serif-geo",
    name: "Noto Serif Georgian",
    desc: "Elegant serif — პრემიუმ შეგრძნება",
    cssVar: "var(--font-noto-serif-geo)",
  },
  {
    id: "firago",
    name: "FiraGO",
    desc: "Modern geometric — Fira-ს ქართული fork",
    cssVar: "var(--font-firago)",
  },
];

const LATIN_FONTS: { id: LatinFont; name: string; desc: string; cssVar: string }[] = [
  {
    id: "geist",
    name: "Geist",
    desc: "Vercel-ის შრიფტი — technical SaaS",
    cssVar: "var(--font-geist)",
  },
  {
    id: "jakarta",
    name: "Plus Jakarta Sans",
    desc: "Friendly geometric — startup feel",
    cssVar: "var(--font-jakarta)",
  },
  {
    id: "ibm-plex",
    name: "IBM Plex Sans",
    desc: "Enterprise-grade — corporate trust",
    cssVar: "var(--font-ibm-plex)",
  },
];

const PREVIEW_GEO = "სასტუმრო მენეჯმენტი — ჯავშნები, სტუმრები, ოთახები";
const PREVIEW_LAT = "Hotel Management — Reservations, Guests, Rooms";

function FontCard({
  name,
  desc,
  cssVar,
  active,
  onClick,
}: {
  name: string;
  desc: string;
  cssVar: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        textAlign: "left",
        background: active ? "var(--acc-s)" : "var(--panel)",
        border: `1.5px solid ${active ? "var(--acc)" : "var(--bdr)"}`,
        borderRadius: 12,
        padding: "16px 20px",
        cursor: "pointer",
        transition: "border-color 150ms, background 150ms",
        width: "100%",
        position: "relative",
      }}
    >
      {active && (
        <span style={{ position: "absolute", top: 12, right: 12, color: "var(--acc)" }}>
          <CheckCircle size={20} weight="fill" />
        </span>
      )}
      <div
        style={{
          fontFamily: cssVar,
          fontSize: 20,
          fontWeight: 600,
          color: "var(--txt)",
          marginBottom: 6,
          lineHeight: 1.4,
        }}
      >
        {name}
      </div>
      <div
        style={{
          fontFamily: cssVar,
          fontSize: 13,
          color: "var(--txt2)",
          marginBottom: 12,
          lineHeight: 1.6,
        }}
      >
        {desc}
      </div>
      <div
        style={{
          fontFamily: cssVar,
          fontSize: 13,
          color: "var(--txt3)",
          lineHeight: 1.7,
          borderTop: "1px solid var(--bdr)",
          paddingTop: 10,
        }}
      >
        {cssVar.includes("noto") || cssVar.includes("firago") ? PREVIEW_GEO : PREVIEW_LAT}
      </div>
    </button>
  );
}

export default function SettingsPage() {
  const { geoFont, latinFont, setGeoFont, setLatinFont } = useFont();

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--txt)", marginBottom: 4 }}>
          პარამეტრები
        </h1>
        <p style={{ fontSize: 14, color: "var(--txt2)" }}>
          გინდა იხილო სისტემა სხვადასხვა შრიფტით — ავირჩიე და გადაწყვეტ.
        </p>
      </div>

      {/* Georgian fonts */}
      <section style={{ marginBottom: 40 }}>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--txt)", marginBottom: 2 }}>
            ქართული შრიფტი
          </h2>
          <p style={{ fontSize: 13, color: "var(--txt3)" }}>
            ზემოქმედებს ყველა ქართულ ტექსტზე UI-ში
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {GEO_FONTS.map((f) => (
            <FontCard
              key={f.id}
              name={f.name}
              desc={f.desc}
              cssVar={f.cssVar}
              active={geoFont === f.id}
              onClick={() => setGeoFont(f.id)}
            />
          ))}
        </div>
      </section>

      {/* Latin fonts */}
      <section style={{ marginBottom: 40 }}>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--txt)", marginBottom: 2 }}>
            ლათინური / ინგლისური შრიფტი
          </h2>
          <p style={{ fontSize: 13, color: "var(--txt3)" }}>
            რიცხვები, ტექნიკური ტერმინები, ინტერფეისის ლათინური ნაწილი
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {LATIN_FONTS.map((f) => (
            <FontCard
              key={f.id}
              name={f.name}
              desc={f.desc}
              cssVar={f.cssVar}
              active={latinFont === f.id}
              onClick={() => setLatinFont(f.id)}
            />
          ))}
        </div>
      </section>

      {/* Live preview */}
      <section>
        <div style={{ marginBottom: 12 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--txt)" }}>
            ლაივ preview
          </h2>
        </div>
        <div
          style={{
            background: "var(--panel)",
            border: "1px solid var(--bdr)",
            borderRadius: 12,
            padding: 24,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div style={{ fontFamily: "var(--font-ui)", fontSize: 24, fontWeight: 700, color: "var(--txt)" }}>
            სასტუმრო OS — Hotel Management
          </div>
          <div style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--txt2)", lineHeight: 1.7 }}>
            ჯავშნების მართვა, სტუმრების ისტორია, ოთახების სტატუსი, RS.ge ინტეგრაცია, TBC/BOG გადახდები.
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["ჯავშანი #1042", "Check-in", "Room 204", "₾180/ღამე", "RS.ge sync"].map((t) => (
              <span
                key={t}
                style={{
                  fontFamily: "var(--font-ui)",
                  background: "var(--acc-s)",
                  color: "var(--acc-txt)",
                  padding: "4px 10px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
