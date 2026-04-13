import type { Item } from '../types';
import { REFS } from './categories';

export const INITIAL_ITEMS: Item[] = [
  // หมวด 1 — แผนแม่บท IT
  { id: '1.1.1', catId: 1, title: 'ข้อมูลพื้นฐานโรงพยาบาล',                   status: 'completed',   owner: 'แผนยุทธศาสตร์', start: 1,  end: 35, ref: REFS.cmu, documentUrl: '', notes: '' },
  { id: '1.1.2', catId: 1, title: 'สรุปแผนยุทธศาสตร์ของโรงพยาบาล',             status: 'completed',   owner: 'แผนยุทธศาสตร์', start: 1,  end: 38, ref: REFS.cmu, documentUrl: '', notes: '' },
  { id: '1.1.3', catId: 1, title: 'ตารางวิเคราะห์ปัจจัยความสำเร็จ IT',           status: 'in_progress', owner: 'CIO',          start: 5,  end: 42, ref: REFS.cmu, documentUrl: '', notes: '' },
  { id: '1.1.4', catId: 1, title: 'แผนยุทธศาสตร์ IT',                          status: 'in_progress', owner: 'CIO',          start: 8,  end: 48, ref: REFS.cmu, documentUrl: '', notes: '' },
  { id: '1.1.5', catId: 1, title: 'แผนปฏิบัติการ IT ปีปัจจุบัน',                status: 'not_started', owner: 'หัวหน้า IT',    start: 15, end: 52, ref: REFS.banbung, documentUrl: '', notes: '' },
  { id: '1.1.6', catId: 1, title: 'ประเมินผลการดำเนินงานปีที่ผ่านมา',           status: 'not_started', owner: 'CIO',          start: 20, end: 55, ref: REFS.banbung, documentUrl: '', notes: '' },

  // หมวด 2 — การจัดการความเสี่ยง
  { id: '2.1.1', catId: 2, title: 'ประเมินจุดอ่อนช่องโหว่ประจำปี',              status: 'completed',      owner: 'IT Security',  start: 1,  end: 33, ref: REFS.banbung, documentUrl: '', notes: '' },
  { id: '2.1.2', catId: 2, title: 'คะแนนความเสี่ยง (PxI)',                     status: 'in_progress',    owner: 'IT Security',  start: 8,  end: 40, ref: REFS.banbung, documentUrl: '', notes: '' },
  { id: '2.1.3', catId: 2, title: 'แผนกลยุทธ์จัดการความเสี่ยง 4 ตาราง',         status: 'needs_revision', owner: 'CIO',          start: 10, end: 45, ref: REFS.banbung, documentUrl: '', notes: '' },
  { id: '2.1.4', catId: 2, title: 'แผนปฏิบัติการจัดการความเสี่ยง',              status: 'not_started',    owner: 'IT Security',  start: 15, end: 55, ref: REFS.banbung, documentUrl: '', notes: '' },
  { id: '2.1.5', catId: 2, title: 'ประเมินผลการจัดการความเสี่ยง',               status: 'not_started',    owner: 'CIO',          start: 25, end: 58, ref: REFS.banbung, documentUrl: '', notes: '' },

  // หมวด 3 — ความมั่นคงปลอดภัย
  { id: '3.1.1', catId: 3, title: 'นโยบายความมั่นคงปลอดภัย + PDPA',            status: 'completed',   owner: 'CIO',              start: 1,  end: 30, ref: REFS.sarapee, documentUrl: '', notes: '' },
  { id: '3.1.2', catId: 3, title: 'ระเบียบปฏิบัติความมั่นคงปลอดภัย',            status: 'completed',   owner: 'IT Security',      start: 1,  end: 35, ref: REFS.sarapee, documentUrl: '', notes: '' },
  { id: '3.1.3', catId: 3, title: 'ประเมินความรับรู้ของบุคลากร',                status: 'in_progress', owner: 'HR',               start: 12, end: 42, ref: REFS.banbung, documentUrl: '', notes: '' },
  { id: '3.1.4', catId: 3, title: 'ประเมินความเข้าใจของบุคลากร',               status: 'not_started', owner: 'HR',               start: 15, end: 48, ref: REFS.banbung, documentUrl: '', notes: '' },
  { id: '3.1.5', catId: 3, title: 'ประเมินการปฏิบัติของบุคลากร',                status: 'not_started', owner: 'HR',               start: 20, end: 55, ref: REFS.banbung, documentUrl: '', notes: '' },
  { id: '3.1.6', catId: 3, title: 'สรุปการปรับปรุง Data Center',                status: 'in_progress', owner: 'IT Infrastructure', start: 5,  end: 58, ref: REFS.banbung, documentUrl: '', notes: '' },
  { id: '3.2.1', catId: 3, title: 'HAIT Plus ข้อ A-R (18 หัวข้อ)',             status: 'not_started', owner: 'IT Security',       start: 15, end: 60, ref: REFS.tmiDoc, documentUrl: '', notes: '' },
  { id: '3.2.2', catId: 3, title: 'คู่มือดูแล Data Center',                    status: 'needs_revision', owner: 'IT Infrastructure', start: 10, end: 45, ref: REFS.banbung, documentUrl: '', notes: '' },
  { id: '3.2.3', catId: 3, title: 'คู่มือสำรองข้อมูล',                         status: 'in_progress', owner: 'IT Infrastructure', start: 8,  end: 40, ref: REFS.banbung, documentUrl: '', notes: '' },
  { id: '3.3',   catId: 3, title: 'แผน BCP + รายงานผลการซ้อม',                status: 'completed',   owner: 'คณะทำงาน HAIT',     start: 1,  end: 35, ref: REFS.vachira, documentUrl: '', notes: '' },
  { id: '3.4',   catId: 3, title: 'แผน DRP + รายงานผลการซ้อม',                status: 'in_progress', owner: 'IT Infrastructure', start: 5,  end: 50, ref: REFS.vachira, documentUrl: '', notes: '' },

  // หมวด 4 — Service & Incident
  { id: '4.1', catId: 4, title: 'การจัดระบบ Service Desk',                     status: 'in_progress', owner: 'IT Support',  start: 1,  end: 45, ref: REFS.banbung, documentUrl: '', notes: '' },
  { id: '4.2', catId: 4, title: 'SLA + ผลการดำเนินงาน',                        status: 'in_progress', owner: 'IT Support',  start: 5,  end: 48, ref: REFS.banbung, documentUrl: '', notes: '' },
  { id: '4.3', catId: 4, title: 'บันทึกอุบัติการณ์ 3-6 เดือน',                  status: 'not_started', owner: 'IT Support',  start: 10, end: 58, ref: REFS.banbung, documentUrl: '', notes: '' },
  { id: '4.4', catId: 4, title: 'บันทึกกิจกรรม IT รายวัน',                      status: 'not_started', owner: 'หัวหน้า IT',  start: 10, end: 60, ref: REFS.banbung, documentUrl: '', notes: '' },

  // หมวด 5 — คุณภาพข้อมูล
  { id: '5.1', catId: 5, title: 'ตรวจสอบคุณภาพเวชระเบียน OPD',                 status: 'completed',   owner: 'เวชระเบียน', start: 1, end: 55, ref: REFS.banbung, documentUrl: '', notes: '' },
  { id: '5.2', catId: 5, title: 'ตรวจสอบคุณภาพเวชระเบียน IPD',                 status: 'in_progress', owner: 'เวชระเบียน', start: 5, end: 58, ref: REFS.banbung, documentUrl: '', notes: '' },

  // หมวด 6 — ออกแบบระบบ
  { id: '6.1',   catId: 6, title: 'วิเคราะห์ระบบเดิม vs ใหม่',                  status: 'not_started', owner: 'Developer', start: 15, end: 48, ref: REFS.banbung, documentUrl: '', notes: '' },
  { id: '6.2.1', catId: 6, title: 'Context Diagram',                           status: 'not_started', owner: 'Developer', start: 20, end: 50, ref: REFS.banbung, documentUrl: '', notes: '' },
  { id: '6.2.2', catId: 6, title: 'Data Flow Diagram',                         status: 'not_started', owner: 'Developer', start: 22, end: 52, ref: REFS.banbung, documentUrl: '', notes: '' },
  { id: '6.2.3', catId: 6, title: 'ER-Diagram',                                status: 'not_started', owner: 'Developer', start: 25, end: 55, ref: REFS.banbung, documentUrl: '', notes: '' },
  { id: '6.2.4', catId: 6, title: 'Data Dictionary',                           status: 'not_started', owner: 'Developer', start: 28, end: 58, ref: REFS.banbung, documentUrl: '', notes: '' },

  // หมวด 7 — Capacity & Competency
  { id: '7.1.1', catId: 7, title: 'ทะเบียน Hardware',                          status: 'completed',   owner: 'IT Infrastructure', start: 1,  end: 35, ref: REFS.banbung, documentUrl: '', notes: '' },
  { id: '7.1.2', catId: 7, title: 'ทะเบียน Software',                          status: 'in_progress', owner: 'IT Infrastructure', start: 5,  end: 40, ref: REFS.banbung, documentUrl: '', notes: '' },
  { id: '7.1.3', catId: 7, title: 'ทะเบียน Network + Diagram',                 status: 'in_progress', owner: 'IT Infrastructure', start: 5,  end: 45, ref: REFS.banbung, documentUrl: '', notes: '' },
  { id: '7.1.4', catId: 7, title: 'Utilization Server/Internet',               status: 'not_started', owner: 'IT Infrastructure', start: 15, end: 55, ref: REFS.banbung, documentUrl: '', notes: '' },
  { id: '7.2.1', catId: 7, title: 'Competency Mapping/Dict/Template',          status: 'not_started', owner: 'HR',                start: 18, end: 55, ref: REFS.banbung, documentUrl: '', notes: '' },
  { id: '7.2.2', catId: 7, title: 'ประเมิน Competency + แผนพัฒนา',             status: 'not_started', owner: 'CIO',               start: 25, end: 60, ref: REFS.banbung, documentUrl: '', notes: '' },
];
