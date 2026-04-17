import type { Item } from '../types';
import { REFS } from './categories';
import { beDateToDayNumber } from '../lib/date';

/**
 * HAIT v1.1 action-plan items (42 total) — sourced from
 * "แผนดำเนินการ HAIT v1.1" (MUP Hospital).
 *
 * Dates are kept as Thai Buddhist Era (YYYY-MM-DD) strings so the plan stays
 * human-readable; day numbers are derived at load time from the project
 * timeline in src/lib/date.ts.
 */
interface PlanItem {
  id: string;
  catId: number;
  title: string;
  owner: string;
  startDate: string;
  dueDate: string;
  ref: string;
}

const PLAN: PlanItem[] = [
  // หมวด 1 — แผนแม่บทเทคโนโลยีสารสนเทศ
  { id: '1.1', catId: 1, title: 'จัดทำแผนแม่บท IT สำเร็จ (มีสารบัญ เลขหน้า แผนยุทธศาสตร์ และแผนปฏิบัติการประจำปี)', owner: 'งานแผน + IT', startDate: '2569-02-17', dueDate: '2569-04-13', ref: REFS.cmu },
  { id: '1.2', catId: 1, title: 'แสดงการเชื่อมโยงยุทธศาสตร์โรงพยาบาล ผ่านการวิเคราะห์ปัจจัยแห่งความสำเร็จมาสู่ยุทธศาสตร์ IT', owner: 'งานแผน + IT', startDate: '2569-02-17', dueDate: '2569-04-13', ref: REFS.cmu },
  { id: '1.3', catId: 1, title: 'สรุปยุทธศาสตร์ IT ทุกข้อ ที่ถ่ายทอดลงไปเป็นแผนปฏิบัติการ (โครงการต่างๆ)', owner: 'งานแผน + IT', startDate: '2569-02-17', dueDate: '2569-04-13', ref: REFS.cmu },
  { id: '1.4', catId: 1, title: 'จัดทำแผนปฏิบัติการของปีปัจจุบัน กำหนดระยะเวลาดำเนินโครงการ งบประมาณ ผู้รับผิดชอบ', owner: 'งานแผน + IT', startDate: '2569-02-17', dueDate: '2569-04-13', ref: REFS.cmu },

  // หมวด 2 — การจัดการความเสี่ยงในระบบ IT
  { id: '2.1', catId: 2, title: 'จัดทำแผนจัดการความเสี่ยงสำเร็จ (มีสารบัญ เลขหน้า ผลการประเมินจุดอ่อน/ช่องโหว่)', owner: 'IT + งาน RM', startDate: '2569-02-17', dueDate: '2569-04-27', ref: REFS.banbung },
  { id: '2.2', catId: 2, title: 'การให้คะแนนความเสี่ยงถูกต้อง ทั้งคะแนน P และ I ไม่นำอุบัติการณ์ที่เกิดขึ้นแล้วมานับ', owner: 'IT + งาน RM', startDate: '2569-02-17', dueDate: '2569-04-27', ref: REFS.banbung },
  { id: '2.3', catId: 2, title: 'จัดทำแผนกลยุทธ์จัดการความเสี่ยง โดยแยกเป็น 4 ตาราง จำแนกตามกลยุทธ์จัดการ', owner: 'IT + งาน RM', startDate: '2569-02-17', dueDate: '2569-04-27', ref: REFS.banbung },
  { id: '2.4', catId: 2, title: 'จัดทำแผนปฏิบัติการความเสี่ยงของปีปัจจุบัน กำหนดระยะเวลา งบประมาณ ผู้รับผิดชอบ', owner: 'IT + งาน RM', startDate: '2569-02-17', dueDate: '2569-04-27', ref: REFS.banbung },
  { id: '2.5', catId: 2, title: 'แสดงผลการดำเนินงานอย่างน้อย 1 ครั้ง โดยเปรียบเทียบคะแนนความเสี่ยงก่อนและหลัง', owner: 'IT + งาน RM', startDate: '2569-02-17', dueDate: '2569-04-27', ref: REFS.banbung },

  // หมวด 3 — การจัดการความมั่นคงปลอดภัยในระบบ IT
  { id: '3.1', catId: 3, title: 'จัดทำนโยบายด้านความมั่นคงปลอดภัย และนโยบาย PDPA สำเร็จ', owner: 'IT ทั้งหมด', startDate: '2569-03-17', dueDate: '2569-05-25', ref: REFS.sarapee },
  { id: '3.2', catId: 3, title: 'จัดทำระเบียบปฏิบัติด้านความมั่นคงปลอดภัยที่สำคัญสำหรับบุคลากรทุกคน', owner: 'IT ทั้งหมด', startDate: '2569-03-17', dueDate: '2569-05-25', ref: REFS.sarapee },
  { id: '3.3', catId: 3, title: 'ดำเนินการประเมินการรับรู้ เข้าใจ และปฏิบัติตามระเบียบกับบุคลากรทุกคน 100%', owner: 'IT ทั้งหมด', startDate: '2569-03-17', dueDate: '2569-05-25', ref: REFS.banbung },
  { id: '3.4', catId: 3, title: 'ปรับปรุงห้อง Data Center ตามหัวข้อในคู่มือ HAIT ข้อ A B C D เสร็จสิ้นทุกข้อ', owner: 'IT ทั้งหมด', startDate: '2569-03-17', dueDate: '2569-05-25', ref: REFS.tmiDoc },
  { id: '3.5', catId: 3, title: 'จัดทำแผน BCP ของทุกหน่วยงานที่ใช้ระบบ HIS เสร็จสิ้น โดยมีรายละเอียดขั้นตอนการปฏิบัติ', owner: 'IT ทั้งหมด', startDate: '2569-03-17', dueDate: '2569-05-25', ref: REFS.vachira },
  { id: '3.6', catId: 3, title: 'วางระบบการ Backup Offline และจัดทำคู่มือการปฏิบัติงาน Backup Offline ทุกฐานข้อมูล', owner: 'IT ทั้งหมด', startDate: '2569-03-17', dueDate: '2569-05-25', ref: REFS.banbung },
  { id: '3.7', catId: 3, title: 'ดำเนินการซ้อมแผน BCP โดยตรวจสอบขั้นตอน จับเวลา มีรายงานผล', owner: 'IT ทั้งหมด', startDate: '2569-03-17', dueDate: '2569-05-25', ref: REFS.vachira },
  { id: '3.8', catId: 3, title: 'นำผลการซ้อมแผน BCP มาปรับปรุงให้แผนดีขึ้น อย่างน้อย 1 รอบ PDCA', owner: 'IT ทั้งหมด', startDate: '2569-03-17', dueDate: '2569-05-25', ref: REFS.vachira },

  // หมวด 4 — การจัดระบบบริการ IT โรงพยาบาล
  { id: '4.1', catId: 4, title: 'วางระบบ Service Desk ให้ชัดเจน เรื่องจุดติดต่อ ช่องทางติดต่อ ผู้รับเรื่อง', owner: 'IT + งาน HA', startDate: '2569-03-17', dueDate: '2569-05-25', ref: REFS.banbung },
  { id: '4.2', catId: 4, title: 'จัดทำ SLA โดยให้น้ำหนักกับการบริการผู้ป่วยไม่ให้ติดขัด รับประกันเวลา', owner: 'IT + งาน HA', startDate: '2569-03-17', dueDate: '2569-05-25', ref: REFS.banbung },
  { id: '4.3', catId: 4, title: 'วางระบบบันทึกอุบัติการณ์ ให้มีหัวข้อครบตามคู่มือ HAIT กำหนดผู้รับผิดชอบ', owner: 'IT + งาน HA', startDate: '2569-03-17', dueDate: '2569-05-25', ref: REFS.banbung },
  { id: '4.4', catId: 4, title: 'ดำเนินการบันทึกอุบัติการณ์ ให้มีจำนวนไม่น้อยกว่าร้อยละ 50 ของจำนวนเหตุการณ์จริง', owner: 'IT + งาน HA', startDate: '2569-03-17', dueDate: '2569-05-25', ref: REFS.banbung },
  { id: '4.5', catId: 4, title: 'วางระบบการบันทึกกิจกรรมรายบุคคลของบุคลากรในฝ่าย IT ให้มีหัวข้อครบตามคู่มือ', owner: 'IT + งาน HA', startDate: '2569-03-17', dueDate: '2569-05-25', ref: REFS.banbung },
  { id: '4.6', catId: 4, title: 'ดำเนินการบันทึกกิจกรรมรายบุคคล ให้เกิดการบันทึกทุกคน ทุกวัน ครบทุกชั่วโมง', owner: 'IT + งาน HA', startDate: '2569-03-17', dueDate: '2569-05-25', ref: REFS.banbung },

  // หมวด 5 — การควบคุมคุณภาพข้อมูลในระบบ IT
  { id: '5.1', catId: 5, title: 'วางระบบการตรวจสอบเวชระเบียนผู้ป่วยนอก กำหนดคณะกรรมการตรวจสอบ', owner: 'Auditor + เวชระเบียน', startDate: '2569-02-17', dueDate: '2569-05-25', ref: REFS.banbung },
  { id: '5.2', catId: 5, title: 'ดำเนินการตรวจสอบคุณภาพเวชระเบียนผู้ป่วยนอก ให้มีคะแนนคุณภาพของแพทย์แต่ละคน', owner: 'Auditor + เวชระเบียน', startDate: '2569-02-17', dueDate: '2569-05-25', ref: REFS.banbung },
  { id: '5.3', catId: 5, title: 'นำผลการตรวจสอบคุณภาพเวชระเบียนผู้ป่วยนอก มากำหนดแผนพัฒนาเฉพาะเจาะจง', owner: 'Auditor + เวชระเบียน', startDate: '2569-02-17', dueDate: '2569-05-25', ref: REFS.banbung },
  { id: '5.4', catId: 5, title: 'ทดสอบพิมพ์เวชระเบียนผู้ป่วยนอกออกมาในกระดาษ แล้วตรวจสอบความผิดเพี้ยน', owner: 'Auditor + เวชระเบียน', startDate: '2569-02-17', dueDate: '2569-05-25', ref: REFS.banbung },
  { id: '5.5', catId: 5, title: 'วางระบบการตรวจสอบเวชระเบียนผู้ป่วยใน กำหนดคณะกรรมการตรวจสอบ', owner: 'Auditor + เวชระเบียน', startDate: '2569-02-17', dueDate: '2569-05-25', ref: REFS.banbung },
  { id: '5.6', catId: 5, title: 'นำผลการตรวจสอบคุณภาพเวชระเบียนผู้ป่วยใน มากำหนดแผนพัฒนาเฉพาะเจาะจง', owner: 'Auditor + เวชระเบียน', startDate: '2569-02-17', dueDate: '2569-05-25', ref: REFS.banbung },
  { id: '5.7', catId: 5, title: 'ทดสอบพิมพ์เวชระเบียนผู้ป่วยในออกมาในกระดาษ แล้วตรวจสอบความผิดเพี้ยน', owner: 'Auditor + เวชระเบียน', startDate: '2569-02-17', dueDate: '2569-05-25', ref: REFS.banbung },

  // หมวด 6 — การควบคุมคุณภาพการพัฒนาโปรแกรม
  { id: '6.1', catId: 6, title: 'จัดทำเอกสารวิเคราะห์ระบบ ครอบคลุม การระบุปัญหา ความต้องการผู้ใช้ ผังงานระบบเดิม', owner: 'IT ทั้งหมด', startDate: '2569-04-28', dueDate: '2569-06-08', ref: REFS.banbung },
  { id: '6.2', catId: 6, title: 'จัดทำเอกสารออกแบบระบบ ครอบคลุม Context Diagram DFD ER Diagram Data Dictionary', owner: 'IT ทั้งหมด', startDate: '2569-04-28', dueDate: '2569-06-08', ref: REFS.banbung },
  { id: '6.3', catId: 6, title: 'มีคู่มือสำหรับผู้ใช้โปรแกรม ที่มีรายละเอียดครบถ้วน', owner: 'IT ทั้งหมด', startDate: '2569-04-28', dueDate: '2569-06-08', ref: REFS.banbung },

  // หมวด 7 — การจัดการศักยภาพ การเปลี่ยนแปลง และสมรรถนะ
  { id: '7.1', catId: 7, title: 'มีทะเบียน Hardware และตารางสรุปทรัพยากร แสดง Capacity ในภาพรวม', owner: 'IT ทั้งหมด', startDate: '2569-05-12', dueDate: '2569-07-06', ref: REFS.banbung },
  { id: '7.2', catId: 7, title: 'มีทะเบียน Software และตารางสรุปทรัพยากร แสดง Capacity ในภาพรวม', owner: 'IT ทั้งหมด', startDate: '2569-05-12', dueDate: '2569-07-06', ref: REFS.banbung },
  { id: '7.3', catId: 7, title: 'มีทะเบียนอุปกรณ์ Network และตารางสรุปทรัพยากร แสดง Network Diagram', owner: 'IT ทั้งหมด', startDate: '2569-05-12', dueDate: '2569-07-06', ref: REFS.banbung },
  { id: '7.4', catId: 7, title: 'มีการวิเคราะห์ Gap Analysis โดยแสดงความต้องการขั้นต่ำเทียบกับสิ่งที่มี', owner: 'IT ทั้งหมด', startDate: '2569-05-12', dueDate: '2569-07-06', ref: REFS.banbung },
  { id: '7.5', catId: 7, title: 'มีการวิเคราะห์ Utilization ของ Server ทุกตัว Network Bandwidth และ Traffic', owner: 'IT ทั้งหมด', startDate: '2569-05-12', dueDate: '2569-07-06', ref: REFS.banbung },
  { id: '7.6', catId: 7, title: 'มีการกำหนด Competency Mapping Competency Template และ Competency Dictionary', owner: 'IT ทั้งหมด', startDate: '2569-05-12', dueDate: '2569-07-06', ref: REFS.banbung },
  { id: '7.7', catId: 7, title: 'มีการจัดทำแบบประเมิน และประเมินสมรรถนะรายบุคคลของเจ้าหน้าที่ฝ่าย IT', owner: 'IT ทั้งหมด', startDate: '2569-05-12', dueDate: '2569-07-06', ref: REFS.banbung },
  { id: '7.8', catId: 7, title: 'มีการจัดทำแผนพัฒนาสมรรถนะรายบุคคลที่สอดคล้องกับผลการประเมิน', owner: 'IT ทั้งหมด', startDate: '2569-05-12', dueDate: '2569-07-06', ref: REFS.banbung },
];

export const INITIAL_ITEMS: Item[] = PLAN.map((p) => ({
  id: p.id,
  catId: p.catId,
  title: p.title,
  status: 'not_started',
  owner: p.owner,
  start: beDateToDayNumber(p.startDate),
  end: beDateToDayNumber(p.dueDate),
  startDate: p.startDate,
  dueDate: p.dueDate,
  ref: p.ref,
  documentUrl: '',
  notes: '',
}));
