import { useState } from 'react';
import type { Mode, Side } from '../types';
import { requestOrientationPermission } from '../lib/deviceOrientation';

interface Props {
  onStart: (opts: { mode: Mode; side: Side | 'auto'; facing: 'user' | 'environment'; showGuide: boolean }) => void;
}

export default function StartScreen({ onStart }: Props) {
  const [mode, setMode] = useState<Mode>('lateral');
  const [side, setSide] = useState<Side | 'auto'>('auto');
  const [facing, setFacing] = useState<'user' | 'environment'>('environment');
  const [showGuide, setShowGuide] = useState(true);

  const handleStart = async () => {
    await requestOrientationPermission();
    onStart({ mode, side, facing, showGuide });
  };

  return (
    <div className="min-h-[100dvh] bg-[#0b1220] text-white">
      <div className="mx-auto max-w-xl px-5 pb-12 pt-6">
        <header className="mb-6">
          <div className="text-amber-300 text-sm">โรงพยาบาลมหาวิทยาลัยพะเยา</div>
          <h1 className="mt-1 text-2xl font-bold">วัดมุมเข่าด้วยกล้องมือถือ</h1>
          <p className="mt-1 text-sm text-white/70">
            วิเคราะห์มุมงอเข่า / เหยียดขา และมุมโก่งขา ด้วย MediaPipe Pose
            ตามจุดอ้างอิงมาตรฐาน (Hip – Knee – Ankle)
          </p>
        </header>

        <section className="mb-5 rounded-xl border border-white/10 bg-white/5 p-4">
          <h2 className="mb-2 text-sm font-semibold text-amber-300">เลือกโหมดการวัด</h2>
          <div className="grid grid-cols-1 gap-2">
            <ModeCard
              selected={mode === 'lateral'}
              onClick={() => setMode('lateral')}
              title="มุมงอ/เหยียดเข่า (ด้านข้าง)"
              subtitle="วางกล้องด้านข้าง ผู้ป่วยนั่ง/นอน ให้เห็น สะโพก–เข่า–ข้อเท้า ครบถ้วน"
              hint="0° = เหยียดเต็ม, 135°+ = งอสุด"
            />
            <ModeCard
              selected={mode === 'frontal'}
              onClick={() => setMode('frontal')}
              title="มุมโก่งขา (หน้าตรง, HKA)"
              subtitle="ยืนหน้าตรงเข้ากล้อง ส้นเท้าห่างเท่าสะโพก ลูกสะบ้าหันไปข้างหน้า"
              hint="Varus (ขาโอ) หรือ Valgus (ขาเอ็กซ์) เทียบแนว Hip–Knee–Ankle"
            />
          </div>
        </section>

        <section className="mb-5 rounded-xl border border-white/10 bg-white/5 p-4">
          <h2 className="mb-2 text-sm font-semibold text-amber-300">ตัวเลือก</h2>
          <Row label="ข้างที่วัด">
            <SegBtn selected={side === 'auto'} onClick={() => setSide('auto')} label="อัตโนมัติ" />
            <SegBtn selected={side === 'left'} onClick={() => setSide('left')} label="ซ้าย" />
            <SegBtn selected={side === 'right'} onClick={() => setSide('right')} label="ขวา" />
          </Row>
          <Row label="กล้อง">
            <SegBtn
              selected={facing === 'environment'}
              onClick={() => setFacing('environment')}
              label="หลัง (แนะนำ)"
            />
            <SegBtn selected={facing === 'user'} onClick={() => setFacing('user')} label="หน้า" />
          </Row>
          <Row label="แสดงเงาจัดท่า">
            <SegBtn selected={showGuide} onClick={() => setShowGuide(true)} label="เปิด" />
            <SegBtn selected={!showGuide} onClick={() => setShowGuide(false)} label="ปิด" />
          </Row>
        </section>

        <section className="mb-5 rounded-xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed">
          <h2 className="mb-2 text-sm font-semibold text-amber-300">วิธีจัดท่าให้แม่นยำ</h2>
          <ol className="list-decimal space-y-1.5 pl-5 text-white/85">
            <li>
              วางมือถือบน <b>ขาตั้ง / tripod</b> ระดับ <b>เดียวกับข้อเข่า</b>{' '}
              เพื่อลด parallax error (มุมเอียงจากการถือกล้องสูง/ต่ำเกิน)
            </li>
            <li>ใช้ระดับน้ำดิจิทัลในจอ (มุมซ้ายบน) ให้จุดเขียว = มือถือตั้งตรงทั้ง pitch และ roll</li>
            <li>
              ผู้ป่วยอยู่ห่าง <b>~2.5–3 เมตร</b> เห็นเต็มตัวตั้งแต่สะโพกถึงฝ่าเท้า ฉากหลังเรียบ แสงสว่างเพียงพอ
            </li>
            <li>
              โหมดด้านข้าง: ให้สะโพก เข่า และข้อเท้า <b>อยู่ในแนวเดียวกับกล้อง</b>{' '}
              สวมกางเกงสั้น/กางเกงรัดรูปเพื่อให้เห็น landmark ชัด
            </li>
            <li>
              โหมดหน้าตรง: ยืนเท้าแยกกว้างเท่าสะโพก <b>ลูกสะบ้าชี้ตรงไปข้างหน้า</b>{' '}
              ห้ามหมุนเท้าเข้า/ออก (จะทำให้ค่า varus/valgus คลาดเคลื่อน)
            </li>
            <li>ถ่ายภาพหลายครั้ง (≥3) แล้วใช้ค่าเฉลี่ย จะลด noise ของโมเดลได้</li>
          </ol>
        </section>

        <section className="mb-6 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-xs text-amber-100">
          <b>ข้อจำกัด:</b> การวัดนี้ใช้ visual landmark จากภาพ 2D
          จึงเหมาะสำหรับ <b>คัดกรอง/ติดตามแนวโน้ม</b> ไม่ใช่การวินิจฉัย
          ผลจะไม่เท่ากับ goniometer หรือ full-length standing radiograph
          โดยมีความคลาดเคลื่อนทั่วไป ±3–5°
        </section>

        <button
          onClick={handleStart}
          className="w-full rounded-xl bg-amber-400 py-4 text-lg font-bold text-[#1e3a5f] shadow-lg active:scale-[0.99]"
        >
          เริ่มวัด
        </button>
      </div>
    </div>
  );
}

function ModeCard({
  selected,
  onClick,
  title,
  subtitle,
  hint,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  subtitle: string;
  hint: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg border p-3 text-left transition ${
        selected
          ? 'border-amber-400 bg-amber-400/10'
          : 'border-white/10 bg-transparent hover:border-white/30'
      }`}
    >
      <div className="font-semibold">{title}</div>
      <div className="mt-0.5 text-sm text-white/75">{subtitle}</div>
      <div className="mt-1 text-xs text-amber-300/90">{hint}</div>
    </button>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-2 flex items-center justify-between gap-3">
      <div className="text-sm text-white/80">{label}</div>
      <div className="flex gap-1.5">{children}</div>
    </div>
  );
}

function SegBtn({ selected, onClick, label }: { selected: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-3 py-1.5 text-sm transition ${
        selected ? 'bg-amber-400 text-[#1e3a5f] font-semibold' : 'bg-white/10 text-white/80'
      }`}
    >
      {label}
    </button>
  );
}
