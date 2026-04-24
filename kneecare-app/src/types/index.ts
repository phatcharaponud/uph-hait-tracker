export type SurgeryType = 'none' | 'pre_op' | 'post_op';

export interface PatientProfile {
  name: string;
  birthYear: number | null;
  heightCm: number | null;
  weightKg: number | null;
  surgeryType: SurgeryType;
  surgeryDate: string | null;
  affectedSide: 'left' | 'right' | 'both' | null;
}

export interface Exercise {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  targetMuscle: string;
  sets: number;
  reps: number;
  holdSeconds: number;
  phase: Array<'pre_op' | 'day_0_7' | 'week_2_6' | 'month_3_plus'>;
  cautions: string[];
  videoUrl?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  times: string[];
  startDate: string;
  endDate: string | null;
  notes?: string;
}

export interface MedicationLog {
  id: string;
  medicationId: string;
  dateTime: string;
  taken: boolean;
}

export interface DiaryEntry {
  id: string;
  date: string;
  painScore: number;
  romDegrees: number | null;
  weightKg: number | null;
  swelling: 'none' | 'mild' | 'moderate' | 'severe';
  notes: string;
  exercisesCompleted: string[];
}

export interface TimelinePhase {
  id: string;
  title: string;
  dayFrom: number;
  dayTo: number;
  description: string;
  goals: string[];
  warnings: string[];
}
