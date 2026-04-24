import { create } from 'zustand';
import { DiaryEntry } from '../types';
import { readJson, StorageKeys, writeJson } from '../lib/storage';
import { todayIso } from '../lib/thaiDate';

interface State {
  entries: DiaryEntry[];
  loaded: boolean;
  load: () => Promise<void>;
  upsertToday: (patch: Partial<DiaryEntry>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  getToday: () => DiaryEntry | undefined;
}

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useDiaryStore = create<State>((set, get) => ({
  entries: [],
  loaded: false,
  load: async () => {
    const entries = await readJson<DiaryEntry[]>(StorageKeys.diary, []);
    set({ entries, loaded: true });
  },
  upsertToday: async (patch) => {
    const today = todayIso();
    const entries = [...get().entries];
    const idx = entries.findIndex((e) => e.date === today);
    if (idx >= 0) {
      entries[idx] = { ...entries[idx], ...patch };
    } else {
      entries.unshift({
        id: newId(),
        date: today,
        painScore: 0,
        romDegrees: null,
        weightKg: null,
        swelling: 'none',
        notes: '',
        exercisesCompleted: [],
        ...patch,
      });
    }
    set({ entries });
    await writeJson(StorageKeys.diary, entries);
  },
  remove: async (id) => {
    const entries = get().entries.filter((e) => e.id !== id);
    set({ entries });
    await writeJson(StorageKeys.diary, entries);
  },
  getToday: () => get().entries.find((e) => e.date === todayIso()),
}));
