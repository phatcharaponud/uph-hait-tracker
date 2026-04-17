import { create } from 'zustand';
import type { Item, StatusValue, SyncStatus, ViewId, User, UserRole } from '../types';
import { INITIAL_ITEMS } from '../data/items';
import { listItems, updateItem, isAdmin as checkIsAdmin } from '../lib/api';
import { jwtDecode } from 'jwt-decode';

const USER_STORAGE_KEY = 'hait_user';
const USER_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

interface StoredUser {
  user: User;
  expiresAt: number;
}

// sessionStorage clears when the browser/tab closes; this limits exposure
// of name/email/role/picture compared to localStorage.
function storage(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.sessionStorage : null;
  } catch {
    return null;
  }
}

function loadStoredUser(): User | null {
  const s = storage();
  if (!s) return null;
  try {
    const raw = s.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    const stored: StoredUser = JSON.parse(raw);
    if (Date.now() > stored.expiresAt) {
      s.removeItem(USER_STORAGE_KEY);
      return null;
    }
    return stored.user;
  } catch {
    s.removeItem(USER_STORAGE_KEY);
    return null;
  }
}

function saveStoredUser(user: User) {
  const s = storage();
  if (!s) return;
  // One-time migration: purge any prior copy in localStorage so we don't leak it.
  try {
    if (typeof window !== 'undefined') window.localStorage.removeItem(USER_STORAGE_KEY);
  } catch {
    /* ignore */
  }
  const stored: StoredUser = { user, expiresAt: Date.now() + USER_EXPIRY_MS };
  s.setItem(USER_STORAGE_KEY, JSON.stringify(stored));
}

function clearStoredUser() {
  const s = storage();
  s?.removeItem(USER_STORAGE_KEY);
  try {
    if (typeof window !== 'undefined') window.localStorage.removeItem(USER_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

interface AppState {
  items: Item[];
  currentView: ViewId;
  syncStatus: SyncStatus;
  syncError: string | null;
  reportMode: boolean;
  user: User | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  highlightItemId: string | null;
  toast: string | null;

  setView: (view: ViewId) => void;
  setReportMode: (on: boolean) => void;
  setHighlightItem: (id: string | null) => void;
  showToast: (msg: string) => void;
  loadItems: () => Promise<void>;
  updateItemField: (id: string, field: string, value: string) => void;
  updateItemNumField: (id: string, field: string, value: number) => void;
  addItem: (item: Item) => void;
  removeItem: (id: string) => void;
  login: (credential: string) => Promise<void>;
  logout: () => void;
  refreshAdminStatus: () => Promise<void>;
}

const initialUser = loadStoredUser();

export const useStore = create<AppState>((set, get) => ({
  items: INITIAL_ITEMS,
  currentView: 'dashboard',
  syncStatus: 'idle',
  syncError: null,
  reportMode: false,
  user: initialUser,
  isAdmin: initialUser?.role === 'admin' || initialUser?.role === 'superadmin',
  isSuperAdmin: initialUser?.role === 'superadmin',
  highlightItemId: null,
  toast: null,

  setView: (view) => {
    set({ currentView: view });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  setReportMode: (on) => set({ reportMode: on }),

  setHighlightItem: (id) => set({ highlightItemId: id }),

  showToast: (msg) => {
    set({ toast: msg });
    setTimeout(() => set({ toast: null }), 2500);
  },

  loadItems: async () => {
    set({ syncStatus: 'syncing' });
    const res = await listItems();
    if (res.ok && res.data && res.data.length > 0) {
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
      set({ syncStatus: 'synced', syncError: null });
    } else {
      set({ syncStatus: 'error', syncError: res.error || 'ไม่สามารถโหลดข้อมูลได้' });
    }
  },

  updateItemField: (id, field, value) => {
    const user = get().user;
    const email = user?.email || 'anonymous';
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
    set({ syncStatus: 'syncing' });
    updateItem(id, { [field]: value }, email).then((res) => {
      if (res.ok) {
        set({ syncStatus: 'synced', syncError: null });
        get().showToast('บันทึกแล้ว');
      } else {
        set({ syncStatus: 'error', syncError: res.error || 'บันทึกไม่สำเร็จ' });
      }
    });
  },

  updateItemNumField: (id, field, value) => {
    const user = get().user;
    const email = user?.email || 'anonymous';
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
    set({ syncStatus: 'syncing' });
    updateItem(id, { [field]: String(value) }, email).then((res) => {
      if (res.ok) {
        set({ syncStatus: 'synced', syncError: null });
        get().showToast('บันทึกแล้ว');
      } else {
        set({ syncStatus: 'error', syncError: res.error || 'บันทึกไม่สำเร็จ' });
      }
    });
  },

  addItem: (item) => {
    set((state) => ({ items: [...state.items, item] }));
    get().showToast('เพิ่มรายการแล้ว');
  },

  removeItem: (id) => {
    set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
    get().showToast('ลบรายการแล้ว');
  },

  login: async (credential: string) => {
    try {
      const decoded = jwtDecode<{
        email: string;
        name: string;
        picture: string;
        hd?: string;
      }>(credential);

      if (!decoded.hd) {
        get().showToast('ไม่พบข้อมูลโดเมนจาก Google — กรุณาใช้บัญชี @up.ac.th');
        return;
      }
      if (decoded.hd !== 'up.ac.th') {
        get().showToast('อนุญาตเฉพาะอีเมล @up.ac.th เท่านั้น');
        return;
      }

      // Check admin status from backend
      let role: UserRole = 'user';
      const adminRes = await checkIsAdmin(decoded.email);
      if (adminRes.ok && adminRes.data) {
        if (adminRes.data.isAdmin) {
          role = adminRes.data.role as UserRole;
        }
      }

      const user: User = {
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        role,
      };

      saveStoredUser(user);
      set({
        user,
        isAdmin: role === 'admin' || role === 'superadmin',
        isSuperAdmin: role === 'superadmin',
      });
      get().showToast(`ยินดีต้อนรับ ${user.name}`);
    } catch {
      get().showToast('เข้าสู่ระบบไม่สำเร็จ');
    }
  },

  logout: () => {
    clearStoredUser();
    set({
      user: null,
      isAdmin: false,
      isSuperAdmin: false,
    });
    // If on admin page, go back to dashboard
    if (get().currentView === 'admin') {
      set({ currentView: 'dashboard' });
    }
    get().showToast('ออกจากระบบแล้ว');
  },

  refreshAdminStatus: async () => {
    const user = get().user;
    if (!user) return;
    const adminRes = await checkIsAdmin(user.email);
    if (adminRes.ok && adminRes.data) {
      const role = adminRes.data.isAdmin ? (adminRes.data.role as UserRole) : 'user';
      const updatedUser = { ...user, role };
      saveStoredUser(updatedUser);
      set({
        user: updatedUser,
        isAdmin: role === 'admin' || role === 'superadmin',
        isSuperAdmin: role === 'superadmin',
      });
    }
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
