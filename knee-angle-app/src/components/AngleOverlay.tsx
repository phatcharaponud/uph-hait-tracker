import type { Mode, Point2D, PoseFrame, Side } from '../types';
import { LM } from '../lib/poseDetection';

interface Props {
  frame: PoseFrame | null;
  side: Side;
  mode: Mode;
  displayWidth: number;
  displayHeight: number;
  mirrored: boolean; // true for front-facing camera
  angleLabel?: string;
  badge?: { text: string; tone: 'ok' | 'warn' | 'info' };
}

/**
 * วาดจุด hip-knee-ankle และเส้นกระดูก (thigh, shank) บน SVG overlay
 * ระบบพิกัด: normalized [0..1] × displaySize
 */
export default function AngleOverlay({
  frame,
  side,
  mode,
  displayWidth,
  displayHeight,
  mirrored,
  angleLabel,
  badge,
}: Props) {
  if (!frame) return null;
  const lm = frame.landmarks;

  const idx =
    side === 'right'
      ? { hip: LM.RIGHT_HIP, knee: LM.RIGHT_KNEE, ankle: LM.RIGHT_ANKLE, foot: LM.RIGHT_FOOT_INDEX }
      : { hip: LM.LEFT_HIP, knee: LM.LEFT_KNEE, ankle: LM.LEFT_ANKLE, foot: LM.LEFT_FOOT_INDEX };

  const toPx = (p: Point2D) => ({
    x: (mirrored ? 1 - p.x : p.x) * displayWidth,
    y: p.y * displayHeight,
  });

  const hip = toPx(lm[idx.hip]);
  const knee = toPx(lm[idx.knee]);
  const ankle = toPx(lm[idx.ankle]);
  const foot = toPx(lm[idx.foot]);

  const vis = Math.min(
    lm[idx.hip].visibility ?? 0,
    lm[idx.knee].visibility ?? 0,
    lm[idx.ankle].visibility ?? 0,
  );
  const faded = vis < 0.5;

  // For frontal mode we also draw the mechanical axis line (hip to ankle)
  // so the deviation of the knee from this line is visually obvious.
  return (
    <svg
      className="no-pointer absolute inset-0 h-full w-full"
      viewBox={`0 0 ${displayWidth} ${displayHeight}`}
      preserveAspectRatio="none"
    >
      <g opacity={faded ? 0.35 : 1}>
        {mode === 'frontal' && (
          <line
            x1={hip.x}
            y1={hip.y}
            x2={ankle.x}
            y2={ankle.y}
            stroke="#fbbf24"
            strokeWidth={2}
            strokeDasharray="6 6"
          />
        )}
        {/* Thigh: hip → knee */}
        <line x1={hip.x} y1={hip.y} x2={knee.x} y2={knee.y} stroke="#38bdf8" strokeWidth={4} />
        {/* Shank: knee → ankle */}
        <line x1={knee.x} y1={knee.y} x2={ankle.x} y2={ankle.y} stroke="#38bdf8" strokeWidth={4} />
        {/* Foot segment (reference only) */}
        {mode === 'lateral' && (
          <line
            x1={ankle.x}
            y1={ankle.y}
            x2={foot.x}
            y2={foot.y}
            stroke="#38bdf8"
            strokeWidth={3}
            opacity={0.6}
          />
        )}

        {/* Joint dots */}
        <circle cx={hip.x} cy={hip.y} r={8} fill="#fff" stroke="#1e3a5f" strokeWidth={2} />
        <circle cx={knee.x} cy={knee.y} r={10} fill="#fbbf24" stroke="#1e3a5f" strokeWidth={2} />
        <circle cx={ankle.x} cy={ankle.y} r={8} fill="#fff" stroke="#1e3a5f" strokeWidth={2} />

        <text x={hip.x + 12} y={hip.y - 10} fill="#fff" fontSize={14} fontWeight={600}>
          Hip
        </text>
        <text x={knee.x + 12} y={knee.y - 12} fill="#fbbf24" fontSize={16} fontWeight={700}>
          Knee
        </text>
        <text x={ankle.x + 12} y={ankle.y + 20} fill="#fff" fontSize={14} fontWeight={600}>
          Ankle
        </text>

        {angleLabel && (
          <g>
            <rect
              x={knee.x - 55}
              y={knee.y + 18}
              width={110}
              height={30}
              rx={6}
              fill="rgba(30,58,95,0.85)"
              stroke="#fbbf24"
            />
            <text
              x={knee.x}
              y={knee.y + 38}
              fill="#fbbf24"
              fontSize={18}
              fontWeight={700}
              textAnchor="middle"
            >
              {angleLabel}
            </text>
          </g>
        )}

        {badge && (
          <g transform={`translate(${displayWidth - 10}, 10)`}>
            <rect
              x={-160}
              y={0}
              width={160}
              height={28}
              rx={6}
              fill={
                badge.tone === 'ok'
                  ? 'rgba(16,185,129,0.9)'
                  : badge.tone === 'warn'
                    ? 'rgba(245,158,11,0.9)'
                    : 'rgba(30,58,95,0.9)'
              }
            />
            <text x={-80} y={19} fill="#fff" fontSize={14} fontWeight={600} textAnchor="middle">
              {badge.text}
            </text>
          </g>
        )}
      </g>
    </svg>
  );
}
