# Deploy ระบบ ANC ขึ้น Production

ระบบใช้ **GitHub Pages** + **Google Sheets (ผ่าน Apps Script)** ไม่ต้องเช่า server
ค่าใช้จ่ายเป็น 0 บาท ใช้ได้ตลอดภายใน Google Workspace ของ @up.ac.th

URL Production จะเป็น
```
https://phatcharaponud.github.io/uph-hait-tracker/
```

มี 3 ขั้นตอนหลัก (ทำครั้งเดียว):

---

## ขั้นที่ 1 · เตรียม Google Sheets Backend

1. เปิด <https://sheets.new> สร้างไฟล์ใหม่ ตั้งชื่อเช่น `ANC-Statistics-UPHP`
2. **double-click** ที่ tab ด้านล่าง (ที่ขึ้นว่า "Sheet1") เปลี่ยนชื่อเป็น **`anc_records`**
   (พิมพ์เล็กตัวธรรมดา, ไม่มีช่องว่าง)
3. ที่เมนู **Extensions → Apps Script**
4. ลบโค้ดที่มีอยู่ใน editor ออกทั้งหมด → เปิดไฟล์
   [`backend/anc-apps-script.gs`](../backend/anc-apps-script.gs) → คัดลอกทั้งไฟล์ → วาง
5. กดบันทึก (💾)
6. กดปุ่ม **Deploy** (มุมขวาบน) → **New deployment**
7. กดรูปเฟือง → เลือก **Web app**
8. กรอก:
   - Description: `ANC backend v1`
   - **Execute as:** `Me (your email)`
   - **Who has access:** `Anyone`
9. กด **Deploy**
10. ครั้งแรกจะขึ้น "Authorize access" → Allow ตามขั้นตอน
11. คัดลอก URL ที่ขึ้นเหมือน
    `https://script.google.com/macros/s/AKfycb..../exec`

---

## ขั้นที่ 2 · ตั้งค่า GitHub Secrets

1. เปิด <https://github.com/phatcharaponud/uph-hait-tracker/settings/secrets/actions>
2. กด **New repository secret**
3. กรอก:
   - Name: **`VITE_ANC_API_URL`**
   - Value: URL ที่ copy มาจากขั้นที่ 1 ข้อ 11
4. กด **Add secret**

ส่วน secret อื่น ๆ (`VITE_API_URL`, `VITE_GOOGLE_CLIENT_ID`) ไม่ต้องตั้งก็ได้
build จะถือเป็นค่าว่าง — ไม่กระทบเพราะ ANC ไม่ได้เรียกใช้

---

## ขั้นที่ 3 · เปิดใช้ GitHub Pages และ Deploy

1. เปิด <https://github.com/phatcharaponud/uph-hait-tracker/settings/pages>
2. ที่ **Build and deployment → Source** เลือก **GitHub Actions**
   (ถ้าตั้งไว้แล้วก็ข้าม)
3. Merge PR หรือ push code เข้า `main` — GitHub Actions จะรัน workflow
   `.github/workflows/deploy.yml` อัตโนมัติ
4. รอประมาณ 1–2 นาที ดูสถานะที่
   <https://github.com/phatcharaponud/uph-hait-tracker/actions>
5. เมื่อ ✅ เขียวแล้ว เปิด <https://phatcharaponud.github.io/uph-hait-tracker/>
6. ดู header ของหน้าเว็บ ถ้าเห็น **"เชื่อม Google Sheets"** ไฟเขียว = ใช้งานได้จริง 🎉

---

## วิธีตรวจว่าทำงานครบลูป

1. เปิดเว็บ → ไปที่ tab **บันทึกใหม่** → กรอกข้อมูลทดลอง → กด "บันทึกข้อมูล"
2. เปิด Google Sheet ของขั้นที่ 1 → ดูแท็บ `anc_records` ควรมีข้อมูลปรากฏแถวล่างสุด
3. กลับมาที่เว็บ → tab **รายชื่อ** → ต้องเห็นข้อมูลที่เพิ่งบันทึก
4. เปิดเว็บจากเครื่องอื่น/มือถือ → ต้องเห็นข้อมูลเดียวกัน (= ดึงจาก Sheets จริง)

---

## การ update โค้ดในอนาคต

- Push เข้า `main` → ระบบ deploy ใหม่อัตโนมัติ
- ถ้าแก้ Apps Script → ต้อง **Deploy → Manage deployments → ✏️ → New version → Deploy**
  มิฉะนั้นโค้ดใหม่จะไม่มีผล

---

## Trouble-shooting

| อาการ | สาเหตุ / วิธีแก้ |
|------|------------------|
| Header ยังขึ้น "โหมดทดลอง (Local)" | `VITE_ANC_API_URL` ไม่ได้ตั้งเป็น secret หรือยังไม่ build ใหม่หลังตั้ง |
| CORS / network error ใน console | Apps Script deploy ไม่ได้เลือก `Anyone` |
| 403 Authorization required | เปิด Apps Script → รัน function `doGet` หนึ่งครั้งเพื่อ approve |
| Sheet ไม่มีหัวคอลัมน์ | ตั้งชื่อแท็บไม่ตรง — ต้องเป็น `anc_records` พอดี |
| Build fail ใน Actions | เปิด tab Actions ดู log — มักเป็น secret ที่ขาด หรือ test ไม่ผ่าน |
