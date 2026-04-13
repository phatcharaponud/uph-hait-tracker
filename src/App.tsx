import { useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AdminBadge from './components/AdminBadge';
import Toast from './components/Toast';
import Dashboard from './pages/Dashboard';
import GanttChart from './pages/GanttChart';
import CategoryView from './pages/CategoryView';
import References from './pages/References';
import { useStore } from './store/useStore';

function App() {
  const currentView = useStore((s) => s.currentView);
  const loadItems = useStore((s) => s.loadItems);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  let content: React.ReactNode;
  if (currentView === 'dashboard') {
    content = <Dashboard />;
  } else if (currentView === 'gantt') {
    content = <GanttChart />;
  } else if (currentView === 'refs') {
    content = <References />;
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

export default App;
