import type { DeviceTilt } from '../types';

type Listener = (tilt: DeviceTilt) => void;

let listeners = new Set<Listener>();
let attached = false;
let lastTilt: DeviceTilt = { beta: null, gamma: null, supported: false };

function handle(event: DeviceOrientationEvent) {
  lastTilt = {
    beta: event.beta,
    gamma: event.gamma,
    supported: true,
  };
  listeners.forEach((l) => l(lastTilt));
}

export async function requestOrientationPermission(): Promise<boolean> {
  // iOS 13+ requires explicit permission; Android usually does not.
  const AnyEvent = DeviceOrientationEvent as unknown as {
    requestPermission?: () => Promise<'granted' | 'denied'>;
  };
  if (typeof AnyEvent.requestPermission === 'function') {
    try {
      const res = await AnyEvent.requestPermission();
      return res === 'granted';
    } catch {
      return false;
    }
  }
  return true;
}

export function subscribeOrientation(listener: Listener): () => void {
  listeners.add(listener);
  if (!attached && typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
    window.addEventListener('deviceorientation', handle, true);
    attached = true;
  }
  // Push last value immediately for UI warmup
  listener(lastTilt);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && attached) {
      window.removeEventListener('deviceorientation', handle, true);
      attached = false;
    }
  };
}

/**
 * ตรวจว่ามือถือตั้งตรงหรือไม่ (portrait, กล้องตั้งฉากกับแนวดิ่ง)
 * threshold: องศาที่ยอมรับได้ (ค่าแนะนำ 2-3°)
 */
export function isPhoneLevel(tilt: DeviceTilt, threshold = 3): boolean {
  if (!tilt.supported || tilt.beta === null || tilt.gamma === null) return false;
  // portrait hold upright: beta ≈ 90°, gamma ≈ 0°
  const betaDiff = Math.abs(tilt.beta - 90);
  const gammaDiff = Math.abs(tilt.gamma);
  return betaDiff <= threshold && gammaDiff <= threshold;
}
