import { NAV_ITEMS, HAIT_CATEGORIES } from '../data/categories';
import { useStore, usePctOf } from '../store/useStore';
import type { ViewId } from '../types';
import SyncIndicator from './SyncIndicator';
import { FileText, Eye } from 'lucide-react';

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
  // day 12 = 12 เม.ย. → เหลือ 61-12 = 49 วัน ถึง 31 พ.ค.
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
          <SidebarCatItem key={String(c.id)} id={c.id as ViewId} {...c} />
        ))}
        <div className="border-t border-slate-200 my-2" />
        {HAIT_CATEGORIES.map((c) => (
          <SidebarCatItem key={String(c.id)} id={c.id as ViewId} {...c} />
        ))}
      </nav>

      {/* Report Mode Toggle */}
      <ReportModeToggle />

      <TodayCounter />
    </aside>
  );
}
