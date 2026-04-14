import { useEffect, useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ErrorBoundary from './components/ErrorBoundary';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AdminBadge from './components/AdminBadge';
import Toast from './components/Toast';
import Dashboard from './pages/Dashboard';
import GanttChart from './pages/GanttChart';
import CategoryView from './pages/CategoryView';
import References from './pages/References';
import AdminManagement from './pages/AdminManagement';
import LoginPage from './pages/LoginPage';
import { useStore } from './store/useStore';
import { useKeyboardShortcuts } from './lib/useKeyboardShortcuts';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

function AppContent() {
  const currentView = useStore((s) => s.currentView);
  const loadItems = useStore((s) => s.loadItems);
  const isSuperAdmin = useStore((s) => s.isSuperAdmin);
  const user = useStore((s) => s.user);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Auth check from localStorage is synchronous in useStore init,
    // so we just mark it done on mount
    setAuthChecked(true);
  }, []);

  useEffect(() => {
    if (user) loadItems();
  }, [user, loadItems]);

  useKeyboardShortcuts();

  // Loading state while checking auth
  if (!authChecked) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)' }}
      >
        <div className="text-white text-center space-y-3">
          <div className="text-4xl">📋</div>
          <div className="text-lg font-medium">HAIT Tracker</div>
          <div className="text-sm opacity-80">กำลังตรวจสอบ...</div>
        </div>
      </div>
    );
  }

  // Not logged in → show login page
  if (!user) {
    return <LoginPage />;
  }

  let content: React.ReactNode;
  if (currentView === 'dashboard') {
    content = <Dashboard />;
  } else if (currentView === 'gantt') {
    content = <GanttChart />;
  } else if (currentView === 'refs') {
    content = <References />;
  } else if (currentView === 'admin' && isSuperAdmin) {
    content = <AdminManagement />;
  } else if (currentView === 'admin') {
    content = <Dashboard />;
  } else {
    content = <CategoryView catId={currentView as number} />;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <Header />
      <AdminBadge />
      <Toast />
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden mt-14 md:mt-0">
        {content}
      </main>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AppContent />
      </GoogleOAuthProvider>
    </ErrorBoundary>
  );
}

export default App;
