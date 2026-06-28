"use client";

import { useState } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

const DAYS = ["ორშ", "სამ", "ოთხ", "ხუთ", "პარ", "შაბ", "კვი"];

// Bookings for June 2026 (day ranges are 1-indexed)
const BOOKINGS = [
  { id: "JV-1042", room: "204", guest: "გ. მამულაშვილი", start: 28, end: 30, color: "#10B981" },
  { id: "JV-1041", room: "312", guest: "И. Петров",       start: 27, end: 29, color: "#3B82F6" },
  { id: "JV-1040", room: "108", guest: "A. Müller",        start: 28, end: 31, color: "#8B5CF6" },
  { id: "JV-1039", room: "215", guest: "ნ. კვარ.",         start: 29, end: 32, color: "#F59E0B" },
  { id: "JV-1038", room: "401", guest: "მ. გელ.",          start: 30, end: 33, color: "#EF4444" },
  { id: "JV-1036", room: "102", guest: "ნ. ბერ.",          start: 25, end: 27, color: "#10B981" },
  { id: "JV-1035", room: "303", guest: "Y. Tanaka",        start: 20, end: 23, color: "#06B6D4" },
];

// Render a simple weekly calendar view centered on June 28
const WEEK_DAYS = [23, 24, 25, 26, 27, 28, 29, 30];
const WEEK_LABELS = ["ორშ 23", "სამ 24", "ოთხ 25", "ხუთ 26", "პარ 27", "შაბ 28", "კვი 29", "ორშ 30"];
const ROOMS_LIST = ["101", "102", "108", "201", "204", "215", "301", "303", "312", "401"];

export default function CalendarPage() {
  const [selected, setSelected] = useState<typeof BOOKINGS[0] | null>(null);

  return (
    <div style={{ padding: "28px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--txt)" }}>კალენდარი</h1>
          <p style={{ fontSize: 13, color: "var(--txt3)", marginTop: 2 }}>ივნისი 2026 &middot; კვირის ხედი</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid var(--bdr)", background: "var(--panel)", cursor: "pointer", color: "var(--txt2)", display: "flex", alignItems: "center" }}><CaretLeft size={14} /></button>
          <button style={{ padding: "7px 16px", borderRadius: 8, border: "1px solid var(--bdr)", background: "var(--panel)", cursor: "pointer", color: "var(--txt2)", fontSize: 13 }}>დღეს</button>
          <button style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid var(--bdr)", background: "var(--panel)", cursor: "pointer", color: "var(--txt2)", display: "flex", alignItems: "center" }}><CaretRight size={14} /></button>
        </div>
      </div>

      <div style={{ background: "var(--panel)", border: "1px solid var(--bdr)", borderRadius: 12, overflow: "auto" }}>
        {/* Header row */}
        <div style={{ display: "grid", gridTemplateColumns: "80px repeat(8, 1fr)", borderBottom: "1px solid var(--bdr)" }}>
          <div style={{ padding: "10px 12px", fontSize: 11, fontWeight: 600, color: "var(--txt3)" }}>ოთახი</div>
          {WEEK_LABELS.map((d, i) => (
            <div key={d} style={{ padding: "10px 8px", textAlign: "center", fontSize: 11, fontWeight: 600, color: WEEK_DAYS[i] === 28 ? "var(--acc)" : "var(--txt3)", borderLeft: "1px solid var(--bdr)", background: WEEK_DAYS[i] === 28 ? "rgba(16,185,129,.05)" : "transparent" }}>{d}</div>
          ))}
        </div>

        {/* Rows per room */}
        {ROOMS_LIST.map((room, ri) => (
          <div key={room} style={{ display: "grid", gridTemplateColumns: "80px repeat(8, 1fr)", borderBottom: ri < ROOMS_LIST.length - 1 ? "1px solid var(--bdr)" : "none", minHeight: 40, position: "relative" }}>
            <div style={{ padding: "10px 12px", fontSize: 12, fontWeight: 600, color: "var(--txt2)", fontFamily: "monospace", display: "flex", alignItems: "center" }}>{room}</div>
            {WEEK_DAYS.map((day, di) => {
              const booking = BOOKINGS.find(b => b.room === room && day >= b.start && day < b.end);
              const isStart = booking && day === booking.start;
              const isEnd   = booking && day === booking.end - 1;
              return (
                <div
                  key={di}
                  onClick={() => booking && isStart && setSelected(booking)}
                  style={{
                    borderLeft: "1px solid var(--bdr)",
                    background: WEEK_DAYS[di] === 28 ? "rgba(16,185,129,.03)" : "transparent",
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
        <div onClick={() => setSelected(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--panel)", borderRadius: 16, padding: 24, width: 320, boxShadow: "0 20px 60px rgba(0,0,0,.2)" }}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: selected.color, marginBottom: 16 }} />
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--txt)", marginBottom: 4 }}>{selected.guest}</div>
            <div style={{ fontSize: 13, color: "var(--txt3)", marginBottom: 16 }}>ოთახი {selected.room} &middot; {selected.id}</div>
            <div style={{ fontSize: 13, color: "var(--txt2)", marginBottom: 4 }}>ივნ {selected.start} &rarr; ივნ {selected.end}</div>
            <button onClick={() => setSelected(null)} style={{ marginTop: 16, width: "100%", padding: "9px 0", borderRadius: 8, border: "none", background: "var(--bg)", fontSize: 13, color: "var(--txt2)", cursor: "pointer" }}>დახურვა</button>
          </div>
        </div>
      )}
    </div>
  );
}
