import type { ANCRecord } from '../types';

const API_URL = (import.meta.env.VITE_ANC_API_URL ?? '').trim();
const STORAGE_KEY = 'anc.records.v1';

function readLocal(): ANCRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ANCRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocal(records: ANCRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function uuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return 'r_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function isRemoteEnabled(): boolean {
  return Boolean(API_URL);
}

export function getApiUrl(): string {
  return API_URL;
}

export async function listRecords(): Promise<ANCRecord[]> {
  if (!API_URL) return readLocal();
  try {
    const res = await fetch(`${API_URL}?action=list`, { cache: 'no-store' });
    const data = await res.json();
    if (data?.ok && Array.isArray(data.data)) {
      return data.data as ANCRecord[];
    }
    throw new Error(data?.error || 'unexpected response');
  } catch (err) {
    console.warn('[anc/api] list failed, falling back to local cache:', err);
    return readLocal();
  }
}

export async function createRecord(rec: Omit<ANCRecord, 'id'>): Promise<ANCRecord> {
  const full: ANCRecord = {
    ...rec,
    id: uuid(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  if (API_URL) {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'create', record: full }),
      });
      const data = await res.json();
      if (!data?.ok) throw new Error(data?.error || 'create failed');
    } catch (err) {
      console.warn('[anc/api] create failed, saving locally:', err);
    }
  }
  const all = readLocal();
  all.push(full);
  writeLocal(all);
  return full;
}

export async function deleteRecord(id: string): Promise<void> {
  if (API_URL) {
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'delete', id }),
      });
    } catch (err) {
      console.warn('[anc/api] delete failed:', err);
    }
  }
  const all = readLocal().filter((r) => r.id !== id);
  writeLocal(all);
}

export async function updateRecord(id: string, changes: Partial<ANCRecord>): Promise<void> {
  if (API_URL) {
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'update', id, changes }),
      });
    } catch (err) {
      console.warn('[anc/api] update failed:', err);
    }
  }
  const all = readLocal().map((r) => (r.id === id ? { ...r, ...changes, updatedAt: new Date().toISOString() } : r));
  writeLocal(all);
}

export function seedSampleData(): ANCRecord[] {
  const existing = readLocal();
  if (existing.length > 0) return existing;
  const sample = buildSampleRecords();
  writeLocal(sample);
  return sample;
}

function buildSampleRecords(): ANCRecord[] {
  const records: ANCRecord[] = [];
  const today = new Date();
  const firstNames = ['สมหญิง', 'มาลี', 'นภา', 'พิมพ์ใจ', 'ดวงใจ', 'ลัดดา', 'อรทัย', 'ปิยะดา', 'รัตนา', 'สุภาภรณ์', 'กชกร', 'นิภาพร'];
  const lastNames = ['ใจดี', 'สมบูรณ์', 'พงษ์ทอง', 'ศรีสุข', 'แก้วใส', 'นาคทอง', 'วงศ์งาม', 'ธรรมรักษ์'];
  for (let i = 0; i < 70; i++) {
    const daysAgo = Math.floor(Math.random() * 180);
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    const age = 18 + Math.floor(Math.random() * 25);
    const ga = 4 + Math.floor(Math.random() * 36);
    const hct = 28 + Math.floor(Math.random() * 14);
    const risks: ANCRecord['risks'] = [];
    if (age >= 35) risks.push('อายุ 35 ปีขึ้นไป');
    else if (age < 20) risks.push('อายุน้อยกว่า 20 ปี');
    if (hct < 33) risks.push('ภาวะโลหิตจาง');
    if (Math.random() < 0.12) risks.push('เบาหวานขณะตั้งครรภ์ (GDM)');
    if (Math.random() < 0.08) risks.push('ความดันโลหิตสูง/ครรภ์เป็นพิษ');
    if (Math.random() < 0.06) risks.push('ครรภ์แฝด');
    if (Math.random() < 0.1) risks.push('เคยผ่าตัดคลอด');
    records.push({
      id: uuid(),
      serviceDate: date.toISOString().slice(0, 10),
      hn: '68' + String(1000 + i).padStart(4, '0'),
      name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
      age,
      gravida: 1 + Math.floor(Math.random() * 4),
      ga,
      visitNumber: 1 + Math.floor(Math.random() * 5),
      weight: 50 + Math.floor(Math.random() * 30),
      height: 150 + Math.floor(Math.random() * 20),
      bpSystolic: 100 + Math.floor(Math.random() * 40),
      bpDiastolic: 60 + Math.floor(Math.random() * 30),
      hct,
      serviceType: Math.random() < 0.7 ? 'ANC ปกติ' : (Math.random() < 0.5 ? 'ANC ครั้งแรก' : 'ANC ครรภ์เสี่ยงสูง'),
      serviceUnit: 'ห้องฝากครรภ์ (ANC)',
      isFirstVisit: ga < 14 && Math.random() < 0.4,
      risks,
      notes: '',
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
    });
  }
  return records;
}
