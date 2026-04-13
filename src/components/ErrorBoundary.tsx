import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">เกิดข้อผิดพลาด</h2>
            <p className="text-sm text-slate-500 mb-4">
              {this.state.error?.message || 'เกิดข้อผิดพลาดที่ไม่คาดคิด'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-navy text-white rounded-lg text-sm font-medium hover:opacity-90"
              style={{ background: '#1e3a5f' }}
            >
              โหลดหน้าใหม่
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
