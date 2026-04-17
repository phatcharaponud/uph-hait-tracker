import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../lib/api', () => ({
  listItems: vi.fn(async () => ({ ok: true, data: [] })),
  updateItem: vi.fn(async () => ({ ok: true })),
  isAdmin: vi.fn(async () => ({ ok: true, data: { isAdmin: false, role: 'user' } })),
}));

import { useStore } from './useStore';

describe('useStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useStore.setState({
      user: null,
      isAdmin: false,
      isSuperAdmin: false,
      currentView: 'dashboard',
      toast: null,
    });
  });

  it('starts signed out with default view', () => {
    const s = useStore.getState();
    expect(s.user).toBeNull();
    expect(s.isAdmin).toBe(false);
    expect(s.currentView).toBe('dashboard');
  });

  it('changes view via setView', () => {
    useStore.getState().setView('gantt');
    expect(useStore.getState().currentView).toBe('gantt');
  });

  it('showToast sets then clears the toast', async () => {
    vi.useFakeTimers();
    useStore.getState().showToast('ทดสอบ');
    expect(useStore.getState().toast).toBe('ทดสอบ');
    vi.advanceTimersByTime(2600);
    expect(useStore.getState().toast).toBeNull();
    vi.useRealTimers();
  });

  it('logout clears user and admin flags', () => {
    useStore.setState({
      user: { email: 'a@up.ac.th', name: 'a', picture: '', role: 'admin' },
      isAdmin: true,
      isSuperAdmin: false,
      currentView: 'admin',
    });
    useStore.getState().logout();
    const s = useStore.getState();
    expect(s.user).toBeNull();
    expect(s.isAdmin).toBe(false);
    expect(s.currentView).toBe('dashboard');
  });
});
