import { useState } from 'react';
import { useStore } from '../store/useStore';
import { X, Shield } from 'lucide-react';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'hait2569';

export default function AdminDialog({ onClose }: { onClose: () => void }) {
  const setAdmin = useStore((s) => s.setAdmin);
  const showToast = useStore((s) => s.showToast);
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    if (pw === ADMIN_PASSWORD) {
      setAdmin(true);
      showToast('เข้าสู่โหมด Admin แล้ว');
      onClose();
    } else {
      setError('รหัสผ่านไม่ถูกต้อง');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-red-600" />
            <h3 className="font-bold text-slate-800">เข้าสู่โหมด Admin</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
            <X size={18} />
          </button>
        </div>
        <p className="text-xs text-slate-500 mb-3">
          โหมด Admin สามารถแก้ไข title, วันครบกำหนด, ช่วงเวลา, และลบ/เพิ่มรายการได้
        </p>
        <input
          type="password"
          value={pw}
          onChange={(e) => { setPw(e.target.value); setError(''); }}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="ใส่รหัสผ่าน..."
          className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 mb-2"
          autoFocus
        />
        {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
        <button
          onClick={submit}
          className="w-full text-sm px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
        >
          เข้าสู่ Admin Mode
        </button>
      </div>
    </div>
  );
}
