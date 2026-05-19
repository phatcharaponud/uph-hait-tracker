import type { RiskTally } from '../lib/stats';

interface Props {
  data: RiskTally[];
}

const BADGE_COLORS = ['#f59e0b', '#94a3b8', '#fb923c', '#3b82f6', '#a855f7'];

export default function RiskRanking({ data }: Props) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const top = data.slice(0, 6);
  return (
    <section className="bg-white rounded-2xl p-5 shadow-sm h-full">
      <header className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
          <span aria-hidden>🏆</span> ภาวะเสี่ยงที่พบบ่อย
        </h2>
        <span className="text-xs text-slate-500">มากไปน้อย</span>
      </header>
      {top.length === 0 ? (
        <div className="text-sm text-slate-400 py-10 text-center">ยังไม่มีภาวะเสี่ยงในข้อมูล</div>
      ) : (
        <ol className="space-y-3">
          {top.map((row, i) => (
            <li key={row.name} className="flex items-center gap-3">
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
                style={{ background: BADGE_COLORS[i] ?? '#64748b' }}
              >
                {i + 1}
              </span>
              <span className="text-sm text-slate-700 flex-1 truncate">{row.name}</span>
              <div className="w-32 md:w-44 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{ width: `${(row.count / max) * 100}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-slate-700 w-8 text-right">{row.count}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
