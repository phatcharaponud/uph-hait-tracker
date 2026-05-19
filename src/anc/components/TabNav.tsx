export type AncTab = 'overview' | 'new' | 'list' | 'reports' | 'settings';

interface Props {
  current: AncTab;
  onChange: (tab: AncTab) => void;
  recordCount: number;
}

const TABS: { id: AncTab; label: string; icon: string }[] = [
  { id: 'overview', label: 'ภาพรวม', icon: '📊' },
  { id: 'new', label: 'บันทึกใหม่', icon: '➕' },
  { id: 'list', label: 'รายชื่อ', icon: '📋' },
  { id: 'reports', label: 'รายงาน', icon: '📈' },
  { id: 'settings', label: 'ตั้งค่า', icon: '⚙️' },
];

export default function TabNav({ current, onChange, recordCount }: Props) {
  return (
    <nav className="flex flex-wrap gap-2 mb-5" aria-label="เมนูหลัก">
      {TABS.map((t) => {
        const active = current === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 font-medium transition shadow-sm ${
              active
                ? 'bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span aria-hidden>{t.icon}</span>
            <span>{t.label}</span>
            {t.id === 'list' && (
              <span
                className={`text-xs rounded-full px-2 py-0.5 ${
                  active ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {recordCount}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
