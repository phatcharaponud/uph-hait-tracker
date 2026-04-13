import type { Category } from '../types';

export const NAV_ITEMS: Category[] = [
  { id: 'dashboard', icon: '📊', code: 'DASHBOARD', name: 'ภาพรวม',           color: '#1e3a5f' },
  { id: 'gantt',     icon: '📅', code: 'TIMELINE',  name: 'Gantt Chart',      color: '#1e3a5f' },
  { id: 'refs',      icon: '📚', code: 'RESOURCES', name: 'เอกสารอ้างอิง',     color: '#1e3a5f' },
];

export const HAIT_CATEGORIES: Category[] = [
  { id: 1, icon: '📋', code: 'HAIT 1', name: 'แผนแม่บท IT',          color: '#1e3a5f' },
  { id: 2, icon: '⚠️', code: 'HAIT 2', name: 'การจัดการความเสี่ยง',    color: '#2563eb' },
  { id: 3, icon: '🔒', code: 'HAIT 3', name: 'ความมั่นคงปลอดภัย',     color: '#dc2626' },
  { id: 4, icon: '🛠', code: 'HAIT 4', name: 'Service & Incident',   color: '#ea580c' },
  { id: 5, icon: '📑', code: 'HAIT 5', name: 'คุณภาพข้อมูล',          color: '#16a34a' },
  { id: 6, icon: '🧩', code: 'HAIT 6', name: 'ออกแบบระบบ',           color: '#7c3aed' },
  { id: 7, icon: '⚙️', code: 'HAIT 7', name: 'Capacity & Competency', color: '#0891b2' },
];

export const ALL_CATEGORIES: Category[] = [...NAV_ITEMS, ...HAIT_CATEGORIES];

export const OWNERS = [
  'CIO',
  'หัวหน้า IT',
  'IT Security',
  'IT Infrastructure',
  'IT Support',
  'Developer',
  'เวชระเบียน',
  'HR',
  'แผนยุทธศาสตร์',
  'คณะทำงาน HAIT',
];

export const REFS = {
  tmi: 'https://tmi.or.th/การรับรอง/',
  banbung: 'https://www.banbunghospital.com/hait-2025/',
  vachira: 'https://www.vachiraphuket.go.th/hait/',
  sarapee: 'https://it.sarapeehospital.go.th/',
  cmu: 'https://w2.med.cmu.ac.th/nd/ha-it/',
  zone1: 'https://www.ciorh1.com/frontend/web/site/hait',
  tmiDoc: 'https://tmi.or.th/wp-content/uploads/2026/01/Document_HAIT_HAITStarV1.pdf',
};
