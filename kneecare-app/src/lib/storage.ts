import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKeys = {
  patient: 'kc.patient.v1',
  diary: 'kc.diary.v1',
  medications: 'kc.medications.v1',
  medicationLogs: 'kc.medLogs.v1',
} as const;

export async function readJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeJson<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}
