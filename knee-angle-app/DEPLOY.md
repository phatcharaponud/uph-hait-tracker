# DEPLOY.md — checklist เปิดเครื่องแล้วทำตามได้เลย

## Phase 1 · ทดสอบบนมือถือผ่าน LAN (~10 นาที)

```bash
cd knee-angle-app
npm install
npm run dev -- --host
```

เปิดบน Android Chrome: `https://<LAN-IP>:5173/` → bypass cert warning →
อนุญาตกล้อง + motion sensor → กด "Add to Home screen" ถ้าต้องการไอคอน

---

## Phase 2 · Deploy บน Vercel (~5 นาที)

1. สมัคร [vercel.com](https://vercel.com) ด้วย GitHub
2. **Add New → Project →** เลือก repo `phatcharaponud/uph-hait-tracker`
3. ตั้ง:
   - **Root Directory:** `knee-angle-app`
   - **Framework Preset:** Vite
   - ปล่อยค่า build/output ตาม default (vercel.json จัดการให้)
4. **Deploy** → ได้ URL เช่น `https://knee-angle-app.vercel.app`
5. ทดสอบ:
   - หน้าแรก: `https://knee-angle-app.vercel.app`
   - Privacy: `https://knee-angle-app.vercel.app/privacy.html`
   - Asset links: `https://knee-angle-app.vercel.app/.well-known/assetlinks.json`
     (ตอนนี้ยังเป็น placeholder — อัปเดต SHA-256 ทีหลัง)

ถ้าต้องการ custom domain (เช่น `knee.up.ac.th`): Vercel → Project Settings →
Domains → Add → ตั้ง CNAME ที่ DNS provider

---

## Phase 3 · ห่อเป็น Android app ด้วย Bubblewrap (~30 นาที ครั้งแรก)

ดูรายละเอียดใน `android/README.md`

```bash
# ติดตั้งครั้งเดียว
npm install -g @bubblewrap/cli
bubblewrap doctor   # auto install Android SDK + JDK

# สร้าง project
cd knee-angle-app/android
# แก้ twa-manifest.json: แทนที่ REPLACE_ME_WITH_DOMAIN ก่อน
bubblewrap init --manifest=./twa-manifest.json
# generate signing key ใหม่ตาม prompt

# build
bubblewrap build
# ได้ app-release-bundle.aab + app-release-signed.apk

# ทดสอบ
adb install app-release-signed.apk
```

จากนั้นดึง SHA-256 ไปแทนที่ใน `public/.well-known/assetlinks.json` แล้ว push:
```bash
keytool -list -v -keystore android.keystore -alias android | grep SHA256
```

---

## Phase 4 · Google Play Store (~3-7 วัน รอ review)

### สมัคร Developer Account
- [play.google.com/console](https://play.google.com/console) — $25 ครั้งเดียว
- ถ้าใช้ในนาม รพ. → **Organization account** (ต้องมี D-U-N-S number)

### สร้าง App
- Create app → กรอก Default language: Thai → App name: `วัดมุมเข่า – Knee Angle`
- App or game: **App** • Free or paid: **Free**
- ยอมรับ declarations (ad? No, etc.)

### Set up app
ทำ checklist ฝั่งซ้ายให้ครบ:
1. **App access** — ไม่มี login, all features available without account
2. **Ads** — No ads
3. **Content rating** — กรอก questionnaire
4. **Target audience** — Adult (18+)
5. **News app** — No
6. **COVID-19 contact tracing** — No
7. **Data safety** — copy ค่าจาก `android/play-listing.md`
8. **Government apps** — Yes (เป็นหน่วยงานของรัฐ — มหาวิทยาลัยพะเยา)
9. **Financial features** — No

### Main store listing
- Copy ข้อความจาก `android/play-listing.md` (short + full description)
- Upload icon 512×512 PNG
- Upload feature graphic 1024×500
- Upload screenshots ≥ 2 ภาพ
- Privacy policy URL → `https://YOUR_DOMAIN/privacy.html`

### Production release
1. Production → Create new release
2. Upload `app-release-bundle.aab`
3. Release notes — copy จาก `android/play-listing.md`
4. **เลือก Closed testing ก่อน** (เพิ่มเป็น tester ตัวเอง 14 วัน)
   จากนั้น Promote release → Production
5. Submit for review

### หลังผ่าน review
- ทดสอบดาวน์โหลดแอปจาก Play Store ของจริง
- ตรวจว่าเปิดมาแล้ว **ไม่มี URL bar** (= TWA verify ผ่าน)
- ถ้ามี URL bar = `assetlinks.json` ยัง verify ไม่ผ่าน → ตรวจ SHA-256

---

## ปัญหาที่เจอบ่อย

| ปัญหา | สาเหตุ |
|---|---|
| URL bar ปรากฏใน TWA | SHA-256 ใน assetlinks.json ผิด หรือ Cache-Control นาน → รอ 5-15 นาที |
| กล้องเปิดไม่ได้ใน Play app | App ต้องเปิดผ่าน HTTPS — Vercel จัดการให้ |
| Motion sensor ไม่ทำงาน | iOS 13+ ต้องขอ permission (`requestOrientationPermission` ใน app เรียกอยู่แล้ว) |
| Build บูลแวรปฟ้อง JDK | ต้อง JDK 17+ (`bubblewrap doctor` ช่วยติดตั้ง) |
| Play review reject "Health misinformation" | เพิ่ม disclaimer "ไม่ใช่อุปกรณ์ทางการแพทย์" ในทั้ง app + Play description (ทำแล้ว) |

---

## ข้อกฎหมายไทยที่ควรพิจารณา

- **อย. (อย./FDA Thailand) Medical Device:** ถ้าเคลมว่าใช้ "วินิจฉัย/รักษา/พยากรณ์โรค"
  จะเข้านิยาม "เครื่องมือแพทย์" ตาม พ.ร.บ. เครื่องมือแพทย์ พ.ศ. 2562
  ต้องขออนุญาต อย. ก่อน — ใช้ภาษา **"คัดกรอง / ติดตามแนวโน้ม / ฝึกหัด"** ในทุก surface
- **PDPA (พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล):** เนื่องจากแอปไม่เก็บข้อมูลฝั่งเซิร์ฟเวอร์
  ภาระตาม PDPA จึงน้อย แต่ privacy policy ควรอ้างอิงให้ชัด (ทำแล้ว)
- **EU MDR / FDA US:** ถ้าเปิดให้ผู้ใช้ต่างประเทศ → ต้องประเมินว่าเข้าข่าย
  Software as a Medical Device หรือไม่
