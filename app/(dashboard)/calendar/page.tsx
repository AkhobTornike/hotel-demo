"use client";

import { useState } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import Modal from "@/components/Modal";

// Bookings for June 2026. `start`/`end` are day-of-June offsets used for grid placement —
// they intentionally run past 30 for stays that end in July, so `label` carries the real date.
const BOOKINGS = [
  { id: "JV-1042", room: "204", guest: "გ. მამულაშვილი", start: 28, end: 30, checkout: "30 ივნ", color: "#10B981" },
  { id: "JV-1041", room: "312", guest: "И. Петров",       start: 27, end: 29, checkout: "29 ივნ", color: "#3B82F6" },
  { id: "JV-1040", room: "108", guest: "A. Müller",        start: 28, end: 31, checkout: "01 ივლ", color: "#8B5CF6" },
  { id: "JV-1039", room: "215", guest: "ნ. კვარ.",         start: 29, end: 32, checkout: "02 ივლ", color: "#F59E0B" },
  { id: "JV-1038", room: "401", guest: "მ. გელ.",          start: 30, end: 33, checkout: "03 ივლ", color: "#EF4444" },
  { id: "JV-1036", room: "102", guest: "ნ. ბერ.",          start: 25, end: 27, checkout: "27 ივნ", color: "#10B981" },
  { id: "JV-1035", room: "303", guest: "Y. Tanaka",        start: 20, end: 23, checkout: "23 ივნ", color: "#06B6D4" },
];

const ROOMS_LIST = ["101", "102", "108", "201", "204", "215", "301", "303", "312", "401"];

const DOW = ["კვი", "ორშ", "სამ", "ოთხ", "ხუთ", "პარ", "შაბ"];
const MONTHS = [
  "იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი",
  "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი",
];

const DAY_MS = 86_400_000;
const JUNE_1 = Date.UTC(2026, 5, 1);
/** Demo "today" — the date the whole prototype is pinned to. */
const TODAY_INDEX = 28;
/** The default window starts Tue 23 June 2026 and runs 8 days. */
const BASE_START = Date.UTC(2026, 5, 23);
const VISIBLE_DAYS = 8;

/** Day number counted from 1 June, so July dates continue as 31, 32, … — the scale BOOKINGS uses. */
function dayIndex(ms: number) {
  return Math.round((ms - JUNE_1) / DAY_MS) + 1;
}

export default function CalendarPage() {
  const [selected, setSelected] = useState<typeof BOOKINGS[0] | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);

  const week = Array.from({ length: VISIBLE_DAYS }, (_, i) => {
    const ms = BASE_START + (weekOffset * 7 + i) * DAY_MS;
    const d = new Date(ms);
    return { index: dayIndex(ms), label: `${DOW[d.getUTCDay()]} ${d.getUTCDate()}` };
  });

  const first = new Date(BASE_START + weekOffset * 7 * DAY_MS);
  const last = new Date(BASE_START + (weekOffset * 7 + VISIBLE_DAYS - 1) * DAY_MS);
  const range =
    first.getUTCMonth() === last.getUTCMonth()
      ? `${MONTHS[first.getUTCMonth()]} ${first.getUTCFullYear()}`
      : `${MONTHS[first.getUTCMonth()]} — ${MONTHS[last.getUTCMonth()]} ${last.getUTCFullYear()}`;

  return (
    <div style={{ padding: "28px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--txt)" }}>კალენდარი</h1>
          <p style={{ fontSize: 13, color: "var(--txt3)", marginTop: 2 }}>{range} &middot; კვირის ხედი</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setWeekOffset((w) => w - 1)} style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid var(--bdr)", background: "var(--panel)", cursor: "pointer", color: "var(--txt2)", display: "flex", alignItems: "center" }}><CaretLeft size={14} /></button>
          <button
            onClick={() => setWeekOffset(0)}
            style={{
              padding: "7px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13,
              border: "1px solid", borderColor: weekOffset === 0 ? "var(--acc)" : "var(--bdr)",
              background: weekOffset === 0 ? "var(--acc-s)" : "var(--panel)",
              color: weekOffset === 0 ? "var(--acc-txt)" : "var(--txt2)",
            }}
          >
            დღეს
          </button>
          <button onClick={() => setWeekOffset((w) => w + 1)} style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid var(--bdr)", background: "var(--panel)", cursor: "pointer", color: "var(--txt2)", display: "flex", alignItems: "center" }}><CaretRight size={14} /></button>
        </div>
      </div>

      <div style={{ background: "var(--panel)", border: "1px solid var(--bdr)", borderRadius: 12, overflow: "auto" }}>
        {/* Header row */}
        <div style={{ display: "grid", gridTemplateColumns: "80px repeat(8, 1fr)", borderBottom: "1px solid var(--bdr)" }}>
          <div style={{ padding: "10px 12px", fontSize: 11, fontWeight: 600, color: "var(--txt3)" }}>ოთახი</div>
          {week.map((d) => (
            <div key={d.index} style={{ padding: "10px 8px", textAlign: "center", fontSize: 11, fontWeight: 600, color: d.index === TODAY_INDEX ? "var(--acc)" : "var(--txt3)", borderLeft: "1px solid var(--bdr)", background: d.index === TODAY_INDEX ? "rgba(16,185,129,.05)" : "transparent" }}>{d.label}</div>
          ))}
        </div>

        {/* Rows per room */}
        {ROOMS_LIST.map((room, ri) => (
          <div key={room} style={{ display: "grid", gridTemplateColumns: "80px repeat(8, 1fr)", borderBottom: ri < ROOMS_LIST.length - 1 ? "1px solid var(--bdr)" : "none", minHeight: 40, position: "relative" }}>
            <div style={{ padding: "10px 12px", fontSize: 12, fontWeight: 600, color: "var(--txt2)", fontFamily: "monospace", display: "flex", alignItems: "center" }}>{room}</div>
            {week.map(({ index: day }) => {
              const booking = BOOKINGS.find(b => b.room === room && day >= b.start && day < b.end);
              const isStart = booking && day === booking.start;
              const isEnd   = booking && day === booking.end - 1;
              return (
                <div
                  key={day}
                  onClick={() => booking && isStart && setSelected(booking)}
                  style={{
                    borderLeft: "1px solid var(--bdr)",
                    background: day === TODAY_INDEX ? "rgba(16,185,129,.03)" : "transparent",
                    padding: "4px 2px",
                    display: "flex", alignItems: "center",
                    cursor: isStart && booking ? "pointer" : "default",
                  }}
                >
                  {booking && isStart && (
                    <div style={{
                      background: booking.color,
                      borderRadius: isEnd ? 6 : "6px 0 0 6px",
                      padding: "3px 8px",
                      fontSize: 11, fontWeight: 500, color: "#fff",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      width: "calc(100% + 2px)",
                    }}>
                      {booking.guest}
                    </div>
                  )}
                  {booking && !isStart && !isEnd && (
                    <div style={{ background: booking.color, opacity: 0.7, height: 24, width: "calc(100% + 2px)", marginLeft: -2 }} />
                  )}
                  {booking && !isStart && isEnd && (
                    <div style={{ background: booking.color, opacity: 0.7, height: 24, width: "calc(100% - 2px)", borderRadius: "0 6px 6px 0" }} />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
        {BOOKINGS.map((b) => (
          <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--txt3)" }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: b.color, display: "inline-block" }} />
            {b.room}: {b.guest}
          </div>
        ))}
      </div>

      {/* Booking detail popup */}
      {selected && (
        <Modal onClose={() => setSelected(null)} width={320}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: selected.color, marginBottom: 16 }} />
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--txt)", marginBottom: 4 }}>{selected.guest}</div>
          <div style={{ fontSize: 13, color: "var(--txt3)", marginBottom: 16 }}>ოთახი {selected.room} &middot; {selected.id}</div>
          <div style={{ fontSize: 13, color: "var(--txt2)" }}>{selected.start} ივნ &rarr; {selected.checkout}</div>
          <button onClick={() => setSelected(null)} style={{ marginTop: 16, width: "100%", padding: "9px 0", borderRadius: 8, border: "none", background: "var(--bg)", fontSize: 13, color: "var(--txt2)", cursor: "pointer" }}>დახურვა</button>
        </Modal>
      )}
    </div>
  );
}
