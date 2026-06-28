"use client";

import { useState } from "react";
import { Plus, X, MagnifyingGlass, CalendarBlank, Users, Door, CreditCard, Check } from "@phosphor-icons/react";

const ALL_RESERVATIONS = [
  { id: "JV-1042", guest: "გიორგი მამულაშვილი", room: "204", type: "სტანდარტი", checkin: "28 ივნ", checkout: "30 ივნ", nights: 2, price: "₾180", status: "in" },
  { id: "JV-1041", guest: "Иван Петров",          room: "312", type: "სუიტი",     checkin: "27 ივნ", checkout: "29 ივნ", nights: 2, price: "₾340", status: "in" },
  { id: "JV-1040", guest: "Ana Müller",            room: "108", type: "სტანდარტი", checkin: "28 ივნ", checkout: "01 ივლ", nights: 3, price: "₾165", status: "in" },
  { id: "JV-1039", guest: "ნინო კვარაცხელია",      room: "215", type: "დელუქსი",  checkin: "29 ივნ", checkout: "02 ივლ", nights: 3, price: "₾220", status: "ok" },
  { id: "JV-1038", guest: "მარიამ გელაშვილი",      room: "401", type: "სუიტი",     checkin: "30 ივნ", checkout: "03 ივლ", nights: 3, price: "₾410", status: "ok" },
  { id: "JV-1037", guest: "David Johnson",          room: "302", type: "სუიტი",     checkin: "01 ივლ", checkout: "05 ივლ", nights: 4, price: "₾560", status: "ok" },
  { id: "JV-1036", guest: "ნინო ბერიძე",           room: "102", type: "სტანდარტი", checkin: "25 ივნ", checkout: "27 ივნ", nights: 2, price: "₾180", status: "done" },
  { id: "JV-1035", guest: "Yuki Tanaka",            room: "303", type: "დელუქსი",  checkin: "20 ივნ", checkout: "23 ივნ", nights: 3, price: "₾315", status: "done" },
  { id: "JV-1034", guest: "გიორგი მამულაშვილი",    room: "101", type: "სტანდარტი", checkin: "10 ივნ", checkout: "12 ივნ", nights: 2, price: "₾180", status: "done" },
  { id: "JV-1033", guest: "Ana Müller",             room: "201", type: "სტანდარტი", checkin: "05 ივნ", checkout: "08 ივნ", nights: 3, price: "₾255", status: "cancel" },
];

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  in:     { label: "სასტუმროში",    color: "#065F46", bg: "rgba(16,185,129,.1)" },
  ok:     { label: "დადასტურებული", color: "#1E40AF", bg: "rgba(59,130,246,.1)" },
  done:   { label: "დასრულებული",   color: "#6B7280", bg: "#F3F4F6" },
  cancel: { label: "გაუქმებული",    color: "#991B1B", bg: "rgba(239,68,68,.1)" },
};

export default function ReservationsPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<typeof ALL_RESERVATIONS[0] | null>(null);
  const [newModal, setNewModal] = useState(false);
  const [form, setForm] = useState({ guest: "", room: "", checkin: "", checkout: "", type: "სტანდარტი" });

  const counts = {
    in:     ALL_RESERVATIONS.filter(r => r.status === "in").length,
    ok:     ALL_RESERVATIONS.filter(r => r.status === "ok").length,
    done:   ALL_RESERVATIONS.filter(r => r.status === "done").length,
    cancel: ALL_RESERVATIONS.filter(r => r.status === "cancel").length,
  };

  const filtered = ALL_RESERVATIONS.filter((r) => {
    const mf = filter === "all" || r.status === filter;
    const ms = r.guest.toLowerCase().includes(search.toLowerCase()) || r.id.includes(search) || r.room.includes(search);
    return mf && ms;
  });

  const FILTERS = [
    { key: "all",    label: `ყველა (${ALL_RESERVATIONS.length})` },
    { key: "in",     label: `სასტუმროში (${counts.in})` },
    { key: "ok",     label: `დადასტურებული (${counts.ok})` },
    { key: "done",   label: `დასრულებული (${counts.done})` },
    { key: "cancel", label: `გაუქმებული (${counts.cancel})` },
  ];

  return (
    <div style={{ padding: "28px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--txt)" }}>ჯავშნები</h1>
          <p style={{ fontSize: 13, color: "var(--txt3)", marginTop: 2 }}>{ALL_RESERVATIONS.length} ჯავშანი სულ</p>
        </div>
        <button onClick={() => setNewModal(true)} style={{ background: "var(--acc)", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <Plus size={14} weight="bold" /> ახალი ჯავშანი
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
        {FILTERS.map(({ key, label }) => (
          <button key={key} onClick={() => setFilter(key)} style={{ padding: "6px 14px", borderRadius: 999, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "1px solid", background: filter === key ? "var(--txt)" : "var(--panel)", color: filter === key ? "#fff" : "var(--txt2)", borderColor: filter === key ? "var(--txt)" : "var(--bdr)" }}>{label}</button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, background: "var(--panel)", border: "1px solid var(--bdr)", borderRadius: 8, padding: "6px 12px" }}>
          <MagnifyingGlass size={14} color="var(--txt3)" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="სტუმარი, ID ან ოთახი..." style={{ border: "none", outline: "none", fontSize: 13, color: "var(--txt)", background: "transparent", width: 170 }} />
        </div>
      </div>

      <div style={{ background: "var(--panel)", border: "1px solid var(--bdr)", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--bdr)" }}>
              {["ID", "სტუმარი", "ოთახი", "Check-in", "Check-out", "ღამეები", "ფასი", "სტატუსი"].map((h) => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "var(--txt3)", textTransform: "uppercase", letterSpacing: ".04em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const st = STATUS_MAP[r.status];
              return (
                <tr key={r.id} onClick={() => setModal(r)} style={{ borderBottom: "1px solid var(--bdr)", cursor: "pointer" }}>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--txt3)", fontFamily: "monospace" }}>{r.id}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 500, color: "var(--txt)" }}>{r.guest}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--txt2)" }}>{r.room} &middot; {r.type}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--txt2)" }}>{r.checkin}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--txt2)" }}>{r.checkout}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--txt2)" }}>{r.nights}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "var(--txt)" }}>{r.price}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: st.color, background: st.bg, padding: "3px 8px", borderRadius: 999 }}>{st.label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detail modal */}
      {modal && (
        <div onClick={() => setModal(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--panel)", borderRadius: 16, padding: 28, width: 420, boxShadow: "0 20px 60px rgba(0,0,0,.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--txt)" }}>ჯავშანი {modal.id}</div>
                <span style={{ fontSize: 11, fontWeight: 600, color: STATUS_MAP[modal.status].color, background: STATUS_MAP[modal.status].bg, padding: "2px 8px", borderRadius: 999, marginTop: 4, display: "inline-block" }}>{STATUS_MAP[modal.status].label}</span>
              </div>
              <button onClick={() => setModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--txt3)" }}><X size={18} /></button>
            </div>
            <div style={{ background: "var(--bg)", borderRadius: 10, padding: 16, marginBottom: 20, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                [Users,        "სტუმარი",  modal.guest],
                [Door,         "ოთახი",    `${modal.room} · ${modal.type}`],
                [CalendarBlank,"Check-in",  modal.checkin],
                [CalendarBlank,"Check-out", modal.checkout],
                [CreditCard,   "ფასი",     modal.price],
              ].map(([Icon, lbl, val]) => (
                <div key={String(lbl)} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Icon size={14} color="var(--txt3)" />
                  <span style={{ fontSize: 12, color: "var(--txt3)", width: 70 }}>{String(lbl)}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "var(--txt)" }}>{String(val)}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <button onClick={() => setModal(null)} style={{ padding: "10px 0", borderRadius: 8, border: "1px solid var(--bdr)", background: "none", fontSize: 13, color: "var(--txt2)", cursor: "pointer" }}>დახურვა</button>
              {modal.status === "ok" && <button style={{ padding: "10px 0", borderRadius: 8, border: "none", background: "var(--acc)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}><Check size={13} weight="bold" />Check-in</button>}
              {modal.status === "in" && <button style={{ padding: "10px 0", borderRadius: 8, border: "none", background: "#EF4444", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Check-out</button>}
            </div>
          </div>
        </div>
      )}

      {/* New reservation modal */}
      {newModal && (
        <div onClick={() => setNewModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--panel)", borderRadius: 16, padding: 28, width: 440, boxShadow: "0 20px 60px rgba(0,0,0,.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--txt)" }}>ახალი ჯავშანი</h3>
              <button onClick={() => setNewModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--txt3)" }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { label: "სტუმრის სახელი", key: "guest", placeholder: "გ. მამულაშვილი" },
                { label: "ოთახის ნომერი", key: "room", placeholder: "204" },
                { label: "Check-in", key: "checkin", placeholder: "2026-06-28" },
                { label: "Check-out", key: "checkout", placeholder: "2026-06-30" },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label style={{ fontSize: 12, fontWeight: 500, color: "var(--txt2)", display: "block", marginBottom: 5 }}>{label}</label>
                  <input
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--bdr)", fontSize: 13, color: "var(--txt)", outline: "none", background: "var(--bg)" }}
                  />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "var(--txt2)", display: "block", marginBottom: 5 }}>ოთახის ტიპი</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--bdr)", fontSize: 13, color: "var(--txt)", outline: "none", background: "var(--bg)" }}>
                  {["სტანდარტი", "დელუქსი", "სუიტი", "პენტჰაუსი"].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 20 }}>
              <button onClick={() => setNewModal(false)} style={{ padding: "10px 0", borderRadius: 8, border: "1px solid var(--bdr)", background: "none", fontSize: 13, color: "var(--txt2)", cursor: "pointer" }}>გაუქმება</button>
              <button onClick={() => setNewModal(false)} style={{ padding: "10px 0", borderRadius: 8, border: "none", background: "var(--acc)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>შენახვა</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
