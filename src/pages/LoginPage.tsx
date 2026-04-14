import { GoogleLogin } from '@react-oauth/google';
import { useStore } from '../store/useStore';

export default function LoginPage() {
  const login = useStore((s) => s.login);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)' }}
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-[480px] w-full p-8 space-y-6">
        {/* Logo + Title */}
        <div className="text-center space-y-1">
          <div className="text-5xl mb-2">📋</div>
          <h1 className="text-2xl font-bold" style={{ color: '#1e3a5f' }}>
            HAIT Tracker
          </h1>
          <p className="text-sm text-slate-500">โรงพยาบาลมหาวิทยาลัยพะเยา</p>
        </div>

        {/* Description */}
        <p className="text-center text-sm text-slate-600">
          ระบบติดตามการเตรียมเอกสาร HAIT ตามมาตรฐาน TMI
        </p>

        {/* Feature list */}
        <ul className="space-y-2 text-sm text-slate-700">
          <li className="flex items-start gap-2">
            <span className="shrink-0">📊</span>
            <span>ติดตามความคืบหน้า 7 หมวด (38+ รายการ)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0">📁</span>
            <span>เชื่อมกับ Google Drive</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0">👥</span>
            <span>ทำงานร่วมกันทีม HAIT</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0">📄</span>
            <span>Export PDF / Excel</span>
          </li>
        </ul>

        {/* Divider */}
        <div className="border-t border-slate-200" />

        {/* Google Login */}
        <div className="flex flex-col items-center gap-3">
          <GoogleLogin
            onSuccess={(res) => {
              if (res.credential) login(res.credential);
            }}
            onError={() => {}}
            size="large"
            theme="outline"
            text="signin_with"
            shape="rectangular"
            width="320"
          />
          <p className="text-xs text-slate-400">
            เข้าสู่ระบบด้วยบัญชี @up.ac.th
          </p>
        </div>

        {/* Footer */}
        <div className="text-center">
          <span
            className="inline-block text-xs px-3 py-1.5 rounded-full text-white font-medium"
            style={{ background: 'linear-gradient(135deg, #1e3a5f, #2563eb)' }}
          >
            🎯 เป้าหมาย: เสร็จภายใน พ.ค. 2569
          </span>
        </div>
      </div>
    </div>
  );
}
