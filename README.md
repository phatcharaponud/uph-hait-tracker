# HAIT Tracker - โรงพยาบาลมหาวิทยาลัยพะเยา

ระบบติดตามความคืบหน้าการจัดเตรียมเอกสาร HAIT (Hospital Accreditation for Information Technology) สมาคมเวชสารสนเทศไทย (TMI)

## 🚀 Live Demo

https://phatcharaponud.github.io/uph-hait-tracker/

## ✨ Features

- ติดตามความคืบหน้า 7 หมวด HAIT (38+ items)
- Dashboard ภาพรวม + แจ้งเตือนรายการเลยกำหนด
- Gantt Chart timeline (1 เม.ย. - 31 พ.ค. 2569)
- เชื่อมกับ Google Sheets (real-time sync)
- เชื่อมกับ Google Drive (เก็บเอกสาร 7 โฟลเดอร์)
- Login ด้วย Google OAuth (@up.ac.th)
- Multi-role: User / Admin / Super Admin
- Export PDF (ฟอนต์ Sarabun) + Excel
- Responsive (Desktop + Tablet + Mobile)

## 🛠 Tech Stack

- **Frontend:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS v4
- **State:** Zustand
- **Auth:** Google OAuth 2.0 (@up.ac.th domain)
- **Backend:** Google Apps Script + Google Sheets
- **PDF:** jsPDF + jspdf-autotable + Sarabun font
- **Excel:** SheetJS (xlsx)
- **Deploy:** GitHub Pages via GitHub Actions

## 📋 Setup

```bash
# Clone
git clone https://github.com/phatcharaponud/uph-hait-tracker.git
cd uph-hait-tracker

# Install
npm install

# Config
cp .env.example .env.local
# แก้ไข .env.local ใส่ค่าจริง

# Dev
npm run dev
```

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Google Apps Script Web App URL |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID |

## 📁 Project Structure

```
├── src/
│   ├── components/      # UI components (Sidebar, Header, Toast, etc.)
│   ├── pages/           # Dashboard, CategoryView, GanttChart, AdminManagement
│   ├── store/           # Zustand state management
│   ├── data/            # Categories, items, statuses, config
│   ├── lib/             # API, PDF/Excel export, fonts
│   └── types/           # TypeScript types
├── backend/
│   └── apps-script.gs   # Google Apps Script backend
├── docs/
│   ├── HAIT_structure.md
│   ├── HAIT_examples.md
│   ├── requirements.md
│   └── user-guide.md    # คู่มือผู้ใช้ (ภาษาไทย)
└── .github/workflows/
    └── deploy.yml       # GitHub Pages CI/CD
```

## 👥 Roles

| Role | Permissions |
|------|------------|
| Guest | View only |
| User (@up.ac.th) | Edit status, owner |
| Admin | + Edit title, dates, add/remove items |
| Super Admin | + Manage admin permissions |

## 📝 License

MIT - University of Phayao Hospital
