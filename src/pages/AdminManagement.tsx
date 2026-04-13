import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { listAdmins, addAdmin, removeAdmin, updateAdminRole } from '../lib/api';
import type { AdminRecord } from '../types';
import { Trash2, UserPlus } from 'lucide-react';

export default function AdminManagement() {
  const user = useStore((s) => s.user);
  const showToast = useStore((s) => s.showToast);
  const refreshAdminStatus = useStore((s) => s.refreshAdminStatus);

  const [admins, setAdmins] = useState<AdminRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'superadmin'>('admin');

  const fetchAdmins = async () => {
    setLoading(true);
    const res = await listAdmins();
    if (res.ok && res.data) {
      setAdmins(res.data as AdminRecord[]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchAdmins(); }, []);

  const superAdminCount = admins.filter((a) => a.role === 'superadmin').length;

  const handleAddAdmin = async () => {
    if (!newEmail.endsWith('@up.ac.th')) {
      showToast('อนุญาตเฉพาะอีเมล @up.ac.th เท่านั้น');
      return;
    }
    if (admins.some((a) => a.email === newEmail)) {
      showToast('อีเมลนี้มีสิทธิ์แล้ว');
      return;
    }
    const res = await addAdmin(newEmail, newName, newRole, user!.email);
    if (res.ok) {
      showToast('เพิ่มสิทธิ์แล้ว');
      setNewEmail('');
      setNewName('');
      setNewRole('admin');
      fetchAdmins();
    } else {
      showToast(res.error || 'เกิดข้อผิดพลาด');
    }
  };

  const handleRemove = async (email: string) => {
    if (email === user!.email && superAdminCount <= 1) {
      showToast('ไม่สามารถลบ Super Admin คนสุดท้ายได้');
      return;
    }
    if (!confirm(`ลบสิทธิ์ admin ของ ${email}?`)) return;
    const res = await removeAdmin(email, user!.email);
    if (res.ok) {
      showToast('ลบสิทธิ์แล้ว');
      fetchAdmins();
      refreshAdminStatus();
    } else {
      showToast(res.error || 'เกิดข้อผิดพลาด');
    }
  };

  const handleRoleChange = async (email: string, role: string) => {
    if (email === user!.email && role !== 'superadmin' && superAdminCount <= 1) {
      showToast('ไม่สามารถลดสิทธิ์ Super Admin คนสุดท้ายได้');
      return;
    }
    const res = await updateAdminRole(email, role, user!.email);
    if (res.ok) {
      showToast('เปลี่ยนสิทธิ์แล้ว');
      fetchAdmins();
      refreshAdminStatus();
    } else {
      showToast(res.error || 'เกิดข้อผิดพลาด');
    }
  };

  const formatDate = (d: string) => {
    if (!d) return '-';
    try {
      const date = new Date(d);
      return date.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch { return d; }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-navy flex items-center gap-2">
          ⚙️ จัดการสิทธิ์ Admin
        </h2>
        <p className="text-slate-500 text-sm mt-1">จัดการผู้ดูแลระบบ HAIT Tracker</p>
      </div>

      {/* Current user */}
      {user && (
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex items-center gap-3">
          <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full border" referrerPolicy="no-referrer" />
          <div>
            <div className="font-medium text-slate-800">{user.name}</div>
            <div className="text-xs text-slate-400">{user.email}</div>
          </div>
          <span className="ml-auto text-xs px-3 py-1 rounded-full font-semibold bg-gradient-to-r from-red-500 to-orange-500 text-white">
            👑 Super Admin
          </span>
        </div>
      )}

      {/* Admin list */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white text-left" style={{ background: '#1e3a5f' }}>
                <th className="px-4 py-3 font-semibold">ชื่อ</th>
                <th className="px-4 py-3 font-semibold">อีเมล</th>
                <th className="px-4 py-3 font-semibold w-[150px]">Role</th>
                <th className="px-4 py-3 font-semibold hidden md:table-cell">เพิ่มโดย</th>
                <th className="px-4 py-3 font-semibold hidden md:table-cell">วันที่</th>
                <th className="px-4 py-3 font-semibold w-[60px] text-center">ลบ</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 text-slate-400">กำลังโหลด...</td></tr>
              ) : admins.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-slate-400">ยังไม่มี admin</td></tr>
              ) : admins.map((a) => {
                const isSelf = a.email === user?.email;
                const isLastSuperAdmin = a.role === 'superadmin' && superAdminCount <= 1;
                return (
                  <tr key={a.email} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{a.name || '-'}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{a.email}</td>
                    <td className="px-4 py-3">
                      <select
                        value={a.role}
                        onChange={(e) => handleRoleChange(a.email, e.target.value)}
                        disabled={isSelf && isLastSuperAdmin}
                        className={`text-xs rounded px-2 py-1 border border-slate-200 cursor-pointer font-medium ${
                          a.role === 'superadmin'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-blue-50 text-blue-700'
                        } ${isSelf && isLastSuperAdmin ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <option value="admin">🛡️ Admin</option>
                        <option value="superadmin">👑 Super Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs hidden md:table-cell">{a.addedBy}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs hidden md:table-cell">{formatDate(a.addedAt)}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleRemove(a.email)}
                        disabled={isSelf && isLastSuperAdmin}
                        className={`p-1 rounded hover:bg-red-100 transition-colors ${
                          isSelf && isLastSuperAdmin
                            ? 'text-slate-300 cursor-not-allowed'
                            : 'text-slate-400 hover:text-red-600'
                        }`}
                        title={isSelf && isLastSuperAdmin ? 'ไม่สามารถลบ Super Admin คนสุดท้ายได้' : 'ลบสิทธิ์'}
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add admin form */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          <UserPlus size={16} /> เพิ่ม Admin
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="อีเมล @up.ac.th"
            className="text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="ชื่อ (ไม่บังคับ)"
            className="text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value as 'admin' | 'superadmin')}
            className="text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="admin">🛡️ Admin</option>
            <option value="superadmin">👑 Super Admin</option>
          </select>
          <button
            onClick={handleAddAdmin}
            disabled={!newEmail}
            className="px-4 py-2 bg-navy text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ background: '#1e3a5f' }}
          >
            เพิ่มสิทธิ์
          </button>
        </div>
      </div>
    </div>
  );
}
