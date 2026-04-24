import { useEffect, useRef, useState } from 'react';
import type { HKAResult, KneeAngleResult, Mode, PoseFrame, Side } from '../types';
import { detectFrame, initPoseLandmarker } from '../lib/poseDetection';
import {
  EmaSmoother,
  computeHKA,
  computeKneeFlexion,
  pickBetterSide,
} from '../lib/angleCalculation';
import { isPhoneLevel, subscribeOrientation } from '../lib/deviceOrientation';
import AngleOverlay from './AngleOverlay';
import LevelIndicator from './LevelIndicator';
import PositioningGuide from './PositioningGuide';
import MeasurementDisplay from './MeasurementDisplay';

interface Props {
  mode: Mode;
  side: Side | 'auto';
  facing: 'user' | 'environment';
  showGuide: boolean;
  onBack: () => void;
}

export default function CameraView({ mode, side, facing, showGuide, onBack }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const emaRef = useRef(new EmaSmoother(0.35));

  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [frame, setFrame] = useState<PoseFrame | null>(null);
  const [displaySize, setDisplaySize] = useState({ w: 0, h: 0 });
  const [kneeResult, setKneeResult] = useState<KneeAngleResult | null>(null);
  const [hkaResult, setHkaResult] = useState<HKAResult | null>(null);
  const [tilt, setTilt] = useState({ beta: null as number | null, gamma: null as number | null, supported: false });
  const [frozen, setFrozen] = useState<{
    angle: number;
    label: string;
    timestamp: Date;
  } | null>(null);

  const mirrored = facing === 'user';

  // Subscribe to device tilt
  useEffect(() => {
    const unsub = subscribeOrientation(setTilt);
    return unsub;
  }, []);

  // Initialize camera + MediaPipe
  useEffect(() => {
    let stream: MediaStream | null = null;
    let cancelled = false;

    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: facing,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });
        if (cancelled) return;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        await initPoseLandmarker();
        if (cancelled) return;
        setReady(true);
      } catch (e) {
        setError((e as Error).message || 'ไม่สามารถเปิดกล้องได้');
      }
    })();

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [facing]);

  // Resize observer for overlay sizing
  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      setDisplaySize({ w: r.width, h: r.height });
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  // Detection loop
  useEffect(() => {
    if (!ready) return;
    emaRef.current.reset();
    let last = 0;
    const loop = (t: number) => {
      rafRef.current = requestAnimationFrame(loop);
      const video = videoRef.current;
      if (!video || video.readyState < 2) return;
      // Throttle to ~30fps
      if (t - last < 30) return;
      last = t;

      const f = detectFrame(video, t);
      setFrame(f);
      if (!f) {
        setKneeResult(null);
        setHkaResult(null);
        return;
      }
      const chosenSide: Side = side === 'auto' ? pickBetterSide(f) : side;

      if (mode === 'lateral') {
        const r = computeKneeFlexion(f, chosenSide);
        if (r) {
          const smoothed = emaRef.current.push(r.flexionDeg);
          setKneeResult({ ...r, flexionDeg: smoothed, interiorDeg: 180 - smoothed });
        } else {
          setKneeResult(null);
        }
        setHkaResult(null);
      } else {
        const r = computeHKA(f, chosenSide);
        if (r) {
          const smoothed = emaRef.current.push(r.deviationDeg);
          setHkaResult({ ...r, deviationDeg: smoothed, hkaDeg: 180 + smoothed });
        } else {
          setHkaResult(null);
        }
        setKneeResult(null);
      }
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [ready, mode, side]);

  const level = isPhoneLevel(tilt);

  const angleLabel =
    mode === 'lateral' && kneeResult
      ? `${kneeResult.flexionDeg.toFixed(1)}° งอ`
      : mode === 'frontal' && hkaResult
        ? `${Math.abs(hkaResult.deviationDeg).toFixed(1)}° ${
            hkaResult.classification === 'varus'
              ? 'โก่งออก'
              : hkaResult.classification === 'valgus'
                ? 'โก่งเข้า'
                : 'ตรง'
          }`
        : undefined;

  const detected = Boolean(frame);
  const badge = !detected
    ? { text: 'ไม่พบร่างกาย — ยืนเข้ากรอบ', tone: 'warn' as const }
    : !level
      ? { text: 'ปรับมือถือให้ตั้งตรง', tone: 'warn' as const }
      : { text: 'พร้อมวัด', tone: 'ok' as const };

  const handleCapture = () => {
    if (mode === 'lateral' && kneeResult) {
      setFrozen({
        angle: kneeResult.flexionDeg,
        label: `มุมงอเข่า ${kneeResult.side === 'right' ? 'ขวา' : 'ซ้าย'}`,
        timestamp: new Date(),
      });
    } else if (mode === 'frontal' && hkaResult) {
      setFrozen({
        angle: hkaResult.deviationDeg,
        label:
          hkaResult.classification === 'varus'
            ? `ขาโก่งออก (varus) ${hkaResult.side === 'right' ? 'ขวา' : 'ซ้าย'}`
            : hkaResult.classification === 'valgus'
              ? `ขาโก่งเข้า (valgus) ${hkaResult.side === 'right' ? 'ขวา' : 'ซ้าย'}`
              : `แนวขาตรง ${hkaResult.side === 'right' ? 'ขวา' : 'ซ้าย'}`,
        timestamp: new Date(),
      });
    }
  };

  return (
    <div ref={containerRef} className="relative h-[100dvh] w-full overflow-hidden bg-black">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ transform: mirrored ? 'scaleX(-1)' : undefined }}
        playsInline
        muted
      />
      {showGuide && <PositioningGuide mode={mode} displayWidth={displaySize.w} displayHeight={displaySize.h} />}
      <AngleOverlay
        frame={frame}
        side={
          side === 'auto' ? (frame ? pickBetterSide(frame) : 'right') : side
        }
        mode={mode}
        displayWidth={displaySize.w}
        displayHeight={displaySize.h}
        mirrored={mirrored}
        angleLabel={angleLabel}
        badge={badge}
      />
      <LevelIndicator tilt={tilt} />

      <button
        onClick={onBack}
        className="absolute top-3 right-3 rounded-md bg-black/60 px-3 py-2 text-sm text-white"
      >
        ← กลับ
      </button>

      <MeasurementDisplay
        mode={mode}
        kneeResult={kneeResult}
        hkaResult={hkaResult}
        onCapture={handleCapture}
        frozen={frozen}
        onDismissFrozen={() => setFrozen(null)}
        ready={ready && !error}
      />

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 p-6 text-center">
          <div className="max-w-sm">
            <div className="text-lg font-semibold text-red-300">ไม่สามารถเปิดกล้องได้</div>
            <div className="mt-2 text-sm text-white/80">{error}</div>
            <div className="mt-4 text-xs text-white/60">
              ตรวจสอบว่าเบราว์เซอร์ได้รับสิทธิ์กล้อง และเปิดผ่าน HTTPS
            </div>
            <button onClick={onBack} className="mt-4 rounded bg-white/20 px-4 py-2 text-white">
              กลับ
            </button>
          </div>
        </div>
      )}

      {!ready && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
          <div className="text-white">กำลังโหลดโมเดลตรวจจับท่าทาง...</div>
        </div>
      )}
    </div>
  );
}
