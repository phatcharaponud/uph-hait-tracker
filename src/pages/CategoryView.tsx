import { useEffect, useRef } from 'react';
import { HAIT_CATEGORIES, OWNERS } from '../data/categories';
import { STATUSES } from '../data/statuses';
import { useStore } from '../store/useStore';
import type { StatusValue } from '../types';
import { ExternalLink, FolderOpen } from 'lucide-react';
import { HAIT_DRIVE_FOLDER_URL } from '../data/config';

const TODAY = 12;

function dayToDate(d: number) {
  return d <= 30 ? `${d} เม.ย.` : `${d - 30} พ.ค.`;
}

function dayToDateShort(d: number) {
  return d <= 30 ? `${d} เม.ย. 69` : `${d - 30} พ.ค. 69`;
}

// Mobile card view for a single item
function MobileItemCard({
  it,
  cat,
  catDriveUrl,
}: {
  it: ReturnType<typeof useStore.getState>['items'][0];
  cat: (typeof HAIT_CATEGORIES)[0];
  catDriveUrl: string;
}) {
  const updateItemField = useStore((s) => s.updateItemField);
  const reportMode = useStore((s) => s.reportMode);
  const highlightItemId = useStore((s) => s.highlightItemId);
  const st = STATUSES[it.status];
  const overdue = it.status !== 'completed' && it.end <= TODAY;
  const isHighlighted = highlightItemId === it.id;

  return (
    <div
      id={`item-${it.id}`}
      className={`bg-white rounded-xl shadow-sm p-3 transition-all duration-500 ${
        overdue ? 'border-l-4 border-red-400' : ''
      } ${it.status === 'completed' ? 'bg-emerald-50/50' : ''} ${
        isHighlighted ? 'ring-4 ring-blue-400/75' : ''
      }`}
    >
      <div className="flex items-start gap-2 mb-2">
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0" style={{ background: `${cat.color}15`, color: cat.color }}>
          {it.id}
        </span>
        <div className="font-medium text-sm text-slate-800 flex-1">{it.title}</div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs mb-2">
        <div>
          <span className="text-slate-400">ผู้รับผิดชอบ</span>
          {reportMode ? (
            <div className="text-slate-700 font-medium">{it.owner}</div>
          ) : (
            <select
              value={it.owner}
              onChange={(e) => updateItemField(it.id, 'owner', e.target.value)}
              className="w-full mt-0.5 text-xs rounded px-1 py-0.5 border border-slate-200 cursor-pointer"
            >
              {OWNERS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          )}
        </div>
        <div>
          <span className="text-slate-400">สถานะ</span>
          {reportMode ? (
            <div className={`mt-0.5 text-[10px] px-2 py-0.5 rounded-full font-medium inline-block ${st.bg}`}>{st.label}</div>
          ) : (
            <select
              value={it.status}
              onChange={(e) => updateItemField(it.id, 'status', e.target.value as StatusValue)}
              className={`w-full mt-0.5 text-xs rounded px-1 py-0.5 border border-slate-200 cursor-pointer font-medium ${st.bg}`}
            >
              {Object.values(STATUSES).map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 text-[10px] text-slate-500">
        <span>⏰ {dayToDateShort(it.end)}</span>
        <span>📅 {dayToDate(it.start)}-{dayToDate(it.end)}</span>
        <a href={catDriveUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-auto">📂 เปิด</a>
        {it.ref && <a href={it.ref} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600">📎 ดู</a>}
      </div>
    </div>
  );
}

export default function CategoryView({ catId }: { catId: number }) {
  const items = useStore((s) => s.items);
  const updateItemField = useStore((s) => s.updateItemField);
  const reportMode = useStore((s) => s.reportMode);
  const highlightItemId = useStore((s) => s.highlightItemId);
  const setHighlightItem = useStore((s) => s.setHighlightItem);

  const cat = HAIT_CATEGORIES.find((c) => c.id === catId)!;
  const catItems = items.filter((i) => i.catId === catId);
  const done = catItems.filter((i) => i.status === 'completed').length;
  const pct = catItems.length ? Math.round((done / catItems.length) * 100) : 0;

  // For now use main folder; Part B will add per-category URLs
  const catDriveUrl = HAIT_DRIVE_FOLDER_URL;

  // Clear highlight after 3 seconds
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    if (highlightItemId) {
      highlightTimerRef.current = setTimeout(() => setHighlightItem(null), 3000);
      const el = document.getElementById(`item-${highlightItemId}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return () => clearTimeout(highlightTimerRef.current);
  }, [highlightItemId, setHighlightItem]);

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-2xl">{cat.icon}</span>
          <span className="text-xs font-mono px-2 py-1 rounded" style={{ background: `${cat.color}20`, color: cat.color }}>
            {cat.code}
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-navy">{cat.name}</h2>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-slate-500 text-sm">{catItems.length} รายการ · {done} เสร็จแล้ว</p>
          <a
            href={catDriveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg text-white hover:opacity-90"
            style={{ background: '#1e3a5f' }}
            title={`เปิดโฟลเดอร์ ${cat.code} ใน Google Drive`}
          >
            <FolderOpen size={12} /> เปิดโฟลเดอร์หมวด
          </a>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div className="flex justify-between mb-1.5">
          <span className="text-sm text-slate-600">ความคืบหน้า</span>
          <span className="font-bold" style={{ color: cat.color }}>{pct}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5">
          <div className="h-2.5 rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: cat.color }} />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-white text-left" style={{ background: '#1e3a5f' }}>
                <th className="px-3 py-2.5 font-semibold w-[60px] sticky top-0">รหัส</th>
                <th className="px-3 py-2.5 font-semibold sticky top-0">รายการ</th>
                <th className="px-3 py-2.5 font-semibold w-[140px] sticky top-0">ผู้รับผิดชอบ</th>
                <th className="px-3 py-2.5 font-semibold w-[140px] sticky top-0">สถานะ</th>
                <th className="px-3 py-2.5 font-semibold w-[100px] sticky top-0">ครบกำหนด</th>
                <th className="px-3 py-2.5 font-semibold w-[120px] sticky top-0 hidden lg:table-cell">ช่วงเวลา</th>
                <th className="px-3 py-2.5 font-semibold w-[100px] sticky top-0 text-center">เอกสาร รพ.</th>
                <th className="px-3 py-2.5 font-semibold w-[80px] sticky top-0 text-center">ตัวอย่าง</th>
              </tr>
            </thead>
            <tbody>
              {catItems.map((it) => {
                const st = STATUSES[it.status];
                const overdue = it.status !== 'completed' && it.end <= TODAY;
                const isCompleted = it.status === 'completed';
                const isHighlighted = highlightItemId === it.id;

                return (
                  <tr
                    key={it.id}
                    id={`item-${it.id}`}
                    className={`border-b border-slate-100 hover:bg-slate-50 transition-all duration-500 ${
                      overdue ? 'border-l-[3px] border-l-red-400' : ''
                    } ${isCompleted ? 'bg-emerald-50/40' : ''} ${
                      isHighlighted ? 'ring-2 ring-inset ring-blue-400' : ''
                    }`}
                  >
                    {/* รหัส */}
                    <td className="px-3 py-2.5">
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded" style={{ background: `${cat.color}12`, color: cat.color }}>
                        {it.id}
                      </span>
                    </td>

                    {/* รายการ */}
                    <td className="px-3 py-2.5">
                      <span className="text-slate-800 font-medium">
                        {it.title}
                        {overdue && <span className="text-red-500 ml-1">⚠️</span>}
                      </span>
                    </td>

                    {/* ผู้รับผิดชอบ */}
                    <td className="px-3 py-2.5">
                      {reportMode ? (
                        <span className="text-slate-700">{it.owner}</span>
                      ) : (
                        <select
                          value={it.owner}
                          onChange={(e) => updateItemField(it.id, 'owner', e.target.value)}
                          className="w-full text-xs rounded px-1.5 py-1 border border-slate-200 cursor-pointer bg-transparent hover:border-slate-400 transition-colors"
                        >
                          {OWNERS.map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                      )}
                    </td>

                    {/* สถานะ */}
                    <td className="px-3 py-2.5">
                      {reportMode ? (
                        <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${st.bg}`}>{st.label}</span>
                      ) : (
                        <select
                          value={it.status}
                          onChange={(e) => updateItemField(it.id, 'status', e.target.value as StatusValue)}
                          className={`w-full text-xs rounded px-1.5 py-1 border border-slate-200 cursor-pointer font-medium transition-colors hover:border-slate-400 ${st.bg}`}
                        >
                          {Object.values(STATUSES).map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                      )}
                    </td>

                    {/* ครบกำหนด */}
                    <td className="px-3 py-2.5 text-slate-600">
                      {dayToDateShort(it.end)}
                    </td>

                    {/* ช่วงเวลา */}
                    <td className="px-3 py-2.5 text-slate-500 hidden lg:table-cell">
                      {dayToDate(it.start)} - {dayToDate(it.end)}
                    </td>

                    {/* เอกสาร รพ. */}
                    <td className="px-3 py-2.5 text-center">
                      <a
                        href={catDriveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded bg-navy/10 text-navy hover:bg-navy/20 transition-colors font-medium"
                        title={`เปิดโฟลเดอร์ ${cat.code} ใน Google Drive`}
                      >
                        📂 เปิด
                      </a>
                    </td>

                    {/* ตัวอย่าง */}
                    <td className="px-3 py-2.5 text-center">
                      {it.ref ? (
                        <a
                          href={it.ref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-0.5 text-[10px] px-2 py-1 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                          📎 ดู
                        </a>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-2">
        {catItems.map((it) => (
          <MobileItemCard key={it.id} it={it} cat={cat} catDriveUrl={catDriveUrl} />
        ))}
      </div>
    </div>
  );
}
