import { create } from 'zustand';
import { Medication, MedicationLog } from '../types';
import { readJson, StorageKeys, writeJson } from '../lib/storage';
import { todayIso } from '../lib/thaiDate';
import {
  cancelAllForMedication,
  ensureNotificationSetup,
  scheduleMedicationReminders,
} from '../lib/notifications';

interface State {
  medications: Medication[];
  logs: MedicationLog[];
  loaded: boolean;
  load: () => Promise<void>;
  addMedication: (m: Omit<Medication, 'id' | 'startDate'>) => Promise<void>;
  updateMedication: (id: string, patch: Partial<Medication>) => Promise<void>;
  removeMedication: (id: string) => Promise<void>;
  logDose: (medicationId: string, time: string, taken: boolean) => Promise<void>;
  getTodayLog: (medicationId: string, time: string) => MedicationLog | undefined;
}

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function dailyLogKey(medicationId: string, time: string) {
  return `${todayIso()}::${medicationId}::${time}`;
}

export const useMedicationStore = create<State>((set, get) => ({
  medications: [],
  logs: [],
  loaded: false,
  load: async () => {
    const medications = await readJson<Medication[]>(StorageKeys.medications, []);
    const logs = await readJson<MedicationLog[]>(StorageKeys.medicationLogs, []);
    set({ medications, logs, loaded: true });
  },
  addMedication: async (m) => {
    const med: Medication = { ...m, id: newId(), startDate: todayIso() };
    try {
      const granted = await ensureNotificationSetup();
      if (granted) {
        med.notificationIds = await scheduleMedicationReminders(med);
      }
    } catch {
      // notifications optional — continue without them
    }
    const medications = [...get().medications, med];
    set({ medications });
    await writeJson(StorageKeys.medications, medications);
  },
  updateMedication: async (id, patch) => {
    const current = get().medications.find((m) => m.id === id);
    if (!current) return;
    const next: Medication = { ...current, ...patch };
    const timesChanged = patch.times && patch.times.join('|') !== current.times.join('|');
    const nameOrDoseChanged = patch.name || patch.dosage || patch.notes !== undefined;
    if (timesChanged || nameOrDoseChanged) {
      try {
        await cancelAllForMedication(current.notificationIds ?? []);
        const granted = await ensureNotificationSetup();
        next.notificationIds = granted ? await scheduleMedicationReminders(next) : [];
      } catch {
        // ignore
      }
    }
    const medications = get().medications.map((m) => (m.id === id ? next : m));
    set({ medications });
    await writeJson(StorageKeys.medications, medications);
  },
  removeMedication: async (id) => {
    const target = get().medications.find((m) => m.id === id);
    if (target?.notificationIds?.length) {
      try {
        await cancelAllForMedication(target.notificationIds);
      } catch {
        // ignore
      }
    }
    const medications = get().medications.filter((m) => m.id !== id);
    const logs = get().logs.filter((l) => l.medicationId !== id);
    set({ medications, logs });
    await writeJson(StorageKeys.medications, medications);
    await writeJson(StorageKeys.medicationLogs, logs);
  },
  logDose: async (medicationId, time, taken) => {
    const key = dailyLogKey(medicationId, time);
    const logs = [...get().logs];
    const idx = logs.findIndex((l) => l.id === key);
    const entry: MedicationLog = {
      id: key,
      medicationId,
      dateTime: `${todayIso()}T${time}`,
      taken,
    };
    if (idx >= 0) logs[idx] = entry;
    else logs.push(entry);
    set({ logs });
    await writeJson(StorageKeys.medicationLogs, logs);
  },
  getTodayLog: (medicationId, time) => {
    return get().logs.find((l) => l.id === dailyLogKey(medicationId, time));
  },
}));
