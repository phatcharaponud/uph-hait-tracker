import { useCallback, useEffect, useState } from 'react';
import HeaderBar from './components/HeaderBar';
import FilterBar from './components/FilterBar';
import TabNav, { type AncTab } from './components/TabNav';
import Overview from './pages/Overview';
import NewRecord from './pages/NewRecord';
import RecordList from './pages/RecordList';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import { createRecord, deleteRecord, listRecords, seedSampleData } from './lib/api';
import { shiftDays, todayISO } from './lib/thaiDate';
import type { ANCRecord, DashboardFilter } from './types';

const STORAGE_KEY = 'anc.records.v1';

const initialFilter = (): DashboardFilter => ({
  from: shiftDays(todayISO(), -180),
  to: todayISO(),
  range: 'month',
  serviceType: 'all',
});

export default function ANCApp() {
  const [records, setRecords] = useState<ANCRecord[]>([]);
  const [filter, setFilter] = useState<DashboardFilter>(initialFilter());
  const [activeTab, setActiveTab] = useState<AncTab>('overview');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; tone: 'ok' | 'err' } | null>(null);

  const showToast = useCallback((msg: string, tone: 'ok' | 'err' = 'ok') => {
    setToast({ msg, tone });
    window.setTimeout(() => setToast(null), 2400);
  }, []);

  const refresh = useCallback(async () => {
    const list = await listRecords();
    if (list.length === 0) {
      const seeded = seedSampleData();
      setRecords(seeded);
    } else {
      setRecords(list);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleSubmit = async (rec: Omit<ANCRecord, 'id'>) => {
    setSubmitting(true);
    try {
      const created = await createRecord(rec);
      setRecords((r) => [...r, created]);
      showToast('บันทึกข้อมูลสำเร็จ');
      setActiveTab('list');
    } catch (err) {
      showToast('เกิดข้อผิดพลาด: ' + (err as Error).message, 'err');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteRecord(id);
    setRecords((r) => r.filter((x) => x.id !== id));
    showToast('ลบข้อมูลแล้ว');
  };

  const handleReseed = () => {
    localStorage.removeItem(STORAGE_KEY);
    const seeded = seedSampleData();
    setRecords(seeded);
    showToast('สร้างข้อมูลตัวอย่างใหม่แล้ว');
  };

  const handleClear = () => {
    localStorage.removeItem(STORAGE_KEY);
    setRecords([]);
    showToast('ล้างข้อมูลทั้งหมดแล้ว');
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-7xl mx-auto px-3 md:px-6 py-4 md:py-6">
        <HeaderBar records={records} />
        <FilterBar
          filter={filter}
          onChange={setFilter}
          onSearch={() => showToast('ใช้ตัวกรองแล้ว')}
          onReset={() => setFilter(initialFilter())}
        />
        <TabNav current={activeTab} onChange={setActiveTab} recordCount={records.length} />

        {activeTab === 'overview' && <Overview records={records} filter={filter} />}
        {activeTab === 'new' && <NewRecord onSubmit={handleSubmit} submitting={submitting} />}
        {activeTab === 'list' && (
          <RecordList records={records} filter={filter} onDelete={handleDelete} />
        )}
        {activeTab === 'reports' && <Reports records={records} filter={filter} />}
        {activeTab === 'settings' && (
          <Settings recordCount={records.length} onReseed={handleReseed} onClear={handleClear} />
        )}

        <footer className="text-center text-xs text-slate-400 mt-8 pb-4">
          © {new Date().getFullYear() + 543} โรงพยาบาลมหาวิทยาลัยพะเยา · แผนกฝากครรภ์ (ANC)
        </footer>
      </div>

      {toast && (
        <div
          role="status"
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl shadow-lg text-sm text-white ${
            toast.tone === 'ok' ? 'bg-emerald-600' : 'bg-rose-600'
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
