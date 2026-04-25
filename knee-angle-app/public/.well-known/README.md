# Digital Asset Links

`assetlinks.json` ใช้สำหรับ verify Trusted Web Activity (TWA) บน Google Play
ทำให้ Android app ที่ห่อ PWA นี้แสดงเต็มจอ (ไม่มี URL bar)

## ขั้นตอนหลัง build APK/AAB ครั้งแรก

1. หลัง `bubblewrap build` หรือเมื่อใช้ Play App Signing บน Play Console
   ให้หา **SHA-256 fingerprint** ของ key ที่ใช้เซ็นแอปจริง:

   - **ถ้าใช้ Play App Signing** (แนะนำ): Play Console → ซ้ายล่าง Setup → App signing → คัดลอก
     "App signing key certificate → SHA-256 certificate fingerprint"
   - **ถ้าเซ็นเอง**:
     ```bash
     keytool -list -v -keystore android.keystore -alias android | grep SHA256
     ```

2. แทนที่ค่า `REPLACE_ME_WITH_SHA256_OF_SIGNING_KEY` ใน `assetlinks.json`
   ด้วย fingerprint ที่ได้ (รูปแบบ `AA:BB:CC:...`)

3. Commit + push → Vercel deploy ใหม่

4. ตรวจว่าเข้าถึงได้:
   ```
   https://<your-domain>/.well-known/assetlinks.json
   ```
   ต้อง return content-type `application/json` (vercel.json จัดการให้แล้ว)

5. ทดสอบ verify ด้วย Google's tool:
   ```
   https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://<your-domain>&relation=delegate_permission/common.handle_all_urls
   ```

## ค่า package_name

- ปัจจุบันตั้งไว้ `th.ac.up.kneeangle`
- ต้องตรงกับ `applicationId` ใน Bubblewrap (`twa-manifest.json`)
- **ห้ามเปลี่ยน** หลัง publish ครั้งแรก (Google Play ใช้เป็น primary key)
