import { beforeEach, describe, expect, it } from 'vitest';
import type { Item } from '../types';
import { findDuplicateItems, ignoreGroup, unignoreGroup } from './duplicateCheck';

function makeItem(overrides: Partial<Item> = {}): Item {
  return {
    id: overrides.id ?? 'x',
    catId: overrides.catId ?? 1,
    title: overrides.title ?? 'รายการทดสอบ',
    status: overrides.status ?? 'not_started',
    owner: overrides.owner ?? 'เจ้าของ',
    start: overrides.start ?? 1,
    end: overrides.end ?? 5,
    ref: overrides.ref ?? '',
    documentUrl: overrides.documentUrl ?? '',
    notes: overrides.notes ?? '',
    description: overrides.description,
  };
}

describe('findDuplicateItems', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns empty when titles are distinct', () => {
    const items = [
      makeItem({ id: 'a', title: 'นโยบายความปลอดภัย' }),
      makeItem({ id: 'b', title: 'แผนบริหารความเสี่ยง' }),
    ];
    expect(findDuplicateItems(items)).toEqual([]);
  });

  it('finds exact-title duplicates regardless of case and whitespace', () => {
    const items = [
      makeItem({ id: 'a', title: 'ชื่อเดียวกัน' }),
      makeItem({ id: 'b', title: '  ชื่อเดียวกัน  ' }),
    ];
    const dups = findDuplicateItems(items);
    expect(dups).toHaveLength(1);
    expect(dups[0].items.map((i) => i.id).sort()).toEqual(['a', 'b']);
  });

  it('finds similar-title pairs above 80% similarity', () => {
    const items = [
      makeItem({ id: 'a', title: 'นโยบายการใช้งานระบบสารสนเทศโรงพยาบาล' }),
      makeItem({ id: 'b', title: 'นโยบายการใช้งานระบบสารสนเทศโรงพยาบา' }),
    ];
    const dups = findDuplicateItems(items);
    expect(dups.length).toBeGreaterThanOrEqual(1);
    expect(dups[0].group).toMatch(/คล้ายกัน/);
  });

  it('ignores groups marked as ignored', () => {
    const items = [
      makeItem({ id: 'a', title: 'ชื่อเดียวกัน' }),
      makeItem({ id: 'b', title: 'ชื่อเดียวกัน' }),
    ];
    ignoreGroup('exact:ชื่อเดียวกัน');
    expect(findDuplicateItems(items)).toEqual([]);
    unignoreGroup('exact:ชื่อเดียวกัน');
    expect(findDuplicateItems(items)).toHaveLength(1);
  });
});
