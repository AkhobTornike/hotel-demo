"use client";

import { useMemo, useState } from "react";
import { Plus, Phone, EnvelopeSimple, MapPin, Star, Check, Calendar, Note } from "@phosphor-icons/react";
import Modal, { ModalHeader, ModalActions, GhostButton, PrimaryButton, Field } from "@/components/Modal";
import NewReservationModal from "@/components/NewReservationModal";
import { Avatar, Badge, Empty, FilterPills, PageHeader, Panel, SearchBox, Td, Th } from "@/components/ui";
import { useHotel } from "@/contexts/HotelContext";
import { RESERVATION_BAR, RESERVATION_STATUS, gel, type Guest } from "@/lib/data";
import { daysBetween, fmtShort, fmtLong } from "@/lib/dates";
import { matches } from "@/lib/search";

const EMPTY = { name: "", phone: "", email: "", country: "", notes: "" };

export default function GuestsPage() {
  const { hotel, addGuest } = useHotel();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [profile, setProfile] = useState<Guest | null>(null);
  const [addModal, setAddModal] = useState(false);
  const [bookingFor, setBookingFor] = useState<Guest | null>(null);
  const [form, setForm] = useState(EMPTY);

  /** Derive each guest's stay history from the reservation list. */
  const enriched = useMemo(
    () =>
      hotel.guests.map((g) => {
        const bookings = hotel.reservations
          .filter((r) => r.guestId === g.id)
          .sort((a, b) => b.checkin.localeCompare(a.checkin));
        const completed = bookings.filter((b) => b.status !== "cancel");
        const spent = completed.reduce((s, b) => s + b.total, 0);
        const nights = completed.reduce((s, b) => s + daysBetween(b.checkin, b.checkout), 0);
        const current = bookings.find((b) => b.status === "in");
        const upcoming = bookings.find((b) => b.status === "ok");
        return {
          guest: g,
          bookings,
          visits: completed.length,
          spent,
          nights,
          status: current ? "active" : upcoming ? "upcoming" : "past",
          current,
        };
      }),
    [hotel.guests, hotel.reservations],
  );

  const filtered = enriched.filter((e) => {
    if (filter === "vip" && !e.guest.vip) return false;
    if (filter !== "all" && filter !== "vip" && e.status !== filter) return false;
    return matches(search, [e.guest.name, e.guest.email, e.guest.phone, e.guest.country, e.guest.id]);
  });

  const counts = {
    active: enriched.filter((e) => e.status === "active").length,
    upcoming: enriched.filter((e) => e.status === "upcoming").length,
    vip: enriched.filter((e) => e.guest.vip).length,
  };

  function submit() {
    if (!form.name.trim()) return;
    addGuest({
      id: `${hotel.id === "tbilisi" ? "G" : "B"}-${Date.now().toString().slice(-3)}`,
      name: form.name,
      phone: form.phone || "—",
      email: form.email || "—",
      country: form.country || "—",
      vip: false,
      since: "2026-06-28",
      notes: form.notes,
    });
    setForm(EMPTY);
    setAddModal(false);
  }

  const detail = profile ? enriched.find((e) => e.guest.id === profile.id) : null;

  return (
    <div style={{ padding: "28px 24px" }}>
      <PageHeader
        title="სტუმრები"
        sub={`${hotel.guests.length} სტუმარი · ${counts.vip} VIP · ${hotel.name}`}
        action={
          <button onClick={() => setAddModal(true)} style={addBtn}>
            <Plus size={14} weight="bold" /> სტუმრის დამატება
          </button>
        }
      />

      <div style={{ display: "flex", gap: 8, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
        <FilterPills
          value={filter}
          onChange={setFilter}
          options={[
            { key: "all", label: `ყველა (${enriched.length})` },
            { key: "active", label: `სასტუმროში (${counts.active})` },
            { key: "upcoming", label: `მოახლოებული (${counts.upcoming})` },
            { key: "vip", label: `VIP (${counts.vip})` },
          ]}
        />
        <div style={{ marginLeft: "auto" }}>
          <SearchBox value={search} onChange={setSearch} placeholder="სახელი, email, ტელეფონი, ქვეყანა..." width={280} />
        </div>
      </div>

      <Panel>
        {filtered.length === 0 ? (
          <Empty>ვერაფერი მოიძებნა &laquo;{search}&raquo;-ზე</Empty>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--bdr)" }}>
                {["სტუმარი", "კონტაქტი", "ქვეყანა", "ვიზიტები", "ღამეები", "სულ დახარჯა", "სტატუსი", ""].map((h) => <Th key={h}>{h}</Th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.guest.id} style={{ borderBottom: "1px solid var(--bdr)" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Avatar name={e.guest.name} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--txt)", display: "flex", alignItems: "center", gap: 5 }}>
                          {e.guest.name}
                          {e.guest.vip && <Star size={11} weight="fill" color="#F59E0B" />}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--txt3)" }}>{e.guest.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ fontSize: 12, color: "var(--txt2)" }}>{e.guest.phone}</div>
                    <div style={{ fontSize: 11, color: "var(--txt3)" }}>{e.guest.email}</div>
                  </td>
                  <Td>{e.guest.country}</Td>
                  <Td strong>{e.visits}</Td>
                  <Td>{e.nights}</Td>
                  <Td strong>{gel(e.spent)}</Td>
                  <td style={{ padding: "12px 16px" }}>
                    <Badge tone={e.status === "active" ? RESERVATION_STATUS.in : e.status === "upcoming" ? RESERVATION_STATUS.ok : RESERVATION_STATUS.done}>
                      {e.status === "active" ? "სასტუმროში" : e.status === "upcoming" ? "მოახლოებული" : "დასრულებული"}
                    </Badge>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <button onClick={() => setProfile(e.guest)} style={linkBtn}>პროფილი</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>

      {/* Detailed profile */}
      {detail && (
        <Modal onClose={() => setProfile(null)} width={560}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <Avatar name={detail.guest.name} size={52} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: "var(--txt)", display: "flex", alignItems: "center", gap: 6 }}>
                {detail.guest.name}
                {detail.guest.vip && <Star size={14} weight="fill" color="#F59E0B" />}
              </div>
              <div style={{ fontSize: 12, color: "var(--txt3)" }}>
                {detail.guest.id} &middot; კლიენტი {fmtLong(detail.guest.since)}-დან
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
            <MiniStat label="ვიზიტი" value={String(detail.visits)} />
            <MiniStat label="ღამე" value={String(detail.nights)} />
            <MiniStat label="სულ დახარჯა" value={gel(detail.spent)} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
            <Contact Icon={Phone} value={detail.guest.phone} />
            <Contact Icon={EnvelopeSimple} value={detail.guest.email} />
            <Contact Icon={MapPin} value={detail.guest.country} />
            {detail.guest.notes && <Contact Icon={Note} value={detail.guest.notes} />}
          </div>

          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--txt)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
            <Calendar size={14} /> ჯავშნების ისტორია ({detail.bookings.length})
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 220, overflowY: "auto" }}>
            {detail.bookings.length === 0 && <Empty>ჯავშნები არ არის</Empty>}
            {detail.bookings.map((b) => (
              <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--bg)", borderRadius: 8, padding: "9px 12px" }}>
                <span style={{ width: 3, height: 26, borderRadius: 2, background: (RESERVATION_BAR[b.status] ?? RESERVATION_BAR.ok).rule, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "var(--txt)" }}>
                    ოთახი {b.room} &middot; <span style={{ fontFamily: "var(--mono)", color: "var(--txt3)" }}>{b.id}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--txt3)" }}>
                    {fmtShort(b.checkin)} → {fmtShort(b.checkout)} &middot; {daysBetween(b.checkin, b.checkout)} ღამე &middot; {b.source}
                  </div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--txt)" }}>{gel(b.total)}</span>
                <Badge tone={RESERVATION_STATUS[b.status]}>{RESERVATION_STATUS[b.status].label}</Badge>
              </div>
            ))}
          </div>

          <ModalActions>
            <GhostButton onClick={() => setProfile(null)}>დახურვა</GhostButton>
            <PrimaryButton onClick={() => { setBookingFor(detail.guest); setProfile(null); }}>
              ახალი ჯავშანი
            </PrimaryButton>
          </ModalActions>
        </Modal>
      )}

      {/* Add guest */}
      {addModal && (
        <Modal onClose={() => setAddModal(false)}>
          <ModalHeader title="სტუმრის დამატება" onClose={() => setAddModal(false)} />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Field label="სახელი და გვარი" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="გ. მამულაშვილი" />
            <Field label="ტელეფონი" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="+995 555 123 456" />
            <Field label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="guest@example.com" />
            <Field label="ქვეყანა" value={form.country} onChange={(v) => setForm({ ...form, country: v })} placeholder="საქართველო" />
            <Field label="შენიშვნა" value={form.notes} onChange={(v) => setForm({ ...form, notes: v })} placeholder="პრეფერენციები, ალერგიები..." />
          </div>
          <ModalActions>
            <GhostButton onClick={() => setAddModal(false)}>გაუქმება</GhostButton>
            <PrimaryButton onClick={submit}><Check size={14} weight="bold" />შენახვა</PrimaryButton>
          </ModalActions>
        </Modal>
      )}

      {bookingFor && (
        <NewReservationModal
          initialGuest={bookingFor.name}
          onClose={() => setBookingFor(null)}
          onSave={() => setBookingFor(null)}
        />
      )}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "var(--bg)", borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
      <div style={{ fontSize: 18, fontWeight: 800, color: "var(--txt)" }}>{value}</div>
      <div style={{ fontSize: 11, color: "var(--txt3)" }}>{label}</div>
    </div>
  );
}

function Contact({ Icon, value }: { Icon: React.ElementType; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "var(--txt2)" }}>
      <Icon size={14} color="var(--txt3)" style={{ marginTop: 2, flexShrink: 0 }} />
      {value}
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
  borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontWeight: 600,
};
