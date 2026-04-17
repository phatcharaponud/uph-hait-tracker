import { useState, useRef, useEffect } from 'react';
import { HAIT_CATEGORIES } from '../data/categories';
import { STATUSES } from '../data/statuses';
import { useStore } from '../store/useStore';
import { ZoomIn, ZoomOut, FileDown } from 'lucide-react';
import { exportGanttPdf } from '../lib/exportPdf';
import { TOTAL_DAYS, dayToDate, todayDayNumber, getMonthSegments, dayNumberToDayOfMonth, dayToDateFull } from '../lib/date';

const TODAY = todayDayNumber();
const ZOOM_LEVELS = [8, 11, 14, 18, 22];
const SMALL_SCREEN_PX = 640; // Tailwind `sm` breakpoint

export default function GanttChart() {
  const items = useStore((s) => s.items);
  const [isSmallScreen, setIsSmallScreen] = useState(
    typeof window !== 'undefined' && window.innerWidth < SMALL_SCREEN_PX
  );
  const [zoomIdx, setZoomIdx] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < SMALL_SCREEN_PX ? 0 : 1
  );
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${SMALL_SCREEN_PX - 1}px)`);
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setIsSmallScreen(e.matches);
    handler(mq);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const colW = ZOOM_LEVELS[zoomIdx];
  const labelW = isSmallScreen ? 120 : 200;
  const rowH = 22;
  const catHeaderH = 24;

  const zoomIn = () => setZoomIdx((i) => Math.min(i + 1, ZOOM_LEVELS.length - 1));
  const zoomOut = () => setZoomIdx((i) => Math.max(i - 1, 0));

  const showTooltip = (e: React.MouseEvent, text: string) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top - 40, text });
  };

  return (
    <div className="md:h-[calc(100vh-64px)] md:overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-navy">📅 Gantt Chart</h2>
          <p className="text-slate-500 text-xs">
            {dayToDateFull(1)} – {dayToDateFull(TOTAL_DAYS)} · เส้นแดง = วันนี้
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="ดาวน์โหลด Gantt Chart เป็น PDF"
            onClick={() => exportGanttPdf()}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-white hover:opacity-90"
            style={{ background: '#1e3a5f' }}
            title="ดาวน์โหลด Gantt Chart เป็น PDF"
          >
            <FileDown size={13} aria-hidden="true" /> 📄 PDF
          </button>
          <div className="flex items-center gap-1" role="group" aria-label="ซูม Gantt">
            <button type="button" aria-label="ซูมออก" onClick={zoomOut} disabled={zoomIdx === 0} className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30" title="ซูมออก">
              <ZoomOut size={16} aria-hidden="true" />
            </button>
            <span className="text-[10px] text-slate-500 w-8 text-center" aria-live="polite">{colW}px</span>
            <button type="button" aria-label="ซูมเข้า" onClick={zoomIn} disabled={zoomIdx === ZOOM_LEVELS.length - 1} className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30" title="ซูมเข้า">
              <ZoomIn size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Gantt body */}
      <div className="gantt-capture bg-white rounded-xl shadow-sm overflow-auto flex-1 relative" ref={containerRef}>
        <div style={{ minWidth: labelW + colW * TOTAL_DAYS }}>
          {/* Month header */}
          <div className="flex text-white text-[10px] font-semibold sticky top-0 z-10">
            <div className="shrink-0 px-2 py-1 sticky left-0 z-20" style={{ width: labelW, background: '#1e3a5f' }}>
              รายการ
            </div>
            {getMonthSegments().map((seg, idx) => (
              <div
                key={`${seg.year}-${seg.monthIndex}`}
                className={`py-1 text-center border-l border-white/30 ${idx % 2 === 1 ? 'bg-red-600' : ''}`}
                style={{ width: colW * seg.dayCount, background: idx % 2 === 0 ? '#1e3a5f' : undefined }}
              >
                {seg.label}
              </div>
            ))}
          </div>

          {/* Day numbers */}
          <div className="flex bg-slate-50 border-b text-[8px] text-slate-500 sticky top-[22px] z-10">
            <div className="shrink-0 sticky left-0 z-20 bg-slate-50" style={{ width: labelW }} />
            {Array.from({ length: TOTAL_DAYS }, (_, i) => {
              const dayNum = i + 1;
              const d = dayNumberToDayOfMonth(dayNum);
              const isToday = dayNum === TODAY;
              return (
                <div
                  key={i}
                  className={`text-center border-l border-slate-200 ${isToday ? 'bg-red-100 font-bold text-red-700' : ''}`}
                  style={{ width: colW, lineHeight: '16px' }}
                >
                  {d % 2 === 1 || colW >= 14 ? d : ''}
                </div>
              );
            })}
          </div>

          {/* Rows grouped by category */}
          {HAIT_CATEGORIES.map((cat) => {
            const catId = cat.id as number;
            const catItems = items.filter((i) => i.catId === catId);
            return (
              <div key={catId}>
                {/* Category header */}
                <div
                  className="flex items-center px-2 font-semibold text-[10px] border-y sticky left-0"
                  style={{ background: `${cat.color}15`, color: cat.color, height: catHeaderH }}
                >
                  <span className="mr-1">{cat.icon}</span>
                  {cat.code}
                </div>

                {/* Items */}
                {catItems.map((it) => {
                  const st = STATUSES[it.status];
                  const barLeft = (it.start - 1) * colW + 1;
                  const barWidth = (it.end - it.start + 1) * colW - 2;
                  const tooltipText = `${it.id} ${it.title}\n${dayToDate(it.start)} → ${dayToDate(it.end)}\n${st.label} · 👤 ${it.owner}`;

                  return (
                    <div
                      key={it.id}
                      className="flex items-center border-b border-slate-100/60 hover:bg-slate-50/50"
                      style={{ height: rowH }}
                    >
                      {/* Label */}
                      <div
                        className="shrink-0 px-2 flex items-center gap-1 sticky left-0 bg-white z-[1]"
                        style={{ width: labelW, height: rowH }}
                      >
                        <span className="text-[8px] text-slate-400 font-mono shrink-0">{it.id}</span>
                        <span className="text-[10px] text-slate-700 truncate" title={it.title}>
                          {it.title}
                        </span>
                      </div>

                      {/* Bar area */}
                      <div className="relative" style={{ width: colW * TOTAL_DAYS, height: rowH }}>
                        {/* Today line */}
                        <div
                          className="absolute top-0 bottom-0 w-px bg-red-500 z-[2]"
                          style={{ left: (TODAY - 1) * colW + colW / 2 }}
                        />
                        {/* Gantt bar */}
                        <div
                          className="absolute rounded-sm cursor-pointer hover:brightness-110 transition-all"
                          style={{
                            left: barLeft,
                            width: Math.max(barWidth, 3),
                            top: 4,
                            height: rowH - 8,
                            background: st.color,
                          }}
                          onMouseEnter={(e) => showTooltip(e, tooltipText)}
                          onMouseLeave={() => setTooltip(null)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute bg-slate-800 text-white text-[10px] px-2.5 py-1.5 rounded-lg shadow-lg z-30 pointer-events-none whitespace-pre-line"
            style={{ left: tooltip.x, top: tooltip.y }}
          >
            {tooltip.text}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl shadow-sm mt-2 px-3 py-2 flex flex-wrap gap-3 text-xs items-center shrink-0">
        <span className="font-semibold text-navy text-[10px]">สถานะ:</span>
        {Object.values(STATUSES).map((s) => (
          <div key={s.value} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm" style={{ background: s.color }} />
            <span className="text-[10px]">{s.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1 ml-auto">
          <div className="w-px h-3 bg-red-500" />
          <span className="text-[10px]">วันนี้</span>
        </div>
      </div>
    </div>
  );
}
