import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { computeOverview, computeRiskRanking, filterRecords } from '../lib/stats';
import type { ANCRecord, DashboardFilter } from '../types';

interface Props {
  records: ANCRecord[];
  filter: DashboardFilter;
}

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#a855f7'];

export default function Reports({ records, filter }: Props) {
  const filtered = useMemo(() => filterRecords(records, filter), [records, filter]);
  const stats = useMemo(() => computeOverview(filtered), [filtered]);
  const ranking = useMemo(() => computeRiskRanking(filtered).slice(0, 8), [filtered]);

  const serviceTypeDist = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of filtered) m.set(r.serviceType, (m.get(r.serviceType) ?? 0) + 1);
    return Array.from(m.entries()).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const ageDist = useMemo(() => {
    const buckets = { '<20': 0, '20-29': 0, '30-34': 0, '35-39': 0, '≥40': 0 } as Record<string, number>;
    for (const r of filtered) {
      const a = r.age ?? -1;
      if (a < 0) continue;
      if (a < 20) buckets['<20']++;
      else if (a < 30) buckets['20-29']++;
      else if (a < 35) buckets['30-34']++;
      else if (a < 40) buckets['35-39']++;
      else buckets['≥40']++;
    }
    return Object.entries(buckets).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  return (
    <div className="space-y-5">
      <section className="bg-white rounded-2xl p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <span aria-hidden>📊</span> รายงานสรุปตัวชี้วัด ANC
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <SummaryItem label="ครั้งทั้งหมด" value={stats.total} tone="indigo" />
          <SummaryItem label="ฝากครรภ์ครั้งแรก" value={stats.firstVisit} tone="blue" />
          <SummaryItem label="ฝากก่อน 12 สัปดาห์" value={stats.earlyANC} tone="amber" />
          <SummaryItem label="ANC ครบ 5 ครั้ง" value={stats.fiveVisitsComplete} tone="purple" />
          <SummaryItem label="ครรภ์เสี่ยงสูง" value={stats.highRisk} tone="orange" />
          <SummaryItem label="ภาวะโลหิตจาง" value={stats.anemia} tone="rose" />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-800 mb-3">สัดส่วนประเภทบริการ</h3>
          {serviceTypeDist.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-400 text-sm">ไม่มีข้อมูล</div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={serviceTypeDist} dataKey="value" nameKey="name" outerRadius={90} label>
                    {serviceTypeDist.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        <section className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-800 mb-3">การกระจายช่วงอายุ</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={ageDist}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="text-base font-semibold text-slate-800 mb-3">10 อันดับภาวะเสี่ยงที่พบบ่อย</h3>
        {ranking.length === 0 ? (
          <div className="text-slate-400 text-sm py-6 text-center">ไม่มีข้อมูลภาวะเสี่ยง</div>
        ) : (
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={ranking} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#94a3b8" allowDecimals={false} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" width={180} />
                <Tooltip />
                <Bar dataKey="count" fill="#f59e0b" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>
    </div>
  );
}

const TONE: Record<string, string> = {
  indigo: 'bg-indigo-50 text-indigo-700',
  blue: 'bg-blue-50 text-blue-700',
  amber: 'bg-amber-50 text-amber-700',
  purple: 'bg-purple-50 text-purple-700',
  orange: 'bg-orange-50 text-orange-700',
  rose: 'bg-rose-50 text-rose-700',
};

function SummaryItem({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className={`rounded-xl p-3 ${TONE[tone]}`}>
      <div className="text-xs">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
