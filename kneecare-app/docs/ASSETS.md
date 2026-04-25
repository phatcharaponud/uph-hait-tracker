# คู่มือสร้าง Assets

ไฟล์ภาพที่ต้องเตรียมก่อนเผยแพร่ KneeCare Companion

---

## ภาพรวม

| ไฟล์ | ตำแหน่ง | ขนาด | รูปแบบ | ใช้ที่ไหน |
|---|---|---|---|---|
| `icon.png` | `assets/` | 1024×1024 | PNG (ไม่มี alpha) | App icon ทั้ง iOS และ Android |
| `adaptive-icon.png` | `assets/` | 1024×1024 | PNG (มี padding) | Android adaptive icon |
| `splash.png` | `assets/` | 1242×2436 | PNG | Splash screen |
| `notification-icon.png` | `assets/` | 96×96 | PNG monochrome | Android notification |
| `feature-graphic.png` | `store/` | 1024×500 | PNG/JPEG | Google Play feature banner |
| `screenshots/*.png` | `store/screenshots/` | ดูด้านล่าง | PNG | Store listing |

---

## วิธีง่ายที่สุด — ใช้ Figma Template

แนะนำใช้ Figma สร้างจากไฟล์เดียว แล้ว export หลายขนาด

**Template ที่แนะนำ:**
- [Figma App Icon Template](https://www.figma.com/community/file/824884358796255374) — มี frame ทุกขนาดพร้อม
- [App Store Screenshot Template](https://www.figma.com/community/file/1175469624486968345)

---

## วิธีอัตโนมัติ — Expo CLI

ถ้ามี icon 1024×1024 PNG แล้ว Expo จะ generate ขนาดอื่นให้:

```bash
# หลังวาง assets/icon.png แล้ว
npx expo prebuild --clean
```

หรือใช้ tool: `npx @expo/configure-splash-screen`

---

## App Icon Design Brief

**สี:** กรมท่า `#1e3a5f` พื้นหลัง / ทอง `#e8a33d` หรือ ขาว `#ffffff` foreground
**สไตล์:** มินิมอล อ่านง่ายในขนาดเล็ก
**สัญลักษณ์:** ข้อเข่า + เครื่องหมาย ✓ หรือ + ทางการแพทย์
**ห้าม:**
- ใส่ตัวอักษรเล็ก ๆ (จะอ่านไม่ออกเมื่อย่อ)
- ใช้กากบาท + แดง (Apple อาจ reject เพราะคล้ายกาชาด)
- ใช้รูปจริงของผู้ป่วย

**รูปแบบ Adaptive Icon (Android)**
- Foreground เนื้อหาในวงกลม diameter 660px (อยู่กลางของ 1024×1024)
- Background ใช้สี `#1e3a5f` (ตั้งใน `app.json`)

---

## Splash Screen

**ขนาด:** 1242×2436 (พอครอบทุก device ratio)
**เนื้อหา:**
- โลโก้แอปกึ่งกลาง (ขนาด ~400×400)
- พื้นหลัง `#1e3a5f`
- (ไม่ต้องใส่ข้อความ)

---

## Notification Icon (Android)

**สำคัญ:** Android ต้องการ icon **เป็นสีขาว transparent เท่านั้น** (monochrome)
- 96×96 PNG
- พื้นหลัง transparent
- ไอคอนเป็นสีขาวล้วน
- Android จะระบายสีให้ด้วย `color` ใน `app.json` plugin

---

## Screenshots — สเปคบังคับ

### Google Play
| ขนาด | จำนวนต่ำสุด | จำนวนสูงสุด |
|---|---|---|
| 1080×1920 (โทรศัพท์) | 2 | 8 |
| Tablet 7" (optional) | 1 | 8 |
| Tablet 10" (optional) | 1 | 8 |

### App Store
| Device | ขนาด | จำนวนต่ำสุด |
|---|---|---|
| iPhone 6.7" (15 Pro Max) | 1290×2796 | **บังคับ ≥ 1** |
| iPhone 6.5" (11 Pro Max) | 1242×2688 | optional |
| iPad 12.9" | 2048×2732 | บังคับถ้า support iPad |

---

## วิธีถ่าย Screenshots ที่สวย

### บน Android เครื่องจริง
1. ติดตั้ง APK preview build
2. ตั้ง demo data: ชื่อ "นางสมศรี ใจดี", ผ่าตัดมา 14 วัน, มียา 3 รายการ
3. ใช้ Volume Down + Power → screenshot ปกติ
4. รีไซส์ให้ตรง spec ด้วย ImageMagick:
   ```bash
   convert input.png -resize 1080x1920 output.png
   ```

### บน iOS Simulator (ถ้ามี Mac)
1. `xcrun simctl list` → เลือก iPhone 15 Pro Max
2. รัน app → File → New Screenshot
3. Image จะอยู่ใน Desktop

### Frame ให้ดูสวย (optional)
- ใช้เครื่องมือ [Mockuphone](https://mockuphone.com/) — ใส่ device frame ฟรี
- หรือ Figma + iPhone mockup template

---

## Feature Graphic (Google Play)

ขนาด **1024×500** — แสดงในหน้าแอปด้านบน

**Layout แนะนำ:**
- ซ้าย: ภาพแอปบน mockup โทรศัพท์
- ขวา: ชื่อแอป "KneeCare Companion" + tagline "ดูแลข้อเข่าครบวงจร"
- พื้นหลัง gradient จาก `#1e3a5f` ไป `#2d5181`

---

## Checklist ก่อนใช้

- [ ] icon.png 1024×1024 (ไม่มี alpha channel — สำคัญสำหรับ App Store)
- [ ] adaptive-icon.png 1024×1024 (มี padding, foreground อยู่กลาง diameter 660)
- [ ] splash.png 1242×2436
- [ ] notification-icon.png 96×96 white-only transparent
- [ ] feature-graphic.png 1024×500
- [ ] อย่างน้อย 2 screenshots ทุกแพลตฟอร์ม

---

## ทำเองไม่ได้? Outsource

ถ้าไม่มีเวลาทำ:
- **Fiverr / Upwork:** หา designer ทำ icon + 5 screenshots ราคา ~$30-100
- **Local designer:** สรุป brief จาก `store/listing-th.md` ส่งให้
- **AI image gen:** ใช้ Midjourney / DALL-E สำหรับ feature graphic (icon ห้ามใช้ — Apple reject ภาพ AI ที่ไม่ original)
