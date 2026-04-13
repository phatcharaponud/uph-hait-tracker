# ความต้องการของระบบติดตามงาน HAIT (Requirements Specification)

## 1. ภาพรวมระบบ

ระบบติดตามงาน HAIT เป็นเว็บแอปภายในสำหรับทีมงานด้าน IT และคณะทำงาน HAIT ของ
รพ.มหาวิทยาลัยพะเยา เพื่อติดตามความคืบหน้าในการจัดเตรียมเอกสาร กิจกรรม
และหลักฐานต่างๆ ตามมาตรฐาน HAIT 7 หมวด ก่อนขอรับการตรวจเยี่ยมและตรวจประเมินจาก TMI

## 2. ผู้ใช้งาน (User Roles)

| Role | สิทธิ์ |
|---|---|
| **Admin (CIO / ผอ.ฝ่าย)** | จัดการผู้ใช้, กำหนดผู้รับผิดชอบ, ยืนยันสถานะ, Export รายงาน |
| **Editor (ผู้รับผิดชอบเอกสาร)** | อัปเดตสถานะ, upload/link เอกสาร, เพิ่มหมายเหตุ |
| **Viewer (คณะกรรมการ/ผู้บริหาร)** | ดู dashboard, ดูเอกสาร, export PDF |

**Auth:** Google OAuth จำกัด domain `@up.ac.th`

## 3. Functional Requirements

### 3.1 Checklist 7 หมวด HAIT
- แสดง checklist ตามโครงสร้าง `HAIT_structure.md` (7 หมวด, ~35 sub-items)
- แต่ละ item มี field:
  - ชื่อเอกสาร/กิจกรรม
  - คำอธิบาย
  - สถานะ: `ยังไม่เริ่ม` / `กำลังดำเนินการ` / `เสร็จแล้ว` / `ต้องปรับปรุง`
  - ผู้รับผิดชอบ (เลือกจากรายชื่อบุคลากร)
  - วันครบกำหนด (พ.ศ.)
  - ลิงก์เอกสาร (Google Drive URL)
  - หมายเหตุ/ความคิดเห็น
  - วันที่อัปเดตล่าสุด + ผู้อัปเดต

### 3.2 Dashboard
- แสดง % ความคืบหน้าโดยรวม
- แสดง % ความคืบหน้าแยกตามหมวด (Bar chart หรือ Radar chart)
- จำนวน item ในแต่ละสถานะ (Pie chart)
- Timeline/Gantt แสดงกำหนดส่ง
- รายการ item ใกล้ครบกำหนด (Alert สีแดง/เหลือง/เขียว/เทา)
  - แดง = ≤ 7 วัน
  - เหลือง = 8–14 วัน
  - เขียว = > 14 วัน
  - เทา = เลยกำหนด

### 3.3 Gap Analysis
- แสดงเปรียบเทียบเอกสารที่ รพ. **มีอยู่แล้ว** กับเอกสารที่ HAIT ต้องการ
- Flag รายการที่ยังขาดหรือไม่เป็นปัจจุบัน
- Link ไปยังเอกสารอ้างอิง/ตัวอย่างจาก รพ. อื่น (จาก `HAIT_examples.md`)

### 3.4 Reference Library
- หน้ารวมลิงก์ รพ. ตัวอย่างที่เผยแพร่เอกสาร HAIT
- หน้ารวมเอกสารมาตรฐานจาก TMI
- ลิงก์แบบประเมินตนเองของเขตสุขภาพที่ 1

### 3.5 Activity Log
- บันทึกทุกการเปลี่ยนแปลงสถานะ, ผู้แก้ไข, เวลา
- แสดงเป็น timeline ในแต่ละ item

### 3.6 Notifications (optional v2)
- แจ้งเตือนผ่าน LINE Notify/email เมื่อใกล้ครบกำหนด
- แจ้งเตือนทุกวันศุกร์สัปดาห์ที่ 2 และ 4 ของเดือน (pattern เดียวกับระบบพัสดุเดิม)

### 3.7 Export
- Export รายงานสรุปเป็น PDF (ธีมกรมท่า)
- Export checklist เป็น Excel
- ปุ่ม Print-friendly view

## 4. Non-Functional Requirements

### 4.1 Performance
- Page load < 3 วินาที
- รองรับผู้ใช้งานพร้อมกัน 30+ คน

### 4.2 Security
- Auth: Google OAuth + จำกัด `@up.ac.th`
- HTTPS เท่านั้น
- ไม่เก็บข้อมูลผู้ป่วยในระบบนี้

### 4.3 Data Storage
- **Option A (แนะนำ):** Google Sheets ผ่าน Google Apps Script Web App
  - ข้อดี: ทีม IT ของ รพ. คุ้นเคย, ไม่ต้อง host DB
- **Option B:** Firebase Firestore
  - ข้อดี: Realtime, scalable

### 4.4 Deployment
- Frontend: GitHub Pages ผ่าน GitHub Actions (auto-deploy เมื่อ merge เข้า main)
- Backend: Google Apps Script Web App (deploy ผ่าน clasp CLI)

### 4.5 UI/UX
- Responsive (desktop + mobile/tablet)
- ภาษาไทย 100%
- วันที่ พ.ศ.
- ธีมกรมท่า (`#1e3a5f`)
- Font: Sarabun หรือ Prompt

## 5. Roadmap

### Phase 1 — MVP (ภายใน 2 สัปดาห์)
- [ ] Auth @up.ac.th
- [ ] Checklist 7 หมวด + CRUD สถานะ
- [ ] Dashboard แสดง % ความคืบหน้า
- [ ] Connect Google Sheets

### Phase 2 — Enhancement (สัปดาห์ที่ 3–4)
- [ ] Gap Analysis page
- [ ] Reference Library
- [ ] Export PDF/Excel
- [ ] Activity log

### Phase 3 — Advanced (สัปดาห์ที่ 5+)
- [ ] Notifications (LINE/email)
- [ ] Integration กับระบบพัสดุเดิม (ถ้าจำเป็น)
- [ ] Multi-year tracking

## 6. ข้อมูลอ้างอิง
- `docs/HAIT_structure.md` — โครงสร้าง 7 หมวด ใช้เป็น seed data สำหรับ checklist
- `docs/HAIT_examples.md` — ตัวอย่าง รพ. อื่น ใช้ใน Reference Library
- เอกสาร TMI: https://tmi.or.th/การรับรอง/
