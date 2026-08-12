import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps { children: ReactNode }
interface ErrorBoundaryState { hasError: boolean }

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('PUBG Sensitivity Generator error', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-6 text-center">
          <div className="max-w-md rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-6">
            <h1 className="text-xl font-bold mb-2">تعذر عرض هذه الصفحة</h1>
            <p className="text-sm text-gray-400 mb-4">حدث خطأ غير متوقع. أعد تحميل الصفحة أو ابدأ ملفاً جديداً.</p>
            <button type="button" onClick={() => window.location.reload()} className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-black">إعادة التحميل</button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}
