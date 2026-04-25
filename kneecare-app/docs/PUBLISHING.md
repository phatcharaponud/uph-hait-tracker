# คู่มือเผยแพร่แอป KneeCare Companion

ขั้นตอนทั้งหมดสำหรับ build และส่งขึ้น Google Play (Android) และ App Store (iOS)

## TL;DR — เส้นทางเร็วที่สุด

1. เปิดบัญชี: Expo (ฟรี) + Google Play Console ($25 จ่ายครั้งเดียว) + Apple Developer ($99/ปี)
2. ติดตั้ง Node.js 20 + EAS CLI
3. `eas init` → ผูก projectId
4. `eas build --profile production --platform all` → ได้ AAB + IPA จาก cloud (ไม่ต้องใช้ Mac)
5. `eas submit --profile production --platform all` → ส่งขึ้นทั้งสองสโตร์

ใช้เวลารวม ~3-7 วันรอ review (Apple ช้ากว่า)

---

## 0. สิ่งที่ต้องเตรียมก่อน

### บัญชีและเงิน
| รายการ | ค่าใช้จ่าย | หมายเหตุ |
|---|---|---|
| Expo account | ฟรี | สำหรับ EAS Build |
| Google Play Console | $25 ครั้งเดียว | https://play.google.com/console/signup |
| Apple Developer Program | $99/ปี | https://developer.apple.com/programs/ — ต้องสมัครเป็น Organization (มี D-U-N-S Number ของ มพ.) ใช้เวลา 1-4 สัปดาห์ หรือสมัครเป็น Individual ก็ได้ |
| EAS Build (free tier) | ฟรี 30 builds/เดือน | พอสำหรับโปรเจกต์เล็ก |

### เครื่องมือ
- Node.js 20 LTS
- Git
- EAS CLI: `npm install -g eas-cli`
- บัญชี GitHub (ถ้าใช้ CI)
- โทรศัพท์ Android สำหรับ test (iPhone จะใช้ TestFlight)

### Assets ที่ต้องเตรียม
ดู [`docs/ASSETS.md`](./ASSETS.md) สำหรับขนาดและสเปก รวมแล้ว:
- App icon 1024×1024
- Splash screen
- Notification icon (24×24 monochrome)
- Adaptive icon (Android)
- Feature graphic 1024×500 (Google Play)
- Screenshots อย่างน้อย 2 รูปต่อแพลตฟอร์ม

---

## 1. Setup ครั้งแรก

```bash
cd kneecare-app
npm install
npm install -g eas-cli
eas login
eas init
```

`eas init` จะสร้าง projectId ให้และอัปเดต `app.json` (`extra.eas.projectId`)

แก้ไข `app.json`:
- `owner` → ใส่ Expo username
- `extra.eas.projectId` → จะถูกแทนที่อัตโนมัติ

แก้ไข `eas.json`:
- `submit.production.ios.appleId` → Apple ID ของคุณ
- `submit.production.ios.ascAppId` → จะได้หลังสร้างแอปใน App Store Connect
- `submit.production.ios.appleTeamId` → Team ID จาก developer.apple.com

---

## 2. ทดสอบบนเครื่องจริงก่อน build production

### Android (เร็วที่สุด)

```bash
eas build --profile preview --platform android
```

ใช้เวลา ~10-15 นาที จะได้ลิงก์ `.apk` มาดาวน์โหลดติดตั้งบน Android เครื่องจริง

### iOS (ต้องมี Apple Developer แล้ว)

```bash
eas build --profile preview --platform ios
```

จะได้ `.ipa` simulator build (รันบน Mac กับ Xcode simulator)
หรือถ้าจะรันบน iPhone จริงต้อง register UDID ของเครื่องก่อน

---

## 3. Build production (สำหรับขึ้นสโตร์)

```bash
eas build --profile production --platform all
```

จะได้:
- **Android:** `.aab` (Android App Bundle — ฟอร์แมตที่ Google Play ต้องการ)
- **iOS:** `.ipa` พร้อมส่ง App Store Connect

ระหว่างนี้ EAS จะถาม:
- Android keystore → ให้ EAS สร้างให้ (เก็บใน cloud, **ห้ามทำหาย** เพราะใช้ทุกครั้งที่อัปเดต)
- iOS distribution certificate + provisioning profile → ให้ EAS จัดการให้

---

## 4. Google Play (Android)

### 4.1 สร้างแอปใน Play Console

1. https://play.google.com/console → "สร้างแอป"
2. ชื่อ: `KneeCare Companion`
3. ภาษาเริ่มต้น: ไทย
4. ประเภทแอป: แอป
5. ฟรี/เสียเงิน: ฟรี

### 4.2 กรอกข้อมูลบังคับ
- **Privacy policy URL** — ต้องมี (ดู `docs/PRIVACY_POLICY_TH.md` ไป host บน GitHub Pages หรือเว็บ รพ.)
- **Data safety** — ระบุว่าเก็บข้อมูลสุขภาพในเครื่อง ไม่ส่งออก
- **Content rating** — ทำแบบสอบถาม (น่าจะได้ Everyone)
- **Target audience** — Adults
- **App category** — Medical

### 4.3 ตั้งค่า service account สำหรับ `eas submit`

1. Play Console → Setup → API access → Create new service account
2. ตามไป Google Cloud Console สร้าง JSON key
3. กลับ Play Console → ให้สิทธิ์ "Release manager"
4. วาง JSON ที่ `secrets/google-play-service-account.json` (gitignored)

### 4.4 Upload AAB

```bash
eas submit --profile production --platform android
```

หรือ manual: ใน Play Console → Internal testing → Create release → upload AAB

แนะนำ flow: **Internal → Closed (Alpha) → Open (Beta) → Production**

---

## 5. App Store (iOS)

### 5.1 สร้างแอปใน App Store Connect

1. https://appstoreconnect.apple.com → My Apps → +
2. Bundle ID: `ac.up.kneecare` (สร้างใน developer.apple.com → Certificates, IDs ก่อน)
3. SKU: `kneecare-001`
4. Primary language: Thai

จดค่า **App Store Connect App ID** (ตัวเลข) ใส่ใน `eas.json` → `ascAppId`

### 5.2 กรอก Metadata
- ชื่อ: KneeCare Companion
- คำโปรย: เพื่อนคู่ใจผู้ป่วยข้อเข่าเสื่อม
- คำอธิบาย: ดู `store/listing-th.md`
- Keywords: ข้อเข่า,เข่าเทียม,กายภาพบำบัด,Quadriceps,ผู้ป่วย
- Support URL + Privacy URL: ต้องมี

### 5.3 Upload IPA

```bash
eas submit --profile production --platform ios
```

หลัง upload จะมีใน App Store Connect → TestFlight (ให้คนทดสอบก่อนได้) → Submit for Review

Apple review ใช้เวลา 1-3 วัน — มักจะถาม:
- เป็นแอปการแพทย์? → ตอบว่า "เสริม wellness ไม่ใช่ medical device" (ถ้า claim ว่ารักษาโรคจะต้องผ่าน FDA)
- ทดสอบยังไง → ให้ test account หรือ guide ขั้นตอน

---

## 6. Versioning (อัปเดตครั้งถัดไป)

### Code อัปเดตเล็ก (UI/copy/bug fix) — ใช้ EAS Update (OTA)
ไม่ต้องส่ง store ใหม่ — ผู้ใช้ได้รับอัตโนมัติ

```bash
eas update --branch production --message "Fix exercise timer"
```

### Code อัปเดตใหญ่ (เพิ่ม native module / SDK) — ต้อง build ใหม่
1. แก้ `app.json`: `version` (semver, แสดงให้ผู้ใช้ดู)
2. `eas.json` มี `autoIncrement: true` → versionCode/buildNumber เพิ่มอัตโนมัติ
3. `eas build --profile production --platform all`
4. `eas submit --profile production --platform all`

---

## 7. Checklist ก่อน Submit

### ทั่วไป
- [ ] ทดสอบบนเครื่องจริงทั้ง Android และ iOS อย่างน้อย 1 เครื่อง
- [ ] ทดสอบ flow: ตั้งโปรไฟล์ → บันทึก diary → เพิ่มยา → ออกกำลังกาย
- [ ] เปิด-ปิดแอปแล้วข้อมูลยังอยู่
- [ ] ทดสอบ notification ยา (ตั้งเวลา 2 นาทีข้างหน้าแล้วรอ)
- [ ] ภาษาไทยแสดงครบ ไม่มี [object] / undefined

### Google Play
- [ ] AAB เซ็นด้วย key ที่ถูกต้อง
- [ ] Privacy policy URL ใช้งานได้
- [ ] Data safety form ตอบครบ
- [ ] Screenshots ขนาด 1080×1920 หรือ 1080×2400 (อย่างน้อย 2 รูป)
- [ ] Feature graphic 1024×500
- [ ] App icon 512×512

### App Store
- [ ] Bundle ID ตรงกัน
- [ ] เปิด App-Specific Password สำหรับ submit
- [ ] Screenshots ขนาด 6.7" (1290×2796) — บังคับ
- [ ] App Privacy ใน Connect ตอบครบ
- [ ] เลือก Age Rating

---

## 8. ปัญหาที่พบบ่อย

| ปัญหา | วิธีแก้ |
|---|---|
| Android build fail "package name conflict" | เปลี่ยน `android.package` ใน `app.json` |
| iOS build fail "no provisioning profile" | `eas credentials` → reset → ให้ EAS สร้างใหม่ |
| Notification ไม่เด้งบน Android | เช็คว่ามี POST_NOTIFICATIONS permission และ user อนุญาตแล้ว |
| Apple reject "uses health data" | ลบทุก claim ที่บอกว่ารักษา/วินิจฉัย ใช้คำว่า "ติดตาม" "บันทึก" "ฟื้นฟู" |
| Google reject "medical claims" | เหมือนกัน + ใส่ disclaimer ใน listing ว่า "ปรึกษาแพทย์" |

---

## 9. ค่าใช้จ่ายโดยประมาณต่อปี

| รายการ | ราคา |
|---|---|
| Apple Developer | $99 (~3,500 บาท) |
| Google Play | $25 (ครั้งเดียว, ~900 บาท) |
| EAS Build (free tier) | $0 |
| Domain สำหรับ privacy policy | ใช้ subdomain ของ มพ. = $0 |
| **รวมปีแรก** | **~4,400 บาท** |
| **รวมปีต่อไป** | **~3,500 บาท** |
