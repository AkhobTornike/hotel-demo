"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import Modal from "@/components/Modal";
import { Badge, PageHeader } from "@/components/ui";
import { useHotel } from "@/contexts/HotelContext";
import { RESERVATION_BAR, RESERVATION_STATUS, ROOM_STATUS, gel, type Reservation } from "@/lib/data";
import {
  TODAY, addDays, addMonths, coversNight, daysBetween, daysInMonth,
  dowLabel, fmtLong, fmtShort, parse, range, startOfMonth,
} from "@/lib/dates";

type RangeKey = "week" | "fortnight" | "month";

/** All three ranges render the same room × date grid — only the column count
 *  and column width change, so the layout never shifts under the user. */
const RANGES: Record<RangeKey, { label: string; minCol: number }> = {
  week:      { label: "კვირა",   minCol: 68 },
  fortnight: { label: "2 კვირა", minCol: 50 },
  month:     { label: "თვე",     minCol: 38 },
};

/** Tape-chart density: rows are scanned, not read. */
const ROW_H = 32;
const ROOM_COL = 96;
/** One weekend tint everywhere — header and body were drifting apart. */
const WEEKEND_TINT = "rgba(15,23,42,.03)";
/** Below this bar width a Georgian guest name renders as pure ellipsis. */
const NAME_MIN = 92;

export default function CalendarPage() {
  const { hotel } = useHotel();
  const [rangeKey, setRangeKey] = useState<RangeKey>("week");
  const [anchor, setAnchor] = useState(TODAY);
  const [selectedDay, setSelectedDay] = useState(TODAY);
  const [selected, setSelected] = useState<Reservation | null>(null);

  const guestName = (id: string) => hotel.guests.find((g) => g.id === id)?.name ?? "—";

  /* Rolling window starting at the anchor — a front desk cares about today and the
     days ahead, not about where the ISO week happens to begin. Month is the exception:
     "თვე" means the actual calendar month. */
  const days = useMemo(() => {
    if (rangeKey === "month") return range(startOfMonth(anchor), daysInMonth(anchor));
    return range(anchor, rangeKey === "week" ? 7 : 14);
  }, [rangeKey, anchor]);

  const first = days[0];
  const last = days[days.length - 1];
  const windowEnd = addDays(last, 1);

  const bookings = useMemo(
    () => hotel.reservations.filter((r) => r.status !== "cancel" && r.checkin < windowEnd && r.checkout > first),
    [hotel.reservations, windowEnd, first],
  );

  function step(dir: number) {
    setAnchor((a) =>
      rangeKey === "month" ? addMonths(a, dir) : addDays(a, dir * (rangeKey === "week" ? 7 : 14)),
    );
  }

  function goToday() {
    setAnchor(TODAY);
    setSelectedDay(TODAY);
  }

  // Keyboard: ← → move the window, T jumps back to today. Inert while a modal is
  // open or the user is typing.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (selected) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
      else if (e.key.toLowerCase() === "t") goToday();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // step/goToday close over rangeKey only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rangeKey, selected]);

  /* Day detail — recomputed for whichever column is selected. */
  const { arrivalList, departureList, inHouse, load } = useMemo(() => {
    const active = hotel.reservations.filter((r) => r.status !== "cancel");
    const staying = active.filter((r) => coversNight(selectedDay, r.checkin, r.checkout)).length;
    return {
      arrivalList: active.filter((r) => r.checkin === selectedDay),
      departureList: active.filter((r) => r.checkout === selectedDay),
      inHouse: staying,
      load: hotel.rooms.length ? Math.round((staying / hotel.rooms.length) * 100) : 0,
    };
  }, [hotel.reservations, hotel.rooms.length, selectedDay]);
  const arrivals = arrivalList.length;
  const departures = departureList.length;

  /** Per-day in-house count — turns the month range's empty field into a load curve. */
  const loadByDay = useMemo(
    () =>
      days.map((d) => bookings.filter((b) => coversNight(d, b.checkin, b.checkout)).length),
    [days, bookings],
  );

  const minWidth = days.length * RANGES[rangeKey].minCol;

  /* In month range the strip is wider than the panel, so bring the selected day
     into view — but only when it is actually off-screen, so clicking a visible
     column never yanks the scroll position. */
  const scrollRef = useRef<HTMLDivElement>(null);

  /* Actual rendered column width. minCol is only the true width when the strip
     overflows, so deciding what fits in a bar from that constant misfires at
     wide viewports. Measure it instead. */
  const [colW, setColW] = useState(RANGES.week.minCol);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const measure = () =>
      setColW(Math.max(RANGES[rangeKey].minCol, (el.clientWidth - ROOM_COL) / days.length));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [rangeKey, days.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const idx = days.indexOf(selectedDay);
    if (idx < 0) return;
    const colW = (el.scrollWidth - ROOM_COL) / days.length;
    const colLeft = ROOM_COL + idx * colW;
    const viewLeft = el.scrollLeft + ROOM_COL;
    const viewRight = el.scrollLeft + el.clientWidth;
    if (colLeft >= viewLeft && colLeft + colW <= viewRight) return;
    el.scrollLeft = Math.max(0, colLeft - (el.clientWidth - ROOM_COL) / 2 - ROOM_COL + colW / 2);
  }, [rangeKey, anchor, selectedDay, days]);

  return (
    <div style={{ padding: "28px 24px" }}>
      <PageHeader
        title="კალენდარი"
        sub={`${fmtShort(first)} — ${fmtShort(last)} · ${hotel.name}`}
        action={
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", background: "var(--panel)", border: "1px solid var(--bdr)", borderRadius: 8, padding: 2 }}>
              {(Object.keys(RANGES) as RangeKey[]).map((k) => (
                <button
                  key={k}
                  onClick={() => setRangeKey(k)}
                  style={{
                    padding: "5px 13px", borderRadius: 6, border: "none", cursor: "pointer",
                    fontSize: 12, fontWeight: 500, transition: "background 120ms, color 120ms",
                    background: rangeKey === k ? "var(--txt)" : "transparent",
                    color: rangeKey === k ? "#fff" : "var(--txt2)",
                  }}
                >
                  {RANGES[k].label}
                </button>
              ))}
            </div>

            <input
              type="date"
              value={selectedDay}
              onChange={(e) => { if (e.target.value) { setSelectedDay(e.target.value); setAnchor(e.target.value); } }}
              style={{
                padding: "6px 10px", borderRadius: 6, border: "1px solid var(--bdr)",
                background: "var(--panel)", color: "var(--txt2)", fontSize: 12,
                fontFamily: "var(--mono)", outline: "none",
              }}
            />

            <button onClick={() => step(-1)} style={navBtn} title="წინა (←)"><CaretLeft size={14} /></button>
            <button
              onClick={goToday}
              title="დღეს (T)"
              style={{
                ...navBtn, padding: "7px 14px", fontSize: 12, fontWeight: 500,
                borderColor: anchor === TODAY ? "var(--acc)" : "var(--bdr)",
                background: anchor === TODAY ? "var(--acc-s)" : "var(--panel)",
                color: anchor === TODAY ? "var(--acc-txt)" : "var(--txt2)",
              }}
            >
              დღეს
            </button>
            <button onClick={() => step(1)} style={navBtn} title="შემდეგი (→)"><CaretRight size={14} /></button>
          </div>
        }
      />

      {/* Selected-day summary — appears in place, never replaces the grid */}
      <div style={{
        display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap",
        background: "var(--panel)", border: "1px solid var(--bdr)", borderRadius: 10,
        padding: "12px 18px", marginBottom: 12,
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ width: 3, height: 26, borderRadius: 2, background: "var(--acc)", display: "inline-block", alignSelf: "center" }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--txt)" }}>{fmtLong(selectedDay)}</span>
          <span style={{ fontSize: 12, color: "var(--txt3)" }}>{dowLabel(selectedDay)}</span>
        </div>
        <div style={{ display: "flex", gap: 22, marginLeft: "auto", flexWrap: "wrap" }}>
          <Metric label="ჩამოსვლა" value={arrivals} tone={arrivals ? "var(--acc)" : undefined} />
          <Metric label="გამგზავრება" value={departures} tone={departures ? "var(--amb)" : undefined} />
          <Metric label="სასტუმროში" value={inHouse} />
          <Metric label="დატვირთვა" value={`${load}%`} />
        </div>
      </div>

      {/* Tape chart */}
      <div ref={scrollRef} role="grid" aria-label="ოთახების დაკავებულობა" style={{
        background: "var(--panel)", border: "1px solid var(--bdr)", borderRadius: 12,
        overflowX: "auto",
      }}>
        <div style={{ minWidth: ROOM_COL + minWidth }}>
          {/* Header */}
          <div role="row" style={{ display: "flex", height: 34, borderBottom: "1px solid var(--bdr)", flexShrink: 0 }}>
            <div style={{
              ...stickyCell, width: ROOM_COL, display: "flex", alignItems: "center", padding: "0 12px",
              fontSize: 10, fontWeight: 600, color: "var(--txt3)", textTransform: "uppercase", letterSpacing: ".06em",
            }}>
              ოთახი
            </div>
            <div style={{ flex: 1, display: "grid", gridTemplateColumns: `repeat(${days.length}, 1fr)` }}>
              {days.map((d, i) => {
                const dow = parse(d).getUTCDay();
                const weekend = dow === 0 || dow === 6;
                const isToday = d === TODAY;
                const isSel = d === selectedDay;
                return (
                  <button
                    key={d}
                    className="cal-day"
                    onClick={() => setSelectedDay(d)}
                    title={fmtLong(d)}
                    aria-label={`${fmtLong(d)}${isToday ? " — დღეს" : ""}`}
                    role="columnheader"
                    aria-selected={isSel}
                    style={{
                      border: "none", borderLeft: i === 0 ? "none" : "1px solid var(--bdr)", cursor: "pointer",
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                      gap: 1, padding: 0,
                      // Selected = fill. Today = top rule. Two meanings, two signals.
                      background: isSel ? "var(--acc-s)" : weekend ? WEEKEND_TINT : "transparent",
                      boxShadow: isToday ? "inset 0 2px 0 var(--acc)" : "none",
                    }}
                  >
                    <span style={{ fontSize: 9, color: isSel ? "var(--acc-txt)" : "var(--txt3)", lineHeight: 1 }}>
                      {dowLabel(d)}
                    </span>
                    <span style={{
                      fontSize: 12, lineHeight: 1, fontFamily: "var(--mono)",
                      fontWeight: isToday || isSel ? 700 : 500,
                      color: isSel ? "var(--acc-txt)" : isToday ? "var(--acc)" : "var(--txt2)",
                    }}>
                      {Number(d.slice(8))}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* One flex row per room — the left cell is sticky, so both halves
              always share a height and the rows stretch to fill the panel. */}
          {hotel.rooms.map((room, ri) => {
            const rowBookings = bookings.filter((b) => b.room === room.id);
            const actionable = room.status === "cleaning" || room.status === "maint";
            return (
              <div key={room.id} role="row" style={{
                display: "flex", height: ROW_H, flexShrink: 0,
                borderBottom: ri < hotel.rooms.length - 1 ? "1px solid var(--bdr)" : "none",
              }}>
                <div
                  role="rowheader"
                  style={{ ...stickyCell, width: ROOM_COL, display: "flex", alignItems: "center", gap: 6, padding: "0 12px 0 10px" }}
                  title={`${room.type} · ${ROOM_STATUS[room.status].label} · ${room.capacity} სტუმარი`}
                >
                  {/* Only the states someone can act on get a mark — "occupied" is
                      normal and is already visible as a bar in this very row. */}
                  <span style={{
                    width: 3, height: 16, borderRadius: 2, flexShrink: 0,
                    background: actionable ? ROOM_STATUS[room.status].dot : "transparent",
                  }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--txt2)", fontFamily: "var(--mono)" }}>{room.id}</span>
                  <span style={{ fontSize: 10, color: "var(--txt3)", marginLeft: "auto", fontFamily: "var(--mono)" }}>
                    ×{room.capacity}
                  </span>
                </div>

                <div role="gridcell" style={{ flex: 1, position: "relative" }}>
                  <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: `repeat(${days.length}, 1fr)` }}>
                    {days.map((d, i) => {
                      const dow = parse(d).getUTCDay();
                      const weekend = dow === 0 || dow === 6;
                      return (
                        <div key={d} style={{
                          borderLeft: i === 0 ? "none" : "1px solid var(--bdr)",
                          background: d === selectedDay ? "var(--acc-s)" : weekend ? WEEKEND_TINT : "transparent",
                        }} />
                      );
                    })}
                  </div>

                  {rowBookings.map((b) => {
                    const startIdx = Math.max(0, daysBetween(first, b.checkin));
                    const endIdx = Math.min(days.length, daysBetween(first, b.checkout));
                    const span = endIdx - startIdx;
                    if (span <= 0) return null;
                    const clippedStart = b.checkin < first;
                    const clippedEnd = b.checkout > windowEnd;
                    const tone = RESERVATION_BAR[b.status] ?? RESERVATION_BAR.ok;
                    const nights = daysBetween(b.checkin, b.checkout);
                    // Georgian names run ~9 glyphs; under ~92px the label is all ellipsis,
                    // so drop it rather than print an ambiguous bare number. The name stays
                    // in the tooltip and the accessible name.
                    const label = span * colW >= NAME_MIN ? guestName(b.guestId) : "";
                    return (
                      <button
                        key={b.id}
                        className="cal-bar"
                        onClick={() => setSelected(b)}
                        title={`${guestName(b.guestId)} · ოთახი ${b.room} · ${fmtShort(b.checkin)} → ${fmtShort(b.checkout)} · ${nights} ღამე`}
                        aria-label={`${guestName(b.guestId)}, ოთახი ${b.room}, ${fmtShort(b.checkin)} — ${fmtShort(b.checkout)}, ${RESERVATION_STATUS[b.status].label}`}
                        style={{
                          position: "absolute", top: 4, bottom: 4,
                          left: `calc(${(startIdx / days.length) * 100}% + 2px)`,
                          width: `calc(${(span / days.length) * 100}% - 4px)`,
                          background: tone.bg,
                          border: "1px solid rgba(15,23,42,.09)",
                          boxShadow: clippedStart ? "none" : `inset 4px 0 0 ${tone.rule}`,
                          cursor: "pointer",
                          borderTopLeftRadius: clippedStart ? 0 : 6,
                          borderBottomLeftRadius: clippedStart ? 0 : 6,
                          borderTopRightRadius: clippedEnd ? 0 : 6,
                          borderBottomRightRadius: clippedEnd ? 0 : 6,
                          color: tone.txt, fontSize: 11, fontWeight: 600,
                          display: "flex", alignItems: "center",
                          padding: clippedStart ? "0 6px" : "0 6px 0 10px",
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        }}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Load curve — makes the wide month range carry a signal instead of white space. */}
          <div role="row" style={{ display: "flex", height: 26, borderTop: "1px solid var(--bdr-s)", background: "var(--bg)" }}>
            <div style={{ ...stickyCell, background: "var(--bg)", width: ROOM_COL, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 10, color: "var(--txt3)" }}>
              დატვირთვა
            </div>
            <div style={{ flex: 1, display: "grid", gridTemplateColumns: `repeat(${days.length}, 1fr)` }}>
              {days.map((d, i) => {
                const n = loadByDay[i];
                const pct = hotel.rooms.length ? n / hotel.rooms.length : 0;
                return (
                  <div
                    key={d}
                    title={`${fmtShort(d)} · ${n}/${hotel.rooms.length}`}
                    style={{
                      borderLeft: i === 0 ? "none" : "1px solid var(--bdr)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 10, fontWeight: 700, fontFamily: "var(--mono)",
                      color: n ? "var(--txt2)" : "var(--txt3)",
                      background: n ? `rgba(16,185,129,${0.06 + pct * 0.3})` : "transparent",
                    }}
                  >
                    {n || ""}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* The 08:00 list. Follows the selected column, so the tape stays the
          navigation and this stays the detail. */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
        <DayList
          title="ჩამოსვლა"
          count={arrivals}
          rule="#059669"
          items={arrivalList}
          guestName={guestName}
          onPick={setSelected}
          empty="ჩამოსვლა არ არის"
        />
        <DayList
          title="გამგზავრება"
          count={departures}
          rule="#D97706"
          items={departureList}
          guestName={guestName}
          onPick={setSelected}
          empty="გამგზავრება არ არის"
        />
      </div>

      <div style={{ marginTop: 12, fontSize: 11, color: "var(--txt3)" }}>
        <Kbd>←</Kbd> <Kbd>→</Kbd> ნავიგაცია &middot; <Kbd>T</Kbd> დღეს
      </div>

      {selected && (
        <Modal onClose={() => setSelected(null)} width={380}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: (RESERVATION_BAR[selected.status] ?? RESERVATION_BAR.ok).rule, marginBottom: 16 }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 4 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--txt)" }}>{guestName(selected.guestId)}</div>
            <Badge tone={RESERVATION_STATUS[selected.status]}>{RESERVATION_STATUS[selected.status].label}</Badge>
          </div>
          <div style={{ fontSize: 12, color: "var(--txt3)", marginBottom: 16 }}>
            ოთახი {selected.room} &middot; {selected.id} &middot; {selected.source}
          </div>
          <div style={{ background: "var(--bg)", borderRadius: 10, padding: 14, display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
            <Row k="Check-in" v={`${fmtShort(selected.checkin)} · ${dowLabel(selected.checkin)}`} />
            <Row k="Check-out" v={`${fmtShort(selected.checkout)} · ${dowLabel(selected.checkout)}`} />
            <Row k="ღამეები" v={String(daysBetween(selected.checkin, selected.checkout))} />
            <Row k="ჯამი" v={gel(selected.total)} />
          </div>
          <button onClick={() => setSelected(null)} style={{ marginTop: 16, width: "100%", padding: "9px 0", borderRadius: 6, border: "none", background: "var(--bg)", fontSize: 13, color: "var(--txt2)", cursor: "pointer" }}>
            დახურვა
          </button>
        </Modal>
      )}
    </div>
  );
}

function DayList({
  title, count, rule, items, guestName, onPick, empty,
}: {
  title: string;
  count: number;
  rule: string;
  items: Reservation[];
  guestName: (id: string) => string;
  onPick: (r: Reservation) => void;
  empty: string;
}) {
  return (
    <div style={{ background: "var(--panel)", border: "1px solid var(--bdr)", borderRadius: 10, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderBottom: "1px solid var(--bdr)" }}>
        <span style={{ width: 3, height: 12, borderRadius: 2, background: rule }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--txt)" }}>{title}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--txt3)", fontFamily: "var(--mono)", marginLeft: "auto" }}>
          {count}
        </span>
      </div>
      {items.length === 0 ? (
        <div style={{ padding: "16px 14px", fontSize: 12, color: "var(--txt3)" }}>{empty}</div>
      ) : (
        items.map((r, i) => (
          <button
            key={r.id}
            className="cal-row"
            onClick={() => onPick(r)}
            style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left",
              padding: "9px 14px", background: "transparent", border: "none", cursor: "pointer",
              borderTop: i > 0 ? "1px solid var(--bdr)" : "none",
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--txt2)", fontFamily: "var(--mono)", width: 44 }}>
              {r.room}
            </span>
            <span style={{ fontSize: 13, color: "var(--txt)", flex: 1, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {guestName(r.guestId)}
            </span>
            <span style={{ fontSize: 11, color: "var(--txt3)" }}>{r.source}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--txt)", fontFamily: "var(--mono)" }}>{gel(r.total)}</span>
          </button>
        ))
      )}
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: number | string; tone?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <span style={{ fontSize: 10, color: "var(--txt3)", textTransform: "uppercase", letterSpacing: ".05em" }}>{label}</span>
      <span style={{ fontSize: 18, fontWeight: 700, fontFamily: "var(--mono)", color: tone ?? "var(--txt)", lineHeight: 1.1 }}>
        {value}
      </span>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ color: "var(--txt3)" }}>{k}</span>
      <span style={{ fontWeight: 500, color: "var(--txt)", fontFamily: "var(--mono)" }}>{v}</span>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd style={{
      fontFamily: "var(--mono)", fontSize: 10, padding: "1px 5px", borderRadius: 4,
      border: "1px solid var(--bdr-s)", background: "var(--panel)", color: "var(--txt2)",
    }}>
      {children}
    </kbd>
  );
}

/** Left room cell — pinned while the date columns scroll sideways. */
const stickyCell: React.CSSProperties = {
  position: "sticky",
  left: 0,
  zIndex: 2,
  flexShrink: 0,
  background: "var(--panel)",
  borderRight: "1px solid var(--bdr-s)",
};

const navBtn: React.CSSProperties = {
  padding: "7px 11px", borderRadius: 6, border: "1px solid var(--bdr)",
  background: "var(--panel)", cursor: "pointer", color: "var(--txt2)",
  display: "flex", alignItems: "center",
};
