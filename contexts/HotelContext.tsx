"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  HOTELS, DEFAULT_HOTEL_ID,
  type Hotel, type Reservation, type Guest, type Room,
} from "@/lib/data";

type HotelMap = Record<string, Hotel>;

const INITIAL: HotelMap = Object.fromEntries(HOTELS.map((h) => [h.id, h]));

interface HotelContextValue {
  hotel: Hotel;
  hotels: { id: string; name: string; city: string }[];
  activeId: string;
  setActiveId: (id: string) => void;
  addReservation: (r: Reservation) => void;
  setReservationStatus: (id: string, status: Reservation["status"]) => void;
  addGuest: (g: Guest) => void;
  addRoom: (r: Room) => void;
  setRoomStatus: (id: string, status: Room["status"]) => void;
  markPaid: (paymentId: string) => void;
  sendInvoice: (invoiceId: string) => void;
  syncAll: () => void;
}

const HotelContext = createContext<HotelContextValue | null>(null);

export function HotelProvider({ children }: { children: React.ReactNode }) {
  const [hotels, setHotels] = useState<HotelMap>(INITIAL);
  const [activeId, setActiveId] = useState(DEFAULT_HOTEL_ID);

  /** Apply a change to the active hotel only — each property keeps its own edits. */
  const patch = useCallback(
    (fn: (h: Hotel) => Partial<Hotel>) => {
      setHotels((prev) => {
        const current = prev[activeId];
        return { ...prev, [activeId]: { ...current, ...fn(current) } };
      });
    },
    [activeId],
  );

  const value = useMemo<HotelContextValue>(() => ({
    hotel: hotels[activeId],
    hotels: HOTELS.map(({ id, name, city }) => ({ id, name, city })),
    activeId,
    setActiveId,

    addReservation: (r) => patch((h) => ({ reservations: [r, ...h.reservations] })),

    setReservationStatus: (id, status) =>
      patch((h) => ({ reservations: h.reservations.map((r) => (r.id === id ? { ...r, status } : r)) })),

    addGuest: (g) => patch((h) => ({ guests: [g, ...h.guests] })),

    addRoom: (r) => patch((h) => ({ rooms: [...h.rooms, r] })),

    setRoomStatus: (id, status) =>
      patch((h) => ({ rooms: h.rooms.map((r) => (r.id === id ? { ...r, status } : r)) })),

    markPaid: (paymentId) =>
      patch((h) => ({ payments: h.payments.map((p) => (p.id === paymentId ? { ...p, status: "paid" as const } : p)) })),

    sendInvoice: (invoiceId) =>
      patch((h) => ({
        pendingInvoices: h.pendingInvoices.filter((i) => i.id !== invoiceId),
        syncLog: [{ time: "ახლა", action: `ფაქტურა ${invoiceId} გაგზავნილი RS.ge-ზე`, status: "ok" as const }, ...h.syncLog],
      })),

    syncAll: () =>
      patch((h) =>
        h.pendingInvoices.length === 0
          ? {}
          : {
              pendingInvoices: [],
              syncLog: [
                { time: "ახლა", action: `ავტომატური სინქ — ${h.pendingInvoices.length} ფაქტურა`, status: "ok" as const },
                ...h.syncLog,
              ],
            },
      ),
  }), [hotels, activeId, patch]);

  return <HotelContext.Provider value={value}>{children}</HotelContext.Provider>;
}

export function useHotel() {
  const ctx = useContext(HotelContext);
  if (!ctx) throw new Error("useHotel must be used inside <HotelProvider>");
  return ctx;
}

/** Look up a guest by id within the active hotel. */
export function useGuestLookup() {
  const { hotel } = useHotel();
  return useCallback((id: string) => hotel.guests.find((g) => g.id === id), [hotel.guests]);
}
