"use client";

import { useState } from "react";
import Modal, { ModalHeader, ModalActions, GhostButton, Field } from "./Modal";

export interface NewReservation {
  guest: string;
  room: string;
  checkin: string;
  checkout: string;
  type: string;
}

export const ROOM_TYPES = ["სტანდარტი", "დელუქსი", "სუიტი", "პენტჰაუსი"];

/** Shared "new booking" form — used from the dashboard, the reservations page and guest profiles. */
export default function NewReservationModal({
  onClose,
  onSave,
  initialGuest = "",
}: {
  onClose: () => void;
  onSave: (r: NewReservation) => void;
  initialGuest?: string;
}) {
  const [form, setForm] = useState<NewReservation>({
    guest: initialGuest,
    room: "",
    checkin: "",
    checkout: "",
    type: ROOM_TYPES[0],
  });

  const valid = form.guest.trim() !== "" && form.room.trim() !== "";

  return (
    <Modal onClose={onClose} width={440}>
      <ModalHeader title="ახალი ჯავშანი" onClose={onClose} />
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Field label="სტუმრის სახელი" value={form.guest} onChange={(v) => setForm({ ...form, guest: v })} placeholder="გ. მამულაშვილი" />
        <Field label="ოთახის ნომერი" value={form.room} onChange={(v) => setForm({ ...form, room: v })} placeholder="204" />
        <Field label="Check-in" value={form.checkin} onChange={(v) => setForm({ ...form, checkin: v })} placeholder="28 ივნ" />
        <Field label="Check-out" value={form.checkout} onChange={(v) => setForm({ ...form, checkout: v })} placeholder="30 ივნ" />
        <div>
          <label style={{ fontSize: 12, fontWeight: 500, color: "var(--txt2)", display: "block", marginBottom: 5 }}>ოთახის ტიპი</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--bdr)", fontSize: 13, color: "var(--txt)", outline: "none", background: "var(--bg)" }}
          >
            {ROOM_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <ModalActions>
        <GhostButton onClick={onClose}>გაუქმება</GhostButton>
        <button
          onClick={() => valid && onSave(form)}
          disabled={!valid}
          style={{
            padding: "10px 0", borderRadius: 8, border: "none",
            background: valid ? "var(--acc)" : "var(--bdr)",
            color: valid ? "#fff" : "var(--txt3)",
            fontSize: 13, fontWeight: 600, cursor: valid ? "pointer" : "not-allowed",
          }}
        >
          შენახვა
        </button>
      </ModalActions>
    </Modal>
  );
}
