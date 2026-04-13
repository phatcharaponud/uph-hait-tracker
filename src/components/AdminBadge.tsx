import { useStore } from '../store/useStore';

export default function AdminBadge() {
  const user = useStore((s) => s.user);
  const isAdmin = useStore((s) => s.isAdmin);

  if (!user || !isAdmin) return null;

  const isSuperAdmin = user.role === 'superadmin';

  return (
    <div
      className={`fixed top-2 right-3 z-40 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-semibold shadow-lg ${
        isSuperAdmin
          ? 'bg-gradient-to-r from-red-500 to-orange-500'
          : 'bg-blue-600'
      }`}
    >
      {isSuperAdmin ? '👑 Super Admin' : '🛡️ Admin'}
    </div>
  );
}
