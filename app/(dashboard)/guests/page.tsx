"use client";

import { useState } from "react";
import { Plus, X, Phone, EnvelopeSimple, MapPin, MagnifyingGlass, Star } from "@phosphor-icons/react";

const GUESTS = [
  { id: "G-001", name: "გიორგი მამულაშვილი", phone: "+995 555 123 456", email: "g.mamulashvili@gmail.com", country: "საქართველო", visits: 4, spent: "₾1,240", vip: true, status: "active" },
  { id: "G-002", name: "Иван Петров", phone: "+7 916 234 5678", email: "ivan.petrov@mail.ru", country: "რუსეთი", visits: 2, spent: "₾680", vip: false, status: "active" },
  { id: "G-003", name: "Ana Müller", phone: "+49 171 345 6789", email: "ana.mueller@gmail.com", country: "გერმანია", visits: 1, spent: "₾165", vip: false, status: "active" },
  { id: "G-004", name: "ნინო კვარაცხელია", phone: "+995 577 987 654", email: "nino.k@gmail.com", country: "საქართველო", visits: 7, spent: "₾2,890", vip: true, status: "upcoming" },
  { id: "G-005", name: "მარიამ გელაშვილი", phone: "+995 598 111 222", email: "mariam.g@yahoo.com", country: "საქართველო", visits: 3, spent: "₾940", vip: false, status: "upcoming" },
  { id: "G-006", name: "David Johnson", phone: "+1 415 555 0100", email: "djohnson@company.com", country: "აშშ", visits: 1, spent: "₾0", vip: false, status: "upcoming" },
  { id: "G-007", name: "ნინო ბერიძე", phone: "+995 555 444 333", email: "nino.beridze@gmail.com", country: "საქართველო", visits: 2, spent: "₾480", vip: false, status: "active" },
  { id: "G-008", name: "Yuki Tanaka", phone: "+81 90 1234 5678", email: "y.tanaka@jp.co", country: "იაპონია", visits: 1, spent: "₾0", vip: false, status: "past" },
];

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  active:   { label: "სასტუმროში",  color: "#065F46", bg: "rgba(16,185,129,.1)" },
  upcoming: { label: "მოახლოება",   color: "#92400E", bg: "rgba(245,158,11,.1)" },
  past:     { label: "დასრულებული", color: "#6B7280", bg: "#F3F4F6" },
};

export default function GuestsPage() {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<typeof GUESTS[0] | null>(null);

  const filtered = GUESTS.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.email.toLowerCase().includes(search.toLowerCase()) ||
    g.country.includes(search)
  );

  return (
    <div style={{ padding: "28px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--txt)" }}>სტუმრები</h1>
          <p style={{ fontSize: 13, color: "var(--txt3)", marginTop: 2 }}>{GUESTS.length} სტუმარი სულ &middot; {GUESTS.filter(g => g.vip).length} VIP</p>
        </div>
        <button style={{ background: "var(--acc)", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <Plus size={14} weight="bold" /> სტუმრის დამატება
        </button>
      </div>

      {/* Search */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--panel)", border: "1px solid var(--bdr)", borderRadius: 8, padding: "8px 14px", marginBottom: 20, maxWidth: 360 }}>
        <MagnifyingGlass size={14} color="var(--txt3)" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="სახელი, email ან ქვეყანა..." style={{ border: "none", outline: "none", fontSize: 13, color: "var(--txt)", background: "transparent", width: "100%" }} />
      </div>

      {/* Table */}
      <div style={{ background: "var(--panel)", border: "1px solid var(--bdr)", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--bdr)" }}>
              {["სტუმარი", "კონტაქტი", "ქვეყანა", "ვიზიტები", "სულ დახარჯა", "სტატუსი", ""].map((h) => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "var(--txt3)", textTransform: "uppercase", letterSpacing: ".04em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((g) => {
              const st = STATUS_MAP[g.status];
              return (
                <tr key={g.id} style={{ borderBottom: "1px solid var(--bdr)" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--acc-s)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "var(--acc)", flexShrink: 0 }}>
                        {g.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--txt)", display: "flex", alignItems: "center", gap: 5 }}>
                          {g.name}
                          {g.vip && <Star size={11} weight="fill" color="#F59E0B" />}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--txt3)" }}>{g.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ fontSize: 12, color: "var(--txt2)" }}>{g.phone}</div>
                    <div style={{ fontSize: 11, color: "var(--txt3)" }}>{g.email}</div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--txt2)" }}>{g.country}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--txt)", fontWeight: 600 }}>{g.visits}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "var(--txt)" }}>{g.spent}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: st.color, background: st.bg, padding: "3px 8px", borderRadius: 999 }}>{st.label}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <button onClick={() => setModal(g)} style={{ fontSize: 12, color: "var(--acc)", background: "var(--acc-s)", border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontWeight: 600 }}>
                      პროფილი
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Guest profile modal */}
      {modal && (
        <div onClick={() => setModal(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--panel)", borderRadius: 16, padding: 28, width: 420, boxShadow: "0 20px 60px rgba(0,0,0,.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--acc-s)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "var(--acc)" }}>
                  {modal.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "var(--txt)", display: "flex", alignItems: "center", gap: 6 }}>
                    {modal.name}
                    {modal.vip && <Star size={14} weight="fill" color="#F59E0B" />}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--txt3)" }}>{modal.id} &middot; {modal.country}</div>
                </div>
              </div>
              <button onClick={() => setModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--txt3)" }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              {[
                [Phone, modal.phone],
                [EnvelopeSimple, modal.email],
                [MapPin, modal.country],
              ].map(([Icon, val]) => (
                <div key={String(val)} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--txt2)" }}>
                  <Icon size={14} color="var(--txt3)" />
                  {String(val)}
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, background: "var(--bg)", borderRadius: 10, padding: 16, marginBottom: 20 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "var(--txt)" }}>{modal.visits}</div>
                <div style={{ fontSize: 11, color: "var(--txt3)" }}>ვიზიტი</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "var(--txt)" }}>{modal.spent}</div>
                <div style={{ fontSize: 11, color: "var(--txt3)" }}>სულ დახარჯა</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <button onClick={() => setModal(null)} style={{ padding: "10px 0", borderRadius: 8, border: "1px solid var(--bdr)", background: "none", fontSize: 13, color: "var(--txt2)", cursor: "pointer" }}>
                დახურვა
              </button>
              <button style={{ padding: "10px 0", borderRadius: 8, border: "none", background: "var(--acc)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                ახალი ჯავშანი
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
