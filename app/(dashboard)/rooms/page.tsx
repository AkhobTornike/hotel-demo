"use client";

import { useState } from "react";
import { Plus, X, Check, MagnifyingGlass } from "@phosphor-icons/react";

const ROOMS = [
  { id: "101", type: "სტანდარტი", floor: 1, capacity: 2, price: 90, status: "free", guest: "" },
  { id: "102", type: "სტანდარტი", floor: 1, capacity: 2, price: 90, status: "occupied", guest: "ნინო ბერიძე" },
  { id: "103", type: "სტანდარტი", floor: 1, capacity: 2, price: 90, status: "cleaning", guest: "" },
  { id: "104", type: "დელუქსი", floor: 1, capacity: 2, price: 150, status: "free", guest: "" },
  { id: "201", type: "სტანდარტი", floor: 2, capacity: 2, price: 95, status: "free", guest: "" },
  { id: "202", type: "სტანდარტი", floor: 2, capacity: 2, price: 95, status: "occupied", guest: "Иван Петров" },
  { id: "203", type: "დელუქსი", floor: 2, capacity: 3, price: 160, status: "free", guest: "" },
  { id: "204", type: "სტანდარტი", floor: 2, capacity: 2, price: 95, status: "occupied", guest: "გიორგი მამ." },
  { id: "205", type: "დელუქსი", floor: 2, capacity: 3, price: 160, status: "maint", guest: "" },
  { id: "301", type: "სუიტი", floor: 3, capacity: 4, price: 280, status: "free", guest: "" },
  { id: "302", type: "სუიტი", floor: 3, capacity: 4, price: 280, status: "occupied", guest: "Ana Müller" },
  { id: "303", type: "დელუქსი", floor: 3, capacity: 2, price: 155, status: "free", guest: "" },
  { id: "401", type: "პენტჰაუსი", floor: 4, capacity: 6, price: 550, status: "free", guest: "" },
  { id: "402", type: "სუიტი", floor: 4, capacity: 4, price: 290, status: "cleaning", guest: "" },
];

const STATUS: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  free:     { label: "თავისუფალი", color: "#065F46", bg: "rgba(16,185,129,.1)", dot: "var(--bdr)" },
  occupied: { label: "დაკავებული", color: "#991B1B", bg: "rgba(239,68,68,.1)", dot: "#EF4444" },
  cleaning: { label: "დასუფთავება", color: "#92400E", bg: "rgba(245,158,11,.1)", dot: "#F59E0B" },
  maint:    { label: "სარემონტო",   color: "#6B7280", bg: "#F3F4F6",             dot: "#9CA3AF" },
};

export default function RoomsPage() {
  const [filter, setFilter] = useState("all");
  const [modal, setModal] = useState<typeof ROOMS[0] | null>(null);
  const [search, setSearch] = useState("");

  const filtered = ROOMS.filter((r) => {
    const matchF = filter === "all" || r.status === filter;
    const matchS = r.id.includes(search) || r.type.includes(search) || r.guest.toLowerCase().includes(search.toLowerCase());
    return matchF && matchS;
  });

  const counts = {
    free:     ROOMS.filter((r) => r.status === "free").length,
    occupied: ROOMS.filter((r) => r.status === "occupied").length,
    cleaning: ROOMS.filter((r) => r.status === "cleaning").length,
    maint:    ROOMS.filter((r) => r.status === "maint").length,
  };

  const FILTERS = [
    { key: "all",      label: `ყველა (${ROOMS.length})` },
    { key: "free",     label: `თავისუფალი (${counts.free})` },
    { key: "occupied", label: `დაკავებული (${counts.occupied})` },
    { key: "cleaning", label: `დასუფთავება (${counts.cleaning})` },
    { key: "maint",    label: `სარემონტო (${counts.maint})` },
  ];

  return (
    <div style={{ padding: "28px 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--txt)" }}>ოთახები</h1>
          <p style={{ fontSize: 13, color: "var(--txt3)", marginTop: 2 }}>
            {counts.occupied}/{ROOMS.length} დაკავებული &middot; {counts.free} თავისუფალი
          </p>
        </div>
        <button style={{ background: "var(--acc)", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <Plus size={14} weight="bold" /> ოთახის დამატება
        </button>
      </div>

      {/* Filters + search */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
        {FILTERS.map(({ key, label }) => (
          <button key={key} onClick={() => setFilter(key)} style={{
            padding: "6px 14px", borderRadius: 999, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "1px solid",
            background: filter === key ? "var(--txt)" : "var(--panel)",
            color: filter === key ? "#fff" : "var(--txt2)",
            borderColor: filter === key ? "var(--txt)" : "var(--bdr)",
          }}>{label}</button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, background: "var(--panel)", border: "1px solid var(--bdr)", borderRadius: 8, padding: "6px 12px" }}>
          <MagnifyingGlass size={14} color="var(--txt3)" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ოთახი ან სტუმარი..." style={{ border: "none", outline: "none", fontSize: 13, color: "var(--txt)", background: "transparent", width: 160 }} />
        </div>
      </div>

      {/* Room grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
        {filtered.map((r) => {
          const st = STATUS[r.status];
          return (
            <div key={r.id} onClick={() => setModal(r)} style={{
              background: "var(--panel)",
              border: `1.5px solid ${r.status === "free" ? "var(--bdr)" : st.dot}`,
              borderRadius: 12, padding: 16, cursor: "pointer",
            }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "var(--txt)", marginBottom: 2, fontFamily: "monospace" }}>{r.id}</div>
              <div style={{ fontSize: 11, color: "var(--txt3)", marginBottom: 10 }}>{r.type} &middot; {r.capacity} სტ. &middot; {r.floor} სართ.</div>
              {r.guest && <div style={{ fontSize: 12, fontWeight: 500, color: "var(--txt2)", marginBottom: 8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.guest}</div>}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: st.color, background: st.bg, padding: "2px 7px", borderRadius: 999 }}>{st.label}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--txt2)" }}>&#8382;{r.price}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Room detail modal */}
      {modal && (
        <div onClick={() => setModal(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--panel)", borderRadius: 16, padding: 28, width: 400, boxShadow: "0 20px 60px rgba(0,0,0,.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "var(--txt)", fontFamily: "monospace" }}>ოთახი {modal.id}</div>
                <div style={{ fontSize: 13, color: "var(--txt3)" }}>{modal.type} &middot; {modal.floor} სართული</div>
              </div>
              <button onClick={() => setModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--txt3)" }}><X size={18} /></button>
            </div>
            <div style={{ background: "var(--bg)", borderRadius: 10, padding: 16, marginBottom: 20, display: "flex", flexDirection: "column", gap: 8 }}>
              {([
                ["ტიპი", modal.type],
                ["სტუმართა რ.", `${modal.capacity} სტუმარი`],
                ["ფასი", `₾${modal.price} / ღამე`],
                ["სტატუსი", STATUS[modal.status].label],
                ...(modal.guest ? [["სტუმარი", modal.guest]] : []),
              ] as [string, string][]).map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "var(--txt3)" }}>{k}</span>
                  <span style={{ fontWeight: 500, color: "var(--txt)" }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <button onClick={() => setModal(null)} style={{ padding: "10px 0", borderRadius: 8, border: "1px solid var(--bdr)", background: "none", fontSize: 13, color: "var(--txt2)", cursor: "pointer" }}>
                დახურვა
              </button>
              {modal.status === "free" && (
                <button style={{ padding: "10px 0", borderRadius: 8, border: "none", background: "var(--acc)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  ჯავშნის გახსნა
                </button>
              )}
              {modal.status === "occupied" && (
                <button style={{ padding: "10px 0", borderRadius: 8, border: "none", background: "#EF4444", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  Check-out
                </button>
              )}
              {modal.status === "cleaning" && (
                <button style={{ padding: "10px 0", borderRadius: 8, border: "none", background: "#F59E0B", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <Check size={13} />დასუფთავდა
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
