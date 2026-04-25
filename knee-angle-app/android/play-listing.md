# Google Play Store — ข้อความและ asset checklist

ใช้ copy-paste เข้า Play Console → Main store listing

---

## App name (≤30 ตัวอักษร)
```
วัดมุมเข่า – Knee Angle
```

## Short description (≤80 ตัวอักษร)
```
วัดมุมงอเข่าและมุมโก่งขาด้วยกล้องมือถือ ใช้ AI ตรวจจับจุดอ้างอิงทางกายวิภาค
```

## Full description (≤4000 ตัวอักษร)
```
"วัดมุมเข่า" คือเครื่องมือคัดกรองและติดตามแนวโน้มมุมข้อเข่าด้วยกล้องมือถือ
พัฒนาโดยโรงพยาบาลมหาวิทยาลัยพะเยา สำหรับบุคลากรทางการแพทย์ นักกายภาพบำบัด
และผู้สนใจติดตามผลการฟื้นฟูข้อเข่า

🦴 ฟีเจอร์หลัก
• โหมดด้านข้าง — วัดมุมงอ/เหยียดเข่า (knee flexion/extension)
  อ้างอิงจุด สะโพก (greater trochanter) – เข่า (lateral epicondyle) – ข้อเท้า (lateral malleolus)
  ตามมาตรฐาน goniometry สากล
• โหมดหน้าตรง — วัดมุมโก่งขา Hip-Knee-Ankle (HKA mechanical axis)
  จำแนก varus (ขาโก่งออก/ขาโอ) หรือ valgus (ขาโก่งเข้า/ขาเอ็กซ์)
• ระดับน้ำดิจิทัลในจอ ช่วยให้ถือมือถือตั้งตรงเพื่อลด parallax error
• เงาโครงร่างช่วยจัดท่าผู้ป่วยให้พอดีกรอบกล้อง
• แสดงผลแบบ real-time พร้อม smoothing ลดการกระตุก

📷 ความเป็นส่วนตัว
ภาพจากกล้อง "ไม่ถูกบันทึก" และ "ไม่ถูกอัปโหลด" ออกนอกอุปกรณ์
การประมวลผลทั้งหมดเกิดขึ้นในมือถือของคุณ ใช้โมเดล Google MediaPipe Pose
ที่รันบน-device ไม่ส่งข้อมูลใด ๆ ไปเซิร์ฟเวอร์

🎯 วิธีใช้ให้แม่นยำ
1. วางมือถือบนขาตั้ง (tripod) ระดับเดียวกับข้อเข่า
2. ให้ผู้ถูกวัดอยู่ห่าง 2.5–3 เมตร เห็นเต็มตัวตั้งแต่สะโพกถึงฝ่าเท้า
3. แสงสว่างเพียงพอ ฉากหลังเรียบ ใส่กางเกงสั้นหรือกางเกงรัดรูป
4. โหมดหน้าตรง: เท้าแยกเท่าสะโพก ลูกสะบ้าชี้ตรงไปข้างหน้า
5. วัดซ้ำอย่างน้อย 3 ครั้งแล้วเฉลี่ย

⚠️ คำเตือนสำคัญ
แอปนี้เป็นเครื่องมือสำหรับคัดกรองและติดตามแนวโน้มเท่านั้น
ไม่ใช่อุปกรณ์ทางการแพทย์ (medical device) มีความคลาดเคลื่อนปกติ ±3–5°
ไม่สามารถใช้แทน goniometer หรือเอกซเรย์ขายืนเต็มความยาว
(full-length standing radiograph) ในการวินิจฉัย
ปรึกษาแพทย์เฉพาะทางสำหรับการวินิจฉัยและตัดสินใจรักษาเสมอ

📱 รองรับ
• Android 6.0 ขึ้นไป (API 23+)
• ต้องมีกล้องและเซนเซอร์ accelerometer/gyroscope
• แนะนำ RAM 3 GB ขึ้นไป

📞 ติดต่อ
โรงพยาบาลมหาวิทยาลัยพะเยา
อีเมล: hospital@up.ac.th
```

---

## Release notes — เวอร์ชัน 0.1.0 (≤500 ตัวอักษร)
```
🎉 เวอร์ชันแรก
• วัดมุมงอ/เหยียดเข่า (โหมดด้านข้าง)
• วัดมุมโก่งขา varus/valgus (โหมดหน้าตรง)
• ระดับน้ำดิจิทัลและเงาโครงร่างช่วยจัดท่า
• ประมวลผลในเครื่องทั้งหมด ไม่ส่งภาพออกนอกอุปกรณ์
```

---

## Categorization
- **Category:** Medical (หรือ Health & Fitness ก็ได้ — Medical จะถูก review เข้มงวดกว่า)
- **Tags:** Health, Medical, Physical Therapy
- **Content rating:** Everyone — ตอบ questionnaire ว่า ไม่มีความรุนแรง/เพศ/ภาษาหยาบ

---

## Data Safety form (สำคัญมาก!)
- Camera data: collected? **No** (ประมวลผลในเครื่อง ไม่ออกนอกอุปกรณ์)
- Photos and videos: collected? **No**
- Personal info: **No**
- Device IDs: **No**
- App activity / interactions: **No**
- App diagnostics: **No** (ถ้าไม่ได้เพิ่ม analytics)
- Data encrypted in transit: **Yes** (ทุก connection เป็น HTTPS)
- Users can request data deletion: **No data is collected**

---

## Asset checklist

### App icon (จำเป็น)
- 512 × 512 px PNG (transparent หรือ solid)
- ใช้ไอคอนปัจจุบัน `public/icon.svg` แต่ต้อง export เป็น PNG ก่อน
- คำสั่งบน macOS/Linux ที่มี ImageMagick:
  ```bash
  magick -background "#1e3a5f" -size 512x512 icon.svg play-icon-512.png
  ```

### Feature graphic (จำเป็น)
- 1024 × 500 px PNG/JPG
- ออกแบบเป็น banner: ชื่อแอป + คนยืนวัดเข่า + โลโก้ รพ.

### Phone screenshots (อย่างน้อย 2, แนะนำ 4-6)
- 1080 × 1920 px (หรืออัตราส่วน 16:9 ใกล้เคียง)
- แนะนำหน้าจอที่ควรถ่าย:
  1. หน้าแรกแสดงโหมดและคำแนะนำ
  2. โหมดด้านข้างกับ overlay มุมงอเข่าระหว่างวัดจริง
  3. โหมดหน้าตรงกับเส้น mechanical axis
  4. ระดับน้ำดิจิทัลและ silhouette
  5. หน้าผลลัพธ์ snapshot
  6. หน้าเกี่ยวกับ/disclaimer

> Tip: ใช้ Chrome DevTools → Device Mode → Pixel 5 → "Capture full size screenshot"

### Privacy policy URL (จำเป็น)
```
https://YOUR_DOMAIN/privacy.html
```

---

## Pre-launch checklist
- [ ] Privacy policy URL กด link ได้และแสดงผลถูกต้อง
- [ ] `assetlinks.json` มี SHA-256 จริงและ verify ผ่าน Google Asset Links API
- [ ] Disclaimer ในแอปครบ (เปิดจากปุ่ม "เกี่ยวกับ")
- [ ] ทดสอบ APK บน Android เครื่องจริง อย่างน้อย 2 รุ่น
- [ ] ภาพ feature graphic + screenshots พร้อม
- [ ] Data safety form กรอกครบ
- [ ] Content rating questionnaire ตอบครบ
- [ ] เลือก Closed testing track ก่อน production (อย่าง 14 วันถึงปลด restriction บางอย่าง)
