"use client";

import { useState } from "react";
import { Plus, Phone, EnvelopeSimple, MapPin, MagnifyingGlass, Star, Check } from "@phosphor-icons/react";
import Modal, { ModalHeader, ModalActions, GhostButton, PrimaryButton, Field } from "@/components/Modal";
import NewReservationModal from "@/components/NewReservationModal";

const INITIAL_GUESTS = [
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

type Guest = (typeof INITIAL_GUESTS)[0];

const EMPTY_GUEST = { name: "", phone: "", email: "", country: "" };

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>(INITIAL_GUESTS);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<Guest | null>(null);
  const [addModal, setAddModal] = useState(false);
  const [form, setForm] = useState(EMPTY_GUEST);
  const [bookingFor, setBookingFor] = useState<string | null>(null);

  function addGuest() {
    if (!form.name.trim()) return;
    const id = `G-${String(guests.length + 1).padStart(3, "0")}`;
    setGuests((p) => [
      { id, name: form.name, phone: form.phone || "—", email: form.email || "—", country: form.country || "—", visits: 0, spent: "₾0", vip: false, status: "upcoming" },
      ...p,
    ]);
    setForm(EMPTY_GUEST);
    setAddModal(false);
  }

  const filtered = guests.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.email.toLowerCase().includes(search.toLowerCase()) ||
    g.country.includes(search)
  );

  return (
    <div style={{ padding: "28px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--txt)" }}>სტუმრები</h1>
          <p style={{ fontSize: 13, color: "var(--txt3)", marginTop: 2 }}>{guests.length} სტუმარი სულ &middot; {guests.filter(g => g.vip).length} VIP</p>
        </div>
        <button onClick={() => setAddModal(true)} style={{ background: "var(--acc)", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
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
        <Modal onClose={() => setModal(null)}>
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
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            {[
              { Icon: Phone, value: modal.phone },
              { Icon: EnvelopeSimple, value: modal.email },
              { Icon: MapPin, value: modal.country },
            ].map(({ Icon, value }) => (
              <div key={value} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--txt2)" }}>
                <Icon size={14} color="var(--txt3)" />
                {value}
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, background: "var(--bg)", borderRadius: 10, padding: 16 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "var(--txt)" }}>{modal.visits}</div>
              <div style={{ fontSize: 11, color: "var(--txt3)" }}>ვიზიტი</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "var(--txt)" }}>{modal.spent}</div>
              <div style={{ fontSize: 11, color: "var(--txt3)" }}>სულ დახარჯა</div>
            </div>
          </div>
          <ModalActions>
            <GhostButton onClick={() => setModal(null)}>დახურვა</GhostButton>
            <PrimaryButton onClick={() => { setBookingFor(modal.name); setModal(null); }}>
              ახალი ჯავშანი
            </PrimaryButton>
          </ModalActions>
        </Modal>
      )}

      {/* Add guest modal */}
      {addModal && (
        <Modal onClose={() => setAddModal(false)}>
          <ModalHeader title="სტუმრის დამატება" onClose={() => setAddModal(false)} />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Field label="სახელი და გვარი" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="გ. მამულაშვილი" />
            <Field label="ტელეფონი" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="+995 555 123 456" />
            <Field label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="guest@example.com" />
            <Field label="ქვეყანა" value={form.country} onChange={(v) => setForm({ ...form, country: v })} placeholder="საქართველო" />
          </div>
          <ModalActions>
            <GhostButton onClick={() => setAddModal(false)}>გაუქმება</GhostButton>
            <PrimaryButton onClick={addGuest}>
              <Check size={14} weight="bold" />შენახვა
            </PrimaryButton>
          </ModalActions>
        </Modal>
      )}

      {/* New booking for a guest */}
      {bookingFor && (
        <NewReservationModal
          initialGuest={bookingFor}
          onClose={() => setBookingFor(null)}
          onSave={() => setBookingFor(null)}
        />
      )}
    </div>
  );
}
