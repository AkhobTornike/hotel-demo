"use client";

import { useState } from "react";
import { CreditCard, Money, ArrowUp, ArrowDown, X, Check } from "@phosphor-icons/react";

const PAYMENTS = [
  { id: "TX-8821", date: "28 ივნ 14:22", guest: "გიორგი მამულაშვილი", reservation: "JV-1042", method: "ბარათი", amount: "₾180", status: "paid" },
  { id: "TX-8820", date: "28 ივნ 11:05", guest: "Ana Müller",          reservation: "JV-1040", method: "ნაღდი", amount: "₾165", status: "paid" },
  { id: "TX-8819", date: "27 ივნ 18:30", guest: "Иван Петров",          reservation: "JV-1041", method: "ბარათი", amount: "₾340", status: "paid" },
  { id: "TX-8818", date: "29 ივნ",        guest: "ნინო კვარაცხელია",    reservation: "JV-1039", method: "TBC Pay", amount: "₾220", status: "pending" },
  { id: "TX-8817", date: "30 ივნ",        guest: "მარიამ გელაშვილი",    reservation: "JV-1038", method: "ბარათი", amount: "₾410", status: "pending" },
  { id: "TX-8816", date: "01 ივლ",        guest: "David Johnson",        reservation: "JV-1037", method: "BOG Pay", amount: "₾560", status: "pending" },
  { id: "TX-8815", date: "25 ივნ 09:10", guest: "ნინო ბერიძე",         reservation: "JV-1036", method: "ნაღდი", amount: "₾180", status: "paid" },
  { id: "TX-8814", date: "23 ივნ 12:45", guest: "Yuki Tanaka",          reservation: "JV-1035", method: "ბარათი", amount: "₾315", status: "paid" },
  { id: "TX-8813", date: "10 ივნ 16:20", guest: "გიორგი მამულაშვილი",  reservation: "JV-1034", method: "ბარათი", amount: "₾180", status: "paid" },
  { id: "TX-8812", date: "05 ივნ",        guest: "Ana Müller",           reservation: "JV-1033", method: "ბარათი", amount: "₾255", status: "refund" },
];

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  paid:    { label: "გადახდილი",   color: "#065F46", bg: "rgba(16,185,129,.1)" },
  pending: { label: "მოლოდინში",  color: "#92400E", bg: "rgba(245,158,11,.1)" },
  refund:  { label: "დაბრუნებული", color: "#1E40AF", bg: "rgba(59,130,246,.1)" },
};

const METHOD_ICON: Record<string, string> = {
  "ბარათი": "💳",
  "ნაღდი":  "💵",
  "TBC Pay": "🏦",
  "BOG Pay": "🏦",
};

export default function PaymentsPage() {
  const [payModal, setPayModal] = useState<typeof PAYMENTS[0] | null>(null);

  const totalPaid   = PAYMENTS.filter(p => p.status === "paid").reduce((sum, p) => sum + parseInt(p.amount.replace(/[₾,]/g, "")), 0);
  const totalPending = PAYMENTS.filter(p => p.status === "pending").reduce((sum, p) => sum + parseInt(p.amount.replace(/[₾,]/g, "")), 0);

  return (
    <div style={{ padding: "28px 24px" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--txt)" }}>გადახდები</h1>
        <p style={{ fontSize: 13, color: "var(--txt3)", marginTop: 2 }}>ტრანზაქციების ისტორია</p>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { icon: ArrowDown, label: "სულ შემოსული", value: `₾${totalPaid.toLocaleString()}`, color: "#065F46", bg: "rgba(16,185,129,.1)" },
          { icon: ArrowUp,   label: "მოლოდინში",   value: `₾${totalPending.toLocaleString()}`, color: "#92400E", bg: "rgba(245,158,11,.1)" },
          { icon: Money,     label: "ამ თვეში",     value: `₾${(totalPaid + totalPending).toLocaleString()}`, color: "#1E40AF", bg: "rgba(59,130,246,.1)" },
        ].map((c) => (
          <div key={c.label} style={{ background: "var(--panel)", border: "1px solid var(--bdr)", borderRadius: 12, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <c.icon size={18} color={c.color} weight="fill" />
            </div>
            <div>
              <div style={{ fontSize: 12, color: "var(--txt3)" }}>{c.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "var(--txt)" }}>{c.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "var(--panel)", border: "1px solid var(--bdr)", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--bdr)" }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--txt)" }}>ტრანზაქციები</h2>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--bdr)" }}>
              {["ID", "თარიღი", "სტუმარი", "ჯავშანი", "გადახდის მეთოდი", "თანხა", "სტატუსი", ""].map((h) => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "var(--txt3)", textTransform: "uppercase", letterSpacing: ".04em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PAYMENTS.map((p) => {
              const st = STATUS_MAP[p.status];
              return (
                <tr key={p.id} style={{ borderBottom: "1px solid var(--bdr)" }}>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--txt3)", fontFamily: "monospace" }}>{p.id}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--txt3)" }}>{p.date}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 500, color: "var(--txt)" }}>{p.guest}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--txt3)", fontFamily: "monospace" }}>{p.reservation}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--txt2)" }}>
                    <span style={{ marginRight: 5 }}>{METHOD_ICON[p.method]}</span>{p.method}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 700, color: "var(--txt)" }}>{p.amount}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: st.color, background: st.bg, padding: "3px 8px", borderRadius: 999 }}>{st.label}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {p.status === "pending" && (
                      <button onClick={() => setPayModal(p)} style={{ fontSize: 12, color: "var(--acc)", background: "var(--acc-s)", border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontWeight: 600 }}>
                        გადახდა
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Payment confirm modal */}
      {payModal && (
        <div onClick={() => setPayModal(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--panel)", borderRadius: 16, padding: 28, width: 400, boxShadow: "0 20px 60px rgba(0,0,0,.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--txt)" }}>გადახდის დადასტურება</h3>
              <button onClick={() => setPayModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--txt3)" }}><X size={18} /></button>
            </div>
            <div style={{ background: "var(--bg)", borderRadius: 10, padding: 20, marginBottom: 20, textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: "var(--txt)", marginBottom: 4 }}>{payModal.amount}</div>
              <div style={{ fontSize: 13, color: "var(--txt3)" }}>{payModal.guest} &middot; {payModal.reservation}</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: "var(--txt2)", display: "block", marginBottom: 6 }}>გადახდის მეთოდი</label>
              <select defaultValue={payModal.method} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--bdr)", fontSize: 13, color: "var(--txt)", outline: "none", background: "var(--bg)" }}>
                {["ბარათი", "ნაღდი", "TBC Pay", "BOG Pay"].map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <button onClick={() => setPayModal(null)} style={{ padding: "10px 0", borderRadius: 8, border: "1px solid var(--bdr)", background: "none", fontSize: 13, color: "var(--txt2)", cursor: "pointer" }}>გაუქმება</button>
              <button onClick={() => setPayModal(null)} style={{ padding: "10px 0", borderRadius: 8, border: "none", background: "var(--acc)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <Check size={14} weight="bold" />დადასტურება
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
