import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useStore } from '../store/useStore';

export default function Toast() {
  const storeToast = useStore((s) => s.toast);
  const syncStatus = useStore((s) => s.syncStatus);
  const syncError = useStore((s) => s.syncError);

  // Show store toast messages
  useEffect(() => {
    if (storeToast) {
      if (storeToast.includes('ไม่สำเร็จ') || storeToast.includes('ผิดพลาด')) {
        toast.error(storeToast);
      } else {
        toast.success(storeToast);
      }
    }
  }, [storeToast]);

  // Show sync errors
  useEffect(() => {
    if (syncStatus === 'error' && syncError) {
      toast.error(syncError);
    }
  }, [syncStatus, syncError]);

  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        duration: 2500,
        style: {
          borderRadius: '12px',
          padding: '10px 16px',
          fontSize: '14px',
          fontWeight: 500,
        },
        success: {
          style: { background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0' },
          iconTheme: { primary: '#10b981', secondary: '#ecfdf5' },
        },
        error: {
          style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' },
          iconTheme: { primary: '#ef4444', secondary: '#fef2f2' },
        },
      }}
    />
  );
}
