import { create } from 'zustand';
import type { Item, StatusValue, SyncStatus, ViewId } from '../types';
import { INITIAL_ITEMS } from '../data/items';
import { listItems, updateItem } from '../lib/api';

interface AppState {
  items: Item[];
  currentView: ViewId;
  syncStatus: SyncStatus;
  syncError: string | null;
  reportMode: boolean;
  highlightItemId: string | null;

  setView: (view: ViewId) => void;
  setReportMode: (on: boolean) => void;
  setHighlightItem: (id: string | null) => void;
  loadItems: () => Promise<void>;
  updateItemField: (id: string, field: string, value: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
  items: INITIAL_ITEMS,
  currentView: 'dashboard',
  syncStatus: 'idle',
  syncError: null,
  reportMode: false,
  highlightItemId: null,

  setView: (view) => {
    set({ currentView: view });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  setReportMode: (on) => set({ reportMode: on }),

  setHighlightItem: (id) => set({ highlightItemId: id }),

  loadItems: async () => {
    set({ syncStatus: 'syncing' });
    const res = await listItems();
    if (res.ok && res.data && res.data.length > 0) {
      // Merge sheet data into local items (keep local start/end/ref for Gantt)
      const local = get().items;
      const merged = local.map((item) => {
        const remote = res.data!.find((r) => r.id === item.id);
        if (!remote) return item;
        return {
          ...item,
          status: (remote.status || item.status) as StatusValue,
          owner: remote.owner || item.owner,
          documentUrl: remote.documentUrl || item.documentUrl,
          notes: remote.notes || item.notes,
        };
      });
      set({ items: merged, syncStatus: 'synced', syncError: null });
    } else if (res.ok) {
      // Sheet is empty — use local data
      set({ syncStatus: 'synced', syncError: null });
    } else {
      set({ syncStatus: 'error', syncError: res.error || 'ไม่สามารถโหลดข้อมูลได้' });
    }
  },

  updateItemField: (id, field, value) => {
    // Optimistic update
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));

    // Sync to backend (fire and forget, update sync indicator)
    set({ syncStatus: 'syncing' });
    updateItem(id, { [field]: value }, 'user@up.ac.th').then((res) => {
      if (res.ok) {
        set({ syncStatus: 'synced', syncError: null });
      } else {
        set({ syncStatus: 'error', syncError: res.error || 'บันทึกไม่สำเร็จ' });
      }
    });
  },
}));

// Helper selectors
export const useItems = () => useStore((s) => s.items);
export const useItemsByCat = (catId: number) =>
  useStore((s) => s.items.filter((i) => i.catId === catId));
export const usePctOf = (catId: number) =>
  useStore((s) => {
    const catItems = s.items.filter((i) => i.catId === catId);
    if (catItems.length === 0) return 0;
    return Math.round(
      (catItems.filter((i) => i.status === 'completed').length / catItems.length) * 100
    );
  });
