# Changelog

## 0.1.0 — Phase 1 MVP (initial)

### Added
- Patient profile (name, DOB, height, weight, surgery date, affected side)
- Recovery timeline screen with phase-based goals and red-flag warnings
  (pre-op / day 0–7 / week 2–6 / month 3+)
- Exercise library with 7 quadriceps-focused exercises and built-in
  set/rep/hold timer (Quad Sets, SLR, Heel Slides, Ankle Pumps,
  Short Arc Quad, Mini Squat, Step Ups)
- Daily diary: pain (0–10), ROM, weight, swelling, notes
- BMI auto-calc with motivational hint linking weight to knee load
- Medication scheduler with daily local push reminders
  (expo-notifications) and per-dose check-in
- Bottom-tab + stack navigation, Thai UI, Buddhist Era dates
- AsyncStorage persistence via Zustand stores

### Build / publish
- EAS Build profiles (development, preview, production AAB+IPA)
- EAS Submit config for Google Play + App Store
- GitHub Actions: typecheck on PR + EAS Build on tag/dispatch
- Android permissions whitelist + iOS NS* usage descriptions
- SVG source for app icon with shell script to generate all PNG sizes

### Docs
- Step-by-step `docs/PUBLISHING.md` (account setup → store submission)
- `docs/PRIVACY_POLICY_TH.md` + `docs/PRIVACY_POLICY_EN.md` (PDPA-compliant)
- `docs/ASSETS.md` (icon/splash/screenshot specs)
- `store/listing-th.md` (ready-to-paste store listing copy in Thai)
