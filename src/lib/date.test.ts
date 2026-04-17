import { describe, expect, it } from 'vitest';
import {
  TOTAL_DAYS,
  dayToDate,
  dayToDateShort,
  dayToDateFull,
  dayToDateMedium,
  todayDayNumber,
  todayBE,
  todayBEShort,
  deadlineBE,
  getMonthSegments,
  dayNumberToDayOfMonth,
} from './date';

describe('date helpers', () => {
  it('covers the full 61-day April–May 2026 timeline', () => {
    expect(TOTAL_DAYS).toBe(61);
  });

  it('maps day numbers to Thai short dates', () => {
    expect(dayToDate(1)).toBe('1 เม.ย.');
    expect(dayToDate(30)).toBe('30 เม.ย.');
    expect(dayToDate(31)).toBe('1 พ.ค.');
    expect(dayToDate(61)).toBe('31 พ.ค.');
  });

  it('maps day numbers to short dates with 2-digit BE year', () => {
    expect(dayToDateShort(1)).toBe('1 เม.ย. 69');
    expect(dayToDateShort(31)).toBe('1 พ.ค. 69');
  });

  it('maps day numbers to full Thai BE dates', () => {
    expect(dayToDateFull(1)).toBe('1 เมษายน 2569');
    expect(dayToDateFull(61)).toBe('31 พฤษภาคม 2569');
  });

  it('maps day numbers to medium BE dates', () => {
    expect(dayToDateMedium(17)).toBe('17 เม.ย. 2569');
  });

  it('computes today day number relative to April 1, 2026', () => {
    expect(todayDayNumber(new Date(2026, 3, 1))).toBe(1);
    expect(todayDayNumber(new Date(2026, 3, 17))).toBe(17);
    expect(todayDayNumber(new Date(2026, 4, 31))).toBe(61);
  });

  it('clamps today day number outside the timeline', () => {
    expect(todayDayNumber(new Date(2025, 11, 31))).toBe(0);
    expect(todayDayNumber(new Date(2026, 5, 15))).toBe(TOTAL_DAYS + 1);
  });

  it('formats today in Thai BE', () => {
    expect(todayBE(new Date(2026, 3, 17))).toBe('17 เมษายน 2569');
    expect(todayBEShort(new Date(2026, 3, 17))).toBe('17 เม.ย. 2569');
  });

  it('returns the final day as deadline', () => {
    expect(deadlineBE()).toBe('31 พฤษภาคม 2569');
  });

  it('splits the timeline into month segments', () => {
    const segments = getMonthSegments();
    expect(segments).toHaveLength(2);
    expect(segments[0]).toMatchObject({ label: 'เมษายน 2569', dayCount: 30 });
    expect(segments[1]).toMatchObject({ label: 'พฤษภาคม 2569', dayCount: 31 });
  });

  it('returns day-of-month for timeline ruler', () => {
    expect(dayNumberToDayOfMonth(1)).toBe(1);
    expect(dayNumberToDayOfMonth(30)).toBe(30);
    expect(dayNumberToDayOfMonth(31)).toBe(1);
    expect(dayNumberToDayOfMonth(61)).toBe(31);
  });
});
