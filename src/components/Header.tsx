import { ALL_CATEGORIES } from '../data/categories';
import { useStore } from '../store/useStore';
import type { ViewId } from '../types';

export default function Header() {
  const currentView = useStore((s) => s.currentView);
  const setView = useStore((s) => s.setView);

  return (
    <div
      className="md:hidden fixed top-0 left-0 right-0 text-white p-3 flex justify-between items-center z-20 shadow-lg"
      style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)' }}
    >
      <span className="font-bold">HAIT Tracker</span>
      <select
        value={String(currentView)}
        onChange={(e) => {
          const v = e.target.value;
          const parsed = Number(v);
          setView(isNaN(parsed) ? (v as ViewId) : parsed);
        }}
        className="bg-white text-slate-800 text-sm rounded-lg px-3 py-1.5"
      >
        {ALL_CATEGORIES.map((c) => (
          <option key={String(c.id)} value={String(c.id)}>
            {c.icon} {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
