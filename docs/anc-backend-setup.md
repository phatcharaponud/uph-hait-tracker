# คู่มือเชื่อม ANC Statistics เข้ากับ Google Sheets

ระบบ ANC Statistics ของ รพ.มหาวิทยาลัยพะเยา ใช้ Google Sheets เป็น backend
ผ่าน Google Apps Script (Web App) ทำให้ไม่ต้องดูแล server เอง และเปิดสิทธิ์ดู/แก้ผ่าน Drive ได้

## 1) สร้าง Google Sheet
1. เปิด <https://sheets.new>
2. ตั้งชื่อไฟล์เช่น `ANC-Statistics-UPHP-2569`
3. เปลี่ยนชื่อแท็บแรกเป็น **`anc_records`** (ตัวพิมพ์เล็กทั้งหมด)

> โค้ดจะสร้างหัวคอลัมน์ให้อัตโนมัติเมื่อมี request แรกเข้ามา

## 2) วาง Apps Script
1. เมนู **Extensions → Apps Script**
2. ลบโค้ดเดิมที่ Apps Script เปิดมาให้ออก แล้ววางโค้ดทั้งหมดจาก
   [`backend/anc-apps-script.gs`](../backend/anc-apps-script.gs)
3. กดบันทึก (💾)

## 3) Deploy เป็น Web App
1. กดปุ่ม **Deploy → New deployment**
2. เลือก type เป็น **Web app**
3. ตั้งค่า:
   - **Execute as:** Me (ใช้สิทธิ์เจ้าของชีต)
   - **Who has access:** Anyone (จำเป็นเพราะแอป frontend เรียกจาก browser ผู้ใช้)
4. กด **Deploy** → คัดลอก URL ที่ขึ้นต้นด้วย `https://script.google.com/macros/s/.../exec`

## 4) ตั้งค่าในแอป
สร้างไฟล์ `.env.local` ที่ root ของโปรเจกต์ ใส่ค่า

```
VITE_ANC_API_URL=https://script.google.com/macros/s/XXXXXXXX/exec
```

จากนั้น

```bash
npm install
npm run dev
```

เปิด `http://localhost:5173` → ที่ header ควรเห็นไฟสีเขียวพร้อมข้อความ
**"เชื่อม Google Sheets"** หากยังเห็น "โหมดทดลอง (Local)" ให้ตรวจสอบว่า
ค่า env โหลดถูกต้อง

## 5) โครงสร้างข้อมูล (คอลัมน์ใน `anc_records`)

| คอลัมน์         | คำอธิบาย                          |
|-----------------|-----------------------------------|
| id              | UUID ของบันทึก                    |
| serviceDate     | วันที่รับบริการ (yyyy-mm-dd)      |
| hn              | Hospital Number                   |
| name            | ชื่อ-สกุล หญิงตั้งครรภ์            |
| age             | อายุ (ปี)                          |
| gravida         | ครรภ์ที่                            |
| ga              | อายุครรภ์ (สัปดาห์)                |
| visitNumber     | ครั้งที่ฝากครรภ์                    |
| weight, height  | น้ำหนัก (กก.), ส่วนสูง (ซม.)       |
| bpSystolic/Diastolic | ความดันโลหิต บน/ล่าง (mmHg) |
| hct             | ความเข้มข้นเลือด (%)              |
| serviceType     | ประเภทบริการ                       |
| serviceUnit     | หน่วยบริการ                        |
| isFirstVisit    | TRUE หากเป็นการฝากครรภ์ครั้งแรก   |
| risks           | ภาวะเสี่ยง (คั่นด้วย `\|`)         |
| notes           | หมายเหตุ/คำแนะนำ                   |
| createdAt/At    | ISO timestamp                      |

## 6) สิทธิ์การเข้าถึง (เพิ่มเติมในอนาคต)
- เพิ่ม domain check ใน Apps Script ให้รับเฉพาะ `@up.ac.th`
- เพิ่มชั้น Google OAuth ใน frontend (ใช้แพคเกจ `@react-oauth/google` ที่ติดตั้งไว้แล้ว)
- เพิ่ม audit log ลงในแท็บ `activity_log`

## 7) ปัญหาที่พบบ่อย
- **CORS error** → ต้อง Deploy แบบ Web app + Anyone เท่านั้น
- **403 Authorization required** → ครั้งแรก Apps Script จะถาม permission ให้กด Allow
- **ไม่เห็นข้อมูลใน sheet หลังบันทึก** → ตรวจสอบว่าชื่อแท็บคือ `anc_records` ตรงตัว
- **เปลี่ยนโค้ด Apps Script แล้วไม่มีผล** → ต้อง Deploy → Manage deployments → Edit → New version
