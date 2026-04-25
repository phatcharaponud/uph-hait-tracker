# Android (TWA) — Bubblewrap

โฟลเดอร์นี้เก็บ template และ note สำหรับห่อ PWA เป็น Android app
ผ่าน [Bubblewrap CLI](https://github.com/GoogleChromeLabs/bubblewrap)
เพื่อ submit ไป Google Play

## Prerequisites (ครั้งเดียว)

```bash
# JDK 17+ (Bubblewrap จะตรวจให้)
node --version    # ต้อง 18+
npm install -g @bubblewrap/cli
bubblewrap doctor   # จะช่วยติดตั้ง Android SDK + JDK ให้อัตโนมัติ
```

## ขั้นตอน

### 1. Deploy PWA ขึ้น HTTPS ก่อน
ผ่าน Vercel (ดู `DEPLOY.md` ใน root ของ knee-angle-app)
ได้ URL เช่น `https://knee-angle-app.vercel.app`

### 2. แก้ `twa-manifest.json`
แทนที่ทุกที่ที่มี `REPLACE_ME_WITH_DOMAIN.vercel.app` เป็น domain จริง

### 3. สร้าง Android project
```bash
cd /path/to/knee-angle-app/android
bubblewrap init --manifest=https://YOUR_DOMAIN/manifest.webmanifest
# หรือถ้าแก้ twa-manifest.json แล้ว:
bubblewrap init --manifest=./twa-manifest.json
```

ระหว่าง init มันจะถามให้ generate **signing key** ใหม่:
- เลือก "Yes, generate a new key"
- เก็บไฟล์ `android.keystore` + password ไว้ปลอดภัย
- **อย่าหาย** — ถ้าหายจะอัปเดตแอปบน Play Store ไม่ได้ (ต้องสร้างแอปใหม่)

### 4. Build
```bash
bubblewrap build
```
ได้ไฟล์:
- `app-release-bundle.aab` ← upload ขึ้น Play Console
- `app-release-signed.apk` ← ทดสอบเครื่องตัวเองด้วย `adb install`

### 5. ดึง SHA-256 ไปใส่ assetlinks.json
หลัง build ครั้งแรก Bubblewrap จะ print fingerprint ออกมา
หรือดึงเองด้วย:
```bash
keytool -list -v -keystore android.keystore -alias android | grep SHA256
```
แทนที่ค่า `REPLACE_ME_WITH_SHA256_OF_SIGNING_KEY` ใน
`knee-angle-app/public/.well-known/assetlinks.json` แล้ว push ขึ้น Vercel ใหม่

> **แนะนำ:** เปิด Play App Signing บน Play Console แล้วใช้ SHA-256 ของ
> "App signing key" (ไม่ใช่ upload key) จะ verify TWA ได้ถูกต้อง

### 6. Verify
```
https://YOUR_DOMAIN/.well-known/assetlinks.json
```
ต้องมี content-type `application/json` (vercel.json จัดการให้แล้ว)

ทดสอบกับ Google Asset Links API:
```
https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://YOUR_DOMAIN&relation=delegate_permission/common.handle_all_urls
```

### 7. อัปโหลด AAB ขึ้น Play Console
ดู `DEPLOY.md` สำหรับขั้นตอน Play Store submission

## Update เวอร์ชันแอป

ทุกครั้งที่ release ใหม่:
1. แก้ `appVersionCode` (+1) และ `appVersionName` ใน `twa-manifest.json`
2. `bubblewrap update`
3. `bubblewrap build`
4. Upload AAB ใหม่ขึ้น Play Console

## ไฟล์ที่ไม่ควร commit
หลังรัน `bubblewrap init` จะมีไฟล์เหล่านี้เกิด — เพิ่มใน `.gitignore`:
- `android.keystore` (private key — ห้ามขึ้น git)
- `android.keystore.json`
- `app/`, `gradle/`, `gradlew`, etc. (Android Studio project)
- `app-release-bundle.aab`, `app-release-signed.apk`

`.gitignore` ในโฟลเดอร์นี้จัดการให้แล้ว
