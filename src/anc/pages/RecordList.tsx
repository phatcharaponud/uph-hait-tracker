import { useMemo, useState } from 'react';
import type { ANCRecord, DashboardFilter } from '../types';
import { filterRecords } from '../lib/stats';
import { toThaiDate } from '../lib/thaiDate';

interface Props {
  records: ANCRecord[];
  filter: DashboardFilter;
  onDelete: (id: string) => void;
}

export default function RecordList({ records, filter, onDelete }: Props) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const base = filterRecords(records, filter);
    if (!query.trim()) return base;
    const q = query.trim().toLowerCase();
    return base.filter(
      (r) =>
        r.hn.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.risks.some((risk) => risk.toLowerCase().includes(q))
    );
  }, [records, filter, query]);

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => b.serviceDate.localeCompare(a.serviceDate)),
    [filtered]
  );

  return (
    <section className="bg-white rounded-2xl p-5 shadow-sm">
      <header className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <span aria-hidden>📋</span> รายชื่อหญิงตั้งครรภ์ที่บันทึก
          <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
            {sorted.length} รายการ
          </span>
        </h2>
        <input
          type="search"
          placeholder="ค้นหา HN / ชื่อ / ภาวะเสี่ยง..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm w-full md:w-72 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
        />
      </header>

      {sorted.length === 0 ? (
        <div className="py-16 text-center text-slate-400">
          <div className="text-3xl mb-2" aria-hidden>📭</div>
          ยังไม่มีข้อมูลในช่วงเวลาที่เลือก
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-500 bg-slate-50">
              <tr>
                <th className="py-2.5 px-3 rounded-l-lg">วันที่</th>
                <th className="py-2.5 px-3">HN</th>
                <th className="py-2.5 px-3">ชื่อ-สกุล</th>
                <th className="py-2.5 px-3">อายุ</th>
                <th className="py-2.5 px-3">GA</th>
                <th className="py-2.5 px-3">BP</th>
                <th className="py-2.5 px-3">Hct</th>
                <th className="py-2.5 px-3">ประเภท</th>
                <th className="py-2.5 px-3">ภาวะเสี่ยง</th>
                <th className="py-2.5 px-3 rounded-r-lg text-right"> </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r) => (
                <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50/60">
                  <td className="py-2.5 px-3 whitespace-nowrap">{toThaiDate(r.serviceDate, { short: true })}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-700">{r.hn}</td>
                  <td className="py-2.5 px-3">{r.name}</td>
                  <td className="py-2.5 px-3">{r.age ?? '-'}</td>
                  <td className="py-2.5 px-3">{r.ga ?? '-'}</td>
                  <td className="py-2.5 px-3">
                    {r.bpSystolic && r.bpDiastolic ? `${r.bpSystolic}/${r.bpDiastolic}` : '-'}
                  </td>
                  <td className="py-2.5 px-3">
                    {r.hct != null ? (
                      <span className={r.hct < 33 ? 'text-rose-600 font-medium' : ''}>{r.hct}%</span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{r.serviceType}</td>
                  <td className="py-2.5 px-3">
                    {r.risks.length === 0 ? (
                      <span className="text-slate-400">-</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {r.risks.slice(0, 2).map((risk) => (
                          <span
                            key={risk}
                            className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full"
                          >
                            {risk}
                          </span>
                        ))}
                        {r.risks.length > 2 && (
                          <span className="text-xs text-slate-500">+{r.risks.length - 2}</span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`ลบข้อมูลของ ${r.name} (HN ${r.hn})?`)) onDelete(r.id);
                      }}
                      className="text-rose-500 hover:text-rose-700 text-xs"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
