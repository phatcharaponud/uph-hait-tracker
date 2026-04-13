import { useState } from 'react';
import { HAIT_CATEGORIES } from '../data/categories';
import { STATUSES } from '../data/statuses';
import { useStore } from '../store/useStore';
import type { Item, StatusValue } from '../types';
import { X, FolderOpen, FileDown, FileSpreadsheet } from 'lucide-react';
import { HAIT_DRIVE_FOLDER_URL } from '../data/config';
import { exportDashboardPdf } from '../lib/exportPdf';
import { exportExcel } from '../lib/exportExcel';

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

function AlertBanner({ items }: { items: Item[] }) {
  const setView = useStore((s) => s.setView);
  const setHighlightItem = useStore((s) => s.setHighlightItem);
  const overdueItems = items.filter(i => i.status !== 'completed' && i.end <= TODAY);
  const nearDeadline = items.filter(i => i.status !== 'completed' && i.end > TODAY && i.end <= TODAY + 7);

  if (overdueItems.length === 0 && nearDeadline.length === 0) return null;

  const goToFirst = (list: Item[]) => {
    if (list.length > 0) {
      setHighlightItem(list[0].id);
      setView(list[0].catId);
    }
  };

  return (
    <div className="space-y-2 mb-3">
      {overdueItems.length > 0 && (
        <div
          className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-sm text-red-700 flex items-center justify-between cursor-pointer hover:bg-red-100 transition-colors"
          onClick={() => goToFirst(overdueItems)}
        >
          <span>⚠️ มีรายการเลยกำหนด <strong>{overdueItems.length}</strong> รายการ</span>
          <span className="text-xs text-red-500">คลิกเพื่อดู →</span>
        </div>
      )}
      {nearDeadline.length > 0 && (
        <div
          className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-sm text-amber-700 flex items-center justify-between cursor-pointer hover:bg-amber-100 transition-colors"
          onClick={() => goToFirst(nearDeadline)}
        >
          <span>🔔 มีรายการใกล้ครบกำหนด (≤7 วัน) <strong>{nearDeadline.length}</strong> รายการ</span>
          <span className="text-xs text-amber-500">คลิกเพื่อดู →</span>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const items = useStore((s) => s.items);
  const user = useStore((s) => s.user);
  const setView = useStore((s) => s.setView);
  const syncStatus = useStore((s) => s.syncStatus);
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

  // Loading skeleton
  if (syncStatus === 'syncing' && items.length === 0) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-slate-200 rounded w-48" />
        <div className="h-32 bg-slate-200 rounded-2xl" />
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-slate-200 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map(i => <div key={i} className="h-32 bg-slate-200 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="md:h-[calc(100vh-64px)] md:flex md:flex-col">
      {/* Alert banners */}
      <AlertBanner items={items} />

      {/* Row 1: Header + Overall Progress */}
      <div className="shrink-0 mb-3">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-2xl font-bold text-navy">ภาพรวม HAIT</h2>
            <p className="text-slate-500 text-sm">
              เป้าหมาย: ทุกหมวดเสร็จภายใน <span className="font-bold text-red-600">31 พฤษภาคม 2569</span>
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={() => exportDashboardPdf(items, user)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-white hover:opacity-90 transition-opacity"
              style={{ background: '#1e3a5f' }}
              title="ดาวน์โหลดรายงาน PDF"
            >
              <FileDown size={14} />
              📄 PDF
            </button>
            <button
              onClick={() => exportExcel(items)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
              title="ดาวน์โหลดรายงาน Excel"
            >
              <FileSpreadsheet size={14} />
              📊 Excel
            </button>
            <a
              href={HAIT_DRIVE_FOLDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-navy hover:shadow-md transition-shadow"
              style={{ background: '#1e3a5f15' }}
            >
              <FolderOpen size={14} className="text-navy" />
              📁 คลังเอกสาร
            </a>
          </div>
        </div>

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
      </div>

      {/* Row 2: Status cards */}
      <div className="shrink-0 grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
        {counts.map((c) => (
          <div
            key={c.key}
            className="bg-white rounded-xl shadow-sm p-3 border-l-4 cursor-pointer hover:shadow-md transition-shadow"
            style={{ borderColor: c.color }}
            onClick={() => setModalStatus(c.key)}
            title={`คลิกเพื่อดูรายการ ${c.label}`}
          >
            <div className="text-2xl font-bold" style={{ color: c.color }}>
              {c.n}
            </div>
            <div className="text-[10px] text-slate-600 mt-0.5">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Row 3: Category cards */}
      <div className="flex-1 min-h-0">
        <h3 className="font-bold text-navy text-sm mb-2">ความคืบหน้ารายหมวด</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:h-[calc(100%-28px)]">
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
                className="bg-white rounded-xl shadow-sm p-4 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between"
                onClick={() => setView(catId)}
                title={`ดูรายละเอียด ${cat.code}`}
              >
                <div>
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-2xl leading-none mt-0.5">{cat.icon}</span>
                    <div className="flex-1">
                      <div className="text-[10px] font-mono font-bold" style={{ color: cat.color }}>
                        {cat.code}
                      </div>
                      <div className="font-semibold text-slate-800 text-sm leading-snug">
                        {cat.name}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-end justify-between mb-1.5">
                    <div className="text-[11px] text-slate-500">
                      {catDone}/{catItems.length} รายการ
                    </div>
                    <div className="text-2xl font-bold leading-none" style={{ color: cat.color }}>
                      {catPct}<span className="text-sm">%</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-700"
                      style={{ width: `${catPct}%`, background: cat.color }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
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
