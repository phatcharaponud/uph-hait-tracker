import { useMemo } from 'react';
import StatCard from '../components/StatCard';
import TrendChart from '../components/TrendChart';
import RiskRanking from '../components/RiskRanking';
import { computeOverview, computeRiskRanking, computeTrend, filterRecords } from '../lib/stats';
import type { ANCRecord, DashboardFilter } from '../types';

interface Props {
  records: ANCRecord[];
  filter: DashboardFilter;
}

const RANGE_LABELS: Record<DashboardFilter['range'], string> = {
  day: 'รายวัน',
  week: 'รายสัปดาห์',
  month: 'รายเดือน',
  quarter: 'รายไตรมาส',
  year: 'รายปี',
};

export default function Overview({ records, filter }: Props) {
  const filtered = useMemo(() => filterRecords(records, filter), [records, filter]);
  const stats = useMemo(() => computeOverview(filtered), [filtered]);
  const trend = useMemo(() => computeTrend(filtered, filter.range), [filtered, filter.range]);
  const ranking = useMemo(() => computeRiskRanking(filtered), [filtered]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
        <StatCard
          label="การมารับบริการ ANC"
          value={stats.total}
          caption="ครั้งทั้งหมด"
          icon="🤰"
          gradient="linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)"
        />
        <StatCard
          label="ฝากครรภ์ครั้งแรก"
          value={stats.firstVisit}
          caption="รายใหม่"
          icon="📝"
          gradient="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
        />
        <StatCard
          label="ฝากก่อน 12 สัปดาห์"
          value={stats.earlyANC}
          caption="ANC คุณภาพ"
          icon="⏱️"
          gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
        />
        <StatCard
          label="ANC ครบ 5 ครั้ง"
          value={stats.fiveVisitsComplete}
          caption="ตามเกณฑ์"
          icon="✅"
          gradient="linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)"
        />
        <StatCard
          label="ครรภ์เสี่ยงสูง"
          value={stats.highRisk}
          caption="ต้องเฝ้าระวัง"
          icon="⚠️"
          gradient="linear-gradient(135deg, #f97316 0%, #ea580c 100%)"
        />
        <StatCard
          label="ภาวะโลหิตจาง"
          value={stats.anemia}
          caption="Hct < 33%"
          icon="🩸"
          gradient="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <TrendChart data={trend} rangeLabel={RANGE_LABELS[filter.range]} />
        <RiskRanking data={ranking} />
      </div>
    </div>
  );
}
