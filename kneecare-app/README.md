# KneeCare Companion

แอปมือถือสำหรับผู้ป่วยข้อเข่าเสื่อมและผู้ป่วยผ่าตัดข้อเข่าเทียม
โรงพยาบาลมหาวิทยาลัยพะเยา · iOS + Android

## ฟีเจอร์ใน v0.1 (Phase 1 MVP)

- 📅 **Timeline ตามระยะการรักษา** — เป้าหมายและข้อควรระวังตามวันหลังผ่าตัด
- 🦵 **คลังท่าออกกำลังกาย Quadriceps** — 7 ท่า (Quad Sets, SLR, Heel Slides, Ankle Pumps, Short Arc Quad, Mini Squat, Step Up) + timer นับเซ็ต/ค้างอัตโนมัติ
- 📝 **บันทึกอาการรายวัน** — ปวด (0-10), ROM, น้ำหนัก (+ BMI), อาการบวม, ประวัติ 14 วัน
- 💊 **ตารางยา + แจ้งเตือนอัตโนมัติ** — local push notification เตือนทุกวันตามเวลา
- 👤 **โปรไฟล์ผู้ป่วย** — ข้อมูลพื้นฐาน วันผ่าตัด ข้างที่เจ็บ
- 🔒 **Privacy-first** — เก็บข้อมูลในเครื่องเท่านั้น (AsyncStorage)

## Tech Stack

| Layer | Choice |
|---|---|
| Runtime | Expo SDK 52 + React Native 0.76 |
| Language | TypeScript (strict) |
| State | Zustand |
| Storage | AsyncStorage (on-device) |
| Navigation | React Navigation (bottom tabs + stack) |
| Notifications | expo-notifications |
| Build | EAS Build (cloud — ไม่ต้องใช้ Mac) |

---

## เริ่มต้นใช้งาน (Local development)

```bash
cd kneecare-app
npm install
npx expo start
```

สแกน QR ด้วย **Expo Go** บนมือถือ (Android/iOS) หรือกด `a` เพื่อเปิดบน Android emulator

```bash
npm run typecheck   # ตรวจ TypeScript
```

---

## เผยแพร่ขึ้น Google Play / App Store

ดูคู่มือเต็มที่ [`docs/PUBLISHING.md`](./docs/PUBLISHING.md)

**ขั้นตอนสรุป:**

```bash
# 1. ติดตั้ง EAS CLI (ครั้งเดียว)
npm install -g eas-cli
eas login
eas init

# 2. Build production สำหรับทั้ง iOS + Android
eas build --profile production --platform all

# 3. ส่งขึ้น store
eas submit --profile production --platform all
```

**ต้องเตรียมล่วงหน้า:**
- บัญชี [Expo](https://expo.dev) (ฟรี)
- บัญชี [Google Play Console](https://play.google.com/console/signup) ($25 ครั้งเดียว)
- บัญชี [Apple Developer](https://developer.apple.com/programs/) ($99/ปี — ต้องเป็น Organization ในนาม รพ. หรือ Individual ก็ได้)
- App icon, splash, screenshots — ดู [`docs/ASSETS.md`](./docs/ASSETS.md)

---

## โครงสร้างโปรเจกต์

```
kneecare-app/
├── App.tsx                          # Entry: hydrate stores + request notification permission
├── app.json                         # Expo config + Android/iOS metadata
├── eas.json                         # EAS Build/Submit profiles
├── index.ts
├── package.json
├── tsconfig.json
├── babel.config.js
├── .github/workflows/               # CI: typecheck + EAS build
├── assets/
│   ├── icon-source.svg              # Source for all icon variants
│   └── (icon.png, splash.png, ...)  # Generate via scripts/generate-assets.sh
├── docs/
│   ├── PUBLISHING.md                # Step-by-step store submission
│   ├── PRIVACY_POLICY_TH.md         # PDPA-compliant policy (Thai)
│   ├── PRIVACY_POLICY_EN.md         # English version
│   └── ASSETS.md                    # Icon/splash/screenshot specs
├── store/
│   └── listing-th.md                # Ready-to-paste Play/App Store listing copy
├── locales/
│   └── th.json                      # iOS Thai localization
├── scripts/
│   └── generate-assets.sh           # SVG → PNG asset generator
└── src/
    ├── components/                  # Card, PrimaryButton, ScoreSlider, ProgressBar, SectionHeader
    ├── data/                        # EXERCISES, TIMELINE_PHASES, SAMPLE_MEDS
    ├── lib/                         # thaiDate, storage, bmi, notifications
    ├── navigation/                  # RootNavigator (tabs + stack)
    ├── screens/                     # Home, Exercises, ExerciseDetail, Diary, Medications, Profile
    ├── store/                       # patientStore, diaryStore, medicationStore (Zustand + AsyncStorage)
    ├── theme/                       # colors, spacing, radius
    └── types/                       # Shared TypeScript types
```

---

## Roadmap

### Phase 2 (next)
- [ ] AI Pose Coach (MediaPipe) สำหรับ Quad Sets — เริ่มจากท่าเดียว
- [ ] กราฟแนวโน้มปวด/ROM/น้ำหนัก (react-native-svg)
- [ ] Snooze/repeat สำหรับ medication reminder
- [ ] เนื้อหาวิดีโอท่าออกกำลังกายจริง (record + edit ร่วมกับกายภาพ)

### Phase 3
- [ ] Cloud sync (Firebase/Supabase) — ต้องผ่าน PDPA + IT security รพ.
- [ ] Dashboard แพทย์/กายภาพ (web)
- [ ] Teleconsult chat
- [ ] Risk-posture detector (เตือนท่านั่งยอง/คุกเข่า)

---

## ข้อจำกัดสำคัญ

⚠️ **ไม่ใช่อุปกรณ์การแพทย์** — เสริมการรักษาเท่านั้น ไม่สามารถใช้แทนคำแนะนำของแพทย์ได้
- โปรแกรมออกกำลังกายและรายการยาเป็น **ตัวอย่าง** ต้องให้ physiotherapist/orthopedist ของ รพ. review ก่อนใช้จริง
- ต้องผ่าน IRB/กรรมการจริยธรรม รพ. ก่อนใช้กับผู้ป่วยในงานวิจัย
- หากมีอาการรุนแรง ผู้ใช้ต้องติดต่อแพทย์ทันที

## License

Internal — University of Phayao Hospital
