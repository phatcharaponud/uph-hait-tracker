import type { Mode } from '../types';

interface Props {
  mode: Mode;
  displayWidth: number;
  displayHeight: number;
}

/**
 * แสดงเงาโครงร่างให้ผู้ใช้ยืนจัดท่าให้ตรงกับกรอบ
 * - lateral: ยืนด้านข้างของกล้อง ลำตัวหันข้างให้เต็มเฟรม
 * - frontal: ยืนหน้าตรงเข้ากล้อง ขาแยกประมาณสะโพก
 *
 * ระยะทางแนะนำ ~ 2.5-3 เมตร ให้เห็นเต็มตัวตั้งแต่สะโพกถึงข้อเท้า
 * วางมือถือบน tripod หรือ stand ระดับสะโพกถึงเข่าเพื่อลดมุม parallax
 */
export default function PositioningGuide({ mode, displayWidth, displayHeight }: Props) {
  const cx = displayWidth / 2;
  const cy = displayHeight / 2;
  const h = displayHeight * 0.75;

  return (
    <svg
      className="no-pointer absolute inset-0 h-full w-full"
      viewBox={`0 0 ${displayWidth} ${displayHeight}`}
      preserveAspectRatio="none"
    >
      {/* Safe frame — subject should fill this area */}
      <rect
        x={displayWidth * 0.12}
        y={cy - h / 2}
        width={displayWidth * 0.76}
        height={h}
        rx={12}
        fill="none"
        stroke="rgba(255,255,255,0.35)"
        strokeDasharray="8 8"
        strokeWidth={2}
      />

      {mode === 'lateral' ? <LateralSilhouette cx={cx} cy={cy} h={h} /> : <FrontalSilhouette cx={cx} cy={cy} h={h} />}

      {/* Horizontal levels at hip and ankle heights for visual reference */}
      <line
        x1={displayWidth * 0.08}
        y1={cy - h / 2 + h * 0.35}
        x2={displayWidth * 0.92}
        y2={cy - h / 2 + h * 0.35}
        stroke="rgba(251,191,36,0.4)"
        strokeDasharray="4 6"
      />
      <line
        x1={displayWidth * 0.08}
        y1={cy - h / 2 + h * 0.95}
        x2={displayWidth * 0.92}
        y2={cy - h / 2 + h * 0.95}
        stroke="rgba(251,191,36,0.4)"
        strokeDasharray="4 6"
      />
    </svg>
  );
}

function LateralSilhouette({ cx, cy, h }: { cx: number; cy: number; h: number }) {
  const top = cy - h / 2;
  const headR = h * 0.055;
  const shoulderY = top + h * 0.12;
  const hipY = top + h * 0.4;
  const kneeY = top + h * 0.7;
  const ankleY = top + h * 0.95;
  const offset = h * 0.05;
  const stroke = 'rgba(255,255,255,0.45)';
  return (
    <g fill="none" stroke={stroke} strokeWidth={3} strokeLinecap="round">
      <circle cx={cx + offset * 0.3} cy={top + headR} r={headR} />
      <line x1={cx + offset * 0.3} y1={top + headR * 2} x2={cx + offset * 0.3} y2={shoulderY} />
      <line x1={cx + offset * 0.3} y1={shoulderY} x2={cx + offset} y2={hipY} />
      <line x1={cx + offset} y1={hipY} x2={cx} y2={kneeY} />
      <line x1={cx} y1={kneeY} x2={cx + offset * 0.6} y2={ankleY} />
    </g>
  );
}

function FrontalSilhouette({ cx, cy, h }: { cx: number; cy: number; h: number }) {
  const top = cy - h / 2;
  const headR = h * 0.055;
  const hipHalf = h * 0.08;
  const hipY = top + h * 0.4;
  const kneeY = top + h * 0.7;
  const ankleY = top + h * 0.95;
  const stroke = 'rgba(255,255,255,0.45)';
  return (
    <g fill="none" stroke={stroke} strokeWidth={3} strokeLinecap="round">
      <circle cx={cx} cy={top + headR} r={headR} />
      <line x1={cx} y1={top + headR * 2} x2={cx} y2={hipY} />
      {/* Left leg */}
      <line x1={cx - hipHalf} y1={hipY} x2={cx - hipHalf * 0.6} y2={kneeY} />
      <line x1={cx - hipHalf * 0.6} y1={kneeY} x2={cx - hipHalf * 0.6} y2={ankleY} />
      {/* Right leg */}
      <line x1={cx + hipHalf} y1={hipY} x2={cx + hipHalf * 0.6} y2={kneeY} />
      <line x1={cx + hipHalf * 0.6} y1={kneeY} x2={cx + hipHalf * 0.6} y2={ankleY} />
    </g>
  );
}
