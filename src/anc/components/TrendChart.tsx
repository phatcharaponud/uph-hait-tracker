import {
  Area,
  CartesianGrid,
  Legend,
  Line,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { TrendPoint } from '../lib/stats';

interface Props {
  data: TrendPoint[];
  rangeLabel: string;
}

export default function TrendChart({ data, rangeLabel }: Props) {
  return (
    <section className="bg-white rounded-2xl p-5 shadow-sm h-full">
      <header className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
          <span aria-hidden>📈</span> แนวโน้มการมารับบริการ ANC
        </h2>
        <span className="text-xs text-slate-500">{rangeLabel}</span>
      </header>
      {data.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
              <defs>
                <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                  fontSize: 13,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 13 }} />
              <Area
                type="monotone"
                name="ครั้งทั้งหมด"
                dataKey="total"
                stroke="#2563eb"
                strokeWidth={2.5}
                fill="url(#totalGrad)"
              />
              <Line
                type="monotone"
                name="ฝากครรภ์ครั้งแรก"
                dataKey="firstVisit"
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                name="ครรภ์เสี่ยงสูง"
                dataKey="highRisk"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

function EmptyState() {
  return (
    <div className="h-72 flex flex-col items-center justify-center text-slate-400 text-sm">
      <span className="text-3xl mb-2" aria-hidden>📉</span>
      ยังไม่มีข้อมูลในช่วงเวลาที่เลือก
    </div>
  );
}
