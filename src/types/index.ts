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
  description?: string;
  status: StatusValue;
  owner: string;
  /** Day number (1-based) in the project timeline — derived from startDate. */
  start: number;
  /** Day number (1-based) in the project timeline — derived from dueDate. */
  end: number;
  /** Source-of-truth start date in Thai BE (YYYY-MM-DD), e.g. "2569-02-17". */
  startDate?: string;
  /** Source-of-truth due date in Thai BE (YYYY-MM-DD), e.g. "2569-04-13". */
  dueDate?: string;
  ref: string;
  documentUrl: string;
  notes: string;
}

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

export type ViewId = 'dashboard' | 'gantt' | 'refs' | 'admin' | 'duplicates' | number;

export type UserRole = 'user' | 'admin' | 'superadmin';

export interface User {
  email: string;
  name: string;
  picture: string;
  role: UserRole;
}

export interface AdminRecord {
  email: string;
  name: string;
  role: UserRole;
  addedBy: string;
  addedAt: string;
}
