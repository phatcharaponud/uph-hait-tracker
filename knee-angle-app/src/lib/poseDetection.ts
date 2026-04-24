import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';
import type { PoseFrame } from '../types';

// MediaPipe Pose landmark indices (BlazePose 33-point model)
// Reference: https://developers.google.com/mediapipe/solutions/vision/pose_landmarker
export const LM = {
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
  LEFT_HEEL: 29,
  RIGHT_HEEL: 30,
  LEFT_FOOT_INDEX: 31,
  RIGHT_FOOT_INDEX: 32,
} as const;

let landmarker: PoseLandmarker | null = null;
let initPromise: Promise<PoseLandmarker> | null = null;

export async function initPoseLandmarker(): Promise<PoseLandmarker> {
  if (landmarker) return landmarker;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.17/wasm',
    );
    const lm = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task',
        delegate: 'GPU',
      },
      runningMode: 'VIDEO',
      numPoses: 1,
      minPoseDetectionConfidence: 0.5,
      minPosePresenceConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    landmarker = lm;
    return lm;
  })();

  return initPromise;
}

export function detectFrame(video: HTMLVideoElement, timestampMs: number): PoseFrame | null {
  if (!landmarker) return null;
  const result = landmarker.detectForVideo(video, timestampMs);
  const first = result.landmarks?.[0];
  if (!first || first.length === 0) return null;
  return {
    landmarks: first.map((p) => ({ x: p.x, y: p.y, visibility: p.visibility })),
    imageWidth: video.videoWidth,
    imageHeight: video.videoHeight,
    timestampMs,
  };
}

export function disposePoseLandmarker() {
  landmarker?.close();
  landmarker = null;
  initPromise = null;
}
