/**
 * HAIT project timeline helpers.
 *
 * Day 1 = TIMELINE_START. Day numbers in items/Gantt are integer offsets from that start.
 * Output formats use Thai Buddhist Era (พ.ศ. = ค.ศ. + 543).
 */

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Project timeline anchor (HAIT submission window for MUP 2026). */
export const TIMELINE_START = new Date(2026, 3, 1); // April 1, 2026 (month is 0-indexed)
export const TIMELINE_END = new Date(2026, 4, 31);  // May 31, 2026
export const TOTAL_DAYS =
  Math.round((TIMELINE_END.getTime() - TIMELINE_START.getTime()) / MS_PER_DAY) + 1;

const THAI_MONTHS_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
];

const THAI_MONTHS_FULL = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
];

function toBE(year: number): number {
  return year + 543;
}

function dayNumberToDate(d: number): Date {
  const date = new Date(TIMELINE_START);
  date.setDate(date.getDate() + (d - 1));
  return date;
}

function dateToDayNumber(date: Date): number {
  const start = new Date(TIMELINE_START);
  start.setHours(0, 0, 0, 0);
  const cmp = new Date(date);
  cmp.setHours(0, 0, 0, 0);
  return Math.round((cmp.getTime() - start.getTime()) / MS_PER_DAY) + 1;
}

/** "17 เม.ย." (day + short Thai month, no year) */
export function dayToDate(d: number): string {
  const dt = dayNumberToDate(d);
  return `${dt.getDate()} ${THAI_MONTHS_SHORT[dt.getMonth()]}`;
}

/** "17 เม.ย. 69" (day + short Thai month + 2-digit BE year) */
export function dayToDateShort(d: number): string {
  const dt = dayNumberToDate(d);
  const be2 = toBE(dt.getFullYear()) % 100;
  return `${dt.getDate()} ${THAI_MONTHS_SHORT[dt.getMonth()]} ${be2}`;
}

/** "17 เมษายน 2569" (full Thai date in BE) */
export function dayToDateFull(d: number): string {
  const dt = dayNumberToDate(d);
  return `${dt.getDate()} ${THAI_MONTHS_FULL[dt.getMonth()]} ${toBE(dt.getFullYear())}`;
}

/** "17 เม.ย. 2569" (full BE year, short month) */
export function dayToDateMedium(d: number): string {
  const dt = dayNumberToDate(d);
  return `${dt.getDate()} ${THAI_MONTHS_SHORT[dt.getMonth()]} ${toBE(dt.getFullYear())}`;
}

/** Day number for a given Date (clamped to [0, TOTAL_DAYS+1]). */
export function todayDayNumber(now: Date = new Date()): number {
  const d = dateToDayNumber(now);
  if (d < 1) return 0;
  if (d > TOTAL_DAYS) return TOTAL_DAYS + 1;
  return d;
}

/** Full Thai BE date string for today, e.g. "17 เมษายน 2569". */
export function todayBE(now: Date = new Date()): string {
  return `${now.getDate()} ${THAI_MONTHS_FULL[now.getMonth()]} ${toBE(now.getFullYear())}`;
}

/** Short Thai BE date string, e.g. "17 เม.ย. 2569". */
export function todayBEShort(now: Date = new Date()): string {
  return `${now.getDate()} ${THAI_MONTHS_SHORT[now.getMonth()]} ${toBE(now.getFullYear())}`;
}

/** Deadline string for UI banners (end of timeline). */
export function deadlineBE(): string {
  return dayToDateFull(TOTAL_DAYS);
}

export interface MonthSegment {
  year: number;      // BE year
  monthIndex: number; // 0-11 (Gregorian)
  label: string;      // e.g. "เมษายน 2569"
  dayCount: number;   // number of timeline days in this month
}

/** Break the timeline into month segments for the Gantt header. */
export function getMonthSegments(): MonthSegment[] {
  const segments: MonthSegment[] = [];
  for (let d = 1; d <= TOTAL_DAYS; d++) {
    const date = dayNumberToDate(d);
    const y = date.getFullYear();
    const m = date.getMonth();
    const last = segments[segments.length - 1];
    if (last && last.monthIndex === m && last.year === toBE(y)) {
      last.dayCount += 1;
    } else {
      segments.push({
        year: toBE(y),
        monthIndex: m,
        label: `${THAI_MONTHS_FULL[m]} ${toBE(y)}`,
        dayCount: 1,
      });
    }
  }
  return segments;
}

/** Day-of-month number to show under each column in the Gantt ruler. */
export function dayNumberToDayOfMonth(d: number): number {
  return dayNumberToDate(d).getDate();
}
