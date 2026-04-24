export type Side = 'left' | 'right';
export type Mode = 'lateral' | 'frontal';

export interface Point2D {
  x: number; // normalized [0..1]
  y: number; // normalized [0..1]
  visibility?: number;
}

export interface PoseFrame {
  landmarks: Point2D[]; // MediaPipe 33 landmarks (normalized image coords)
  imageWidth: number;
  imageHeight: number;
  timestampMs: number;
}

export interface KneeAngleResult {
  // Lateral view: interior angle at the knee between thigh (hip→knee) and shank (knee→ankle).
  // 180° = full extension, lower value = more flexion. Flexion angle = 180 - interior.
  interiorDeg: number;
  flexionDeg: number;
  side: Side;
}

export interface HKAResult {
  // Frontal view: Hip-Knee-Ankle angle. 180° = neutral alignment.
  // <180° = varus (bow-legged, ขาโก่งออก); >180° = valgus (knock-knee, ขาโก่งเข้า).
  hkaDeg: number;
  deviationDeg: number; // hkaDeg - 180
  classification: 'varus' | 'valgus' | 'neutral';
  side: Side;
}

export interface DeviceTilt {
  // beta = front-to-back tilt (pitch), gamma = left-to-right tilt (roll)
  beta: number | null;
  gamma: number | null;
  supported: boolean;
}
