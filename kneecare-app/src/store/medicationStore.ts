import { create } from 'zustand';
import { Medication, MedicationLog } from '../types';
import { readJson, StorageKeys, writeJson } from '../lib/storage';
import { todayIso } from '../lib/thaiDate';

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
    const medications = [...get().medications, med];
    set({ medications });
    await writeJson(StorageKeys.medications, medications);
  },
  updateMedication: async (id, patch) => {
    const medications = get().medications.map((m) => (m.id === id ? { ...m, ...patch } : m));
    set({ medications });
    await writeJson(StorageKeys.medications, medications);
  },
  removeMedication: async (id) => {
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
