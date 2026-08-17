"use client";

import { useState } from "react";
import { Money, ArrowUp, ArrowDown, Check } from "@phosphor-icons/react";
import Modal, { ModalHeader, ModalActions, GhostButton, PrimaryButton } from "@/components/Modal";
import { Badge, Empty, FilterPills, PageHeader, Panel, SearchBox, Td, Th } from "@/components/ui";
import { useHotel } from "@/contexts/HotelContext";
import { PAYMENT_STATUS, gel, type Payment } from "@/lib/data";
import { fmtShort } from "@/lib/dates";
import { matches } from "@/lib/search";

const METHOD_ICON: Record<string, string> = {
  "ბარათი": "💳", "ნაღდი": "💵", "TBC Pay": "🏦", "BOG Pay": "🏦",
};

export default function PaymentsPage() {
  const { hotel, markPaid } = useHotel();
  const [payModal, setPayModal] = useState<Payment | null>(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [method, setMethod] = useState("");

  const guestName = (id: string) => hotel.guests.find((g) => g.id === id)?.name ?? "—";

  const totalPaid = hotel.payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const totalPending = hotel.payments.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0);
  const totalRefund = hotel.payments.filter((p) => p.status === "refund").reduce((s, p) => s + p.amount, 0);

  const counts = {
    paid: hotel.payments.filter((p) => p.status === "paid").length,
    pending: hotel.payments.filter((p) => p.status === "pending").length,
    refund: hotel.payments.filter((p) => p.status === "refund").length,
  };

  const filtered = hotel.payments.filter((p) => {
    if (filter !== "all" && p.status !== filter) return false;
    return matches(search, [guestName(p.guestId), p.id, p.reservationId, p.method, String(p.amount)]);
  });

  return (
    <div style={{ padding: "28px 24px" }}>
      <PageHeader title="გადახდები" sub={`ტრანზაქციების ისტორია · ${hotel.name}`} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { icon: ArrowDown, label: "სულ შემოსული", value: gel(totalPaid), color: "var(--acc-txt)", bg: "var(--acc-s)" },
          { icon: ArrowUp, label: "მოლოდინში", value: gel(totalPending), color: "var(--amb-txt)", bg: "var(--amb-s)" },
          { icon: Money, label: "დაბრუნებული", value: gel(totalRefund), color: "var(--blue-txt)", bg: "var(--blue-s)" },
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

      <div style={{ display: "flex", gap: 8, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
        <FilterPills
          value={filter}
          onChange={setFilter}
          options={[
            { key: "all", label: `ყველა (${hotel.payments.length})` },
            { key: "paid", label: `გადახდილი (${counts.paid})` },
            { key: "pending", label: `მოლოდინში (${counts.pending})` },
            { key: "refund", label: `დაბრუნებული (${counts.refund})` },
          ]}
        />
        <div style={{ marginLeft: "auto" }}>
          <SearchBox value={search} onChange={setSearch} placeholder="სტუმარი, TX, ჯავშანი, თანხა..." width={260} />
        </div>
      </div>

      <Panel title="ტრანზაქციები">
        {filtered.length === 0 ? (
          <Empty>ვერაფერი მოიძებნა</Empty>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--bdr)" }}>
                {["ID", "თარიღი", "სტუმარი", "ჯავშანი", "მეთოდი", "თანხა", "სტატუსი", ""].map((h) => <Th key={h}>{h}</Th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid var(--bdr)" }}>
                  <Td mono>{p.id}</Td>
                  <Td dim>{fmtShort(p.date)}</Td>
                  <Td strong>{guestName(p.guestId)}</Td>
                  <Td mono>{p.reservationId}</Td>
                  <Td><span style={{ marginRight: 5 }}>{METHOD_ICON[p.method]}</span>{p.method}</Td>
                  <Td strong>{gel(p.amount)}</Td>
                  <td style={{ padding: "12px 16px" }}>
                    <Badge tone={PAYMENT_STATUS[p.status]}>{PAYMENT_STATUS[p.status].label}</Badge>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {p.status === "pending" && (
                      <button onClick={() => { setPayModal(p); setMethod(p.method); }} style={linkBtn}>გადახდა</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>

      {payModal && (
        <Modal onClose={() => setPayModal(null)} width={400}>
          <ModalHeader title="გადახდის დადასტურება" onClose={() => setPayModal(null)} />
          <div style={{ background: "var(--bg)", borderRadius: 10, padding: 20, textAlign: "center" }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: "var(--txt)", marginBottom: 4 }}>{gel(payModal.amount)}</div>
            <div style={{ fontSize: 13, color: "var(--txt3)" }}>
              {guestName(payModal.guestId)} &middot; {payModal.reservationId}
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: "var(--txt2)", display: "block", marginBottom: 6 }}>გადახდის მეთოდი</label>
            <select value={method} onChange={(e) => setMethod(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--bdr)", fontSize: 13, color: "var(--txt)", outline: "none", background: "var(--bg)" }}>
              {Object.keys(METHOD_ICON).map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
          <ModalActions>
            <GhostButton onClick={() => setPayModal(null)}>გაუქმება</GhostButton>
            <PrimaryButton onClick={() => { markPaid(payModal.id); setPayModal(null); }}>
              <Check size={14} weight="bold" />დადასტურება
            </PrimaryButton>
          </ModalActions>
        </Modal>
      )}
    </div>
  );
}

const linkBtn: React.CSSProperties = {
  fontSize: 12, color: "var(--acc)", background: "var(--acc-s)", border: "none",
  borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontWeight: 600,
};
