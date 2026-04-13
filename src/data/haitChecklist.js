// src/data/haitChecklist.js
// Seed data สำหรับระบบติดตามงาน HAIT
// อ้างอิง: docs/HAIT_structure.md (TMI Document_HAIT_HAITStarV1)

export const HAIT_CATEGORIES = [
  { id: 1, code: "HAIT1", name: "แผนแม่บทเทคโนโลยีสารสนเทศ", nameEn: "IT Master Plan", docCount: 1, color: "#1e3a5f" },
  { id: 2, code: "HAIT2", name: "การจัดการความเสี่ยง", nameEn: "IT Risk Management", docCount: 1, color: "#2563eb" },
  { id: 3, code: "HAIT3", name: "การจัดการความมั่นคงปลอดภัย", nameEn: "Security Management + HAIT Plus", docCount: 4, color: "#dc2626" },
  { id: 4, code: "HAIT4", name: "การจัดการระบบบริการและอุบัติการณ์", nameEn: "IT Service & Incident Management", docCount: 1, color: "#ea580c" },
  { id: 5, code: "HAIT5", name: "การพัฒนาคุณภาพข้อมูล", nameEn: "Data Quality Improvement", docCount: 2, color: "#16a34a" },
  { id: 6, code: "HAIT6", name: "การวิเคราะห์และออกแบบระบบ", nameEn: "System Analysis & Design", docCount: "ตามโปรแกรม", color: "#7c3aed" },
  { id: 7, code: "HAIT7", name: "การจัดการศักยภาพและสมรรถนะ", nameEn: "Capacity & Competency Management", docCount: 2, color: "#0891b2" },
];

export const STATUS_OPTIONS = [
  { value: "not_started", label: "ยังไม่เริ่ม", color: "#9ca3af" },
  { value: "in_progress", label: "กำลังดำเนินการ", color: "#f59e0b" },
  { value: "completed", label: "เสร็จแล้ว", color: "#10b981" },
  { value: "needs_revision", label: "ต้องปรับปรุง", color: "#ef4444" },
];

// แต่ละ item = เอกสาร/กิจกรรม ที่ต้องทำ
// ฟิลด์: id, categoryId, code, title, description, status, assignee, dueDate, documentUrl, notes, updatedAt
export const HAIT_CHECKLIST = [
  // หมวด 1
  { id: "1.1.1", categoryId: 1, title: "ข้อมูลพื้นฐานโรงพยาบาล", status: "not_started", assignee: "", dueDate: "", documentUrl: "", notes: "" },
  { id: "1.1.2", categoryId: 1, title: "สรุปแผนยุทธศาสตร์ของโรงพยาบาล", status: "not_started", assignee: "", dueDate: "", documentUrl: "", notes: "" },
  { id: "1.1.3", categoryId: 1, title: "ตารางวิเคราะห์ปัจจัยความสำเร็จ เชื่อมโยงยุทธศาสตร์ รพ. สู่ IT", status: "not_started", assignee: "", dueDate: "", documentUrl: "", notes: "" },
  { id: "1.1.4", categoryId: 1, title: "แผนยุทธศาสตร์ IT", status: "not_started", assignee: "", dueDate: "", documentUrl: "", notes: "" },
  { id: "1.1.5", categoryId: 1, title: "แผนปฏิบัติการ IT อย่างน้อย 1 ปี ในปีปัจจุบัน", status: "not_started", assignee: "", dueDate: "", documentUrl: "", notes: "" },
  { id: "1.1.6", categoryId: 1, title: "ประเมินผลการดำเนินงานในรอบปีที่ผ่านมา", status: "not_started", assignee: "", dueDate: "", documentUrl: "", notes: "" },

  // หมวด 2
  { id: "2.1.1", categoryId: 2, title: "ผลการประเมินจุดอ่อนช่องโหว่ประจำปี", status: "not_started", assignee: "", dueDate: "", documentUrl: "", notes: "" },
  { id: "2.1.2", categoryId: 2, title: "ผลการประเมินคะแนนความเสี่ยง (PxI)", status: "not_started", assignee: "", dueDate: "", documentUrl: "", notes: "" },
  { id: "2.1.3", categoryId: 2, title: "แผนกลยุทธ์การจัดการความเสี่ยง 4 ตาราง", status: "not_started", assignee: "", dueDate: "", documentUrl: "", notes: "" },
  { id: "2.1.4", categoryId: 2, title: "แผนปฏิบัติการจัดการความเสี่ยงในปีปัจจุบัน", status: "not_started", assignee: "", dueDate: "", documentUrl: "", notes: "" },
  { id: "2.1.5", categoryId: 2, title: "ประเมินผลการจัดการความเสี่ยงในรอบปีที่ผ่านมา", status: "not_started", assignee: "", dueDate: "", documentUrl: "", notes: "" },

  // หมวด 3 - Basic Security
  { id: "3.1.1", categoryId: 3, title: "นโยบายความมั่นคงปลอดภัย และการจัดการข้อมูลส่วนบุคคล (PDPA)", status: "not_started", assignee: "", dueDate: "", documentUrl: "", notes: "" },
  { id: "3.1.2", categoryId: 3, title: "ระเบียบปฏิบัติด้านความมั่นคงปลอดภัย", status: "not_started", assignee: "", dueDate: "", documentUrl: "", notes: "" },
  { id: "3.1.3", categoryId: 3, title: "ผลการประเมินความรับรู้ของบุคลากรต่อระเบียบปฏิบัติ", status: "not_started", assignee: "", dueDate: "", documentUrl: "", notes: "" },
  { id: "3.1.4", categoryId: 3, title: "ผลการประเมินความเข้าใจของบุคลากรต่อระเบียบปฏิบัติ", status: "not_started", assignee: "", dueDate: "", documentUrl: "", notes: "" },
  { id: "3.1.5", categoryId: 3, title: "ผลการประเมินการปฏิบัติของบุคลากรต่อระเบียบปฏิบัติ", status: "not_started", assignee: "", dueDate: "", documentUrl: "", notes: "" },
  { id: "3.1.6", categoryId: 3, title: "สรุปผลการปรับปรุง Data Center ตามมาตรฐาน HAIT", status: "not_started", assignee: "", dueDate: "", documentUrl: "", notes: "" },
  // HAIT Plus
  { id: "3.2.1", categoryId: 3, title: "การดำเนินการตามหัวข้อ HAIT Plus ข้อ A-R (18 หัวข้อ)", status: "not_started", assignee: "", dueDate: "", documentUrl: "", notes: "" },
  { id: "3.2.2", categoryId: 3, title: "คู่มือแนวทางปฏิบัติการดูแลรักษาห้อง Data Center", status: "not_started", assignee: "", dueDate: "", documentUrl: "", notes: "" },
  { id: "3.2.3", categoryId: 3, title: "คู่มือแนวทางปฏิบัติการสำรองข้อมูลฐานข้อมูลสำคัญ", status: "not_started", assignee: "", dueDate: "", documentUrl: "", notes: "" },
  { id: "3.3", categoryId: 3, title: "แผน BCP และรายงานผลการซ้อมดำเนินการ", status: "not_started", assignee: "", dueDate: "", documentUrl: "", notes: "" },
  { id: "3.4", categoryId: 3, title: "แผน DRP และรายงานผลการซ้อมดำเนินการ", status: "not_started", assignee: "", dueDate: "", documentUrl: "", notes: "" },

  // หมวด 4
  { id: "4.1", categoryId: 4, title: "การจัดระบบ Service Desk", status: "not_started", assignee: "", dueDate: "", documentUrl: "", notes: "" },
  { id: "4.2", categoryId: 4, title: "ข้อตกลงระดับบริการ (SLA) และผลการดำเนินงาน", status: "not_started", assignee: "", dueDate: "", documentUrl: "", notes: "" },
  { id: "4.3", categoryId: 4, title: "ข้อมูลบันทึกอุบัติการณ์ 3-6 เดือน", status: "not_started", assignee: "", dueDate: "", documentUrl: "", notes: "" },
  { id: "4.4", categoryId: 4, title: "บันทึกกิจกรรมประจำวันบุคลากร IT ทุกคน 3-6 เดือน", status: "not_started", assignee: "", dueDate: "", documentUrl: "", notes: "" },

  // หมวด 5
  { id: "5.1", categoryId: 5, title: "ระบบและผลการตรวจสอบคุณภาพเวชระเบียน OPD", status: "not_started", assignee: "", dueDate: "", documentUrl: "", notes: "" },
  { id: "5.2", categoryId: 5, title: "ระบบและผลการตรวจสอบคุณภาพเวชระเบียน IPD", status: "not_started", assignee: "", dueDate: "", documentUrl: "", notes: "" },

  // หมวด 6
  { id: "6.1", categoryId: 6, title: "การวิเคราะห์ระบบเดิมเปรียบเทียบกับระบบใหม่ (ต่อโปรแกรม)", status: "not_started", assignee: "", dueDate: "", documentUrl: "", notes: "" },
  { id: "6.2.1", categoryId: 6, title: "Context Diagram", status: "not_started", assignee: "", dueDate: "", documentUrl: "", notes: "" },
  { id: "6.2.2", categoryId: 6, title: "Data Flow Diagram (DFD)", status: "not_started", assignee: "", dueDate: "", documentUrl: "", notes: "" },
  { id: "6.2.3", categoryId: 6, title: "ER-Diagram", status: "not_started", assignee: "", dueDate: "", documentUrl: "", notes: "" },
  { id: "6.2.4", categoryId: 6, title: "Data Dictionary", status: "not_started", assignee: "", dueDate: "", documentUrl: "", notes: "" },

  // หมวด 7
  { id: "7.1.1", categoryId: 7, title: "ทะเบียน Hardware และตารางสรุป", status: "not_started", assignee: "", dueDate: "", documentUrl: "", notes: "" },
  { id: "7.1.2", categoryId: 7, title: "ทะเบียน Software ทั้งหมดในระบบ รพ.", status: "not_started", assignee: "", dueDate: "", documentUrl: "", notes: "" },
  { id: "7.1.3", categoryId: 7, title: "ทะเบียนอุปกรณ์ Network และ Network Diagram", status: "not_started", assignee: "", dueDate: "", documentUrl: "", notes: "" },
  { id: "7.1.4", categoryId: 7, title: "ผลการวิเคราะห์ Utilization: Server, Intranet, Internet", status: "not_started", assignee: "", dueDate: "", documentUrl: "", notes: "" },
  { id: "7.2.1", categoryId: 7, title: "Competency Mapping, Dictionary, Template", status: "not_started", assignee: "", dueDate: "", documentUrl: "", notes: "" },
  { id: "7.2.2", categoryId: 7, title: "ผลประเมิน Competency รายบุคคล (รวม CIO) + แผนพัฒนา", status: "not_started", assignee: "", dueDate: "", documentUrl: "", notes: "" },
];

export const getItemsByCategory = (categoryId) =>
  HAIT_CHECKLIST.filter((item) => item.categoryId === categoryId);

export const getCategoryProgress = (categoryId, items = HAIT_CHECKLIST) => {
  const catItems = items.filter((i) => i.categoryId === categoryId);
  if (catItems.length === 0) return 0;
  const completed = catItems.filter((i) => i.status === "completed").length;
  return Math.round((completed / catItems.length) * 100);
};
