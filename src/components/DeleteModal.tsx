import { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  noteTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteModal({ isOpen, noteTitle, onConfirm, onCancel }: DeleteModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onCancel();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md animate-fadeIn"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-white/95 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-xl z-10 animate-slideUp overflow-hidden liquid-glass">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
              <AlertTriangle size={15} className="text-red-500" />
            </div>
            <h2 className="text-gray-900 font-semibold text-[16px]">Delete Note</h2>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors duration-300"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-[14px] text-gray-600 leading-relaxed">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-gray-900">"{noteTitle}"</span>?
            This action cannot be undone.
          </p>

          <div className="flex items-center justify-end gap-3 pt-5">
            <button
              onClick={onCancel}
              className="px-5 py-2.5 rounded-full text-[13px] font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-[13px] font-semibold transition-all duration-300 shadow-md shadow-red-500/20"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
