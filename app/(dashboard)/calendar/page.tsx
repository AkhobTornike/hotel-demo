"use client";

import { useMemo, useState } from "react";
import { CaretLeft, CaretRight, ArrowRight, ArrowLeft } from "@phosphor-icons/react";
import Modal from "@/components/Modal";
import { Badge, PageHeader, Panel, Empty } from "@/components/ui";
import { useHotel } from "@/contexts/HotelContext";
import { RESERVATION_STATUS, gel, type Reservation } from "@/lib/data";
import {
  TODAY, GEO_DOW, addDays, addMonths, coversNight, daysBetween, dowLabel,
  fmtLong, fmtMonth, fmtShort, monthGrid, range, sameMonth, startOfMonth, startOfWeek,
} from "@/lib/dates";

type View = "day" | "week" | "month";

const VIEWS: { key: View; label: string }[] = [
  { key: "day", label: "დღე" },
  { key: "week", label: "კვირა" },
  { key: "month", label: "თვე" },
];

export default function CalendarPage() {
  const { hotel } = useHotel();
  const [view, setView] = useState<View>("week");
  const [anchor, setAnchor] = useState(TODAY);
  const [selected, setSelected] = useState<Reservation | null>(null);

  const guestName = (id: string) => hotel.guests.find((g) => g.id === id)?.name ?? "—";

  /** Bookings that occupy at least one night in [from, to). */
  const bookingsIn = useMemo(
    () => (from: string, to: string) =>
      hotel.reservations.filter(
        (r) => r.status !== "cancel" && r.checkin < to && r.checkout > from,
      ),
    [hotel.reservations],
  );

  function step(dir: number) {
    if (view === "day") setAnchor((a) => addDays(a, dir));
    else if (view === "week") setAnchor((a) => addDays(a, dir * 7));
    else setAnchor((a) => addMonths(a, dir));
  }

  const heading =
    view === "day" ? fmtLong(anchor) + " — " + dowLabel(anchor)
    : view === "month" ? fmtMonth(anchor)
    : `${fmtShort(startOfWeek(anchor))} — ${fmtShort(addDays(startOfWeek(anchor), 6))}`;

  return (
    <div style={{ padding: "28px 24px" }}>
      <PageHeader
        title="კალენდარი"
        sub={`${heading} · ${hotel.name}`}
        action={
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            {/* View switch */}
            <div style={{ display: "flex", background: "var(--panel)", border: "1px solid var(--bdr)", borderRadius: 8, padding: 2 }}>
              {VIEWS.map((v) => (
                <button
                  key={v.key}
                  onClick={() => setView(v.key)}
                  style={{
                    padding: "5px 14px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 500,
                    background: view === v.key ? "var(--txt)" : "transparent",
                    color: view === v.key ? "#fff" : "var(--txt2)",
                  }}
                >
                  {v.label}
                </button>
              ))}
            </div>

            {/* Exact date picker */}
            <input
              type="date"
              value={anchor}
              onChange={(e) => e.target.value && setAnchor(e.target.value)}
              style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid var(--bdr)", background: "var(--panel)", color: "var(--txt2)", fontSize: 12, outline: "none" }}
            />

            <button onClick={() => step(-1)} style={navBtn}><CaretLeft size={14} /></button>
            <button
              onClick={() => setAnchor(TODAY)}
              style={{
                ...navBtn, padding: "7px 14px", fontSize: 13,
                borderColor: anchor === TODAY ? "var(--acc)" : "var(--bdr)",
                background: anchor === TODAY ? "var(--acc-s)" : "var(--panel)",
                color: anchor === TODAY ? "var(--acc-txt)" : "var(--txt2)",
              }}
            >
              დღეს
            </button>
            <button onClick={() => step(1)} style={navBtn}><CaretRight size={14} /></button>
          </div>
        }
      />

      {view === "day" && <DayView hotel={hotel} day={anchor} guestName={guestName} onPick={setSelected} />}
      {view === "week" && (
        <WeekView
          rooms={hotel.rooms.map((r) => r.id)}
          days={range(startOfWeek(anchor), 7)}
          bookings={bookingsIn(startOfWeek(anchor), addDays(startOfWeek(anchor), 7))}
          guestName={guestName}
          onPick={setSelected}
        />
      )}
      {view === "month" && (
        <MonthView
          anchor={anchor}
          rooms={hotel.rooms.length}
          bookingsIn={bookingsIn}
          onPickDay={(d) => { setAnchor(d); setView("day"); }}
        />
      )}

      {selected && (
        <Modal onClose={() => setSelected(null)} width={380}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: selected.color, marginBottom: 16 }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 4 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--txt)" }}>{guestName(selected.guestId)}</div>
            <Badge tone={RESERVATION_STATUS[selected.status]}>{RESERVATION_STATUS[selected.status].label}</Badge>
          </div>
          <div style={{ fontSize: 12, color: "var(--txt3)", marginBottom: 16 }}>
            ოთახი {selected.room} &middot; {selected.id} &middot; {selected.source}
          </div>
          <div style={{ background: "var(--bg)", borderRadius: 10, padding: 14, display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
            <Row k="Check-in" v={`${fmtShort(selected.checkin)} (${dowLabel(selected.checkin)})`} />
            <Row k="Check-out" v={`${fmtShort(selected.checkout)} (${dowLabel(selected.checkout)})`} />
            <Row k="ღამეები" v={String(daysBetween(selected.checkin, selected.checkout))} />
            <Row k="ჯამი" v={gel(selected.total)} />
          </div>
          <button onClick={() => setSelected(null)} style={{ marginTop: 16, width: "100%", padding: "9px 0", borderRadius: 8, border: "none", background: "var(--bg)", fontSize: 13, color: "var(--txt2)", cursor: "pointer" }}>
            დახურვა
          </button>
        </Modal>
      )}
    </div>
  );
}

const navBtn: React.CSSProperties = {
  padding: "7px 12px", borderRadius: 8, border: "1px solid var(--bdr)",
  background: "var(--panel)", cursor: "pointer", color: "var(--txt2)",
  display: "flex", alignItems: "center",
};

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ color: "var(--txt3)" }}>{k}</span>
      <span style={{ fontWeight: 500, color: "var(--txt)" }}>{v}</span>
    </div>
  );
}

/* ── Day: arrivals, departures and who is staying ── */

function DayView({
  hotel, day, guestName, onPick,
}: {
  hotel: ReturnType<typeof useHotel>["hotel"];
  day: string;
  guestName: (id: string) => string;
  onPick: (r: Reservation) => void;
}) {
  const active = hotel.reservations.filter((r) => r.status !== "cancel");
  const arrivals = active.filter((r) => r.checkin === day);
  const departures = active.filter((r) => r.checkout === day);
  const staying = active.filter((r) => coversNight(day, r.checkin, r.checkout) && r.checkin !== day);
  const occupancy = active.filter((r) => coversNight(day, r.checkin, r.checkout)).length;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        <Stat label="დაკავებული" value={`${occupancy}/${hotel.rooms.length}`} />
        <Stat label="ჩამოსვლა" value={String(arrivals.length)} color="var(--acc)" />
        <Stat label="გამგზავრება" value={String(departures.length)} color="var(--amb)" />
        <Stat label="დატვირთვა" value={`${Math.round((occupancy / hotel.rooms.length) * 100)}%`} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Panel title="ჩამოსვლა (Check-in)" pad>
          <List items={arrivals} guestName={guestName} onPick={onPick} icon={<ArrowRight size={13} color="#10B981" />} empty="ამ დღეს ჩამოსვლა არ არის" />
        </Panel>
        <Panel title="გამგზავრება (Check-out)" pad>
          <List items={departures} guestName={guestName} onPick={onPick} icon={<ArrowLeft size={13} color="#F59E0B" />} empty="ამ დღეს გამგზავრება არ არის" />
        </Panel>
      </div>

      <Panel title={`სასტუმროში (${staying.length})`} pad>
        <List items={staying} guestName={guestName} onPick={onPick} empty="ამ ღამეს სტუმრები არ არიან" />
      </Panel>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ background: "var(--panel)", border: "1px solid var(--bdr)", borderRadius: 12, padding: "16px 18px" }}>
      <div style={{ fontSize: 12, color: "var(--txt3)", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: color ?? "var(--txt)" }}>{value}</div>
    </div>
  );
}

function List({
  items, guestName, onPick, icon, empty,
}: {
  items: Reservation[];
  guestName: (id: string) => string;
  onPick: (r: Reservation) => void;
  icon?: React.ReactNode;
  empty: string;
}) {
  if (items.length === 0) return <Empty>{empty}</Empty>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((r) => (
        <button
          key={r.id}
          onClick={() => onPick(r)}
          style={{
            display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left",
            background: "var(--bg)", border: "1px solid var(--bdr)", borderRadius: 10,
            padding: "10px 12px", cursor: "pointer",
          }}
        >
          <span style={{ width: 4, height: 28, borderRadius: 2, background: r.color, flexShrink: 0 }} />
          {icon}
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--txt)" }}>{guestName(r.guestId)}</span>
            <span style={{ display: "block", fontSize: 11, color: "var(--txt3)" }}>ოთახი {r.room} &middot; {r.id}</span>
          </span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--txt)" }}>{gel(r.total)}</span>
        </button>
      ))}
    </div>
  );
}

/* ── Week: room × day grid ── */

function WeekView({
  rooms, days, bookings, guestName, onPick,
}: {
  rooms: string[];
  days: string[];
  bookings: Reservation[];
  guestName: (id: string) => string;
  onPick: (r: Reservation) => void;
}) {
  const cols = `88px repeat(${days.length}, 1fr)`;
  return (
    <div style={{ background: "var(--panel)", border: "1px solid var(--bdr)", borderRadius: 12, overflow: "auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: cols, borderBottom: "1px solid var(--bdr)" }}>
        <div style={{ padding: "10px 12px", fontSize: 11, fontWeight: 600, color: "var(--txt3)" }}>ოთახი</div>
        {days.map((d) => (
          <div key={d} style={{
            padding: "10px 8px", textAlign: "center", fontSize: 11, fontWeight: 600,
            color: d === TODAY ? "var(--acc)" : "var(--txt3)",
            borderLeft: "1px solid var(--bdr)",
            background: d === TODAY ? "rgba(16,185,129,.05)" : "transparent",
          }}>
            {GEO_DOW[new Date(d).getUTCDay()]} {Number(d.slice(8))}
          </div>
        ))}
      </div>

      {rooms.map((room, ri) => (
        <div key={room} style={{ display: "grid", gridTemplateColumns: cols, borderBottom: ri < rooms.length - 1 ? "1px solid var(--bdr)" : "none", minHeight: 40 }}>
          <div style={{ padding: "10px 12px", fontSize: 12, fontWeight: 600, color: "var(--txt2)", fontFamily: "monospace", display: "flex", alignItems: "center" }}>{room}</div>
          {days.map((day) => {
            const b = bookings.find((x) => x.room === room && coversNight(day, x.checkin, x.checkout));
            const isStart = b && (b.checkin === day || day === days[0]);
            const isLast = b && addDays(day, 1) === b.checkout;
            return (
              <div
                key={day}
                onClick={() => b && isStart && onPick(b)}
                style={{
                  borderLeft: "1px solid var(--bdr)",
                  background: day === TODAY ? "rgba(16,185,129,.03)" : "transparent",
                  padding: "4px 2px", display: "flex", alignItems: "center",
                  cursor: b && isStart ? "pointer" : "default",
                }}
              >
                {b && isStart && (
                  <div style={{
                    background: b.color, borderRadius: isLast ? 6 : "6px 0 0 6px",
                    padding: "3px 8px", fontSize: 11, fontWeight: 500, color: "#fff",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "100%",
                  }}>
                    {guestName(b.guestId)}
                  </div>
                )}
                {b && !isStart && (
                  <div style={{ background: b.color, opacity: 0.75, height: 24, width: "100%", borderRadius: isLast ? "0 6px 6px 0" : 0 }} />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* ── Month: occupancy heat grid, click a day to drill in ── */

function MonthView({
  anchor, rooms, bookingsIn, onPickDay,
}: {
  anchor: string;
  rooms: number;
  bookingsIn: (from: string, to: string) => Reservation[];
  onPickDay: (d: string) => void;
}) {
  const grid = monthGrid(anchor);
  const month = startOfMonth(anchor);

  return (
    <div style={{ background: "var(--panel)", border: "1px solid var(--bdr)", borderRadius: 12, padding: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginBottom: 6 }}>
        {["ორშ", "სამ", "ოთხ", "ხუთ", "პარ", "შაბ", "კვი"].map((d) => (
          <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 600, color: "var(--txt3)", padding: "4px 0" }}>{d}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
        {grid.map((day) => {
          const inMonth = sameMonth(day, month);
          const count = bookingsIn(day, addDays(day, 1)).length;
          const pct = rooms ? count / rooms : 0;
          return (
            <button
              key={day}
              onClick={() => onPickDay(day)}
              style={{
                aspectRatio: "1 / 1", borderRadius: 10, cursor: "pointer", padding: 8,
                display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-start",
                border: day === TODAY ? "1.5px solid var(--acc)" : "1px solid var(--bdr)",
                background: count ? `rgba(16,185,129,${0.08 + pct * 0.45})` : "var(--bg)",
                opacity: inMonth ? 1 : 0.35,
              }}
            >
              <span style={{ fontSize: 13, fontWeight: day === TODAY ? 700 : 500, color: "var(--txt)" }}>{Number(day.slice(8))}</span>
              {count > 0 && (
                <span style={{ fontSize: 10, color: "var(--txt2)", fontWeight: 600 }}>{count}/{rooms}</span>
              )}
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: 14, fontSize: 11, color: "var(--txt3)" }}>
        დააკლიკე დღეს დეტალური ხედისთვის &middot; ფერის სიმკვეთრე = დატვირთვა
      </div>
    </div>
  );
}
