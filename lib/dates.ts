/** Date helpers. Everything is an ISO "YYYY-MM-DD" string handled in UTC so the
 *  demo renders identically in every timezone. */

export const GEO_MONTHS = [
  "იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი",
  "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი",
];

export const GEO_MONTHS_SHORT = [
  "იან", "თებ", "მარ", "აპრ", "მაი", "ივნ",
  "ივლ", "აგვ", "სექ", "ოქტ", "ნოე", "დეკ",
];

/** Indexed by Date#getUTCDay() — 0 is Sunday. */
export const GEO_DOW = ["კვი", "ორშ", "სამ", "ოთხ", "ხუთ", "პარ", "შაბ"];

/** The date the whole prototype is pinned to. */
export const TODAY = "2026-06-28";

const DAY_MS = 86_400_000;

export function parse(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function toISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function addDays(iso: string, n: number): string {
  return toISO(new Date(parse(iso).getTime() + n * DAY_MS));
}

export function addMonths(iso: string, n: number): string {
  const d = parse(iso);
  return toISO(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, d.getUTCDate())));
}

export function daysBetween(a: string, b: string): number {
  return Math.round((parse(b).getTime() - parse(a).getTime()) / DAY_MS);
}

/** "28 ივნ" */
export function fmtShort(iso: string): string {
  const d = parse(iso);
  return `${d.getUTCDate()} ${GEO_MONTHS_SHORT[d.getUTCMonth()]}`;
}

/** "28 ივნისი, 2026 — კვირა" */
export function fmtLong(iso: string): string {
  const d = parse(iso);
  return `${d.getUTCDate()} ${GEO_MONTHS[d.getUTCMonth()]}, ${d.getUTCFullYear()}`;
}

export function fmtMonth(iso: string): string {
  const d = parse(iso);
  return `${GEO_MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function dowLabel(iso: string): string {
  return GEO_DOW[parse(iso).getUTCDay()];
}

/** Monday-based start of the week containing `iso`. */
export function startOfWeek(iso: string): string {
  const d = parse(iso);
  const shift = (d.getUTCDay() + 6) % 7; // Mon = 0
  return addDays(iso, -shift);
}

export function startOfMonth(iso: string): string {
  const d = parse(iso);
  return toISO(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)));
}

export function daysInMonth(iso: string): number {
  const d = parse(iso);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
}

export function sameMonth(a: string, b: string): boolean {
  return a.slice(0, 7) === b.slice(0, 7);
}

export function range(startISO: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) => addDays(startISO, i));
}

/** 6×7 Monday-based grid covering the month containing `iso`. */
export function monthGrid(iso: string): string[] {
  return range(startOfWeek(startOfMonth(iso)), 42);
}

/** True when `day` falls inside the stay [checkin, checkout). */
export function coversNight(day: string, checkin: string, checkout: string): boolean {
  return day >= checkin && day < checkout;
}
