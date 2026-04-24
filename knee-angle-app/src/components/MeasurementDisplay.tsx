import type { HKAResult, KneeAngleResult, Mode } from '../types';

interface Props {
  mode: Mode;
  kneeResult: KneeAngleResult | null;
  hkaResult: HKAResult | null;
  onCapture: () => void;
  frozen: { angle: number; label: string; timestamp: Date } | null;
  onDismissFrozen: () => void;
  ready: boolean;
}

function formatDate(d: Date): string {
  const be = d.getFullYear() + 543;
  const months = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
  ];
  const time = d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
  return `${d.getDate()} ${months[d.getMonth()]} ${be} ${time}`;
}

export default function MeasurementDisplay({
  mode,
  kneeResult,
  hkaResult,
  onCapture,
  frozen,
  onDismissFrozen,
  ready,
}: Props) {
  const primary =
    mode === 'lateral'
      ? kneeResult
        ? `${kneeResult.flexionDeg.toFixed(1)}°`
        : '— °'
      : hkaResult
        ? `${hkaResult.deviationDeg >= 0 ? '+' : ''}${hkaResult.deviationDeg.toFixed(1)}°`
        : '— °';

  const caption =
    mode === 'lateral'
      ? kneeResult
        ? `มุมงอเข่า • ${kneeResult.side === 'right' ? 'ขวา' : 'ซ้าย'} • เหยียด = 0° งอเต็ม ≈ 135°`
        : 'รอจับจุด hip-knee-ankle'
      : hkaResult
        ? `${
            hkaResult.classification === 'varus'
              ? 'ขาโก่งออก (varus, ขาโอ)'
              : hkaResult.classification === 'valgus'
                ? 'ขาโก่งเข้า (valgus, ขาเอ็กซ์)'
                : 'แนวกลไก (HKA) ใกล้เคียงตรง'
          } • ${hkaResult.side === 'right' ? 'ขวา' : 'ซ้าย'}`
        : 'รอจับจุด hip-knee-ankle';

  const canCapture = mode === 'lateral' ? !!kneeResult : !!hkaResult;

  return (
    <>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 pb-6 pt-10">
        <div className="mx-auto flex max-w-md flex-col items-center gap-2 text-center">
          <div className="text-5xl font-bold tabular-nums text-white">{primary}</div>
          <div className="text-sm text-white/80">{caption}</div>
          <button
            disabled={!canCapture || !ready}
            onClick={onCapture}
            className="mt-3 h-14 w-14 rounded-full border-4 border-white bg-amber-400 shadow-lg transition active:scale-95 disabled:opacity-40"
            aria-label="บันทึกค่า"
          />
        </div>
      </div>

      {frozen && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-6">
          <div className="w-full max-w-sm rounded-xl bg-[#1e3a5f] p-6 text-white shadow-2xl">
            <div className="text-sm text-white/70">{frozen.label}</div>
            <div className="mt-2 text-5xl font-bold tabular-nums text-amber-300">
              {frozen.angle >= 0 ? '+' : ''}
              {frozen.angle.toFixed(1)}°
            </div>
            <div className="mt-2 text-xs text-white/60">{formatDate(frozen.timestamp)}</div>
            <div className="mt-6 flex gap-2">
              <button
                onClick={onDismissFrozen}
                className="flex-1 rounded-md bg-white/10 px-4 py-2 text-sm"
              >
                วัดใหม่
              </button>
              <button
                onClick={() => {
                  const text = `${frozen.label}: ${frozen.angle.toFixed(1)}° (${formatDate(frozen.timestamp)})`;
                  navigator.clipboard?.writeText(text).catch(() => {});
                  onDismissFrozen();
                }}
                className="flex-1 rounded-md bg-amber-400 px-4 py-2 text-sm font-semibold text-[#1e3a5f]"
              >
                คัดลอก
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
