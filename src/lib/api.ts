const API_URL = import.meta.env.VITE_API_URL as string;

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
        id,
        ...changes,
        updatedBy: userEmail,
      }),
    });
    return await res.json();
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}
