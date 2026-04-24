import type { DeviceTilt } from '../types';
import { isPhoneLevel } from '../lib/deviceOrientation';

interface Props {
  tilt: DeviceTilt;
}

/**
 * Level bubble — แสดงการเอียงของมือถือ 2 แกน
 * สีเขียวเมื่อตรง (ทั้ง pitch และ roll ≤ 3°)
 */
export default function LevelIndicator({ tilt }: Props) {
  const level = isPhoneLevel(tilt);
  const beta = tilt.beta ?? 0;
  const gamma = tilt.gamma ?? 0;

  if (!tilt.supported) {
    return (
      <div className="absolute top-3 left-3 rounded-md bg-black/60 px-2 py-1 text-xs text-white/70">
        ไม่รองรับเซนเซอร์เอียง
      </div>
    );
  }

  const pitchOff = beta - 90;
  const rollOff = gamma;
  const clamp = (v: number) => Math.max(-15, Math.min(15, v));
  const dotX = (clamp(rollOff) / 15) * 30;
  const dotY = (clamp(pitchOff) / 15) * 30;

  return (
    <div className="absolute top-3 left-3 flex items-center gap-2 rounded-md bg-black/60 px-2 py-2 text-xs text-white">
      <div className="relative h-16 w-16 rounded-full border border-white/40">
        {/* crosshair */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-px w-full bg-white/30" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-full w-px bg-white/30" />
        </div>
        <div className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/50" />
        <div
          className={`absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors ${
            level ? 'bg-emerald-400' : 'bg-amber-400'
          }`}
          style={{ transform: `translate(calc(-50% + ${dotX}px), calc(-50% + ${dotY}px))` }}
        />
      </div>
      <div className="leading-tight">
        <div className={level ? 'text-emerald-300 font-semibold' : 'text-amber-300'}>
          {level ? 'ตั้งตรงแล้ว' : 'ปรับให้ตรง'}
        </div>
        <div className="text-white/70">pitch {pitchOff.toFixed(0)}°</div>
        <div className="text-white/70">roll {rollOff.toFixed(0)}°</div>
      </div>
    </div>
  );
}
