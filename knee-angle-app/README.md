# วัดมุมเข่าด้วยกล้องมือถือ (Knee Angle Tracker)

เว็บแอป PWA ติดตั้งบน Android ได้ ใช้กล้องมือถือวัด **มุมงอเข่า/เหยียดขา** และ **มุมโก่งขา (varus/valgus)**
โดยใช้ [MediaPipe Pose Landmarker](https://developers.google.com/mediapipe/solutions/vision/pose_landmarker)
ตรวจจับจุด **Hip – Knee – Ankle** ตามมาตรฐาน goniometry

> โปรเจกต์นี้อยู่ในโฟลเดอร์ย่อย `knee-angle-app/` แยกขาดจากระบบ HAIT tracker ของ repo หลัก

## จุดอ้างอิงทางกายวิภาคที่ใช้

- **โหมดด้านข้าง (lateral — knee flexion/extension)**
  fulcrum = lateral epicondyle (เข่า)
  proximal arm = greater trochanter (สะโพก)
  distal arm = lateral malleolus (ข้อเท้า)
  - `180°` = เหยียดเต็ม (full extension)
  - `flexion = 180° - interior angle`
- **โหมดหน้าตรง (frontal — HKA, Hip-Knee-Ankle angle)**
  hip center – knee center – ankle center
  - `180°` = แนวกลไกตรง
  - `<180°` = **varus** (ขาโก่งออก, ขาโอ)
  - `>180°` = **valgus** (ขาโก่งเข้า, ขาเอ็กซ์)

## Dev

```bash
npm install
npm run dev -- --host   # เปิด https://<LAN-IP>:5173 บนมือถือในวง Wi-Fi เดียวกัน
npm run build
npm run preview -- --host
```

`vite-plugin-mkcert` จะออก certificate local ให้อัตโนมัติ เพราะ getUserMedia
และ DeviceOrientation API ต้องใช้ **HTTPS** บน mobile browser

## คุณภาพการวัด

- Pose 2D ไม่แทน goniometer หรือ full-length standing x-ray ได้
- ความคลาดเคลื่อนทั่วไป ±3–5° ขึ้นอยู่กับแสง, เสื้อผ้า, มุมกล้อง
- ควรวัดซ้ำอย่างน้อย 3 ครั้งแล้วเฉลี่ย
- ต้องใช้ **ขาตั้งกล้อง** หรือจิ๊กช่วย ให้มือถืออยู่ระดับเดียวกับเข่า พร้อมใช้ level indicator ในแอปให้จุดเขียว

## ส่วนประกอบหลัก

- `src/lib/poseDetection.ts` — wrap MediaPipe Tasks Vision, ระบุ landmark index
- `src/lib/angleCalculation.ts` — คำนวณมุม 3 จุด, varus/valgus classification, EMA smoothing
- `src/lib/deviceOrientation.ts` — ระดับน้ำจาก DeviceOrientation API
- `src/components/CameraView.tsx` — รวม video + pose loop + overlay
- `src/components/AngleOverlay.tsx` — SVG overlay วาด hip-knee-ankle
- `src/components/StartScreen.tsx` — หน้าเลือกโหมดและคำแนะนำการจัดท่า
