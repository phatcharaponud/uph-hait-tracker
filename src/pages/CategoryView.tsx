import { useState, useEffect, useRef } from 'react';
import { HAIT_CATEGORIES, OWNERS } from '../data/categories';
import { STATUSES } from '../data/statuses';
import { useStore } from '../store/useStore';
import type { StatusValue } from '../types';
import { ExternalLink, Save, Pencil, FolderOpen } from 'lucide-react';

const TODAY = 12;

function dayToDate(d: number) {
  return d <= 30 ? `${d} เม.ย.` : `${d - 30} พ.ค.`;
}

function isValidDocUrl(url: string) {
  try {
    const u = new URL(url);
    return u.hostname.endsWith('drive.google.com') || u.hostname.endsWith('docs.google.com');
  } catch {
    return false;
  }
}

function DocumentUrlSection({ itemId, documentUrl }: { itemId: string; documentUrl: string }) {
  const updateItemField = useStore((s) => s.updateItemField);
  const [editing, setEditing] = useState(!documentUrl);
  const [draft, setDraft] = useState(documentUrl);
  const [error, setError] = useState('');

  const save = () => {
    if (draft && !isValidDocUrl(draft)) {
      setError('URL ต้องเป็น drive.google.com หรือ docs.google.com');
      return;
    }
    setError('');
    updateItemField(itemId, 'documentUrl', draft);
    setEditing(false);
  };

  return (
    <div className="rounded-lg p-3 border" style={{ background: '#1e3a5f0d', borderColor: '#1e3a5f30' }}>
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-xs font-bold text-navy">📁 เอกสารของโรงพยาบาล</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-semibold">
          ⚡ ใช้ส่งประเมิน HAIT
        </span>
      </div>
      {editing ? (
        <div className="space-y-1.5">
          <div className="flex gap-2">
            <input
              type="url"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="วาง Google Drive URL ที่นี่..."
              className="flex-1 text-xs px-2 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/30"
            />
            <button
              onClick={save}
              className="flex items-center gap-1 text-xs px-3 py-1.5 bg-navy text-white rounded-lg hover:opacity-90"
              style={{ background: '#1e3a5f' }}
            >
              <Save size={12} /> บันทึก
            </button>
          </div>
          {error && <p className="text-red-500 text-[10px]">{error}</p>}
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 bg-navy text-white rounded-lg hover:opacity-90"
            style={{ background: '#1e3a5f' }}
          >
            <FolderOpen size={12} /> เปิดเอกสาร
          </a>
          <button
            onClick={() => { setEditing(true); setDraft(documentUrl); }}
            className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200"
          >
            <Pencil size={12} /> แก้ไขลิงก์
          </button>
          <a
            href="https://drive.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
          >
            <ExternalLink size={12} /> อัพโหลดใหม่
          </a>
        </div>
      )}
    </div>
  );
}

function RefUrlSection({ refUrl }: { refUrl: string }) {
  return (
    <div className="pt-2 border-t border-slate-100 mt-3">
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-[10px] text-slate-400">🔍 เพื่อการศึกษา ไม่ใช่เอกสารส่งประเมิน</span>
      </div>
      <a
        href={refUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600"
      >
        📚 ดูตัวอย่างจาก รพ. อื่น <ExternalLink size={10} />
      </a>
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

  // Clear highlight after 3 seconds
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    if (highlightItemId) {
      highlightTimerRef.current = setTimeout(() => setHighlightItem(null), 3000);
      // Scroll to highlighted item
      const el = document.getElementById(`item-${highlightItemId}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return () => clearTimeout(highlightTimerRef.current);
  }, [highlightItemId, setHighlightItem]);

  return (
    <div>
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-3xl">{cat.icon}</span>
          <span
            className="text-xs font-mono px-2 py-1 rounded"
            style={{ background: `${cat.color}20`, color: cat.color }}
          >
            {cat.code}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-navy">{cat.name}</h2>
        </div>
        <p className="text-slate-500 text-sm">
          {catItems.length} รายการ · {done} เสร็จแล้ว
        </p>
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-2xl shadow-sm p-5 mb-5">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-slate-600">ความคืบหน้า</span>
          <span className="font-bold" style={{ color: cat.color }}>
            {pct}%
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3">
          <div
            className="h-3 rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: cat.color }}
          />
        </div>
      </div>

      {/* Items */}
      <div className="space-y-2">
        {catItems.map((it) => {
          const st = STATUSES[it.status];
          const overdue = it.status !== 'completed' && it.end <= TODAY;
          const isHighlighted = highlightItemId === it.id;

          return (
            <div
              key={it.id}
              id={`item-${it.id}`}
              className={`bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition-all duration-500 ${
                overdue ? 'border-2 border-red-200' : ''
              } ${isHighlighted ? 'ring-4 ring-blue-400 ring-opacity-75' : ''}`}
            >
              <div className="flex items-start gap-3 mb-3">
                <span
                  className="text-xs font-mono px-2 py-1 rounded shrink-0 mt-0.5"
                  style={{ background: `${cat.color}15`, color: cat.color }}
                >
                  {it.id}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-800">
                    {it.title}
                    {overdue && (
                      <span className="text-red-600 text-xs ml-1">⚠️ เลยกำหนด</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2 text-xs">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      👤 {it.owner}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      ⏰ ครบกำหนด {dayToDate(it.end)} 69
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700">
                      📅 {dayToDate(it.start)} - {dayToDate(it.end)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              {reportMode ? (
                <div className="flex flex-wrap gap-2 items-center pt-3 border-t border-slate-100 mb-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${st.bg}`}>
                    {st.label}
                  </span>
                  <span className="text-xs text-slate-500">👤 {it.owner}</span>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 items-center pt-3 border-t border-slate-100 mb-3">
                  <label className="text-xs text-slate-500 font-semibold">สถานะ:</label>
                  <select
                    value={it.status}
                    onChange={(e) =>
                      updateItemField(it.id, 'status', e.target.value)
                    }
                    className={`text-xs rounded-lg px-2 py-1.5 border border-slate-300 font-medium cursor-pointer ${st.bg}`}
                  >
                    {Object.values(STATUSES).map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>

                  <label className="text-xs text-slate-500 font-semibold ml-2">
                    ผู้รับผิดชอบ:
                  </label>
                  <select
                    value={it.owner}
                    onChange={(e) => updateItemField(it.id, 'owner', e.target.value)}
                    className="text-xs rounded-lg px-2 py-1.5 border border-slate-300 cursor-pointer"
                  >
                    {OWNERS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Document URL section */}
              {reportMode ? (
                it.documentUrl && (
                  <a
                    href={it.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 bg-navy text-white rounded-lg hover:opacity-90"
                    style={{ background: '#1e3a5f' }}
                  >
                    <FolderOpen size={12} /> เปิดเอกสาร
                  </a>
                )
              ) : (
                <DocumentUrlSection itemId={it.id} documentUrl={it.documentUrl} />
              )}

              {/* Reference URL section */}
              {!reportMode && it.ref && <RefUrlSection refUrl={it.ref} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
