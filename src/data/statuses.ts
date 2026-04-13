import type { Status, StatusValue } from '../types';

export const STATUSES: Record<StatusValue, Status> = {
  not_started:    { value: 'not_started',    label: 'ยังไม่เริ่ม',    color: '#94a3b8', bg: 'bg-slate-100 text-slate-700' },
  in_progress:    { value: 'in_progress',    label: 'กำลังดำเนินการ', color: '#f59e0b', bg: 'bg-amber-100 text-amber-800' },
  completed:      { value: 'completed',      label: 'เสร็จแล้ว',      color: '#10b981', bg: 'bg-emerald-100 text-emerald-800' },
  needs_revision: { value: 'needs_revision', label: 'ต้องปรับปรุง',   color: '#ef4444', bg: 'bg-red-100 text-red-800' },
};

export const STATUS_LIST = Object.values(STATUSES);
