# KneeCare Companion (Phase 1 MVP)

แอปมือถือสำหรับผู้ป่วยข้อเข่าเสื่อมและผู้ป่วยผ่าตัดข้อเข่าเทียม
โรงพยาบาลมหาวิทยาลัยพะเยา

## ฟีเจอร์ใน Phase 1

- **Timeline ตามระยะการรักษา** — แสดงเป้าหมายและข้อควรระวังตามวันหลังผ่าตัด
- **คลังท่าออกกำลังกาย Quadriceps** — Quad Sets, SLR, Heel Slides, Ankle Pumps, Short Arc Quad, Mini Squat, Step Up พร้อม timer นับเซ็ต/ค้าง
- **บันทึกอาการรายวัน** — ระดับปวด (0-10), ROM, น้ำหนัก (+ BMI อัตโนมัติ), อาการบวม, บันทึก
- **ตารางยา + ตอกบัตรยา** — จัดเวลายา กดปุ่มยืนยันเมื่อทาน
- **โปรไฟล์ผู้ป่วย** — ข้อมูลพื้นฐาน วันผ่าตัด ข้างที่เจ็บ

ข้อมูลทั้งหมดเก็บในเครื่อง (AsyncStorage) — ไม่มีการส่งออก cloud ใน Phase 1

## Tech Stack

- Expo SDK 52 + React Native 0.76
- TypeScript (strict)
- Zustand (state) + AsyncStorage (persistence)
- React Navigation (bottom tabs + stack)

## เริ่มใช้งาน

```bash
cd kneecare-app
npm install
npx expo start
```

สแกน QR ด้วย **Expo Go** บนมือถือ (Android/iOS) หรือกด `a` เพื่อเปิดใน Android emulator

### ตรวจชนิดข้อมูล

```bash
npm run typecheck
```

## โครงสร้าง

```
kneecare-app/
├── App.tsx                 # Entry point + hydrate stores
├── app.json                # Expo config (theme, bundle id ac.up.kneecare)
├── index.ts
├── src/
│   ├── components/         # Card, PrimaryButton, ScoreSlider, ProgressBar
│   ├── data/               # EXERCISES, TIMELINE_PHASES, SAMPLE_MEDS
│   ├── lib/                # thaiDate, storage, bmi
│   ├── navigation/         # RootNavigator (Tabs + Stack)
│   ├── screens/            # Home, Exercises, ExerciseDetail, Diary, Medications, Profile
│   ├── store/              # patientStore, diaryStore, medicationStore (Zustand)
│   ├── theme/              # colors, spacing, radius
│   └── types/              # shared TypeScript types
└── assets/                 # (ต้องใส่ icon.png, splash.png, adaptive-icon.png)
```

## ถัดไป (Phase 2)

- [ ] แจ้งเตือนยา (expo-notifications — schedule local notification)
- [ ] AI Pose Coach ด้วย MediaPipe สำหรับ Quad Sets
- [ ] กราฟแนวโน้มปวด/ROM/น้ำหนัก (recharts-like ด้วย react-native-svg)
- [ ] Cloud sync (Firebase/Supabase) — ต้องผ่าน PDPA & IT security รพ.
- [ ] Dashboard แพทย์/กายภาพ
- [ ] เนื้อหาวิดีโอท่าออกกำลังกายจริง

## ข้อจำกัดสำคัญ

- **ไม่ใช่อุปกรณ์การแพทย์** — เสริมการรักษา ไม่ใช่แทน
- โปรแกรมออกกำลังกายและรายการยาในนี้เป็น **ตัวอย่าง** — ต้องให้ physiotherapist/orthopedist ของ รพ. review ก่อนใช้จริง
- ต้องผ่าน IRB/กรรมการจริยธรรม รพ. ก่อนนำไปใช้กับผู้ป่วยในงานวิจัย
