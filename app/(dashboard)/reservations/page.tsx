"use client";

import { useState } from "react";
import { Plus, MagnifyingGlass, CalendarBlank, Users, Door, CreditCard, Check } from "@phosphor-icons/react";
import Modal, { ModalHeader, ModalActions, GhostButton, PrimaryButton } from "@/components/Modal";
import NewReservationModal, { type NewReservation } from "@/components/NewReservationModal";

const INITIAL_RESERVATIONS = [
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

type Reservation = (typeof INITIAL_RESERVATIONS)[0];

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<Reservation | null>(null);
  const [newModal, setNewModal] = useState(false);

  function setStatus(id: string, status: string) {
    setReservations((p) => p.map((r) => (r.id === id ? { ...r, status } : r)));
    setModal(null);
  }

  function addReservation(r: NewReservation) {
    const nextNum = 1043 + reservations.length - INITIAL_RESERVATIONS.length;
    setReservations((p) => [
      {
        id: `JV-${nextNum}`, guest: r.guest, room: r.room || "—", type: r.type,
        checkin: r.checkin || "—", checkout: r.checkout || "—", nights: 1, price: "—", status: "ok",
      },
      ...p,
    ]);
    setNewModal(false);
  }

  const counts = {
    in:     reservations.filter(r => r.status === "in").length,
    ok:     reservations.filter(r => r.status === "ok").length,
    done:   reservations.filter(r => r.status === "done").length,
    cancel: reservations.filter(r => r.status === "cancel").length,
  };

  const filtered = reservations.filter((r) => {
    const mf = filter === "all" || r.status === filter;
    const ms = r.guest.toLowerCase().includes(search.toLowerCase()) || r.id.includes(search) || r.room.includes(search);
    return mf && ms;
  });

  const FILTERS = [
    { key: "all",    label: `ყველა (${reservations.length})` },
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
          <p style={{ fontSize: 13, color: "var(--txt3)", marginTop: 2 }}>{reservations.length} ჯავშანი სულ</p>
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
        <Modal onClose={() => setModal(null)}>
          <ModalHeader
            title={`ჯავშანი ${modal.id}`}
            sub={
              <span style={{ fontSize: 11, fontWeight: 600, color: STATUS_MAP[modal.status].color, background: STATUS_MAP[modal.status].bg, padding: "2px 8px", borderRadius: 999, display: "inline-block" }}>
                {STATUS_MAP[modal.status].label}
              </span>
            }
            onClose={() => setModal(null)}
          />
          <div style={{ background: "var(--bg)", borderRadius: 10, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { Icon: Users, label: "სტუმარი", value: modal.guest },
              { Icon: Door, label: "ოთახი", value: `${modal.room} · ${modal.type}` },
              { Icon: CalendarBlank, label: "Check-in", value: modal.checkin },
              { Icon: CalendarBlank, label: "Check-out", value: modal.checkout },
              { Icon: CreditCard, label: "ფასი", value: modal.price },
            ].map(({ Icon, label, value }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Icon size={14} color="var(--txt3)" />
                <span style={{ fontSize: 12, color: "var(--txt3)", width: 70 }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: "var(--txt)" }}>{value}</span>
              </div>
            ))}
          </div>
          <ModalActions>
            <GhostButton onClick={() => setModal(null)}>დახურვა</GhostButton>
            {modal.status === "ok" && (
              <PrimaryButton onClick={() => setStatus(modal.id, "in")}>
                <Check size={13} weight="bold" />Check-in
              </PrimaryButton>
            )}
            {modal.status === "in" && (
              <PrimaryButton color="#EF4444" onClick={() => setStatus(modal.id, "done")}>Check-out</PrimaryButton>
            )}
            {modal.status === "done" && (
              <PrimaryButton color="var(--bdr)" onClick={() => setModal(null)}>დასრულებული</PrimaryButton>
            )}
            {modal.status === "cancel" && (
              <PrimaryButton onClick={() => setStatus(modal.id, "ok")}>აღდგენა</PrimaryButton>
            )}
          </ModalActions>
        </Modal>
      )}

      {/* New reservation modal */}
      {newModal && (
        <NewReservationModal onClose={() => setNewModal(false)} onSave={addReservation} />
      )}
    </div>
  );
}
