import { useStore } from '../store/useStore';
import { Shield } from 'lucide-react';

export default function AdminBadge() {
  const isAdmin = useStore((s) => s.isAdmin);
  const setAdmin = useStore((s) => s.setAdmin);

  if (!isAdmin) return null;

  return (
    <button
      onClick={() => setAdmin(false)}
      className="fixed top-2 right-3 z-40 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600 text-white text-xs font-semibold shadow-lg hover:bg-red-700 transition-colors"
      title="คลิกเพื่อออกจากโหมด Admin"
    >
      <Shield size={13} />
      Admin Mode
    </button>
  );
}
