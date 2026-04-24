import { Medication } from '../types';

export const SAMPLE_MEDS: Omit<Medication, 'id' | 'startDate'>[] = [
  {
    name: 'Paracetamol 500 mg',
    dosage: '1-2 เม็ด',
    times: ['08:00', '12:00', '18:00', '22:00'],
    endDate: null,
    notes: 'ทานเมื่อปวด ไม่เกิน 8 เม็ดต่อวัน',
  },
  {
    name: 'Celecoxib 200 mg',
    dosage: '1 เม็ด',
    times: ['08:00', '20:00'],
    endDate: null,
    notes: 'ทานหลังอาหาร',
  },
  {
    name: 'Rivaroxaban 10 mg',
    dosage: '1 เม็ด',
    times: ['08:00'],
    endDate: null,
    notes: 'ยากันลิ่มเลือดหลังผ่าตัด ห้ามขาด',
  },
];
