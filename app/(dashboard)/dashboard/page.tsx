"use client";

import { useState } from "react";
import {
  Users, Door, CreditCard, TrendUp, X, Check,
  CalendarBlank, Clock,
} from "@phosphor-icons/react";

const STATS = [
  { label: "დღევანდელი სტუმრები", value: "24", sub: "+3 check-in დღეს", icon: Users, color: "var(--acc)", bg: "var(--acc-s)" },
  { label: "დაკავებული ოთახები", value: "18/32", sub: "56% occupancy", icon: Door, color: "var(--blue)", bg: "var(--blue-s)" },
  { label: "დღევანდელი შემოსავალი", value: "₾3,240", sub: "+12% გუშინთან", icon: TrendUp, color: "var(--amb)", bg: "var(--amb-s)" },
  { label: "მოლოდინში გადახდები", value: "5", sub: "₾820 სულ", icon: CreditCard, color: "var(--rose)", bg: "var(--rose-s)" },
];

const RESERVATIONS = [
  { id: "JV-1042", guest: "გიორგი მამულაშვილი", room: "204", type: "სტანდარტი", checkin: "28 ივნ", checkout: "30 ივნ", status: "in", price: "₾180" },
  { id: "JV-1041", guest: "Иван Петров", room: "312", type: "სუიტი", checkin: "27 ივნ", checkout: "29 ივნ", status: "ok", price: "₾340" },
  { id: "JV-1040", guest: "Ana Müller", room: "108", type: "სტანდარტი", checkin: "28 ივნ", checkout: "01 ივლ", status: "ok", price: "₾165" },
  { id: "JV-1039", guest: "ნინო კვარაცხელია", room: "215", type: "დელუქსი", checkin: "29 ივნ", checkout: "02 ივლ", status: "pending", price: "₾220" },
  { id: "JV-1038", guest: "მარიამ გელაშვილი", room: "401", type: "სუიტი", checkin: "30 ივნ", checkout: "03 ივლ", status: "pending", price: "₾410" },
];

const STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  in:      { label: "სასტუმროში", color: "var(--acc-txt)", bg: "var(--acc-s)" },
  ok:      { label: "დადასტურებული", color: "var(--blue-txt)", bg: "var(--blue-s)" },
  pending: { label: "მოლოდინში", color: "var(--amb-txt)", bg: "var(--amb-s)" },
};

export default function DashboardPage() {
  const [modal, setModal] = useState<(typeof RESERVATIONS)[0] | null>(null);
  const [checkedIn, setCheckedIn] = useState<string[]>([]);

  function doCheckin(id: string) {
    setCheckedIn((p) => [...p, id]);
    setModal(null);
  }

  return (
    <div style={{ padding: "28px 24px", maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--txt)" }}>დაფა</h1>
          <p style={{ fontSize: 13, color: "var(--txt3)", marginTop: 2 }}>28 ივნისი, 2026 — კვირა</p>
        </div>
        <button
          style={{
            background: "var(--acc)", color: "#fff", border: "none", borderRadius: 8,
            padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6,
          }}
        >
          <CalendarBlank size={14} weight="fill" />
          ახალი ჯავშანი
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
        {STATS.map((s) => (
          <div key={s.label} style={{ background: "var(--panel)", border: "1px solid var(--bdr)", borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: "var(--txt3)", lineHeight: 1.4 }}>{s.label}</div>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <s.icon size={16} color={s.color} weight="fill" />
              </div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--txt)", marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "var(--txt3)" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Reservations table */}
      <div style={{ background: "var(--panel)", border: "1px solid var(--bdr)", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--bdr)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--txt)" }}>დღევანდელი ჯავშნები</h2>
          <span style={{ fontSize: 12, color: "var(--txt3)" }}>5 ჩანაწერი</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--bdr)" }}>
              {["ID", "სტუმარი", "ოთახი", "Check-in", "Check-out", "სტატუსი", "ფასი", ""].map((h) => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "var(--txt3)", textTransform: "uppercase", letterSpacing: ".04em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RESERVATIONS.map((r) => {
              const st = STATUS_LABEL[checkedIn.includes(r.id) ? "in" : r.status];
              return (
                <tr key={r.id} style={{ borderBottom: "1px solid var(--bdr)" }}>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--txt3)", fontFamily: "monospace" }}>{r.id}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 500, color: "var(--txt)" }}>{r.guest}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--txt2)" }}>{r.room} · {r.type}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--txt2)" }}>{r.checkin}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--txt2)" }}>{r.checkout}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: st.color, background: st.bg, padding: "3px 8px", borderRadius: 999 }}>{st.label}</span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "var(--txt)" }}>{r.price}</td>
                  <td style={{ padding: "12px 16px" }}>
                    {!checkedIn.includes(r.id) && r.status !== "in" ? (
                      <button
                        onClick={() => setModal(r)}
                        style={{ fontSize: 12, color: "var(--acc)", background: "var(--acc-s)", border: "none", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontWeight: 600 }}
                      >
                        შ-ინი →
                      </button>
                    ) : (
                      <span style={{ color: "var(--txt3)", fontSize: 12 }}>✓</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Check-in Modal */}
      {modal && (
        <div
          onClick={() => setModal(null)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", display: "flex",
            alignItems: "center", justifyContent: "center", zIndex: 50,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--panel)", borderRadius: 16, padding: 28, width: 440,
              boxShadow: "0 20px 60px rgba(0,0,0,.2)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--txt)" }}>Check-in დადასტურება</h3>
              <button onClick={() => setModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--txt3)" }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ background: "var(--bg)", borderRadius: 10, padding: 16, marginBottom: 20, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                [Users, "სტუმარი", modal.guest],
                [Door, "ოთახი", `${modal.room} · ${modal.type}`],
                [CalendarBlank, "Check-in", modal.checkin],
                [Clock, "Check-out", modal.checkout],
                [CreditCard, "ჯამი", modal.price],
              ].map(([Icon, lbl, val]) => (
                <div key={String(lbl)} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color: "var(--txt3)" }}><Icon size={14} /></span>
                  <span style={{ fontSize: 12, color: "var(--txt3)", width: 80 }}>{String(lbl)}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "var(--txt)" }}>{String(val)}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <button
                onClick={() => setModal(null)}
                style={{ padding: "10px 0", borderRadius: 8, border: "1px solid var(--bdr)", background: "none", fontSize: 13, color: "var(--txt2)", cursor: "pointer" }}
              >
                გაუქმება
              </button>
              <button
                onClick={() => doCheckin(modal.id)}
                style={{ padding: "10px 0", borderRadius: 8, border: "none", background: "var(--acc)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
              >
                <Check size={14} weight="bold" />
                Check-in დადასტურება
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
