import type { HKAResult, KneeAngleResult, Point2D, PoseFrame, Side } from '../types';
import { LM } from './poseDetection';

/**
 * มุมสามจุด (degrees) หาแบบ interior angle ที่จุด b
 * อิงตามมาตรฐาน goniometry ของ AAOS:
 *   - Knee flexion/extension: fulcrum = lateral epicondyle (knee)
 *     proximal arm = greater trochanter (hip), distal arm = lateral malleolus (ankle)
 *   - Hip-Knee-Ankle (HKA) mechanical axis ใช้จุด center ทั้งสามจุด
 */
export function angleDeg(a: Point2D, b: Point2D, c: Point2D): number {
  const abx = a.x - b.x;
  const aby = a.y - b.y;
  const cbx = c.x - b.x;
  const cby = c.y - b.y;
  const dot = abx * cbx + aby * cby;
  const magAB = Math.hypot(abx, aby);
  const magCB = Math.hypot(cbx, cby);
  if (magAB === 0 || magCB === 0) return NaN;
  const cos = Math.max(-1, Math.min(1, dot / (magAB * magCB)));
  return (Math.acos(cos) * 180) / Math.PI;
}

function minVis(points: Point2D[]): number {
  return Math.min(...points.map((p) => p.visibility ?? 0));
}

/**
 * เลือกด้านขวา/ซ้ายที่เห็นชัดกว่า ถ้าไม่ระบุ
 */
export function pickBetterSide(frame: PoseFrame): Side {
  const lm = frame.landmarks;
  const leftVis = minVis([lm[LM.LEFT_HIP], lm[LM.LEFT_KNEE], lm[LM.LEFT_ANKLE]]);
  const rightVis = minVis([lm[LM.RIGHT_HIP], lm[LM.RIGHT_KNEE], lm[LM.RIGHT_ANKLE]]);
  return rightVis >= leftVis ? 'right' : 'left';
}

/**
 * มุมงอเข่าจากมุมมองด้านข้าง (lateral view)
 * 180° = เหยียดเต็ม (full extension), 0° = งอสุด (hypothetical)
 * flexionDeg = 180 - interiorDeg
 */
export function computeKneeFlexion(frame: PoseFrame, side: Side): KneeAngleResult | null {
  const lm = frame.landmarks;
  const [hip, knee, ankle] =
    side === 'right'
      ? [lm[LM.RIGHT_HIP], lm[LM.RIGHT_KNEE], lm[LM.RIGHT_ANKLE]]
      : [lm[LM.LEFT_HIP], lm[LM.LEFT_KNEE], lm[LM.LEFT_ANKLE]];
  if (minVis([hip, knee, ankle]) < 0.5) return null;
  const interior = angleDeg(hip, knee, ankle);
  if (Number.isNaN(interior)) return null;
  return {
    interiorDeg: interior,
    flexionDeg: 180 - interior,
    side,
  };
}

/**
 * Hip-Knee-Ankle angle สำหรับประเมิน varus/valgus จากมุมมองด้านหน้า
 * ค่าใกล้ 180° = แนวกลไกตรง (neutral)
 * deviationDeg < 0 และเข่าอยู่ด้าน lateral ของเส้น hip-ankle => varus (ขาโก่งออก, โอ)
 * deviationDeg > 0 และเข่าอยู่ด้าน medial ของเส้น hip-ankle => valgus (ขาโก่งเข้า, เอ็กซ์)
 */
export function computeHKA(frame: PoseFrame, side: Side): HKAResult | null {
  const lm = frame.landmarks;
  const [hip, knee, ankle] =
    side === 'right'
      ? [lm[LM.RIGHT_HIP], lm[LM.RIGHT_KNEE], lm[LM.RIGHT_ANKLE]]
      : [lm[LM.LEFT_HIP], lm[LM.LEFT_KNEE], lm[LM.LEFT_ANKLE]];
  if (minVis([hip, knee, ankle]) < 0.5) return null;
  const hka = angleDeg(hip, knee, ankle);
  if (Number.isNaN(hka)) return null;

  // Signed deviation: cross product of (hip→ankle) and (hip→knee) z-component
  // tells us whether the knee lies medial or lateral to the mechanical axis.
  const ha = { x: ankle.x - hip.x, y: ankle.y - hip.y };
  const hk = { x: knee.x - hip.x, y: knee.y - hip.y };
  const cross = ha.x * hk.y - ha.y * hk.x;

  // In image coords (y grows downward), and with the subject facing the camera:
  //  - right leg: medial = negative x relative to hip, lateral = positive x
  //  - left  leg: medial = positive x relative to hip, lateral = negative x
  // We use the sign of the cross product combined with side to classify.
  const magnitude = 180 - hka; // always ≥ 0
  const varusForRight = cross < 0;
  const isVarus = side === 'right' ? varusForRight : !varusForRight;
  const deviation = (isVarus ? -1 : 1) * magnitude;

  let classification: HKAResult['classification'] = 'neutral';
  if (magnitude >= 3) classification = isVarus ? 'varus' : 'valgus';

  return {
    hkaDeg: hka,
    deviationDeg: deviation,
    classification,
    side,
  };
}

/**
 * Smooth values ด้วย EMA (exponential moving average) เพื่อลดการกระตุก
 */
export class EmaSmoother {
  private value: number | null = null;
  constructor(private alpha = 0.35) {}
  push(v: number): number {
    if (this.value === null || !Number.isFinite(this.value)) {
      this.value = v;
    } else {
      this.value = this.alpha * v + (1 - this.alpha) * this.value;
    }
    return this.value;
  }
  reset() {
    this.value = null;
  }
  get current(): number | null {
    return this.value;
  }
}
