import { useStore } from '../store/useStore';
import { CloudOff, Loader2, CheckCircle2, Cloud } from 'lucide-react';

export default function SyncIndicator() {
  const syncStatus = useStore((s) => s.syncStatus);
  const syncError = useStore((s) => s.syncError);

  return (
    <div className="flex items-center gap-1.5 text-xs">
      {syncStatus === 'idle' && (
        <>
          <Cloud size={14} className="text-slate-400" />
          <span className="text-slate-400">ออฟไลน์</span>
        </>
      )}
      {syncStatus === 'syncing' && (
        <>
          <Loader2 size={14} className="text-blue-500 animate-spin" />
          <span className="text-blue-500">กำลัง sync...</span>
        </>
      )}
      {syncStatus === 'synced' && (
        <>
          <CheckCircle2 size={14} className="text-emerald-500" />
          <span className="text-emerald-500">synced</span>
        </>
      )}
      {syncStatus === 'error' && (
        <span className="text-red-500 flex items-center gap-1" title={syncError || ''}>
          <CloudOff size={14} />
          error
        </span>
      )}
    </div>
  );
}
