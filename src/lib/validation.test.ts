import { describe, expect, it } from 'vitest';
import { LIMITS, validateText, validateDay, validateUrl } from './validation';

describe('validateText', () => {
  it('accepts a reasonable title', () => {
    expect(validateText('นโยบายความปลอดภัย', LIMITS.title)).toEqual({
      ok: true,
      value: 'นโยบายความปลอดภัย',
    });
  });

  it('rejects empty by default', () => {
    const r = validateText('   ', LIMITS.title);
    expect(r.ok).toBe(false);
  });

  it('allows empty when flagged', () => {
    expect(validateText('', LIMITS.notes, { allowEmpty: true })).toEqual({
      ok: true,
      value: '',
    });
  });

  it('rejects overlong text', () => {
    const long = 'x'.repeat(LIMITS.title + 1);
    const r = validateText(long, LIMITS.title);
    expect(r.ok).toBe(false);
  });
});

describe('validateDay', () => {
  it('accepts days within timeline', () => {
    expect(validateDay(1).ok).toBe(true);
    expect(validateDay(90).ok).toBe(true);
    expect(validateDay(181).ok).toBe(true);
  });

  it('rejects out-of-range or non-integer', () => {
    expect(validateDay(0).ok).toBe(false);
    expect(validateDay(182).ok).toBe(false);
    expect(validateDay(1.5).ok).toBe(false);
    expect(validateDay(Number.NaN).ok).toBe(false);
  });
});

describe('validateUrl', () => {
  it('accepts https URLs', () => {
    expect(validateUrl('https://example.com/a').ok).toBe(true);
  });

  it('rejects non-http schemes', () => {
    expect(validateUrl('javascript:alert(1)').ok).toBe(false);
    expect(validateUrl('ftp://foo/bar').ok).toBe(false);
  });

  it('allows empty when permitted', () => {
    expect(validateUrl('').ok).toBe(true);
  });

  it('rejects malformed URL', () => {
    expect(validateUrl('not a url').ok).toBe(false);
  });
});
