"use client";

import { useState } from "react";
import { Users, Door, CreditCard, TrendUp, Check, CalendarBlank, Clock } from "@phosphor-icons/react";
import Modal, { ModalHeader, ModalActions, GhostButton, PrimaryButton } from "@/components/Modal";
import NewReservationModal, { type NewReservation } from "@/components/NewReservationModal";
import { Badge, Empty, PageHeader, Panel, Td, Th } from "@/components/ui";
import { useHotel } from "@/contexts/HotelContext";
import { RESERVATION_STATUS, gel, type Reservation } from "@/lib/data";
import { TODAY, coversNight, daysBetween, dowLabel, fmtLong, fmtShort } from "@/lib/dates";

export default function DashboardPage() {
  const { hotel, addReservation, setReservationStatus } = useHotel();
  const [modal, setModal] = useState<Reservation | null>(null);
  const [newModal, setNewModal] = useState(false);

  const guestName = (id: string) => hotel.guests.find((g) => g.id === id)?.name ?? "—";

  const active = hotel.reservations.filter((r) => r.status !== "cancel");
  const inHouse = active.filter((r) => coversNight(TODAY, r.checkin, r.checkout));
  const arrivals = active.filter((r) => r.checkin === TODAY);
  const occupied = hotel.rooms.filter((r) => r.status === "occupied").length;
  const todayRevenue = hotel.payments
    .filter((p) => p.date === TODAY && p.status === "paid")
    .reduce((s, p) => s + p.amount, 0);
  const pendingPayments = hotel.payments.filter((p) => p.status === "pending");

  /** Today's board: everyone arriving or already staying. */
  const board = active
    .filter((r) => r.checkin === TODAY || coversNight(TODAY, r.checkin, r.checkout) || r.checkout === TODAY)
    .sort((a, b) => a.checkin.localeCompare(b.checkin));

  const stats = [
    { label: "სასტუმროში სტუმრები", value: String(inHouse.length), sub: `+${arrivals.length} ჩამოსვლა დღეს`, icon: Users, color: "var(--acc)", bg: "var(--acc-s)" },
    { label: "დაკავებული ოთახები", value: `${occupied}/${hotel.rooms.length}`, sub: `${Math.round((occupied / hotel.rooms.length) * 100)}% დატვირთვა`, icon: Door, color: "var(--blue)", bg: "var(--blue-s)" },
    { label: "დღევანდელი შემოსავალი", value: gel(todayRevenue), sub: hotel.city, icon: TrendUp, color: "var(--amb)", bg: "var(--amb-s)" },
    { label: "მოლოდინში გადახდები", value: String(pendingPayments.length), sub: `${gel(pendingPayments.reduce((s, p) => s + p.amount, 0))} სულ`, icon: CreditCard, color: "var(--rose)", bg: "var(--rose-s)" },
  ];

  function save(n: NewReservation) {
    const prefix = hotel.id === "tbilisi" ? "JV" : "BT";
    addReservation({
      id: `${prefix}-${Date.now().toString().slice(-4)}`,
      guestId: hotel.guests.find((g) => g.name === n.guest)?.id ?? hotel.guests[0].id,
      room: n.room || hotel.rooms[0].id,
      checkin: n.checkin || TODAY,
      checkout: n.checkout || "2026-06-30",
      total: 0,
      status: "ok",
      source: "პირდაპირი",
      color: "#10B981",
    });
    setNewModal(false);
  }

  return (
    <div style={{ padding: "28px 24px", maxWidth: 1180 }}>
      <PageHeader
        title="დაფა"
        sub={`${fmtLong(TODAY)} — ${dowLabel(TODAY)} · ${hotel.name}`}
        action={
          <button onClick={() => setNewModal(true)} style={addBtn}>
            <CalendarBlank size={14} weight="fill" /> ახალი ჯავშანი
          </button>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: "var(--panel)", border: "1px solid var(--bdr)", borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: "var(--txt3)", lineHeight: 1.4 }}>{s.label}</div>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <s.icon size={16} color={s.color} weight="fill" />
              </div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--txt)", marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "var(--txt3)" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <Panel title="დღევანდელი ჯავშნები" extra={<span style={{ fontSize: 12, color: "var(--txt3)" }}>{board.length} ჩანაწერი</span>}>
        {board.length === 0 ? (
          <Empty>დღეს მოძრაობა არ არის</Empty>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--bdr)" }}>
                {["ID", "სტუმარი", "ოთახი", "Check-in", "Check-out", "სტატუსი", "ჯამი", ""].map((h) => <Th key={h}>{h}</Th>)}
              </tr>
            </thead>
            <tbody>
              {board.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid var(--bdr)" }}>
                  <Td mono>{r.id}</Td>
                  <Td strong>{guestName(r.guestId)}</Td>
                  <Td>{r.room}</Td>
                  <Td>{fmtShort(r.checkin)}</Td>
                  <Td>{fmtShort(r.checkout)}</Td>
                  <td style={{ padding: "12px 16px" }}>
                    <Badge tone={RESERVATION_STATUS[r.status]}>{RESERVATION_STATUS[r.status].label}</Badge>
                  </td>
                  <Td strong>{gel(r.total)}</Td>
                  <td style={{ padding: "12px 16px" }}>
                    {r.status === "ok" ? (
                      <button onClick={() => setModal(r)} style={linkBtn}>შ-ინი →</button>
                    ) : (
                      <span style={{ color: "var(--txt3)", fontSize: 12 }}>✓</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>

      {modal && (
        <Modal onClose={() => setModal(null)} width={440}>
          <ModalHeader title="Check-in დადასტურება" onClose={() => setModal(null)} />
          <div style={{ background: "var(--bg)", borderRadius: 10, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { Icon: Users, label: "სტუმარი", value: guestName(modal.guestId) },
              { Icon: Door, label: "ოთახი", value: modal.room },
              { Icon: CalendarBlank, label: "Check-in", value: fmtShort(modal.checkin) },
              { Icon: Clock, label: "Check-out", value: `${fmtShort(modal.checkout)} · ${daysBetween(modal.checkin, modal.checkout)} ღამე` },
              { Icon: CreditCard, label: "ჯამი", value: gel(modal.total) },
            ].map(({ Icon, label, value }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Icon size={14} color="var(--txt3)" />
                <span style={{ fontSize: 12, color: "var(--txt3)", width: 80 }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: "var(--txt)" }}>{value}</span>
              </div>
            ))}
          </div>
          <ModalActions>
            <GhostButton onClick={() => setModal(null)}>გაუქმება</GhostButton>
            <PrimaryButton onClick={() => { setReservationStatus(modal.id, "in"); setModal(null); }}>
              <Check size={14} weight="bold" />დადასტურება
            </PrimaryButton>
          </ModalActions>
        </Modal>
      )}

      {newModal && <NewReservationModal onClose={() => setNewModal(false)} onSave={save} />}
    </div>
  );
}

const addBtn: React.CSSProperties = {
  background: "var(--acc)", color: "#fff", border: "none", borderRadius: 8,
  padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer",
  display: "flex", alignItems: "center", gap: 6,
};

const linkBtn: React.CSSProperties = {
  fontSize: 12, color: "var(--acc)", background: "var(--acc-s)", border: "none",
  borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontWeight: 600,
};
