import { useState } from 'react';
import { HAIT_CATEGORIES } from '../data/categories';
import { STATUSES } from '../data/statuses';
import { useStore } from '../store/useStore';
import type { Item, StatusValue } from '../types';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts';
import { X, FolderOpen } from 'lucide-react';
import { HAIT_DRIVE_FOLDER_URL } from '../data/config';

const TODAY = 12;

function StatusModal({
  statusKey,
  items,
  onClose,
}: {
  statusKey: StatusValue;
  items: Item[];
  onClose: () => void;
}) {
  const setView = useStore((s) => s.setView);
  const setHighlightItem = useStore((s) => s.setHighlightItem);
  const st = STATUSES[statusKey];
  const filtered = items.filter((i) => i.status === statusKey);

  const goToItem = (item: Item) => {
    onClose();
    setHighlightItem(item.id);
    setView(item.catId);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: st.color }} />
            <h3 className="font-bold text-slate-800">{st.label} ({filtered.length} รายการ)</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-2">
          {filtered.map((it) => {
            const cat = HAIT_CATEGORIES.find((c) => c.id === it.catId);
            return (
              <div
                key={it.id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer"
                onClick={() => goToItem(it)}
              >
                <span className="text-xs font-mono px-1.5 py-0.5 rounded shrink-0" style={{ background: `${cat?.color}15`, color: cat?.color }}>
                  {it.id}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-800 truncate">{it.title}</div>
                  <div className="text-[10px] text-slate-500">👤 {it.owner} · {cat?.code}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const items = useStore((s) => s.items);
  const setView = useStore((s) => s.setView);
  const [modalStatus, setModalStatus] = useState<StatusValue | null>(null);

  const total = items.length;
  const done = items.filter((i) => i.status === 'completed').length;
  const pct = Math.round((done / total) * 100);
  const overdue = items.filter((i) => i.status !== 'completed' && i.end <= TODAY).length;

  const counts = (Object.keys(STATUSES) as StatusValue[]).map((k) => ({
    key: k,
    n: items.filter((i) => i.status === k).length,
    ...STATUSES[k],
  }));

  // Chart data
  const barData = HAIT_CATEGORIES.map((cat) => {
    const catId = cat.id as number;
    const catItems = items.filter((i) => i.catId === catId);
    const catDone = catItems.filter((i) => i.status === 'completed').length;
    const catPct = catItems.length ? Math.round((catDone / catItems.length) * 100) : 0;
    return { name: cat.code, pct: catPct, color: cat.color, catId };
  });

  const radarData = HAIT_CATEGORIES.map((cat) => {
    const catId = cat.id as number;
    const catItems = items.filter((i) => i.catId === catId);
    const catDone = catItems.filter((i) => i.status === 'completed').length;
    const catPct = catItems.length ? Math.round((catDone / catItems.length) * 100) : 0;
    return { subject: cat.code.replace('HAIT ', 'H'), pct: catPct, fullMark: 100 };
  });

  return (
    <div className="md:h-[calc(100vh-64px)] md:overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h2 className="text-2xl font-bold text-navy">ภาพรวม HAIT</h2>
          <p className="text-slate-500 text-sm">
            เป้าหมาย: ทุกหมวดเสร็จภายใน <span className="font-bold text-red-600">31 พฤษภาคม 2569</span>
          </p>
        </div>
        <a
          href={HAIT_DRIVE_FOLDER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-navy hover:shadow-md transition-shadow"
          style={{ background: '#1e3a5f15' }}
        >
          <FolderOpen size={14} className="text-navy" />
          📁 คลังเอกสาร
        </a>
      </div>

      {/* 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left column */}
        <div className="space-y-3">
          {/* Overall progress */}
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <div className="flex justify-between items-end mb-3">
              <div>
                <div className="text-xs text-slate-500">ความคืบหน้ารวม</div>
                <div className="text-4xl font-bold text-navy">
                  {pct}<span className="text-xl">%</span>
                </div>
              </div>
              <div className="text-right text-sm">
                <div className="text-slate-600">
                  <span className="font-bold text-emerald-600 text-lg">{done}</span>/{total} เสร็จ
                </div>
                {overdue > 0 && (
                  <div className="text-red-600 font-semibold text-xs mt-0.5">
                    ⚠️ เลยกำหนด {overdue} รายการ
                  </div>
                )}
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="h-3 rounded-full transition-all duration-700"
                style={{
                  width: `${pct}%`,
                  background: 'linear-gradient(90deg, #1e3a5f, #2563eb, #10b981)',
                }}
              />
            </div>
          </div>

          {/* Status cards — clickable */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {counts.map((c) => (
              <div
                key={c.key}
                className="bg-white rounded-xl shadow-sm p-3 border-l-4 cursor-pointer hover:shadow-md transition-shadow"
                style={{ borderColor: c.color }}
                onClick={() => setModalStatus(c.key)}
              >
                <div className="text-2xl font-bold" style={{ color: c.color }}>
                  {c.n}
                </div>
                <div className="text-[10px] text-slate-600 mt-0.5">{c.label}</div>
              </div>
            ))}
          </div>

          {/* Category cards — compact */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            {HAIT_CATEGORIES.map((cat) => {
              const catId = cat.id as number;
              const catItems = items.filter((i) => i.catId === catId);
              const catDone = catItems.filter((i) => i.status === 'completed').length;
              const catPct = catItems.length
                ? Math.round((catDone / catItems.length) * 100)
                : 0;

              return (
                <div
                  key={catId}
                  className="bg-white rounded-xl shadow-sm p-3 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all"
                  onClick={() => setView(catId)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{cat.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[9px] font-mono font-bold" style={{ color: cat.color }}>
                        {cat.code}
                      </div>
                      <div className="font-medium text-slate-800 text-xs truncate">{cat.name}</div>
                    </div>
                    <div className="text-lg font-bold" style={{ color: cat.color }}>
                      {catPct}%
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all duration-700"
                      style={{ width: `${catPct}%`, background: cat.color }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    {catDone}/{catItems.length}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column — Charts */}
        <div className="space-y-3">
          {/* Radar chart */}
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <h3 className="font-bold text-navy text-sm mb-2">Radar — ความคืบหน้ารายหมวด</h3>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9 }} />
                <Radar
                  name="ความคืบหน้า"
                  dataKey="pct"
                  stroke="#1e3a5f"
                  fill="#1e3a5f"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Bar chart */}
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <h3 className="font-bold text-navy text-sm mb-2">Bar Chart — % แต่ละหมวด</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} onClick={(e) => {
                if (e?.activePayload?.[0]?.payload?.catId) {
                  setView(e.activePayload[0].payload.catId);
                }
              }}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(value: number) => [`${value}%`, 'ความคืบหน้า']}
                  contentStyle={{ borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="pct" radius={[4, 4, 0, 0]} cursor="pointer">
                  {barData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalStatus && (
        <StatusModal
          statusKey={modalStatus}
          items={items}
          onClose={() => setModalStatus(null)}
        />
      )}
    </div>
  );
}
