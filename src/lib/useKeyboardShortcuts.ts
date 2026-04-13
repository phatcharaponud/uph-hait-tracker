import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { exportDashboardPdf } from './exportPdf';

export function useKeyboardShortcuts() {
  const items = useStore((s) => s.items);
  const user = useStore((s) => s.user);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ctrl+P → export PDF
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        exportDashboardPdf(items, user);
      }

      // Esc → close modals (handled via event bubbling, but also blur active element)
      if (e.key === 'Escape') {
        const active = document.activeElement as HTMLElement;
        if (active && active !== document.body) {
          active.blur();
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [items, user]);
}
