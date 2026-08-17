"use client";

import { useMemo } from "react";
import { PageHeader, Panel } from "@/components/ui";
import { useHotel } from "@/contexts/HotelContext";
import { gel } from "@/lib/data";
import { daysBetween } from "@/lib/dates";

export default function ReportsPage() {
  const { hotel } = useHotel();
  const maxRevenue = Math.max(...hotel.monthly.map((m) => m.revenue));

  /** Revenue per room, derived from the booking list rather than hardcoded. */
  const topRooms = useMemo(() => {
    const byRoom = new Map<string, { revenue: number; nights: number }>();
    for (const r of hotel.reservations) {
      if (r.status === "cancel") continue;
      const cur = byRoom.get(r.room) ?? { revenue: 0, nights: 0 };
      cur.revenue += r.total;
      cur.nights += daysBetween(r.checkin, r.checkout);
      byRoom.set(r.room, cur);
    }
    return [...byRoom.entries()]
      .map(([room, v]) => ({ room, ...v, type: hotel.rooms.find((x) => x.id === room)?.type ?? "—" }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6);
  }, [hotel.reservations, hotel.rooms]);

  const bySource = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of hotel.reservations) {
      if (r.status === "cancel") continue;
      m.set(r.source, (m.get(r.source) ?? 0) + 1);
    }
    const total = [...m.values()].reduce((a, b) => a + b, 0) || 1;
    return [...m.entries()]
      .map(([source, n]) => ({ source, n, pct: Math.round((n / total) * 100) }))
      .sort((a, b) => b.n - a.n);
  }, [hotel.reservations]);

  return (
    <div style={{ padding: "28px 24px" }}>
      <PageHeader title="ანგარიშები" sub={`2026 წლის სტატისტიკა · ${hotel.name}`} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "წლის შემოსავალი", value: gel(hotel.yearly.revenue), delta: "+18%" },
          { label: "სულ ჯავშნები", value: String(hotel.yearly.bookings), delta: "+22%" },
          { label: "Avg occupancy", value: hotel.yearly.occupancy, delta: "+9pp" },
          { label: "RevPAR", value: hotel.yearly.revpar, delta: "+14%" },
        ].map((k) => (
          <div key={k.label} style={{ background: "var(--panel)", border: "1px solid var(--bdr)", borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ fontSize: 12, color: "var(--txt3)", marginBottom: 8 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "var(--txt)", marginBottom: 4 }}>{k.value}</div>
            <div style={{ fontSize: 12, color: "var(--acc-txt)", background: "var(--acc-s)", display: "inline-block", padding: "1px 7px", borderRadius: 999, fontWeight: 600 }}>
              {k.delta} vs 2025
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16 }}>
        <div style={{ background: "var(--panel)", border: "1px solid var(--bdr)", borderRadius: 12, padding: 24 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--txt)", marginBottom: 20 }}>ყოველთვიური შემოსავალი (₾)</h2>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 180 }}>
            {hotel.monthly.map((m) => (
              <div key={m.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ fontSize: 10, color: "var(--txt3)", fontWeight: 600 }}>{(m.revenue / 1000).toFixed(0)}k</div>
                <div style={{ width: "100%", background: "#10B981", borderRadius: "6px 6px 0 0", height: `${(m.revenue / maxRevenue) * 150}px`, transition: "height 600ms" }} />
                <div style={{ fontSize: 11, color: "var(--txt3)" }}>{m.month}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 16, borderTop: "1px solid var(--bdr)", paddingTop: 12 }}>
            {hotel.monthly.map((m) => (
              <div key={m.month} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--txt)" }}>{m.occupancy}%</div>
                <div style={{ fontSize: 10, color: "var(--txt3)" }}>occ.</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Panel title="Top ოთახები" pad>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {topRooms.map((r, i) => (
                <div key={r.room} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: i === 0 ? "#F59E0B" : "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: i === 0 ? "#fff" : "var(--txt3)", flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--txt)" }}>ოთახი {r.room} &middot; {r.type}</div>
                    <div style={{ fontSize: 11, color: "var(--txt3)" }}>{r.nights} ღამე</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--txt)" }}>{gel(r.revenue)}</div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="ჯავშნის არხები" pad>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {bySource.map((s) => (
                <div key={s.source}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: "var(--txt2)" }}>{s.source}</span>
                    <span style={{ color: "var(--txt3)" }}>{s.n} &middot; {s.pct}%</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: "var(--bg)", overflow: "hidden" }}>
                    <div style={{ width: `${s.pct}%`, height: "100%", background: "var(--acc)", borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
