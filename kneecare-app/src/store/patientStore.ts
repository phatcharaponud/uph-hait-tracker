import { create } from 'zustand';
import { PatientProfile } from '../types';
import { readJson, StorageKeys, writeJson } from '../lib/storage';

interface State {
  profile: PatientProfile;
  loaded: boolean;
  load: () => Promise<void>;
  update: (patch: Partial<PatientProfile>) => Promise<void>;
  reset: () => Promise<void>;
}

const DEFAULT_PROFILE: PatientProfile = {
  name: '',
  birthYear: null,
  heightCm: null,
  weightKg: null,
  surgeryType: 'none',
  surgeryDate: null,
  affectedSide: null,
};

export const usePatientStore = create<State>((set, get) => ({
  profile: DEFAULT_PROFILE,
  loaded: false,
  load: async () => {
    const profile = await readJson<PatientProfile>(StorageKeys.patient, DEFAULT_PROFILE);
    set({ profile, loaded: true });
  },
  update: async (patch) => {
    const next = { ...get().profile, ...patch };
    set({ profile: next });
    await writeJson(StorageKeys.patient, next);
  },
  reset: async () => {
    set({ profile: DEFAULT_PROFILE });
    await writeJson(StorageKeys.patient, DEFAULT_PROFILE);
  },
}));
