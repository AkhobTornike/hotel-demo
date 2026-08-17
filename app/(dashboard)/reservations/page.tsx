"use client";

import { useState } from "react";
import { Plus, CalendarBlank, Users, Door, CreditCard, Check, Tag } from "@phosphor-icons/react";
import Modal, { ModalHeader, ModalActions, GhostButton, PrimaryButton } from "@/components/Modal";
import NewReservationModal, { type NewReservation } from "@/components/NewReservationModal";
import { Badge, Empty, FilterPills, PageHeader, Panel, SearchBox, Td, Th } from "@/components/ui";
import { useHotel } from "@/contexts/HotelContext";
import { RESERVATION_STATUS, gel, type Reservation } from "@/lib/data";
import { daysBetween, fmtShort, dowLabel } from "@/lib/dates";
import { matches } from "@/lib/search";

export default function ReservationsPage() {
  const { hotel, addReservation, setReservationStatus } = useHotel();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<Reservation | null>(null);
  const [newModal, setNewModal] = useState(false);

  const guestName = (id: string) => hotel.guests.find((g) => g.id === id)?.name ?? "—";

  const counts = {
    in: hotel.reservations.filter((r) => r.status === "in").length,
    ok: hotel.reservations.filter((r) => r.status === "ok").length,
    done: hotel.reservations.filter((r) => r.status === "done").length,
    cancel: hotel.reservations.filter((r) => r.status === "cancel").length,
  };

  const filtered = hotel.reservations.filter((r) => {
    if (filter !== "all" && r.status !== filter) return false;
    return matches(search, [guestName(r.guestId), r.id, r.room, r.source, fmtShort(r.checkin)]);
  });

  function save(n: NewReservation) {
    const prefix = hotel.id === "tbilisi" ? "JV" : "BT";
    addReservation({
      id: `${prefix}-${Date.now().toString().slice(-4)}`,
      guestId: hotel.guests.find((g) => g.name === n.guest)?.id ?? hotel.guests[0].id,
      room: n.room || hotel.rooms[0].id,
      checkin: n.checkin || "2026-06-28",
      checkout: n.checkout || "2026-06-30",
      total: 0,
      status: "ok",
      source: "პირდაპირი",
      color: "#10B981",
    });
    setNewModal(false);
  }

  return (
    <div style={{ padding: "28px 24px" }}>
      <PageHeader
        title="ჯავშნები"
        sub={`${hotel.reservations.length} ჯავშანი · ${hotel.name}`}
        action={
          <button onClick={() => setNewModal(true)} style={addBtn}>
            <Plus size={14} weight="bold" /> ახალი ჯავშანი
          </button>
        }
      />

      <div style={{ display: "flex", gap: 8, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
        <FilterPills
          value={filter}
          onChange={setFilter}
          options={[
            { key: "all", label: `ყველა (${hotel.reservations.length})` },
            { key: "in", label: `სასტუმროში (${counts.in})` },
            { key: "ok", label: `დადასტურებული (${counts.ok})` },
            { key: "done", label: `დასრულებული (${counts.done})` },
            { key: "cancel", label: `გაუქმებული (${counts.cancel})` },
          ]}
        />
        <div style={{ marginLeft: "auto" }}>
          <SearchBox value={search} onChange={setSearch} placeholder="სტუმარი, ID, ოთახი, არხი..." width={260} />
        </div>
      </div>

      <Panel>
        {filtered.length === 0 ? (
          <Empty>ვერაფერი მოიძებნა</Empty>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--bdr)" }}>
                {["ID", "სტუმარი", "ოთახი", "Check-in", "Check-out", "ღამე", "არხი", "ჯამი", "სტატუსი"].map((h) => <Th key={h}>{h}</Th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} onClick={() => setModal(r)} style={{ borderBottom: "1px solid var(--bdr)", cursor: "pointer" }}>
                  <Td mono>{r.id}</Td>
                  <Td strong>{guestName(r.guestId)}</Td>
                  <Td>{r.room}</Td>
                  <Td>{fmtShort(r.checkin)}</Td>
                  <Td>{fmtShort(r.checkout)}</Td>
                  <Td>{daysBetween(r.checkin, r.checkout)}</Td>
                  <Td dim>{r.source}</Td>
                  <Td strong>{gel(r.total)}</Td>
                  <td style={{ padding: "12px 16px" }}>
                    <Badge tone={RESERVATION_STATUS[r.status]}>{RESERVATION_STATUS[r.status].label}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>

      {modal && (
        <Modal onClose={() => setModal(null)} width={440}>
          <ModalHeader
            title={`ჯავშანი ${modal.id}`}
            sub={<Badge tone={RESERVATION_STATUS[modal.status]}>{RESERVATION_STATUS[modal.status].label}</Badge>}
            onClose={() => setModal(null)}
          />
          <div style={{ background: "var(--bg)", borderRadius: 10, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { Icon: Users, label: "სტუმარი", value: guestName(modal.guestId) },
              { Icon: Door, label: "ოთახი", value: modal.room },
              { Icon: CalendarBlank, label: "Check-in", value: `${fmtShort(modal.checkin)} (${dowLabel(modal.checkin)})` },
              { Icon: CalendarBlank, label: "Check-out", value: `${fmtShort(modal.checkout)} (${dowLabel(modal.checkout)})` },
              { Icon: Tag, label: "არხი", value: modal.source },
              { Icon: CreditCard, label: "ჯამი", value: `${gel(modal.total)} · ${daysBetween(modal.checkin, modal.checkout)} ღამე` },
            ].map(({ Icon, label, value }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Icon size={14} color="var(--txt3)" />
                <span style={{ fontSize: 12, color: "var(--txt3)", width: 74 }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: "var(--txt)" }}>{value}</span>
              </div>
            ))}
          </div>
          <ModalActions>
            <GhostButton onClick={() => setModal(null)}>დახურვა</GhostButton>
            {modal.status === "ok" && (
              <PrimaryButton onClick={() => { setReservationStatus(modal.id, "in"); setModal(null); }}>
                <Check size={13} weight="bold" />Check-in
              </PrimaryButton>
            )}
            {modal.status === "in" && (
              <PrimaryButton color="#EF4444" onClick={() => { setReservationStatus(modal.id, "done"); setModal(null); }}>
                Check-out
              </PrimaryButton>
            )}
            {modal.status === "cancel" && (
              <PrimaryButton onClick={() => { setReservationStatus(modal.id, "ok"); setModal(null); }}>აღდგენა</PrimaryButton>
            )}
            {modal.status === "done" && (
              <PrimaryButton color="var(--bdr)" onClick={() => setModal(null)}>დასრულებული</PrimaryButton>
            )}
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
