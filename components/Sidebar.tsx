"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SquaresFour,
  CalendarBlank,
  BookOpen,
  Users,
  Door,
  CreditCard,
  ChartBar,
  ArrowsClockwise,
  Gear,
  CaretUpDown,
} from "@phosphor-icons/react";

const NAV_SECTIONS = [
  {
    label: "მთავარი",
    items: [
      { label: "დაფა", href: "/dashboard", icon: SquaresFour },
      { label: "კალენდარი", href: "/calendar", icon: CalendarBlank },
      { label: "ჯავშნები", href: "/reservations", icon: BookOpen },
    ],
  },
  {
    label: "სასტუმრო",
    items: [
      { label: "სტუმრები", href: "/guests", icon: Users },
      { label: "ოთახები", href: "/rooms", icon: Door },
      { label: "გადახდები", href: "/payments", icon: CreditCard },
    ],
  },
  {
    label: "სისტემა",
    items: [
      { label: "ანგარიშები", href: "/reports", icon: ChartBar },
      { label: "RS.ge სინქ.", href: "/rsge", icon: ArrowsClockwise },
      { label: "პარამეტრები", href: "/settings", icon: Gear },
    ],
  },
];

const HOTELS = ["Tbilisi Grand Hotel", "Batumi Seaside Resort"];

export default function Sidebar() {
  const pathname = usePathname();
  const [hotel, setHotel] = useState(HOTELS[0]);
  const [open, setOpen] = useState(false);

  return (
    <aside
      style={{
        width: 220,
        background: "var(--sb)",
        borderRight: "1px solid var(--sb-bdr)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid var(--sb-bdr)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: "rgba(16,185,129,.15)",
            border: "1px solid rgba(16,185,129,.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            color: "var(--acc)",
            fontWeight: 700,
            fontFamily: "Georgia, serif",
          }}
        >
          ს
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--sb-txt)", letterSpacing: "-.01em" }}>
            სასტუმრო OS
          </div>
          <div style={{ fontSize: 10, color: "var(--sb-txt3)" }}>Demo v1.0</div>
        </div>
      </div>

      {/* Hotel switcher */}
      <div style={{ margin: "10px 10px 4px", position: "relative" }}>
        <button
          onClick={() => setOpen((o) => !o)}
          style={{
            width: "100%",
            padding: "9px 12px",
            background: "var(--sb-hov)",
            border: "1px solid var(--sb-bdr)",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--acc)",
              boxShadow: "0 0 0 3px rgba(16,185,129,.2)",
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 12, fontWeight: 500, color: "var(--sb-txt)", flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {hotel}
          </span>
          <CaretUpDown size={12} color="var(--sb-txt3)" />
        </button>
        {open && (
          <div
            style={{
              position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 20,
              background: "var(--sb-el)", border: "1px solid var(--sb-bdr)", borderRadius: 8,
              padding: 4, boxShadow: "0 10px 30px rgba(0,0,0,.4)",
            }}
          >
            {HOTELS.map((h) => (
              <button
                key={h}
                onClick={() => { setHotel(h); setOpen(false); }}
                style={{
                  width: "100%", textAlign: "left", padding: "7px 9px", borderRadius: 6,
                  border: "none", cursor: "pointer", fontSize: 12,
                  background: h === hotel ? "var(--sb-hov)" : "transparent",
                  color: h === hotel ? "var(--sb-txt)" : "var(--sb-txt2)",
                }}
              >
                {h}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "6px 0", overflowY: "auto" }}>
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <div
              style={{
                padding: "12px 16px 4px",
                fontSize: 10,
                fontWeight: 600,
                color: "var(--sb-txt3)",
                textTransform: "uppercase",
                letterSpacing: ".08em",
              }}
            >
              {section.label}
            </div>
            {section.items.map(({ label, href, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    padding: "7px 16px",
                    color: active ? "var(--sb-txt)" : "var(--sb-txt2)",
                    fontWeight: active ? 500 : 400,
                    fontSize: 13,
                    textDecoration: "none",
                    background: active ? "var(--sb-hov)" : "transparent",
                    transition: "color 120ms, background 120ms",
                  }}
                >
                  {active && (
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                        height: 18,
                        width: 2,
                        background: "var(--acc)",
                        borderRadius: 2,
                      }}
                    />
                  )}
                  <Icon
                    size={14}
                    weight={active ? "fill" : "regular"}
                    color={active ? "var(--acc)" : "var(--sb-txt3)"}
                  />
                  {label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid var(--sb-bdr)",
          fontSize: 11,
          color: "var(--sb-txt3)",
        }}
      >
        © 2026 სასტუმრო OS
      </div>
    </aside>
  );
}
