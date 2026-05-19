import type { DashboardFilter, ServiceType } from '../types';

const SERVICE_TYPES: ServiceType[] = [
  'ANC ปกติ',
  'ANC ครั้งแรก',
  'ANC ครรภ์เสี่ยงสูง',
  'หลังคลอด',
  'อื่นๆ',
];

interface Props {
  filter: DashboardFilter;
  onChange: (next: DashboardFilter) => void;
  onSearch: () => void;
  onReset: () => void;
}

export default function FilterBar({ filter, onChange, onSearch, onReset }: Props) {
  return (
    <div className="bg-indigo-700/95 rounded-2xl p-3 md:p-4 mb-5 shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3">
        <FieldCard label="ตั้งแต่วันที่">
          <input
            type="date"
            value={filter.from}
            onChange={(e) => onChange({ ...filter, from: e.target.value })}
            className="w-full bg-transparent outline-none text-slate-700"
          />
        </FieldCard>
        <FieldCard label="ถึงวันที่">
          <input
            type="date"
            value={filter.to}
            onChange={(e) => onChange({ ...filter, to: e.target.value })}
            className="w-full bg-transparent outline-none text-slate-700"
          />
        </FieldCard>
        <FieldCard label="มุมมองข้อมูล">
          <select
            value={filter.range}
            onChange={(e) => onChange({ ...filter, range: e.target.value as DashboardFilter['range'] })}
            className="w-full bg-transparent outline-none text-slate-700"
          >
            <option value="day">รายวัน</option>
            <option value="week">รายสัปดาห์</option>
            <option value="month">รายเดือน</option>
            <option value="quarter">รายไตรมาส</option>
            <option value="year">รายปี</option>
          </select>
        </FieldCard>
        <FieldCard label="ประเภทบริการ">
          <select
            value={filter.serviceType}
            onChange={(e) => onChange({ ...filter, serviceType: e.target.value as DashboardFilter['serviceType'] })}
            className="w-full bg-transparent outline-none text-slate-700"
          >
            <option value="all">ทุกประเภท</option>
            {SERVICE_TYPES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </FieldCard>
        <div className="md:col-span-4 flex items-end gap-2">
          <button
            type="button"
            onClick={onSearch}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-2xl transition shadow"
          >
            <span aria-hidden>● </span>ค้นหา
          </button>
          <button
            type="button"
            onClick={onReset}
            className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 rounded-2xl transition shadow"
          >
            ✕ ล้าง
          </button>
        </div>
      </div>
    </div>
  );
}

function FieldCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="md:col-span-2 bg-white rounded-2xl px-4 py-2.5 flex flex-col">
      <span className="text-xs text-slate-500">{label}</span>
      {children}
    </label>
  );
}
