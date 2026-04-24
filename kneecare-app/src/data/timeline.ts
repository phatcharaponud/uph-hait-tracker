import { TimelinePhase } from '../types';

export const TIMELINE_PHASES: TimelinePhase[] = [
  {
    id: 'pre_op',
    title: 'ก่อนผ่าตัด (Prehabilitation)',
    dayFrom: -60,
    dayTo: -1,
    description: 'เตรียมร่างกายและกล้ามเนื้อก่อนการผ่าตัด เพื่อให้ฟื้นตัวเร็วหลังผ่า',
    goals: [
      'ออกกำลังกายเสริม Quadriceps อย่างน้อยวันละ 2 รอบ',
      'ควบคุมน้ำหนักให้อยู่ในเกณฑ์ที่เหมาะสม',
      'งดสูบบุหรี่อย่างน้อย 4 สัปดาห์ก่อนผ่าตัด',
      'จัดบ้านให้ปลอดภัย ไม่มีพรมลื่น ราวจับในห้องน้ำ',
    ],
    warnings: ['หากมีไข้หรือแผลติดเชื้อ แจ้งแพทย์ก่อนวันผ่าตัด'],
  },
  {
    id: 'day_0_7',
    title: 'วันที่ 0-7 หลังผ่าตัด (Acute Recovery)',
    dayFrom: 0,
    dayTo: 7,
    description: 'ช่วงพักฟื้นในโรงพยาบาลและสัปดาห์แรก เน้นลดปวด ลดบวม และเริ่มขยับขา',
    goals: [
      'กระดกข้อเท้าทุกชั่วโมง (ลดลิ่มเลือด)',
      'Quad Sets วันละ 3-4 รอบ',
      'งอเข่าอย่างน้อย 60-70°',
      'เดินโดยใช้ไม้เท้า/Walker ตามกายภาพแนะนำ',
      'ประคบเย็น 15-20 นาที วันละ 4-6 ครั้ง',
    ],
    warnings: [
      'น่องบวม แดง เจ็บผิดปกติ → แจ้งแพทย์ (อาจเป็น DVT)',
      'ไข้ > 38°C → โทรแจ้งทีมทันที',
      'แผลมีหนอง/เลือดซึมมาก → ติดต่อโรงพยาบาล',
    ],
  },
  {
    id: 'week_2_6',
    title: 'สัปดาห์ที่ 2-6 (Sub-acute)',
    dayFrom: 8,
    dayTo: 42,
    description: 'เพิ่มการเคลื่อนไหวและเสริมกล้ามเนื้อ เริ่มเดินได้ไกลขึ้น',
    goals: [
      'งอเข่าถึง 90° ภายในสัปดาห์ที่ 3',
      'เดินโดยไม่ใช้ไม้เท้าได้ภายในสัปดาห์ที่ 4-6',
      'เพิ่ม Heel Slides และ Short Arc Quad',
      'ตัดไหม / ติดตามที่ OPD ตามนัด',
    ],
    warnings: [
      'ห้ามนั่งยอง ห้ามคุกเข่า',
      'ห้ามบิดหมุนเข่าเร็ว ๆ',
      'หากเข่าบวมขึ้นหลังออกกำลังกาย ลดจำนวนรอบลง',
    ],
  },
  {
    id: 'month_3_plus',
    title: 'เดือนที่ 3 ขึ้นไป (Return to Activity)',
    dayFrom: 43,
    dayTo: 365,
    description: 'กลับไปใช้ชีวิตปกติ เน้นความแข็งแรงระยะยาว',
    goals: [
      'งอเข่าได้อย่างน้อย 110-120°',
      'เดินได้ต่อเนื่อง 30 นาที',
      'เพิ่ม Mini Squat, Step Up',
      'ว่ายน้ำหรือปั่นจักรยานอยู่กับที่ได้',
    ],
    warnings: [
      'หลีกเลี่ยงกีฬากระแทกสูง (วิ่งเร็ว บาสเกตบอล ฟุตบอล)',
      'ห้ามยกของหนัก > 10 กก. ในช่วง 6 เดือนแรก',
    ],
  },
];

export function getPhaseByDay(dayFromSurgery: number): TimelinePhase | null {
  return TIMELINE_PHASES.find((p) => dayFromSurgery >= p.dayFrom && dayFromSurgery <= p.dayTo) ?? null;
}

export function getPhaseKey(dayFromSurgery: number): 'pre_op' | 'day_0_7' | 'week_2_6' | 'month_3_plus' {
  const p = getPhaseByDay(dayFromSurgery);
  if (!p) return dayFromSurgery < 0 ? 'pre_op' : 'month_3_plus';
  return p.id as any;
}
