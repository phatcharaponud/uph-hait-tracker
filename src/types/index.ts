export type StatusValue = 'not_started' | 'in_progress' | 'completed' | 'needs_revision';

export interface Status {
  value: StatusValue;
  label: string;
  color: string;
  bg: string;
}

export interface Category {
  id: number | string;
  icon: string;
  code: string;
  name: string;
  color: string;
}

export interface Item {
  id: string;
  catId: number;
  title: string;
  status: StatusValue;
  owner: string;
  start: number;
  end: number;
  ref: string;
  documentUrl: string;
  notes: string;
}

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

export type ViewId = 'dashboard' | 'gantt' | 'refs' | number;
