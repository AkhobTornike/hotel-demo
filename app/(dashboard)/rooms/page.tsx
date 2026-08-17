"use client";

import { useState } from "react";
import { Plus, Check, Eye } from "@phosphor-icons/react";
import Modal, { ModalHeader, ModalActions, GhostButton, PrimaryButton, Field } from "@/components/Modal";
import { Badge, Empty, FilterPills, PageHeader, SearchBox } from "@/components/ui";
import { useHotel } from "@/contexts/HotelContext";
import { ROOM_STATUS, ROOM_TYPES, gel, type Room } from "@/lib/data";
import { TODAY, coversNight, fmtShort } from "@/lib/dates";
import { matches } from "@/lib/search";

const EMPTY = { id: "", type: ROOM_TYPES[0], floor: "", capacity: "", price: "", view: "" };

export default function RoomsPage() {
  const { hotel, addRoom, setRoomStatus } = useHotel();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<Room | null>(null);
  const [addModal, setAddModal] = useState(false);
  const [form, setForm] = useState(EMPTY);

  /** Who is in this room tonight, according to the booking list. */
  const occupantOf = (roomId: string) => {
    const r = hotel.reservations.find(
      (x) => x.room === roomId && x.status !== "cancel" && coversNight(TODAY, x.checkin, x.checkout),
    );
    if (!r) return null;
    return { reservation: r, guest: hotel.guests.find((g) => g.id === r.guestId) };
  };

  const counts = {
    free: hotel.rooms.filter((r) => r.status === "free").length,
    occupied: hotel.rooms.filter((r) => r.status === "occupied").length,
    cleaning: hotel.rooms.filter((r) => r.status === "cleaning").length,
    maint: hotel.rooms.filter((r) => r.status === "maint").length,
  };

  const filtered = hotel.rooms.filter((r) => {
    if (filter !== "all" && r.status !== filter) return false;
    return matches(search, [r.id, r.type, r.view, occupantOf(r.id)?.guest?.name]);
  });

  function submit() {
    if (!form.id.trim()) return;
    addRoom({
      id: form.id,
      type: form.type,
      floor: Number(form.floor) || 1,
      capacity: Number(form.capacity) || 2,
      price: Number(form.price) || 0,
      status: "free",
      view: form.view || "ეზო",
    });
    setForm(EMPTY);
    setAddModal(false);
  }

  const occupant = modal ? occupantOf(modal.id) : null;

  return (
    <div style={{ padding: "28px 24px" }}>
      <PageHeader
        title="ოთახები"
        sub={`${counts.occupied}/${hotel.rooms.length} დაკავებული · ${counts.free} თავისუფალი · ${hotel.name}`}
        action={
          <button onClick={() => setAddModal(true)} style={addBtn}>
            <Plus size={14} weight="bold" /> ოთახის დამატება
          </button>
        }
      />

      <div style={{ display: "flex", gap: 8, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
        <FilterPills
          value={filter}
          onChange={setFilter}
          options={[
            { key: "all", label: `ყველა (${hotel.rooms.length})` },
            { key: "free", label: `თავისუფალი (${counts.free})` },
            { key: "occupied", label: `დაკავებული (${counts.occupied})` },
            { key: "cleaning", label: `დასუფთავება (${counts.cleaning})` },
            { key: "maint", label: `სარემონტო (${counts.maint})` },
          ]}
        />
        <div style={{ marginLeft: "auto" }}>
          <SearchBox value={search} onChange={setSearch} placeholder="ოთახი, ტიპი, ხედი, სტუმარი..." width={250} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ background: "var(--panel)", border: "1px solid var(--bdr)", borderRadius: 12 }}>
          <Empty>ვერაფერი მოიძებნა</Empty>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
          {filtered.map((r) => {
            const st = ROOM_STATUS[r.status];
            const occ = occupantOf(r.id);
            return (
              <div key={r.id} onClick={() => setModal(r)} style={{
                background: "var(--panel)", border: `1.5px solid ${st.dot}`,
                borderRadius: 12, padding: 16, cursor: "pointer",
              }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: "var(--txt)", marginBottom: 2, fontFamily: "monospace" }}>{r.id}</div>
                <div style={{ fontSize: 11, color: "var(--txt3)", marginBottom: 8 }}>
                  {r.type} &middot; {r.capacity} სტ. &middot; {r.floor} სართ.
                </div>
                <div style={{ fontSize: 11, color: "var(--txt3)", marginBottom: 10, display: "flex", alignItems: "center", gap: 4 }}>
                  <Eye size={11} /> {r.view}
                </div>
                {occ?.guest && (
                  <div style={{ fontSize: 12, fontWeight: 500, color: "var(--txt2)", marginBottom: 8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {occ.guest.name}
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Badge tone={st}>{st.label}</Badge>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--txt2)" }}>{gel(r.price)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <Modal onClose={() => setModal(null)} width={420}>
          <ModalHeader
            title={<span style={{ fontSize: 24, fontWeight: 800, fontFamily: "monospace" }}>ოთახი {modal.id}</span>}
            sub={`${modal.type} · ${modal.floor} სართული · ${modal.view}`}
            onClose={() => setModal(null)}
          />
          <div style={{ background: "var(--bg)", borderRadius: 10, padding: 16, display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
            <Row k="ტიპი" v={modal.type} />
            <Row k="ტევადობა" v={`${modal.capacity} სტუმარი`} />
            <Row k="ხედი" v={modal.view} />
            <Row k="ფასი" v={`${gel(modal.price)} / ღამე`} />
            <Row k="სტატუსი" v={ROOM_STATUS[modal.status].label} />
          </div>

          {occupant?.guest && (
            <div style={{ marginTop: 12, background: "var(--acc-s)", borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 11, color: "var(--acc-txt)", fontWeight: 600, marginBottom: 4 }}>ამჟამინდელი სტუმარი</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--txt)" }}>{occupant.guest.name}</div>
              <div style={{ fontSize: 12, color: "var(--txt2)", marginTop: 2 }}>
                {fmtShort(occupant.reservation.checkin)} → {fmtShort(occupant.reservation.checkout)} &middot; {occupant.reservation.id}
              </div>
            </div>
          )}

          <ModalActions>
            <GhostButton onClick={() => setModal(null)}>დახურვა</GhostButton>
            {modal.status === "free" && (
              <PrimaryButton onClick={() => { setRoomStatus(modal.id, "occupied"); setModal(null); }}>ჯავშნის გახსნა</PrimaryButton>
            )}
            {modal.status === "occupied" && (
              <PrimaryButton color="#EF4444" onClick={() => { setRoomStatus(modal.id, "cleaning"); setModal(null); }}>Check-out</PrimaryButton>
            )}
            {modal.status === "cleaning" && (
              <PrimaryButton color="#F59E0B" onClick={() => { setRoomStatus(modal.id, "free"); setModal(null); }}>
                <Check size={13} />დასუფთავდა
              </PrimaryButton>
            )}
            {modal.status === "maint" && (
              <PrimaryButton onClick={() => { setRoomStatus(modal.id, "free"); setModal(null); }}>რემონტი დასრულდა</PrimaryButton>
            )}
          </ModalActions>
        </Modal>
      )}

      {addModal && (
        <Modal onClose={() => setAddModal(false)}>
          <ModalHeader title="ოთახის დამატება" onClose={() => setAddModal(false)} />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Field label="ოთახის ნომერი" value={form.id} onChange={(v) => setForm({ ...form, id: v })} placeholder="405" />
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: "var(--txt2)", display: "block", marginBottom: 5 }}>ტიპი</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={selectStyle}>
                {ROOM_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <Field label="სართული" value={form.floor} onChange={(v) => setForm({ ...form, floor: v })} placeholder="4" />
            <Field label="ტევადობა" value={form.capacity} onChange={(v) => setForm({ ...form, capacity: v })} placeholder="2" />
            <Field label="ფასი / ღამე (₾)" value={form.price} onChange={(v) => setForm({ ...form, price: v })} placeholder="120" />
            <Field label="ხედი" value={form.view} onChange={(v) => setForm({ ...form, view: v })} placeholder="ზღვა" />
          </div>
          <ModalActions>
            <GhostButton onClick={() => setAddModal(false)}>გაუქმება</GhostButton>
            <PrimaryButton onClick={submit}><Check size={14} weight="bold" />შენახვა</PrimaryButton>
          </ModalActions>
        </Modal>
      )}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ color: "var(--txt3)" }}>{k}</span>
      <span style={{ fontWeight: 500, color: "var(--txt)" }}>{v}</span>
    </div>
  );
}

const addBtn: React.CSSProperties = {
  background: "var(--acc)", color: "#fff", border: "none", borderRadius: 8,
  padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer",
  display: "flex", alignItems: "center", gap: 6,
};

const selectStyle: React.CSSProperties = {
  width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--bdr)",
  fontSize: 13, color: "var(--txt)", outline: "none", background: "var(--bg)",
};
