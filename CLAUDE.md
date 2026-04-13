# HAIT Tracking System – โรงพยาบาลมหาวิทยาลัยพะเยา

## บริบทโปรเจกต์
ระบบเว็บแอปสำหรับติดตามความคืบหน้าการจัดเตรียมเอกสารและกิจกรรม
เพื่อขอรับการรับรอง **HAIT (Hospital Accreditation for Information Technology)**
ของสมาคมเวชสารสนเทศไทย (TMI) สำหรับโรงพยาบาลมหาวิทยาลัยพะเยา

## เอกสารอ้างอิงสำคัญ (อ่านก่อนเริ่มพัฒนา)
- `docs/HAIT_structure.md` — โครงสร้างมาตรฐาน HAIT 7 หมวด และรายการเอกสารย่อย
- `docs/HAIT_examples.md` — ตัวอย่างโรงพยาบาลที่ผ่าน HAIT และรูปแบบการเผยแพร่
- `docs/requirements.md` — ความต้องการเชิงฟังก์ชันของระบบ

## Tech Stack
- **Frontend:** React (Vite) + Tailwind CSS + Recharts
- **Backend:** Google Sheets ผ่าน Google Apps Script (หรือ Firebase Firestore หากต้องการ realtime)
- **Auth:** Google OAuth จำกัด domain `@up.ac.th`
- **Deployment:** GitHub Pages (branch `gh-pages`) ผ่าน GitHub Actions
- **Repository:** `phatcharaponud/hait-tracker` (เสนอชื่อ)

## แนวทางการพัฒนา (Conventions)
- UI ทั้งหมดเป็นภาษาไทย
- วันที่แสดงแบบ **พ.ศ.** (Buddhist Era) เช่น 12 เมษายน 2569
- ธีมสี: กรมท่า (navy blue `#1e3a5f`) ให้สอดคล้องกับระบบพัสดุเดิม
- ใช้ฟอนต์ Sarabun หรือ Prompt
- Responsive design รองรับทั้ง desktop และ mobile
- เน้นหลัก **หลีกเลี่ยงการ hallucinate** ข้อมูลที่ไม่มีในเอกสารอ้างอิง

## โครงสร้างโปรเจกต์ที่คาดหวัง
```
hait-tracking-system/
├── CLAUDE.md                 # ไฟล์นี้
├── docs/                     # เอกสารอ้างอิง
│   ├── HAIT_structure.md
│   ├── HAIT_examples.md
│   └── requirements.md
├── src/
│   ├── App.jsx
│   ├── components/
│   ├── pages/
│   └── data/
│       └── haitChecklist.js  # แปลงจาก HAIT_structure.md
├── backend/
│   └── apps-script.gs        # Google Apps Script code
└── package.json
```

## หลักการสำคัญ
1. **ข้อมูลหลักของ checklist** ให้ดึงจาก `docs/HAIT_structure.md` โดยตรง เพื่อให้สามารถปรับปรุงเอกสารและ code พร้อมกัน
2. **ไม่ลบหรือแก้ไขเนื้อหา** ในไฟล์ `docs/` โดยไม่ได้รับการยืนยันจากผู้ใช้
3. **Commit git เป็นระยะ** ทุกครั้งที่มีการเพิ่ม feature สำเร็จ
4. **ทุก PR/commit message** เขียนเป็นภาษาอังกฤษ แต่ UI และ docs เป็นภาษาไทย

## คำสั่งเริ่มต้น (ใช้กับ Claude Code)
```
อ่าน CLAUDE.md และไฟล์ทั้งหมดใน docs/ ก่อน
แล้วสรุปความเข้าใจเกี่ยวกับโปรเจกต์ให้ฟัง
ก่อนที่จะเริ่มเขียน code
```

## ผู้รับผิดชอบ
- **Product Owner:** รองผู้อำนวยการฝ่ายพัฒนาระบบบริการสุขภาพ รพ.มหาวิทยาลัยพะเยา
- **Development:** Claude Code + Human reviewer
