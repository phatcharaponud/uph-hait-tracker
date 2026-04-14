import type { Item } from '../types';

export interface DuplicateGroup {
  group: string;
  items: Item[];
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function stringSimilarity(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - levenshtein(a, b) / maxLen;
}

const IGNORED_KEY = 'hait_duplicate_ignored';

export function getIgnoredGroups(): string[] {
  try {
    const raw = localStorage.getItem(IGNORED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function ignoreGroup(groupKey: string) {
  const ignored = getIgnoredGroups();
  if (!ignored.includes(groupKey)) {
    ignored.push(groupKey);
    localStorage.setItem(IGNORED_KEY, JSON.stringify(ignored));
  }
}

export function unignoreGroup(groupKey: string) {
  const ignored = getIgnoredGroups().filter((k) => k !== groupKey);
  localStorage.setItem(IGNORED_KEY, JSON.stringify(ignored));
}

export function findDuplicateItems(items: Item[]): DuplicateGroup[] {
  const duplicates: DuplicateGroup[] = [];
  const ignored = getIgnoredGroups();

  // Exact title matches
  const byTitle: Record<string, Item[]> = {};
  for (const item of items) {
    const key = item.title.trim().toLowerCase();
    (byTitle[key] ||= []).push(item);
  }
  for (const [title, group] of Object.entries(byTitle)) {
    if (group.length > 1) {
      const groupKey = `exact:${title}`;
      if (!ignored.includes(groupKey)) {
        duplicates.push({ group: `ชื่อซ้ำ: "${group[0].title}"`, items: group });
      }
    }
  }

  // Similar title matches (>80% similarity but not exact)
  const seen = new Set<string>();
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const a = items[i].title.trim().toLowerCase();
      const b = items[j].title.trim().toLowerCase();
      if (a === b) continue; // already covered by exact match
      const sim = stringSimilarity(a, b);
      if (sim > 0.8) {
        const pairKey = `similar:${[items[i].id, items[j].id].sort().join(',')}`;
        if (!seen.has(pairKey) && !ignored.includes(pairKey)) {
          seen.add(pairKey);
          duplicates.push({
            group: `คล้ายกัน (${Math.round(sim * 100)}%)`,
            items: [items[i], items[j]],
          });
        }
      }
    }
  }

  return duplicates;
}
