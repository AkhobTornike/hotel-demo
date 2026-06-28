const MONTHLY = [
  { month: "იანვ", revenue: 18400, bookings: 62, occupancy: 54 },
  { month: "თებ",  revenue: 16200, bookings: 55, occupancy: 49 },
  { month: "მარ",  revenue: 21500, bookings: 74, occupancy: 65 },
  { month: "აპრ",  revenue: 24800, bookings: 88, occupancy: 74 },
  { month: "მაი",  revenue: 28300, bookings: 96, occupancy: 82 },
  { month: "ივნ",  revenue: 31200, bookings: 108, occupancy: 87 },
];

const TOP_ROOMS = [
  { room: "401", type: "პენტჰაუსი", revenue: "₾6,600", nights: 12 },
  { room: "301", type: "სუიტი",     revenue: "₾3,360", nights: 12 },
  { room: "302", type: "სუიტი",     revenue: "₾3,220", nights: 11 },
  { room: "203", type: "დელუქსი",  revenue: "₾1,760", nights: 11 },
  { room: "204", type: "სტანდარტი", revenue: "₾1,050", nights: 11 },
];

const maxRevenue = Math.max(...MONTHLY.map(m => m.revenue));

export default function ReportsPage() {
  return (
    <div style={{ padding: "28px 24px" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--txt)" }}>ანგარიშები</h1>
        <p style={{ fontSize: 13, color: "var(--txt3)", marginTop: 2 }}>2026 წლის სტატისტიკა</p>
      </div>

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "წლის შემოსავალი",  value: "₾140,400", delta: "+18%" },
          { label: "სულ ჯავშნები",     value: "483",       delta: "+22%" },
          { label: "Avg occupancy",     value: "68.5%",     delta: "+9pp" },
          { label: "RevPAR",            value: "₾61.4",     delta: "+14%" },
        ].map((k) => (
          <div key={k.label} style={{ background: "var(--panel)", border: "1px solid var(--bdr)", borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ fontSize: 12, color: "var(--txt3)", marginBottom: 8 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "var(--txt)", marginBottom: 4 }}>{k.value}</div>
            <div style={{ fontSize: 12, color: "#065F46", background: "rgba(16,185,129,.1)", display: "inline-block", padding: "1px 7px", borderRadius: 999, fontWeight: 600 }}>{k.delta} vs 2025</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16 }}>
        {/* Bar chart */}
        <div style={{ background: "var(--panel)", border: "1px solid var(--bdr)", borderRadius: 12, padding: 24 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--txt)", marginBottom: 20 }}>ყოველთვიური შემოსავალი (₾)</h2>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 180 }}>
            {MONTHLY.map((m) => {
              const pct = (m.revenue / maxRevenue) * 100;
              return (
                <div key={m.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div style={{ fontSize: 10, color: "var(--txt3)", fontWeight: 600 }}>{(m.revenue / 1000).toFixed(0)}k</div>
                  <div style={{ width: "100%", background: "#10B981", borderRadius: "6px 6px 0 0", height: `${pct * 1.5}px`, transition: "height 600ms" }} />
                  <div style={{ fontSize: 11, color: "var(--txt3)" }}>{m.month}</div>
                </div>
              );
            })}
          </div>
          {/* Occupancy dots */}
          <div style={{ marginTop: 16, display: "flex", gap: 16, borderTop: "1px solid var(--bdr)", paddingTop: 12 }}>
            {MONTHLY.map((m) => (
              <div key={m.month} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--txt)" }}>{m.occupancy}%</div>
                <div style={{ fontSize: 10, color: "var(--txt3)" }}>occ.</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top rooms */}
        <div style={{ background: "var(--panel)", border: "1px solid var(--bdr)", borderRadius: 12, padding: 24 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--txt)", marginBottom: 16 }}>Top ოთახები (ივნ)</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {TOP_ROOMS.map((r, i) => (
              <div key={r.room} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: i === 0 ? "#F59E0B" : "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: i === 0 ? "#fff" : "var(--txt3)" }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--txt)" }}>ოთახი {r.room} &middot; {r.type}</div>
                  <div style={{ fontSize: 11, color: "var(--txt3)" }}>{r.nights} ღამე</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--txt)" }}>{r.revenue}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
