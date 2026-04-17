import { TOTAL_DAYS } from './date';

export const LIMITS = {
  title: 200,
  notes: 1000,
  url: 500,
  owner: 100,
} as const;

export type ValidationResult = { ok: true; value: string } | { ok: false; error: string };

export function validateText(
  value: string,
  maxLen: number,
  { allowEmpty = false, label = 'ค่านี้' }: { allowEmpty?: boolean; label?: string } = {}
): ValidationResult {
  const trimmed = value.trim();
  if (!allowEmpty && !trimmed) {
    return { ok: false, error: `${label}ห้ามว่าง` };
  }
  if (trimmed.length > maxLen) {
    return { ok: false, error: `${label}ต้องไม่เกิน ${maxLen} ตัวอักษร` };
  }
  return { ok: true, value: trimmed };
}

export function validateDay(n: number): ValidationResult {
  if (!Number.isFinite(n) || !Number.isInteger(n)) {
    return { ok: false, error: 'วันต้องเป็นจำนวนเต็ม' };
  }
  if (n < 1 || n > TOTAL_DAYS) {
    return { ok: false, error: `วันต้องอยู่ระหว่าง 1–${TOTAL_DAYS}` };
  }
  return { ok: true, value: String(n) };
}

export function validateUrl(value: string, { allowEmpty = true }: { allowEmpty?: boolean } = {}): ValidationResult {
  const trimmed = value.trim();
  if (!trimmed) {
    return allowEmpty ? { ok: true, value: '' } : { ok: false, error: 'URL ห้ามว่าง' };
  }
  if (trimmed.length > LIMITS.url) {
    return { ok: false, error: `URL ต้องไม่เกิน ${LIMITS.url} ตัวอักษร` };
  }
  try {
    const u = new URL(trimmed);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') {
      return { ok: false, error: 'URL ต้องเป็น http หรือ https' };
    }
    return { ok: true, value: trimmed };
  } catch {
    return { ok: false, error: 'รูปแบบ URL ไม่ถูกต้อง' };
  }
}
