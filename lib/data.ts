/** Demo dataset. Two independent properties — separate rooms, guests, bookings,
 *  payments, RS.ge queue and yearly figures. Everything is pinned to 2026-06-28. */

export type ReservationStatus = "in" | "ok" | "done" | "cancel";
export type RoomStatus = "free" | "occupied" | "cleaning" | "maint";
export type PaymentStatus = "paid" | "pending" | "refund";

export interface Guest {
  id: string;
  name: string;
  phone: string;
  email: string;
  country: string;
  vip: boolean;
  since: string;
  notes: string;
}

export interface Room {
  id: string;
  type: string;
  floor: number;
  capacity: number;
  price: number;
  status: RoomStatus;
  view: string;
}

export interface Reservation {
  id: string;
  guestId: string;
  room: string;
  checkin: string;
  checkout: string;
  total: number;
  status: ReservationStatus;
  source: string;
}

export interface Payment {
  id: string;
  date: string;
  guestId: string;
  reservationId: string;
  method: string;
  amount: number;
  status: PaymentStatus;
}

export interface SyncEntry { time: string; action: string; status: "ok" | "error" }
export interface PendingInvoice { id: string; guestId: string; amount: number; date: string }
export interface MonthStat { month: string; revenue: number; bookings: number; occupancy: number }

export interface Hotel {
  id: string;
  name: string;
  city: string;
  tagline: string;
  rooms: Room[];
  guests: Guest[];
  reservations: Reservation[];
  payments: Payment[];
  syncLog: SyncEntry[];
  pendingInvoices: PendingInvoice[];
  monthly: MonthStat[];
  yearly: { revenue: number; bookings: number; occupancy: string; revpar: string };
}

/* ───────────────────────── Tbilisi Grand Hotel ───────────────────────── */

const TBILISI_GUESTS: Guest[] = [
  { id: "G-101", name: "გიორგი მამულაშვილი", phone: "+995 555 123 456", email: "g.mamulashvili@gmail.com", country: "საქართველო", vip: true,  since: "2023-04-12", notes: "ყოველთვის ითხოვს მაღალ სართულს, არა-მწეველი." },
  { id: "G-102", name: "Иван Петров",          phone: "+7 916 234 5678",  email: "ivan.petrov@mail.ru",      country: "რუსეთი",      vip: false, since: "2025-09-02", notes: "საქმიანი ვიზიტები, ინვოისი კომპანიაზე." },
  { id: "G-103", name: "Ana Müller",           phone: "+49 171 345 6789", email: "ana.mueller@gmail.com",    country: "გერმანია",    vip: false, since: "2026-06-28", notes: "პირველი ვიზიტი, ადრეული check-in ითხოვა." },
  { id: "G-104", name: "ნინო კვარაცხელია",     phone: "+995 577 987 654", email: "nino.k@gmail.com",         country: "საქართველო", vip: true,  since: "2022-07-19", notes: "მუდმივი კლიენტი — 10% ფასდაკლება." },
  { id: "G-105", name: "მარიამ გელაშვილი",     phone: "+995 598 111 222", email: "mariam.g@yahoo.com",       country: "საქართველო", vip: false, since: "2024-11-30", notes: "ოჯახური ვიზიტები, საბავშვო საწოლი." },
  { id: "G-106", name: "David Johnson",        phone: "+1 415 555 0100",  email: "djohnson@company.com",     country: "აშშ",         vip: false, since: "2026-07-01", notes: "კონფერენციის დელეგატი." },
  { id: "G-107", name: "ნინო ბერიძე",          phone: "+995 555 444 333", email: "nino.beridze@gmail.com",   country: "საქართველო", vip: false, since: "2025-03-08", notes: "" },
  { id: "G-108", name: "Yuki Tanaka",          phone: "+81 90 1234 5678", email: "y.tanaka@jp.co",           country: "იაპონია",     vip: false, since: "2026-06-20", notes: "ვეგეტარიანული საუზმე." },
  { id: "G-109", name: "ლევან ხარაზი",         phone: "+995 591 776 040", email: "levan.kharazi@gmail.com",  country: "საქართველო", vip: false, since: "2026-05-14", notes: "" },
];

const TBILISI_ROOMS: Room[] = [
  { id: "101", type: "სტანდარტი", floor: 1, capacity: 2, price: 90,  status: "free",     view: "ეზო" },
  { id: "102", type: "სტანდარტი", floor: 1, capacity: 2, price: 90,  status: "occupied", view: "ეზო" },
  { id: "103", type: "სტანდარტი", floor: 1, capacity: 2, price: 90,  status: "cleaning", view: "ეზო" },
  { id: "104", type: "დელუქსი",   floor: 1, capacity: 2, price: 150, status: "free",     view: "ქუჩა" },
  { id: "108", type: "სტანდარტი", floor: 1, capacity: 2, price: 95,  status: "occupied", view: "ეზო" },
  { id: "201", type: "სტანდარტი", floor: 2, capacity: 2, price: 95,  status: "free",     view: "ქუჩა" },
  { id: "204", type: "სტანდარტი", floor: 2, capacity: 2, price: 95,  status: "occupied", view: "ქუჩა" },
  { id: "215", type: "დელუქსი",   floor: 2, capacity: 3, price: 160, status: "free",     view: "მთაწმინდა" },
  { id: "301", type: "სუიტი",     floor: 3, capacity: 4, price: 280, status: "free",     view: "მთაწმინდა" },
  { id: "303", type: "დელუქსი",   floor: 3, capacity: 2, price: 155, status: "maint",    view: "ქუჩა" },
  { id: "312", type: "სუიტი",     floor: 3, capacity: 4, price: 290, status: "occupied", view: "მთაწმინდა" },
  { id: "401", type: "პენტჰაუსი", floor: 4, capacity: 6, price: 550, status: "free",     view: "პანორამა" },
];

const TBILISI_RESERVATIONS: Reservation[] = [
  { id: "JV-1042", guestId: "G-101", room: "204", checkin: "2026-06-28", checkout: "2026-06-30", total: 190, status: "in",     source: "პირდაპირი" },
  { id: "JV-1041", guestId: "G-102", room: "312", checkin: "2026-06-27", checkout: "2026-06-29", total: 580, status: "in",     source: "Booking.com" },
  { id: "JV-1040", guestId: "G-103", room: "108", checkin: "2026-06-28", checkout: "2026-07-01", total: 285, status: "in",     source: "Booking.com" },
  { id: "JV-1039", guestId: "G-104", room: "215", checkin: "2026-06-29", checkout: "2026-07-02", total: 480, status: "ok",     source: "პირდაპირი" },
  { id: "JV-1038", guestId: "G-105", room: "401", checkin: "2026-06-30", checkout: "2026-07-03", total: 1650, status: "ok",    source: "ტელეფონი" },
  { id: "JV-1037", guestId: "G-106", room: "301", checkin: "2026-07-01", checkout: "2026-07-05", total: 1120, status: "ok",    source: "Airbnb" },
  { id: "JV-1036", guestId: "G-107", room: "102", checkin: "2026-06-25", checkout: "2026-06-27", total: 180, status: "done",   source: "პირდაპირი" },
  { id: "JV-1035", guestId: "G-108", room: "303", checkin: "2026-06-20", checkout: "2026-06-23", total: 465, status: "done",   source: "Booking.com" },
  { id: "JV-1034", guestId: "G-101", room: "101", checkin: "2026-06-10", checkout: "2026-06-12", total: 180, status: "done",   source: "პირდაპირი" },
  { id: "JV-1033", guestId: "G-103", room: "201", checkin: "2026-06-05", checkout: "2026-06-08", total: 285, status: "cancel", source: "Booking.com" },
  { id: "JV-1032", guestId: "G-104", room: "301", checkin: "2026-05-18", checkout: "2026-05-21", total: 840, status: "done",   source: "პირდაპირი" },
  { id: "JV-1031", guestId: "G-109", room: "104", checkin: "2026-06-24", checkout: "2026-06-26", total: 300, status: "done",   source: "ტელეფონი" },
  { id: "JV-1030", guestId: "G-101", room: "215", checkin: "2026-04-02", checkout: "2026-04-05", total: 480, status: "done",   source: "პირდაპირი" },
  { id: "JV-1029", guestId: "G-104", room: "401", checkin: "2026-03-14", checkout: "2026-03-16", total: 1100, status: "done",  source: "პირდაპირი" },
];

const TBILISI_PAYMENTS: Payment[] = [
  { id: "TX-8821", date: "2026-06-28", guestId: "G-101", reservationId: "JV-1042", method: "ბარათი",  amount: 190,  status: "paid" },
  { id: "TX-8820", date: "2026-06-28", guestId: "G-103", reservationId: "JV-1040", method: "ნაღდი",   amount: 285,  status: "paid" },
  { id: "TX-8819", date: "2026-06-27", guestId: "G-102", reservationId: "JV-1041", method: "ბარათი",  amount: 580,  status: "paid" },
  { id: "TX-8818", date: "2026-06-29", guestId: "G-104", reservationId: "JV-1039", method: "TBC Pay", amount: 480,  status: "pending" },
  { id: "TX-8817", date: "2026-06-30", guestId: "G-105", reservationId: "JV-1038", method: "ბარათი",  amount: 1650, status: "pending" },
  { id: "TX-8816", date: "2026-07-01", guestId: "G-106", reservationId: "JV-1037", method: "BOG Pay", amount: 1120, status: "pending" },
  { id: "TX-8815", date: "2026-06-25", guestId: "G-107", reservationId: "JV-1036", method: "ნაღდი",   amount: 180,  status: "paid" },
  { id: "TX-8814", date: "2026-06-23", guestId: "G-108", reservationId: "JV-1035", method: "ბარათი",  amount: 465,  status: "paid" },
  { id: "TX-8813", date: "2026-06-24", guestId: "G-109", reservationId: "JV-1031", method: "ბარათი",  amount: 300,  status: "paid" },
  { id: "TX-8812", date: "2026-06-05", guestId: "G-103", reservationId: "JV-1033", method: "ბარათი",  amount: 285,  status: "refund" },
];

/* ───────────────────────── Batumi Seaside Resort ───────────────────────── */

const BATUMI_GUESTS: Guest[] = [
  { id: "B-201", name: "თამარ ჩხეიძე",       phone: "+995 599 303 771", email: "t.chkheidze@gmail.com",   country: "საქართველო", vip: true,  since: "2024-06-03", notes: "ყოველ ზაფხულს 2 კვირით, ზღვის ხედი სავალდებულო." },
  { id: "B-202", name: "Mehmet Yılmaz",       phone: "+90 532 445 1290", email: "m.yilmaz@turkmail.com",   country: "თურქეთი",     vip: false, since: "2025-07-11", notes: "ოჯახით, 2 ბავშვი." },
  { id: "B-203", name: "Olena Kovalenko",     phone: "+380 67 221 8834", email: "o.kovalenko@ukr.net",     country: "უკრაინა",     vip: true,  since: "2023-08-22", notes: "გრძელვადიანი ყოფნა, თვეში ერთხელ." },
  { id: "B-204", name: "ზურაბ ლომიძე",       phone: "+995 574 618 905", email: "z.lomidze@gmail.com",     country: "საქართველო", vip: false, since: "2026-06-15", notes: "" },
  { id: "B-205", name: "Sarah Whitfield",     phone: "+44 7700 900413",  email: "s.whitfield@uk.co",       country: "დიდი ბრიტანეთი", vip: false, since: "2026-06-26", notes: "სპა პაკეტი დაჯავშნილი." },
  { id: "B-206", name: "Arman Grigoryan",     phone: "+374 91 556 210",  email: "arman.g@armail.am",       country: "სომხეთი",     vip: false, since: "2025-05-09", notes: "" },
  { id: "B-207", name: "ეკატერინე ჯაფარიძე", phone: "+995 592 884 117", email: "eka.japaridze@gmail.com", country: "საქართველო", vip: false, since: "2026-04-18", notes: "ღონისძიების ორგანიზატორი — ჯგუფური ჯავშნები." },
  { id: "B-208", name: "Daniel Roth",         phone: "+43 664 337 1180", email: "d.roth@austria.at",       country: "ავსტრია",     vip: false, since: "2026-06-22", notes: "" },
];

const BATUMI_ROOMS: Room[] = [
  { id: "A-11", type: "სტანდარტი",  floor: 1, capacity: 2, price: 120, status: "occupied", view: "ბაღი" },
  { id: "A-12", type: "სტანდარტი",  floor: 1, capacity: 2, price: 120, status: "free",     view: "ბაღი" },
  { id: "A-14", type: "დელუქსი",    floor: 1, capacity: 3, price: 190, status: "cleaning", view: "ზღვა" },
  { id: "B-21", type: "დელუქსი",    floor: 2, capacity: 3, price: 210, status: "occupied", view: "ზღვა" },
  { id: "B-22", type: "დელუქსი",    floor: 2, capacity: 3, price: 210, status: "free",     view: "ზღვა" },
  { id: "B-24", type: "ფემილი",     floor: 2, capacity: 5, price: 320, status: "occupied", view: "ზღვა" },
  { id: "C-31", type: "სუიტი",      floor: 3, capacity: 4, price: 420, status: "free",     view: "ზღვა" },
  { id: "C-33", type: "სუიტი",      floor: 3, capacity: 4, price: 420, status: "occupied", view: "ზღვა" },
  { id: "C-35", type: "ფემილი",     floor: 3, capacity: 5, price: 340, status: "maint",    view: "ბაღი" },
  { id: "D-41", type: "პენტჰაუსი",  floor: 4, capacity: 6, price: 780, status: "free",     view: "პანორამა" },
  { id: "D-42", type: "სუიტი",      floor: 4, capacity: 4, price: 450, status: "free",     view: "პანორამა" },
];

const BATUMI_RESERVATIONS: Reservation[] = [
  { id: "BT-2051", guestId: "B-201", room: "C-33", checkin: "2026-06-22", checkout: "2026-07-06", total: 5880, status: "in",     source: "პირდაპირი" },
  { id: "BT-2050", guestId: "B-202", room: "B-24", checkin: "2026-06-26", checkout: "2026-07-03", total: 2240, status: "in",     source: "Booking.com" },
  { id: "BT-2049", guestId: "B-203", room: "B-21", checkin: "2026-06-28", checkout: "2026-07-12", total: 2940, status: "in",     source: "პირდაპირი" },
  { id: "BT-2048", guestId: "B-204", room: "A-11", checkin: "2026-06-27", checkout: "2026-06-30", total: 360,  status: "in",     source: "ტელეფონი" },
  { id: "BT-2047", guestId: "B-205", room: "C-31", checkin: "2026-06-30", checkout: "2026-07-04", total: 1680, status: "ok",     source: "Airbnb" },
  { id: "BT-2046", guestId: "B-206", room: "D-41", checkin: "2026-07-02", checkout: "2026-07-06", total: 3120, status: "ok",     source: "Booking.com" },
  { id: "BT-2045", guestId: "B-207", room: "D-42", checkin: "2026-07-04", checkout: "2026-07-07", total: 1350, status: "ok",     source: "პირდაპირი" },
  { id: "BT-2044", guestId: "B-208", room: "A-14", checkin: "2026-06-22", checkout: "2026-06-26", total: 760,  status: "done",   source: "Booking.com" },
  { id: "BT-2043", guestId: "B-203", room: "B-22", checkin: "2026-05-30", checkout: "2026-06-06", total: 1470, status: "done",   source: "პირდაპირი" },
  { id: "BT-2042", guestId: "B-201", room: "C-33", checkin: "2026-05-02", checkout: "2026-05-09", total: 2940, status: "done",   source: "პირდაპირი" },
  { id: "BT-2041", guestId: "B-207", room: "C-35", checkin: "2026-06-12", checkout: "2026-06-15", total: 1020, status: "done",   source: "პირდაპირი" },
  { id: "BT-2040", guestId: "B-202", room: "B-24", checkin: "2026-04-20", checkout: "2026-04-25", total: 1600, status: "cancel", source: "Booking.com" },
];

const BATUMI_PAYMENTS: Payment[] = [
  { id: "BX-4410", date: "2026-06-22", guestId: "B-201", reservationId: "BT-2051", method: "ბარათი",  amount: 2940, status: "paid" },
  { id: "BX-4411", date: "2026-06-26", guestId: "B-202", reservationId: "BT-2050", method: "BOG Pay", amount: 2240, status: "paid" },
  { id: "BX-4412", date: "2026-06-28", guestId: "B-203", reservationId: "BT-2049", method: "ბარათი",  amount: 1470, status: "paid" },
  { id: "BX-4413", date: "2026-06-27", guestId: "B-204", reservationId: "BT-2048", method: "ნაღდი",   amount: 360,  status: "paid" },
  { id: "BX-4414", date: "2026-06-30", guestId: "B-205", reservationId: "BT-2047", method: "TBC Pay", amount: 1680, status: "pending" },
  { id: "BX-4415", date: "2026-07-02", guestId: "B-206", reservationId: "BT-2046", method: "ბარათი",  amount: 3120, status: "pending" },
  { id: "BX-4416", date: "2026-07-04", guestId: "B-207", reservationId: "BT-2045", method: "BOG Pay", amount: 1350, status: "pending" },
  { id: "BX-4417", date: "2026-06-26", guestId: "B-208", reservationId: "BT-2044", method: "ბარათი",  amount: 760,  status: "paid" },
  { id: "BX-4418", date: "2026-06-06", guestId: "B-203", reservationId: "BT-2043", method: "ბარათი",  amount: 1470, status: "paid" },
  { id: "BX-4419", date: "2026-04-25", guestId: "B-202", reservationId: "BT-2040", method: "ბარათი",  amount: 1600, status: "refund" },
];

/* ───────────────────────── Hotels ───────────────────────── */

export const HOTELS: Hotel[] = [
  {
    id: "tbilisi",
    name: "Tbilisi Grand Hotel",
    city: "თბილისი",
    tagline: "ბიზნეს-სასტუმრო ქალაქის ცენტრში",
    rooms: TBILISI_ROOMS,
    guests: TBILISI_GUESTS,
    reservations: TBILISI_RESERVATIONS,
    payments: TBILISI_PAYMENTS,
    syncLog: [
      { time: "28 ივნ 14:30", action: "ფაქტურა JV-1042 გაგზავნილი RS.ge-ზე", status: "ok" },
      { time: "28 ივნ 11:05", action: "ფაქტურა JV-1040 გაგზავნილი RS.ge-ზე", status: "ok" },
      { time: "27 ივნ 18:30", action: "ფაქტურა JV-1041 გაგზავნილი RS.ge-ზე", status: "ok" },
      { time: "25 ივნ 09:15", action: "ავტომატური სინქ — 3 ფაქტურა", status: "ok" },
      { time: "23 ივნ 12:45", action: "ფაქტურა JV-1035 — კავშირის შეცდომა", status: "error" },
      { time: "23 ივნ 12:50", action: "ხელახლა გაგზავნა JV-1035 — წარმატება", status: "ok" },
      { time: "20 ივნ 08:00", action: "ავტომატური სინქ — 5 ფაქტურა", status: "ok" },
    ],
    pendingInvoices: [
      { id: "JV-1039", guestId: "G-104", amount: 480,  date: "2026-06-29" },
      { id: "JV-1038", guestId: "G-105", amount: 1650, date: "2026-06-30" },
      { id: "JV-1037", guestId: "G-106", amount: 1120, date: "2026-07-01" },
    ],
    monthly: [
      { month: "იან", revenue: 18400, bookings: 62,  occupancy: 54 },
      { month: "თებ", revenue: 16200, bookings: 55,  occupancy: 49 },
      { month: "მარ", revenue: 21500, bookings: 74,  occupancy: 65 },
      { month: "აპრ", revenue: 24800, bookings: 88,  occupancy: 74 },
      { month: "მაი", revenue: 28300, bookings: 96,  occupancy: 82 },
      { month: "ივნ", revenue: 31200, bookings: 108, occupancy: 87 },
    ],
    yearly: { revenue: 140400, bookings: 483, occupancy: "68.5%", revpar: "₾61.4" },
  },
  {
    id: "batumi",
    name: "Batumi Seaside Resort",
    city: "ბათუმი",
    tagline: "საკურორტო სასტუმრო ზღვის სანაპიროზე",
    rooms: BATUMI_ROOMS,
    guests: BATUMI_GUESTS,
    reservations: BATUMI_RESERVATIONS,
    payments: BATUMI_PAYMENTS,
    syncLog: [
      { time: "28 ივნ 16:10", action: "ფაქტურა BT-2049 გაგზავნილი RS.ge-ზე", status: "ok" },
      { time: "27 ივნ 20:40", action: "ფაქტურა BT-2048 გაგზავნილი RS.ge-ზე", status: "ok" },
      { time: "26 ივნ 15:25", action: "ფაქტურა BT-2050 გაგზავნილი RS.ge-ზე", status: "ok" },
      { time: "26 ივნ 09:00", action: "ავტომატური სინქ — 6 ფაქტურა", status: "ok" },
      { time: "24 ივნ 19:12", action: "ფაქტურა BT-2044 — ვალიდაციის შეცდომა", status: "error" },
      { time: "24 ივნ 19:30", action: "ხელახლა გაგზავნა BT-2044 — წარმატება", status: "ok" },
      { time: "22 ივნ 08:00", action: "ავტომატური სინქ — 9 ფაქტურა", status: "ok" },
    ],
    pendingInvoices: [
      { id: "BT-2047", guestId: "B-205", amount: 1680, date: "2026-06-30" },
      { id: "BT-2046", guestId: "B-206", amount: 3120, date: "2026-07-02" },
    ],
    monthly: [
      { month: "იან", revenue: 9200,  bookings: 24,  occupancy: 21 },
      { month: "თებ", revenue: 8600,  bookings: 22,  occupancy: 19 },
      { month: "მარ", revenue: 14100, bookings: 38,  occupancy: 33 },
      { month: "აპრ", revenue: 26400, bookings: 71,  occupancy: 58 },
      { month: "მაი", revenue: 44800, bookings: 112, occupancy: 79 },
      { month: "ივნ", revenue: 61500, bookings: 148, occupancy: 94 },
    ],
    yearly: { revenue: 164600, bookings: 415, occupancy: "50.7%", revpar: "₾78.2" },
  },
];

export const DEFAULT_HOTEL_ID = HOTELS[0].id;

export function getHotel(id: string): Hotel {
  return HOTELS.find((h) => h.id === id) ?? HOTELS[0];
}

export const RESERVATION_STATUS: Record<string, { label: string; color: string; bg: string }> = {
  in:     { label: "სასტუმროში",    color: "var(--acc-txt)",  bg: "var(--acc-s)" },
  ok:     { label: "დადასტურებული", color: "var(--blue-txt)", bg: "var(--blue-s)" },
  done:   { label: "დასრულებული",   color: "var(--gray-txt)", bg: "var(--gray-s)" },
  cancel: { label: "გაუქმებული",    color: "var(--rose-txt)", bg: "var(--rose-s)" },
};

export const ROOM_STATUS: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  free:     { label: "თავისუფალი",  color: "var(--acc-txt)",  bg: "var(--acc-s)",  dot: "var(--bdr)" },
  occupied: { label: "დაკავებული",  color: "var(--rose-txt)", bg: "var(--rose-s)", dot: "#EF4444" },
  cleaning: { label: "დასუფთავება", color: "var(--amb-txt)",  bg: "var(--amb-s)",  dot: "#F59E0B" },
  maint:    { label: "სარემონტო",   color: "var(--gray-txt)", bg: "var(--gray-s)", dot: "#9CA3AF" },
};

export const PAYMENT_STATUS: Record<string, { label: string; color: string; bg: string }> = {
  paid:    { label: "გადახდილი",   color: "var(--acc-txt)",  bg: "var(--acc-s)" },
  pending: { label: "მოლოდინში",   color: "var(--amb-txt)",  bg: "var(--amb-s)" },
  refund:  { label: "დაბრუნებული", color: "var(--blue-txt)", bg: "var(--blue-s)" },
};

/**
 * Calendar bar tones. Colour encodes booking STATUS, not identity — a front desk
 * needs "who is still to arrive?" at a glance. Adjacent bookings stay separable
 * via the gutter, hairline and left rule rather than by hue. Dark text on a light
 * tint clears WCAG AA at 11px, which white-on-saturated never did.
 */
export const RESERVATION_BAR: Record<string, { bg: string; rule: string; txt: string }> = {
  in:     { bg: "#C7EDDD", rule: "#047857", txt: "#064E3B" },
  ok:     { bg: "#D3E3FD", rule: "#1D4ED8", txt: "#1E3A8A" },
  done:   { bg: "#E5E9EF", rule: "#94A3B8", txt: "#475569" },
  cancel: { bg: "#FBD9D9", rule: "#DC2626", txt: "#991B1B" },
};

export const ROOM_TYPES = ["სტანდარტი", "დელუქსი", "ფემილი", "სუიტი", "პენტჰაუსი"];

export const gel = (n: number) => `₾${n.toLocaleString("en-US")}`;
