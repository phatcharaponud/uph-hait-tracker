import { env } from './env';

const API_URL = env.API_URL;

export interface ApiResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
}

interface SheetItem {
  id: string;
  catId: number;
  title: string;
  status: string;
  owner: string;
  dueDate: string;
  startDate: string;
  documentUrl: string;
  refUrl: string;
  notes: string;
  updatedAt: string;
  updatedBy: string;
}

export async function listItems(): Promise<ApiResponse<SheetItem[]>> {
  try {
    const res = await fetch(`${API_URL}?action=list`, { cache: 'no-store' });
    return await res.json();
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function updateItem(
  id: string,
  changes: Record<string, string>,
  userEmail: string
): Promise<ApiResponse> {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        action: 'update',
        itemId: id,
        changes,
        userEmail,
      }),
    });
    return await res.json();
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function createItem(
  item: Record<string, unknown>,
  userEmail: string
): Promise<ApiResponse> {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'create', item, userEmail }),
    });
    return await res.json();
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function deleteItem(
  itemId: string,
  userEmail: string
): Promise<ApiResponse> {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'delete', itemId, userEmail }),
    });
    return await res.json();
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

// ===== Admin API =====

export async function isAdmin(email: string): Promise<ApiResponse<{ isAdmin: boolean; role: string }>> {
  try {
    const res = await fetch(`${API_URL}?action=isAdmin&email=${encodeURIComponent(email)}`, { cache: 'no-store' });
    return await res.json();
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function listAdmins(): Promise<ApiResponse<Array<{
  email: string; name: string; role: string; addedBy: string; addedAt: string;
}>>> {
  try {
    const res = await fetch(`${API_URL}?action=listAdmins`, { cache: 'no-store' });
    return await res.json();
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function addAdmin(
  email: string, name: string, role: string, addedBy: string
): Promise<ApiResponse> {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'addAdmin', email, name, role, addedBy }),
    });
    return await res.json();
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function removeAdmin(email: string, removedBy: string): Promise<ApiResponse> {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'removeAdmin', email, removedBy }),
    });
    return await res.json();
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function updateAdminRole(
  email: string, role: string, updatedBy: string
): Promise<ApiResponse> {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'updateAdminRole', email, role, updatedBy }),
    });
    return await res.json();
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}
