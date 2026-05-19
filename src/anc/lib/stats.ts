import type { ANCRecord, DashboardFilter } from '../types';
import { monthLabel, thaiMonthKey } from './thaiDate';

export interface OverviewStats {
  total: number;
  firstVisit: number;
  earlyANC: number; // first visit with GA < 12 weeks
  fiveVisitsComplete: number; // unique HN with >=5 visits
  highRisk: number;
  anemia: number; // Hct < 33
}

export function filterRecords(records: ANCRecord[], f: DashboardFilter): ANCRecord[] {
  return records.filter((r) => {
    if (f.from && r.serviceDate < f.from) return false;
    if (f.to && r.serviceDate > f.to) return false;
    if (f.serviceType !== 'all' && r.serviceType !== f.serviceType) return false;
    return true;
  });
}

export function computeOverview(records: ANCRecord[]): OverviewStats {
  const total = records.length;
  const firstVisit = records.filter((r) => r.isFirstVisit || r.visitNumber === 1).length;
  const earlyANC = records.filter((r) => (r.isFirstVisit || r.visitNumber === 1) && (r.ga ?? 99) < 12).length;
  const highRisk = records.filter((r) => r.risks && r.risks.length > 0).length;
  const anemia = records.filter((r) => (r.hct ?? 99) < 33).length;

  const visitsByHN = new Map<string, number>();
  for (const r of records) {
    if (!r.hn) continue;
    visitsByHN.set(r.hn, (visitsByHN.get(r.hn) ?? 0) + 1);
  }
  let fiveVisitsComplete = 0;
  for (const count of visitsByHN.values()) if (count >= 5) fiveVisitsComplete++;

  return { total, firstVisit, earlyANC, fiveVisitsComplete, highRisk, anemia };
}

export interface TrendPoint {
  label: string;
  total: number;
  firstVisit: number;
  highRisk: number;
}

export function computeTrend(records: ANCRecord[], range: DashboardFilter['range']): TrendPoint[] {
  const buckets = new Map<string, { total: number; firstVisit: number; highRisk: number; sortKey: string }>();
  for (const r of records) {
    if (!r.serviceDate) continue;
    let key: string;
    if (range === 'day') {
      key = r.serviceDate;
    } else if (range === 'week') {
      const d = new Date(r.serviceDate);
      const monday = new Date(d);
      monday.setDate(d.getDate() - ((d.getDay() + 6) % 7));
      key = monday.toISOString().slice(0, 10);
    } else if (range === 'year') {
      key = String(new Date(r.serviceDate).getFullYear());
    } else if (range === 'quarter') {
      const d = new Date(r.serviceDate);
      const q = Math.floor(d.getMonth() / 3) + 1;
      key = `${d.getFullYear()}-Q${q}`;
    } else {
      key = thaiMonthKey(r.serviceDate);
    }
    const existing = buckets.get(key) ?? { total: 0, firstVisit: 0, highRisk: 0, sortKey: key };
    existing.total += 1;
    if (r.isFirstVisit || r.visitNumber === 1) existing.firstVisit += 1;
    if (r.risks && r.risks.length > 0) existing.highRisk += 1;
    buckets.set(key, existing);
  }
  const sorted = Array.from(buckets.entries()).sort(([a], [b]) => a.localeCompare(b));
  return sorted.map(([k, v]) => ({
    label: bucketLabel(k, range),
    total: v.total,
    firstVisit: v.firstVisit,
    highRisk: v.highRisk,
  }));
}

function bucketLabel(key: string, range: DashboardFilter['range']): string {
  if (range === 'day') return key.slice(8) + '/' + key.slice(5, 7);
  if (range === 'week') return 'สัปดาห์ ' + key.slice(8) + '/' + key.slice(5, 7);
  if (range === 'year') return String(Number(key) + 543);
  if (range === 'quarter') {
    const [y, q] = key.split('-');
    return `${q}/${(Number(y) + 543).toString().slice(-2)}`;
  }
  return monthLabel(key + '-01');
}

export interface RiskTally {
  name: string;
  count: number;
}

export function computeRiskRanking(records: ANCRecord[]): RiskTally[] {
  const tally = new Map<string, number>();
  for (const r of records) {
    for (const risk of r.risks ?? []) {
      tally.set(risk, (tally.get(risk) ?? 0) + 1);
    }
  }
  return Array.from(tally.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}
