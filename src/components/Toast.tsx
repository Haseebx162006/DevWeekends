import { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import type { ToastMessage } from '../types';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: number) => void;
}

const icons = {
  success: <CheckCircle size={16} className="text-emerald-500 shrink-0" />,
  error: <XCircle size={16} className="text-red-500 shrink-0" />,
  info: <Info size={16} className="text-[#F26522] shrink-0" />,
};

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-2.5 pointer-events-none">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function Toast({ toast, onDismiss }: { toast: ToastMessage; onDismiss: (id: number) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div className="pointer-events-auto flex items-center gap-3 px-4 py-3 bg-white/95 border border-gray-100/50 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl animate-slideUp min-w-[280px]">
      {icons[toast.type]}
      <span className="text-[13px] text-gray-700 flex-1 font-medium">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors shrink-0"
      >
        <X size={14} />
      </button>
    </div>
  );
}
