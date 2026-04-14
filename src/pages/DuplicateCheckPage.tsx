import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { findDuplicateItems, ignoreGroup, type DuplicateGroup } from '../lib/duplicateCheck';
import { HAIT_CATEGORIES } from '../data/categories';

function getCatName(catId: number): string {
  return HAIT_CATEGORIES.find((c) => c.id === catId)?.name ?? `หมวด ${catId}`;
}

function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 space-y-4">
        <p className="text-sm text-slate-700">{message}</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
          >
            ยกเลิก
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-xs font-medium rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            ยืนยัน
          </button>
        </div>
      </div>
    </div>
  );
}

function DuplicateGroupCard({
  dup,
  isSuperAdmin,
  onMerge,
  onIgnore,
}: {
  dup: DuplicateGroup;
  isSuperAdmin: boolean;
  onMerge: (keepId: string, removeIds: string[]) => void;
  onIgnore: (dup: DuplicateGroup) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [confirm, setConfirm] = useState<{ keepId: string; removeIds: string[] } | null>(null);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {confirm && (
        <ConfirmDialog
          message={`จะรวมรายการและลบ ${confirm.removeIds.length} รายการที่ซ้ำ ยืนยันหรือไม่?`}
          onConfirm={() => {
            onMerge(confirm.keepId, confirm.removeIds);
            setConfirm(null);
          }}
          onCancel={() => setConfirm(null)}
        />
      )}

      <div className="px-4 py-3 bg-amber-50 border-b border-amber-200 flex items-center justify-between">
        <span className="text-sm font-semibold text-amber-800">{dup.group}</span>
        <span className="text-xs text-amber-600">{dup.items.length} รายการ</span>
      </div>

      <div className="p-4">
        {/* Side-by-side comparison */}
        <div className={`grid gap-3 ${dup.items.length === 2 ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
          {dup.items.map((item) => (
            <div key={item.id} className="border border-slate-200 rounded-lg p-3 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">{item.id}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                  HAIT {item.catId} — {getCatName(item.catId)}
                </span>
              </div>
              <div className="text-sm font-medium text-slate-800">{item.title}</div>
              {expanded && (
                <div className="text-xs text-slate-500 space-y-0.5 pt-1 border-t border-slate-100">
                  <div>สถานะ: {item.status}</div>
                  <div>ผู้รับผิดชอบ: {item.owner || '-'}</div>
                  <div>หมายเหตุ: {item.notes || '-'}</div>
                  {item.documentUrl && <div>เอกสาร: {item.documentUrl}</div>}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mt-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="px-3 py-1.5 text-xs rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
          >
            {expanded ? '🔼 ซ่อนรายละเอียด' : '🔽 ดูรายละเอียด'}
          </button>

          {isSuperAdmin && dup.items.length >= 2 && (
            <>
              {dup.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() =>
                    setConfirm({
                      keepId: item.id,
                      removeIds: dup.items.filter((i) => i.id !== item.id).map((i) => i.id),
                    })
                  }
                  className="px-3 py-1.5 text-xs rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
                >
                  รวมไว้ที่ {item.id}
                </button>
              ))}
            </>
          )}

          <button
            onClick={() => onIgnore(dup)}
            className="px-3 py-1.5 text-xs rounded-lg bg-green-50 text-green-700 hover:bg-green-100"
          >
            ไม่ใช่ซ้ำ
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DuplicateCheckPage() {
  const items = useStore((s) => s.items);
  const removeItem = useStore((s) => s.removeItem);
  const updateItemField = useStore((s) => s.updateItemField);
  const isSuperAdmin = useStore((s) => s.isSuperAdmin);
  const showToast = useStore((s) => s.showToast);
  const [version, setVersion] = useState(0);

  const duplicates = useMemo(
    () => findDuplicateItems(items),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, version]
  );

  const handleMerge = (keepId: string, removeIds: string[]) => {
    const keepItem = items.find((i) => i.id === keepId);
    if (!keepItem) return;

    // Copy non-empty fields from removed items to the kept item
    for (const removeId of removeIds) {
      const removeItem_ = items.find((i) => i.id === removeId);
      if (!removeItem_) continue;

      if (!keepItem.notes && removeItem_.notes) {
        updateItemField(keepId, 'notes', removeItem_.notes);
      }
      if (!keepItem.documentUrl && removeItem_.documentUrl) {
        updateItemField(keepId, 'documentUrl', removeItem_.documentUrl);
      }

      removeItem(removeId);
    }
    showToast(`รวมรายการเรียบร้อย เก็บ ${keepId}`);
  };

  const handleIgnore = (dup: DuplicateGroup) => {
    // Build a group key for localStorage
    const ids = dup.items.map((i) => i.id).sort().join(',');
    const isExact = dup.group.startsWith('ชื่อซ้ำ');
    const key = isExact
      ? `exact:${dup.items[0].title.trim().toLowerCase()}`
      : `similar:${ids}`;
    ignoreGroup(key);
    setVersion((v) => v + 1);
    showToast('ซ่อนกลุ่มนี้แล้ว');
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold" style={{ color: '#1e3a5f' }}>
          🔍 ตรวจสอบรายการซ้ำ
        </h2>
        <p className="text-slate-500 text-sm">
          ตรวจหารายการที่ชื่อซ้ำกันหรือคล้ายกัน เพื่อลดความซ้ำซ้อน
        </p>
      </div>

      {!isSuperAdmin && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700 mb-4">
          คุณสามารถดูรายงานรายการซ้ำได้ แต่การรวม/ลบต้องใช้สิทธิ์ Super Admin
        </div>
      )}

      {duplicates.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <div className="text-4xl mb-3">✅</div>
          <div className="text-lg font-medium">ไม่พบรายการซ้ำ</div>
          <p className="text-sm mt-1">รายการทั้งหมดไม่มีชื่อซ้ำหรือคล้ายกัน</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-slate-600">
            พบ <span className="font-bold text-amber-600">{duplicates.length}</span> กลุ่มที่อาจซ้ำกัน
          </div>
          {duplicates.map((dup, i) => (
            <DuplicateGroupCard
              key={i}
              dup={dup}
              isSuperAdmin={isSuperAdmin}
              onMerge={handleMerge}
              onIgnore={handleIgnore}
            />
          ))}
        </div>
      )}
    </div>
  );
}
