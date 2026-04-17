import { useState, useEffect, useRef } from 'react';
import { HAIT_CATEGORIES, OWNERS } from '../data/categories';
import { STATUSES } from '../data/statuses';
import { useStore } from '../store/useStore';
import type { StatusValue, Item } from '../types';
import { FolderOpen, Pencil, Trash2, Plus, FileDown } from 'lucide-react';
import { getCategoryDriveUrl } from '../data/config';
import { exportCategoryPdf } from '../lib/exportPdf';
import ItemTooltip from '../components/ItemTooltip';
import { dayToDate, dayToDateShort, todayDayNumber, TOTAL_DAYS } from '../lib/date';
import { LIMITS, validateText, validateDay } from '../lib/validation';

const TODAY = todayDayNumber();

// Inline editable text cell (admin only)
function EditableText({
  value,
  onSave,
  maxLen = LIMITS.title,
  label = 'ชื่อรายการ',
}: {
  value: string;
  onSave: (v: string) => void;
  maxLen?: number;
  label?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const showToast = useStore((s) => s.showToast);

  const commit = () => {
    if (draft === value) { setEditing(false); return; }
    const result = validateText(draft, maxLen, { label });
    if (!result.ok) {
      showToast(result.error);
      setEditing(false);
      return;
    }
    onSave(result.value);
    setEditing(false);
  };

  if (!editing) {
    return (
      <span
        className="cursor-pointer hover:bg-amber-50 px-1 -mx-1 rounded group inline-flex items-center gap-1"
        onClick={() => { setDraft(value); setEditing(true); }}
      >
        {value}
        <Pencil size={10} className="text-slate-300 opacity-0 group-hover:opacity-100" />
      </span>
    );
  }
  return (
    <input
      autoFocus
      value={draft}
      maxLength={maxLen}
      aria-label={label}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') commit();
        if (e.key === 'Escape') setEditing(false);
      }}
      className="w-full text-xs px-1.5 py-0.5 border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
    />
  );
}

// Inline editable number cell (admin only) — for day numbers
function EditableDay({ value, onSave }: { value: number; onSave: (v: number) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));

  if (!editing) {
    return (
      <span
        className="cursor-pointer hover:bg-amber-50 px-1 -mx-1 rounded group inline-flex items-center gap-1"
        onClick={() => { setDraft(String(value)); setEditing(true); }}
      >
        {dayToDateShort(value)}
        <Pencil size={10} className="text-slate-300 opacity-0 group-hover:opacity-100" />
      </span>
    );
  }
  const commit = () => {
    const n = parseInt(draft);
    const result = validateDay(n);
    if (result.ok && n !== value) onSave(n);
    setEditing(false);
  };
  return (
    <input
      autoFocus
      type="number"
      min={1}
      max={TOTAL_DAYS}
      value={draft}
      aria-label="วันครบกำหนด"
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') commit();
        if (e.key === 'Escape') setEditing(false);
      }}
      className="w-16 text-xs px-1.5 py-0.5 border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
      title={`วันที่ 1–${TOTAL_DAYS} ของช่วงเวลาโครงการ`}
    />
  );
}

function EditableRange({ start, end, onSaveStart, onSaveEnd }: {
  start: number; end: number;
  onSaveStart: (v: number) => void; onSaveEnd: (v: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draftS, setDraftS] = useState(String(start));
  const [draftE, setDraftE] = useState(String(end));

  if (!editing) {
    return (
      <span
        className="cursor-pointer hover:bg-amber-50 px-1 -mx-1 rounded group inline-flex items-center gap-1"
        onClick={() => { setDraftS(String(start)); setDraftE(String(end)); setEditing(true); }}
      >
        {dayToDate(start)} - {dayToDate(end)}
        <Pencil size={10} className="text-slate-300 opacity-0 group-hover:opacity-100" />
      </span>
    );
  }

  const save = () => {
    const s = parseInt(draftS);
    const e = parseInt(draftE);
    const rs = validateDay(s);
    const re = validateDay(e);
    if (rs.ok && re.ok && s > e) {
      // swap if inverted
      if (s !== start) onSaveStart(e);
      if (e !== end) onSaveEnd(s);
    } else {
      if (rs.ok && s !== start) onSaveStart(s);
      if (re.ok && e !== end) onSaveEnd(e);
    }
    setEditing(false);
  };

  return (
    <div className="flex items-center gap-1">
      <input type="number" min={1} max={TOTAL_DAYS} value={draftS} onChange={(e) => setDraftS(e.target.value)}
        aria-label="วันเริ่ม"
        className="w-12 text-xs px-1 py-0.5 border border-blue-300 rounded" autoFocus />
      <span>-</span>
      <input type="number" min={1} max={TOTAL_DAYS} value={draftE} onChange={(e) => setDraftE(e.target.value)}
        aria-label="วันสิ้นสุด"
        className="w-12 text-xs px-1 py-0.5 border border-blue-300 rounded"
        onBlur={save} onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(false); }} />
    </div>
  );
}

// Mobile card
function MobileItemCard({ it, cat, catDriveUrl, canEditBasic, canEditAdvanced }: {
  it: Item; cat: (typeof HAIT_CATEGORIES)[0]; catDriveUrl: string;
  canEditBasic: boolean; canEditAdvanced: boolean;
}) {
  const updateItemField = useStore((s) => s.updateItemField);
  const reportMode = useStore((s) => s.reportMode);
  const highlightItemId = useStore((s) => s.highlightItemId);
  const st = STATUSES[it.status];
  const overdue = it.status !== 'completed' && it.end <= TODAY;
  const isHighlighted = highlightItemId === it.id;
  const disabled = !canEditBasic;

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
        <div className="font-medium text-sm text-slate-800 flex-1">
          {canEditAdvanced ? (
            <EditableText value={it.title} onSave={(v) => updateItemField(it.id, 'title', v)} />
          ) : it.title}
          {it.description && <ItemTooltip description={it.description} />}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs mb-2">
        <div>
          <span className="text-slate-400">ผู้รับผิดชอบ</span>
          {reportMode || disabled ? (
            <div className="text-slate-700 font-medium">{it.owner}</div>
          ) : (
            <select value={it.owner} onChange={(e) => updateItemField(it.id, 'owner', e.target.value)}
              className="w-full mt-0.5 text-xs rounded px-1 py-0.5 border border-slate-200 cursor-pointer">
              {OWNERS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          )}
        </div>
        <div>
          <span className="text-slate-400">สถานะ</span>
          {reportMode || disabled ? (
            <div className={`mt-0.5 text-[10px] px-2 py-0.5 rounded-full font-medium inline-block ${st.bg}`}>{st.label}</div>
          ) : (
            <select value={it.status} onChange={(e) => updateItemField(it.id, 'status', e.target.value as StatusValue)}
              className={`w-full mt-0.5 text-xs rounded px-1 py-0.5 border border-slate-200 cursor-pointer font-medium ${st.bg}`}>
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
  const updateItemNumField = useStore((s) => s.updateItemNumField);
  const addItem = useStore((s) => s.addItem);
  const removeItem = useStore((s) => s.removeItem);
  const reportMode = useStore((s) => s.reportMode);
  const user = useStore((s) => s.user);
  const isAdmin = useStore((s) => s.isAdmin);
  const highlightItemId = useStore((s) => s.highlightItemId);
  const setHighlightItem = useStore((s) => s.setHighlightItem);

  // Permission levels
  const canEditBasic = !!user;  // logged in: status, owner
  const canEditAdvanced = isAdmin; // admin: title, dates, add/remove

  const cat = HAIT_CATEGORIES.find((c) => c.id === catId)!;
  const catItems = items.filter((i) => i.catId === catId);
  const done = catItems.filter((i) => i.status === 'completed').length;
  const pct = catItems.length ? Math.round((done / catItems.length) * 100) : 0;
  const catDriveUrl = getCategoryDriveUrl(catId);

  // Clear highlight after 3 seconds
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => {
    if (highlightItemId) {
      highlightTimerRef.current = setTimeout(() => setHighlightItem(null), 3000);
      const el = document.getElementById(`item-${highlightItemId}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return () => clearTimeout(highlightTimerRef.current);
  }, [highlightItemId, setHighlightItem]);

  const handleAddItem = () => {
    const maxId = catItems.reduce((max, it) => {
      const parts = it.id.split('.');
      const lastNum = parseInt(parts[parts.length - 1]) || 0;
      return lastNum > max ? lastNum : max;
    }, 0);
    const newId = `${catId}.${maxId + 1}`;
    const newItem: Item = {
      id: newId, catId, title: 'รายการใหม่', status: 'not_started',
      owner: 'CIO', start: Math.max(TODAY, 1), end: TOTAL_DAYS, ref: '', documentUrl: '', notes: '',
    };
    addItem(newItem);
  };

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
          <button
            onClick={() => exportCategoryPdf(catId, items, user)}
            className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg text-white hover:opacity-90"
            style={{ background: '#1e3a5f' }}
            title={`ดาวน์โหลด PDF ${cat.code}`}
          >
            <FileDown size={12} /> 📄 PDF
          </button>
          <a href={catDriveUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg text-white hover:opacity-90"
            style={{ background: '#1e3a5f' }}
            title={`เปิดโฟลเดอร์ ${cat.code} ใน Google Drive`}>
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

      {/* Not logged in warning */}
      {!user && !reportMode && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-4 text-xs text-amber-700">
          🔒 โปรดเข้าสู่ระบบเพื่อแก้ไขข้อมูล
        </div>
      )}

      {/* Empty state */}
      {catItems.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="text-4xl mb-3">📭</div>
          <h3 className="text-lg font-semibold text-slate-700 mb-1">ยังไม่มีรายการ</h3>
          <p className="text-sm text-slate-400">
            {canEditAdvanced ? 'คลิกปุ่ม "เพิ่มรายการ" ด้านล่างเพื่อเริ่มต้น' : 'ยังไม่มีรายการในหมวดนี้'}
          </p>
        </div>
      )}

      {/* Desktop Table */}
      {catItems.length > 0 && <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
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
                {canEditAdvanced && <th className="px-2 py-2.5 font-semibold w-[40px] sticky top-0 text-center">ลบ</th>}
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
                      {canEditAdvanced ? (
                        <EditableText value={it.title} onSave={(v) => updateItemField(it.id, 'title', v)} />
                      ) : (
                        <span className="text-slate-800 font-medium">
                          {it.title}
                          {overdue && <span className="text-red-500 ml-1">⚠️</span>}
                        </span>
                      )}
                      {canEditAdvanced && overdue && <span className="text-red-500 ml-1">⚠️</span>}
                      {it.description && <ItemTooltip description={it.description} />}
                    </td>

                    {/* ผู้รับผิดชอบ */}
                    <td className="px-3 py-2.5">
                      {reportMode || !canEditBasic ? (
                        <span className="text-slate-700">{it.owner}</span>
                      ) : (
                        <select value={it.owner} onChange={(e) => updateItemField(it.id, 'owner', e.target.value)}
                          className="w-full text-xs rounded px-1.5 py-1 border border-slate-200 cursor-pointer bg-transparent hover:border-slate-400 transition-colors">
                          {OWNERS.map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                      )}
                    </td>

                    {/* สถานะ */}
                    <td className="px-3 py-2.5">
                      {reportMode || !canEditBasic ? (
                        <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${st.bg}`}>{st.label}</span>
                      ) : (
                        <select value={it.status} onChange={(e) => updateItemField(it.id, 'status', e.target.value as StatusValue)}
                          className={`w-full text-xs rounded px-1.5 py-1 border border-slate-200 cursor-pointer font-medium transition-colors hover:border-slate-400 ${st.bg}`}>
                          {Object.values(STATUSES).map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                      )}
                    </td>

                    {/* ครบกำหนด */}
                    <td className="px-3 py-2.5 text-slate-600">
                      {canEditAdvanced ? (
                        <EditableDay value={it.end} onSave={(v) => updateItemNumField(it.id, 'end', v)} />
                      ) : (
                        dayToDateShort(it.end)
                      )}
                    </td>

                    {/* ช่วงเวลา */}
                    <td className="px-3 py-2.5 text-slate-500 hidden lg:table-cell">
                      {canEditAdvanced ? (
                        <EditableRange
                          start={it.start} end={it.end}
                          onSaveStart={(v) => updateItemNumField(it.id, 'start', v)}
                          onSaveEnd={(v) => updateItemNumField(it.id, 'end', v)}
                        />
                      ) : (
                        <>{dayToDate(it.start)} - {dayToDate(it.end)}</>
                      )}
                    </td>

                    {/* เอกสาร รพ. */}
                    <td className="px-3 py-2.5 text-center">
                      <a href={catDriveUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded bg-navy/10 text-navy hover:bg-navy/20 transition-colors font-medium"
                        title={`เปิดโฟลเดอร์ ${cat.code} ใน Google Drive`}>
                        📂 เปิด
                      </a>
                    </td>

                    {/* ตัวอย่าง */}
                    <td className="px-3 py-2.5 text-center">
                      {it.ref ? (
                        <a href={it.ref} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-0.5 text-[10px] px-2 py-1 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                          📎 ดู
                        </a>
                      ) : <span className="text-slate-300">-</span>}
                    </td>

                    {/* ลบ (admin only) */}
                    {canEditAdvanced && (
                      <td className="px-2 py-2.5 text-center">
                        <button
                          onClick={() => { if (confirm(`ลบรายการ ${it.id} "${it.title}"?`)) removeItem(it.id); }}
                          className="p-1 rounded hover:bg-red-100 text-slate-400 hover:text-red-600 transition-colors"
                          title="ลบรายการนี้"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Add item button (admin only) */}
        {canEditAdvanced && (
          <button
            onClick={handleAddItem}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium text-blue-600 hover:bg-blue-50 border-t border-slate-100 transition-colors"
          >
            <Plus size={14} /> เพิ่มรายการ
          </button>
        )}
      </div>}

      {/* Mobile Cards */}
      {catItems.length > 0 && (
        <div className="md:hidden space-y-2">
          {catItems.map((it) => (
            <MobileItemCard key={it.id} it={it} cat={cat} catDriveUrl={catDriveUrl}
              canEditBasic={canEditBasic} canEditAdvanced={canEditAdvanced} />
          ))}
        </div>
      )}

      {/* Add item button when empty (admin) */}
      {catItems.length === 0 && canEditAdvanced && (
        <button
          onClick={handleAddItem}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium text-blue-600 bg-white rounded-xl shadow-sm hover:bg-blue-50 border border-slate-100 transition-colors mt-4"
        >
          <Plus size={14} /> เพิ่มรายการ
        </button>
      )}
    </div>
  );
}
