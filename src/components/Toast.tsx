import { useStore } from '../store/useStore';
import { CheckCircle2 } from 'lucide-react';

export default function Toast() {
  const toast = useStore((s) => s.toast);
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 text-white text-sm font-medium shadow-xl animate-[fadeIn_0.2s]">
      <CheckCircle2 size={16} className="text-emerald-400" />
      {toast}
    </div>
  );
}
