const PLACEHOLDER_PATTERNS = [
  'YOUR_DEPLOYMENT_ID',
  'YOUR_CLIENT_ID',
];

function read(name: string): string {
  const value = (import.meta.env[name] ?? '') as string;
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(
      `[env] ${name} is not set. คัดลอก .env.example เป็น .env.local แล้วใส่ค่าจริงก่อนรัน`
    );
  }
  if (PLACEHOLDER_PATTERNS.some((p) => trimmed.includes(p))) {
    throw new Error(
      `[env] ${name} ยังเป็นค่า placeholder — ใส่ค่าจริงใน .env.local`
    );
  }
  return trimmed;
}

export const env = {
  API_URL: read('VITE_API_URL'),
  GOOGLE_CLIENT_ID: read('VITE_GOOGLE_CLIENT_ID'),
} as const;
