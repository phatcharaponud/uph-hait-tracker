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
  parseBEDate,
  beDateToDayNumber,
} from './date';

describe('date helpers', () => {
  it('covers the Feb–Jul 2569 (181-day) project timeline', () => {
    // Feb(28) + Mar(31) + Apr(30) + May(31) + Jun(30) + Jul(31) = 181
    expect(TOTAL_DAYS).toBe(181);
  });

  it('maps day numbers to Thai short dates', () => {
    expect(dayToDate(1)).toBe('1 ก.พ.');
    expect(dayToDate(28)).toBe('28 ก.พ.');
    expect(dayToDate(29)).toBe('1 มี.ค.');
    expect(dayToDate(TOTAL_DAYS)).toBe('31 ก.ค.');
  });

  it('maps day numbers to short dates with 2-digit BE year', () => {
    expect(dayToDateShort(1)).toBe('1 ก.พ. 69');
    expect(dayToDateShort(TOTAL_DAYS)).toBe('31 ก.ค. 69');
  });

  it('maps day numbers to full Thai BE dates', () => {
    expect(dayToDateFull(1)).toBe('1 กุมภาพันธ์ 2569');
    expect(dayToDateFull(TOTAL_DAYS)).toBe('31 กรกฎาคม 2569');
  });

  it('maps day numbers to medium BE dates', () => {
    expect(dayToDateMedium(17)).toBe('17 ก.พ. 2569');
  });

  it('computes today day number relative to Feb 1, 2026', () => {
    expect(todayDayNumber(new Date(2026, 1, 1))).toBe(1);
    expect(todayDayNumber(new Date(2026, 3, 17))).toBe(76); // Feb28 + Mar31 + 17
    expect(todayDayNumber(new Date(2026, 6, 31))).toBe(TOTAL_DAYS);
  });

  it('clamps today day number outside the timeline', () => {
    expect(todayDayNumber(new Date(2026, 0, 31))).toBe(0);
    expect(todayDayNumber(new Date(2026, 7, 15))).toBe(TOTAL_DAYS + 1);
  });

  it('formats today in Thai BE', () => {
    expect(todayBE(new Date(2026, 3, 17))).toBe('17 เมษายน 2569');
    expect(todayBEShort(new Date(2026, 3, 17))).toBe('17 เม.ย. 2569');
  });

  it('returns the final day as deadline', () => {
    expect(deadlineBE()).toBe('31 กรกฎาคม 2569');
  });

  it('splits the timeline into month segments', () => {
    const segments = getMonthSegments();
    expect(segments).toHaveLength(6);
    expect(segments[0]).toMatchObject({ label: 'กุมภาพันธ์ 2569', dayCount: 28 });
    expect(segments[1]).toMatchObject({ label: 'มีนาคม 2569', dayCount: 31 });
    expect(segments[2]).toMatchObject({ label: 'เมษายน 2569', dayCount: 30 });
    expect(segments[3]).toMatchObject({ label: 'พฤษภาคม 2569', dayCount: 31 });
    expect(segments[4]).toMatchObject({ label: 'มิถุนายน 2569', dayCount: 30 });
    expect(segments[5]).toMatchObject({ label: 'กรกฎาคม 2569', dayCount: 31 });
  });

  it('returns day-of-month for timeline ruler', () => {
    expect(dayNumberToDayOfMonth(1)).toBe(1);
    expect(dayNumberToDayOfMonth(28)).toBe(28);
    expect(dayNumberToDayOfMonth(29)).toBe(1); // March 1
    expect(dayNumberToDayOfMonth(TOTAL_DAYS)).toBe(31);
  });

  it('parses Buddhist Era date strings', () => {
    const d = parseBEDate('2569-02-17');
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(1);
    expect(d.getDate()).toBe(17);
  });

  it('converts BE date strings to timeline day numbers', () => {
    expect(beDateToDayNumber('2569-02-01')).toBe(1);
    expect(beDateToDayNumber('2569-02-17')).toBe(17);
    expect(beDateToDayNumber('2569-04-13')).toBe(72);
    expect(beDateToDayNumber('2569-05-25')).toBe(114);
    expect(beDateToDayNumber('2569-07-06')).toBe(156);
    expect(beDateToDayNumber('2569-07-31')).toBe(TOTAL_DAYS);
  });
});
