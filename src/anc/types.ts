export type ServiceType =
  | 'ANC ปกติ'
  | 'ANC ครั้งแรก'
  | 'ANC ครรภ์เสี่ยงสูง'
  | 'หลังคลอด'
  | 'อื่นๆ';

export type ServiceUnit =
  | 'ห้องฝากครรภ์ (ANC)'
  | 'คลินิกครรภ์เสี่ยงสูง'
  | 'ห้องคลอด'
  | 'อื่นๆ';

export const ALL_RISKS = [
  'อายุน้อยกว่า 20 ปี',
  'อายุ 35 ปีขึ้นไป',
  'ภาวะโลหิตจาง',
  'เบาหวานขณะตั้งครรภ์ (GDM)',
  'ความดันโลหิตสูง/ครรภ์เป็นพิษ',
  'ครรภ์แฝด',
  'เคยผ่าตัดคลอด',
  'ภาวะอ้วน (BMI ≥ 30)',
  'ประวัติแท้ง/คลอดก่อนกำหนด',
  'ติดเชื้อ (HIV/ซิฟิลิส/ไวรัสตับอักเสบ)',
  'ภาวะซีดรุนแรง/ตกเลือดเสี่ยง',
  'อื่น ๆ',
] as const;

export type RiskFactor = (typeof ALL_RISKS)[number];

export interface ANCRecord {
  id: string;
  serviceDate: string; // ISO yyyy-mm-dd
  hn: string;
  name: string;
  age: number | null;
  gravida: number | null;
  ga: number | null; // weeks
  visitNumber: number | null;
  weight: number | null; // kg
  height: number | null; // cm
  bpSystolic: number | null;
  bpDiastolic: number | null;
  hct: number | null; // %
  serviceType: ServiceType;
  serviceUnit: ServiceUnit;
  isFirstVisit: boolean;
  risks: RiskFactor[];
  notes: string;
  createdAt?: string;
  updatedAt?: string;
}

export type DateRange = 'day' | 'week' | 'month' | 'quarter' | 'year';

export interface DashboardFilter {
  from: string; // yyyy-mm-dd
  to: string;
  range: DateRange;
  serviceType: 'all' | ServiceType;
}
