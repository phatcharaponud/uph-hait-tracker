# HAIT Tracking System

ระบบติดตามงานการเตรียมเอกสาร HAIT ของโรงพยาบาลมหาวิทยาลัยพะเยา

## 🚀 วิธีเริ่มต้นใช้งานกับ Claude Code

### 1. Clone หรือสร้างโปรเจกต์

```bash
# วางโฟลเดอร์นี้ไว้ในที่ที่ต้องการ แล้ว
cd hait-tracking-system
git init
git add .
git commit -m "Initial project setup with HAIT documentation"
```

### 2. เปิด Claude Code

```bash
claude
```

### 3. ใช้ Prompt เริ่มต้น

Copy ข้อความด้านล่างนี้ส่งให้ Claude Code:

---

```
สวัสดีครับ นี่คือโปรเจกต์ระบบติดตามงาน HAIT ของ รพ.มหาวิทยาลัยพะเยา

กรุณาอ่านไฟล์ต่อไปนี้ให้ครบก่อนเริ่มงาน:
1. CLAUDE.md - context หลักของโปรเจกต์
2. docs/HAIT_structure.md - โครงสร้างมาตรฐาน HAIT 7 หมวด
3. docs/HAIT_examples.md - ตัวอย่าง รพ. อื่น
4. docs/requirements.md - ความต้องการระบบ

หลังอ่านเสร็จ ให้สรุปความเข้าใจให้ฟังก่อน
แล้วรอคำสั่งถัดไป ยังไม่ต้องเริ่มเขียน code
```

---

### 4. เมื่อ Claude Code เข้าใจโปรเจกต์แล้ว สั่งต่อทีละขั้น

**Step A — Setup โปรเจกต์**
```
สร้างโปรเจกต์ React ด้วย Vite + Tailwind + Recharts
ติดตั้ง dependencies ที่จำเป็น
และสร้าง .gitignore, package.json ให้พร้อม
```

**Step B — สร้าง Seed Data**
```
แปลงข้อมูลจาก docs/HAIT_structure.md
ให้เป็นไฟล์ src/data/haitChecklist.js
โดยแต่ละ item มี id, category, title, description, status, assignee, dueDate, documentUrl, notes
```

**Step C — สร้าง UI**
```
สร้างหน้าแรกที่แสดง checklist 7 หมวด
ใช้ธีมกรมท่า #1e3a5f, ฟอนต์ Sarabun
วันที่แสดงเป็น พ.ศ.
ยังไม่ต้องเชื่อม backend
```

**Step D — Dashboard**
```
สร้างหน้า Dashboard แสดง % ความคืบหน้ารายหมวด
ใช้ Recharts แสดง bar chart และ pie chart
```

**Step E — Backend**
```
สร้าง Google Apps Script (backend/apps-script.gs)
สำหรับเชื่อม Google Sheets เป็น backend
และเขียนคู่มือ deploy ใน docs/backend-setup.md
```

**Step F — Deploy**
```
สร้าง GitHub Actions workflow
สำหรับ auto-deploy ไปยัง GitHub Pages
เมื่อ merge เข้า main branch
```

## 📁 โครงสร้างโปรเจกต์ปัจจุบัน

```
hait-tracking-system/
├── CLAUDE.md                  # Context หลัก (Claude Code อ่านอัตโนมัติ)
├── README.md                  # ไฟล์นี้
└── docs/
    ├── HAIT_structure.md      # โครงสร้างมาตรฐาน HAIT 7 หมวด
    ├── HAIT_examples.md       # ตัวอย่าง รพ. อื่น
    └── requirements.md        # Requirements specification
```

## 💡 Tips การทำงานกับ Claude Code

1. **ทำทีละ step** อย่าสั่งรวมทีเดียว เพราะ context จะล้น
2. **ให้ commit git** หลังจบแต่ละ step: พิมพ์ `commit การเปลี่ยนแปลงล่าสุด`
3. **Review code ก่อน accept** โดยเฉพาะส่วน Google Apps Script
4. **อัปเดต CLAUDE.md** เมื่อมีการเปลี่ยนแปลง convention หรือ tech stack
5. หาก Claude Code หลงทาง พิมพ์ `อ่าน CLAUDE.md อีกครั้ง` เพื่อรีเซ็ต context

## 📝 License
Internal use only — University of Phayao Hospital
