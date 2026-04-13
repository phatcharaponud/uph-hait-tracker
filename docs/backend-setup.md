# คู่มือติดตั้ง Backend: Google Sheets + Apps Script

## ภาพรวม

ระบบ HAIT Tracker ใช้ **Google Sheets** เป็นฐานข้อมูล และ **Google Apps Script**
เป็น API Server (Web App) โดยเว็บแอปจะเรียก API ผ่าน HTTPS เพื่ออ่าน/เขียนข้อมูล

```
[React Web App]  ──HTTPS──▶  [Apps Script Web App]  ──▶  [Google Sheet]
```

## ข้อดีของวิธีนี้

- ✅ **ฟรี** — ใช้ quota ของ Google บัญชี up.ac.th
- ✅ **ไม่ต้อง host server** — Google จัดการให้
- ✅ **เปิด Sheet ดูข้อมูลได้โดยตรง** — ผู้บริหารดูใน Google Sheets ได้เลย
- ✅ **Backup อัตโนมัติ** — Version history ของ Google Sheets
- ✅ **Export ง่าย** — ดาวน์โหลด Excel/CSV ได้ทันที

---

## 📋 ขั้นตอนติดตั้ง (ครั้งแรก)

### Step 1: สร้าง Google Sheet

1. เปิด https://sheets.google.com (ล็อกอินด้วย `@up.ac.th`)
2. สร้าง Sheet ใหม่ ตั้งชื่อ: **"HAIT Tracker - รพ.มหาวิทยาลัยพะเยา"**
3. Copy URL ของ Sheet ไว้ (จะใช้ทีหลัง)

### Step 2: ติดตั้ง Apps Script

1. ใน Google Sheet → เมนู **Extensions** → **Apps Script**
2. จะเปิด editor ขึ้นมา ลบ code เดิมทั้งหมดใน `Code.gs`
3. Copy code จากไฟล์ `backend/apps-script.gs` วางแทนที่
4. กด **💾 Save** (หรือ Ctrl+S)
5. ตั้งชื่อโปรเจกต์: **"HAIT Tracker Backend"**

### Step 3: รัน Setup (สร้าง Sheet tabs)

1. ใน Apps Script editor → เลือกฟังก์ชัน **`setupSheets`** จาก dropdown ด้านบน
2. กด **▶ Run**
3. ครั้งแรกจะขอ permission:
   - "Review permissions" → เลือกบัญชี `@up.ac.th`
   - "Advanced" → "Go to HAIT Tracker Backend (unsafe)" → "Allow"
4. กลับไปดู Google Sheet จะเห็น 4 tabs ใหม่:
   - `items` — ข้อมูล checklist
   - `users` — ผู้ใช้งาน
   - `owners` — รายชื่อผู้รับผิดชอบ
   - `activity_log` — บันทึกการเปลี่ยนแปลง

### Step 4: Deploy เป็น Web App

1. ใน Apps Script editor → มุมขวาบน **Deploy** → **New deployment**
2. กดไอคอน ⚙️ ข้าง "Select type" → เลือก **Web app**
3. ตั้งค่า:
   - **Description:** `HAIT API v1`
   - **Execute as:** `Me (ของคุณ@up.ac.th)`
   - **Who has access:** `Anyone` *(ระบบจะเช็ค domain ผ่าน code เอง)*
4. กด **Deploy**
5. **Copy Web app URL** ที่ได้ เก็บไว้ เช่น:
   ```
   https://script.google.com/macros/s/AKfyc.../exec
   ```
   → URL นี้คือ **API endpoint** ที่จะใช้ใน React

### Step 5: ทดสอบ API

เปิดเบราว์เซอร์ ไปที่:
```
{Web_App_URL}?action=list
```
ควรได้ผลลัพธ์:
```json
{ "ok": true, "data": [] }
```
(ยังไม่มีข้อมูล เพราะยังไม่ได้เพิ่ม)

---

## 📊 โครงสร้าง Sheets

### Sheet: `items`
| Column | ประเภท | คำอธิบาย |
|---|---|---|
| id | string | รหัส item เช่น "1.1.1", "3.2.1" |
| catId | number | หมวด 1-7 |
| title | string | ชื่อเอกสาร/กิจกรรม |
| status | string | not_started / in_progress / completed / needs_revision |
| owner | string | ผู้รับผิดชอบ |
| dueDate | date | วันครบกำหนด (พ.ค. 2569) |
| startDate | date | วันเริ่ม |
| documentUrl | string | ลิงก์เอกสารที่จัดทำ (Google Drive) |
| refUrl | string | ลิงก์ตัวอย่างจาก รพ. อื่น |
| notes | string | หมายเหตุ |
| updatedAt | datetime | เวลาที่อัปเดตล่าสุด |
| updatedBy | string | อีเมลผู้อัปเดตล่าสุด |

### Sheet: `owners`
| Column | คำอธิบาย |
|---|---|
| name | ชื่อผู้รับผิดชอบ เช่น "CIO", "IT Security" |
| email | อีเมล (ถ้ามี) |
| role | admin / editor / viewer |

### Sheet: `activity_log`
ระบบเขียนอัตโนมัติทุกครั้งที่มีการเปลี่ยนแปลง

### Sheet: `users`
จัดการสิทธิ์ผู้ใช้ (ถ้าต้องการควบคุม role เข้มงวด)

---

## 🔧 Seed Initial Data

หลัง setup แล้ว ให้นำเข้าข้อมูลเริ่มต้น 38 รายการจาก `src/data/haitChecklist.js`:

### วิธีที่ 1: Copy-paste ใน Sheet โดยตรง (ง่ายสุด)
เปิดไฟล์ `seed-data.csv` (จะให้ในขั้นตอนถัดไป) → import เข้า Sheet `items`

### วิธีที่ 2: รัน script seed
เพิ่มฟังก์ชัน `seedInitialData()` ใน Apps Script แล้วรันครั้งเดียว

---

## 🔄 การอัปเดต Backend

เมื่อแก้ code ใน `apps-script.gs`:
1. Paste code ใหม่ → Save
2. **Deploy → Manage deployments** → ไอคอนดินสอ (Edit)
3. **Version:** New version → Deploy
4. **URL เดิมใช้ได้ต่อ** (ไม่ต้องเปลี่ยน React)

---

## 🔐 Security Notes

- ✅ Code ตรวจสอบ `@up.ac.th` domain ทุก POST request
- ✅ ทุกการเปลี่ยนแปลงถูก log พร้อมอีเมลผู้ทำ
- ⚠️ API URL ถือเป็น semi-public — อย่าโพสต์ใน GitHub public repo
- 💡 แนะนำใช้ **Google OAuth** ใน React เพื่อยืนยันตัวตน แล้วส่ง email ใน request

---

## 🆘 Troubleshooting

| ปัญหา | วิธีแก้ |
|---|---|
| 401 Unauthorized | ตรวจว่า email ลงท้าย `@up.ac.th` |
| Sheet not found | รัน `setupSheets()` ซ้ำ |
| CORS error | Apps Script เปิด CORS อัตโนมัติเมื่อ deploy เป็น Web app |
| Data ไม่อัปเดต | ล้าง browser cache หรือใช้ no-cache fetch |

---

## 📞 ขั้นตอนถัดไป

หลัง backend พร้อม → ส่งต่อให้ Claude Code เพื่อ:
1. สร้าง React app ตาม prototype v3
2. เชื่อม API ด้วย Web App URL ที่ได้จาก Step 4
3. Deploy ไป GitHub Pages
