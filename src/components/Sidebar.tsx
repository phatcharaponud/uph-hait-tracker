import { useMemo } from 'react';
import { NAV_ITEMS, HAIT_CATEGORIES } from '../data/categories';
import { useStore, usePctOf } from '../store/useStore';
import type { ViewId } from '../types';
import SyncIndicator from './SyncIndicator';
import { FileText, Eye, FolderOpen, LogOut, Settings, Search } from 'lucide-react';
import { HAIT_DRIVE_FOLDER_URL } from '../data/config';
import { findDuplicateItems } from '../lib/duplicateCheck';

function SidebarCatItem({ id, icon, code, name, color }: {
  id: ViewId; icon: string; code: string; name: string; color: string;
}) {
  const currentView = useStore((s) => s.currentView);
  const setView = useStore((s) => s.setView);
  const pct = typeof id === 'number' ? usePctOf(id) : null;
  const active = currentView === id;

  return (
    <div
      className={`rounded-xl px-3 py-2.5 cursor-pointer flex items-center gap-3 transition-all ${
        active
          ? 'text-white shadow-lg'
          : 'hover:bg-slate-50'
      }`}
      style={active ? {
        background: 'linear-gradient(135deg, #1e3a5f, #2563eb)',
        boxShadow: '0 4px 12px rgba(30,58,95,0.3)',
      } : undefined}
      onClick={() => setView(id)}
    >
      <span className="text-xl">{icon}</span>
      <div className="flex-1 min-w-0">
        <div
          className="text-[10px] font-mono font-bold"
          style={{ color: active ? 'white' : color }}
        >
          {code}
        </div>
        <div className="font-medium text-sm truncate">{name}</div>
      </div>
      {pct !== null && (
        <span
          className="text-xs font-bold"
          style={{ color: active ? 'white' : color }}
        >
          {pct}%
        </span>
      )}
    </div>
  );
}

function TodayCounter() {
  const today = 12;
  const daysLeft = 61 - today;

  return (
    <div className="p-3 border-t border-slate-200 text-xs text-slate-500 space-y-1">
      <p>📅 <span className="font-semibold text-slate-700">12 เม.ย. 2569</span></p>
      <p>⏱ เหลือ <span className="font-bold text-red-600">{daysLeft}</span> วัน</p>
      <SyncIndicator />
    </div>
  );
}

function ReportModeToggle() {
  const reportMode = useStore((s) => s.reportMode);
  const setReportMode = useStore((s) => s.setReportMode);

  return (
    <div className="px-3 py-2 border-t border-slate-200">
      <button
        onClick={() => setReportMode(!reportMode)}
        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
          reportMode
            ? 'bg-navy text-white'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }`}
        style={reportMode ? { background: '#1e3a5f' } : undefined}
      >
        {reportMode ? <Eye size={14} /> : <FileText size={14} />}
        {reportMode ? 'โหมดรายงาน' : 'โหมดแก้ไข'}
      </button>
    </div>
  );
}

function UserPanel() {
  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);
  const isAdmin = useStore((s) => s.isAdmin);
  const isSuperAdmin = useStore((s) => s.isSuperAdmin);
  const setView = useStore((s) => s.setView);
  const currentView = useStore((s) => s.currentView);
  const items = useStore((s) => s.items);
  const dupCount = useMemo(() => findDuplicateItems(items).length, [items]);

  if (!user) return null;

  const roleBadge = user.role === 'superadmin'
    ? { label: '👑 Super Admin', cls: 'bg-gradient-to-r from-red-500 to-orange-500 text-white' }
    : user.role === 'admin'
    ? { label: '🛡️ Admin', cls: 'bg-blue-600 text-white' }
    : { label: '👤 ผู้ใช้', cls: 'bg-slate-200 text-slate-600' };

  return (
    <div className="px-3 py-3 border-t border-slate-200 space-y-2">
      <div className="flex items-center gap-2.5">
        <img
          src={user.picture}
          alt={user.name}
          className="w-8 h-8 rounded-full border border-slate-200"
          referrerPolicy="no-referrer"
        />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-slate-800 truncate">{user.name}</div>
          <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${roleBadge.cls}`}>
          {roleBadge.label}
        </span>
      </div>
      {isAdmin && (
        <button
          onClick={() => setView('duplicates')}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
            currentView === 'duplicates'
              ? 'text-white shadow-lg'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
          style={currentView === 'duplicates' ? { background: 'linear-gradient(135deg, #1e3a5f, #2563eb)' } : undefined}
        >
          <Search size={14} />
          🔍 ตรวจสอบรายการซ้ำ
          {dupCount > 0 && (
            <span className="ml-auto bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {dupCount}
            </span>
          )}
        </button>
      )}
      {isSuperAdmin && (
        <button
          onClick={() => setView('admin')}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
            currentView === 'admin'
              ? 'text-white shadow-lg'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
          style={currentView === 'admin' ? { background: 'linear-gradient(135deg, #1e3a5f, #2563eb)' } : undefined}
        >
          <Settings size={14} />
          ⚙️ จัดการสิทธิ์ Admin
        </button>
      )}
      <button
        onClick={logout}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all"
      >
        <LogOut size={14} />
        ออกจากระบบ
      </button>
    </div>
  );
}

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 shrink-0 hidden md:flex flex-col sticky top-0 h-screen">
      {/* Header */}
      <div
        className="text-white p-5"
        style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)' }}
      >
        <h1 className="font-bold text-xl">HAIT Tracker</h1>
        <p className="text-xs opacity-90 mt-1">รพ.มหาวิทยาลัยพะเยา</p>
        <div className="mt-3 text-xs bg-white/20 rounded-lg px-3 py-2">
          🎯 เป้าหมาย: เสร็จภายใน พ.ค. 2569
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((c) => (
          <SidebarCatItem key={String(c.id)} {...c} id={c.id as ViewId} />
        ))}
        <div className="border-t border-slate-200 my-2" />
        {HAIT_CATEGORIES.map((c) => (
          <SidebarCatItem key={String(c.id)} {...c} id={c.id as ViewId} />
        ))}
      </nav>

      {/* Report Mode Toggle */}
      <ReportModeToggle />

      {/* User Panel (Login / Profile) */}
      <UserPanel />

      {/* Drive folder */}
      <div className="px-3 py-2 border-t border-slate-200">
        <a
          href={HAIT_DRIVE_FOLDER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-white hover:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #1e3a5f, #2563eb)' }}
        >
          <FolderOpen size={14} />
          📁 โฟลเดอร์กลาง HAIT
        </a>
      </div>

      <TodayCounter />
    </aside>
  );
}
