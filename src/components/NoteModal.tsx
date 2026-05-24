import { useState, useEffect, useRef } from 'react';
import { X, ArrowRight } from 'lucide-react';
import type { Note } from '../types';

interface NoteModalProps {
  isOpen: boolean;
  note: Note | null;
  onClose: () => void;
  onSubmit: (data: { title: string; content: string; tags: string[]; favorite: boolean }) => void;
}

export default function NoteModal({ isOpen, note, onClose, onSubmit }: NoteModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [favorite, setFavorite] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  const isEditing = note !== null;

  useEffect(() => {
    if (isOpen) {
      if (note) {
        setTitle(note.title);
        setContent(note.content);
        setTagsInput(note.tags.join(', '));
        setFavorite(note.favorite);
      } else {
        setTitle('');
        setContent('');
        setTagsInput('');
        setFavorite(false);
      }
      setTimeout(() => titleRef.current?.focus(), 150);
    }
  }, [isOpen, note]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
    onSubmit({ title, content, tags, favorite });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white/95 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white/40 backdrop-blur-xl z-10 animate-slideUp overflow-hidden liquid-glass flex flex-col max-h-[90vh] sm:max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-gray-100/60 bg-white/50 shrink-0">
          <h2 className="text-gray-900 font-bold text-[18px] tracking-tight">
            {isEditing ? 'Edit Note' : 'Create New Note'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors duration-300 shadow-sm"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 flex flex-col gap-6">
            {/* Title */}
            <div className="flex flex-col gap-2">
              <label htmlFor="modal-title" className="text-[12px] font-semibold text-gray-600 uppercase tracking-wider pl-1">
                Note Title
              </label>
              <input
                ref={titleRef}
                id="modal-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Masterclass: System Design"
                required
                className="w-full px-5 py-3.5 bg-white border border-gray-200/80 rounded-xl text-[15px] font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#F26522] focus:ring-4 focus:ring-[#F26522]/10 transition-all shadow-sm"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between pl-1">
                <label htmlFor="modal-content" className="text-[12px] font-semibold text-gray-600 uppercase tracking-wider">
                  Content
                </label>
                <span className="text-[11px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  Use ```language for code
                </span>
              </div>
              <textarea
                id="modal-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={"Write your insights here...\n\n```javascript\nconsole.log('Hello world!');\n```"}
                rows={6}
                required
                className="w-full px-5 py-4 bg-white border border-gray-200/80 rounded-xl text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#F26522] focus:ring-4 focus:ring-[#F26522]/10 transition-all resize-y min-h-[120px] font-['JetBrains_Mono',monospace] leading-relaxed shadow-sm"
              />
            </div>

            {/* Tags & Favorite Row */}
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              {/* Tags */}
              <div className="flex flex-col gap-2 flex-1 w-full">
                <label htmlFor="modal-tags" className="text-[12px] font-semibold text-gray-600 uppercase tracking-wider pl-1">
                  Tags <span className="text-gray-400 font-medium normal-case tracking-normal">(comma separated)</span>
                </label>
                <input
                  id="modal-tags"
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g. react, architecture, ideas"
                  className="w-full px-5 py-3.5 bg-white border border-gray-200/80 rounded-xl text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#F26522] focus:ring-4 focus:ring-[#F26522]/10 transition-all shadow-sm"
                />
              </div>

              {/* Favorite */}
              <div className="flex flex-col gap-2 pt-1 sm:pt-6">
                <label className="flex items-center gap-3 cursor-pointer select-none group bg-gray-50 hover:bg-gray-100 border border-gray-200/80 px-4 py-3.5 rounded-xl transition-colors shadow-sm">
                  <input
                    type="checkbox"
                    checked={favorite}
                    onChange={(e) => setFavorite(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-5 h-5 rounded-[6px] border-2 border-gray-300 bg-white peer-checked:bg-[#F26522] peer-checked:border-[#F26522] flex items-center justify-center transition-all duration-300 shadow-sm">
                    <svg className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[14px] font-medium text-gray-700 group-hover:text-gray-900 transition-colors flex items-center gap-1.5">
                    Pin to top
                  </span>
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 sm:px-8 py-5 border-t border-gray-100/60 bg-white/50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-full text-[14px] font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="group flex items-center bg-[#F26522] hover:bg-[#e05a1a] text-white rounded-full pl-6 pr-2.5 py-2.5 gap-4 cursor-pointer transition-colors duration-300 select-none shadow-lg shadow-[#F26522]/20"
          >
            <div className="overflow-hidden h-[20px]">
              <div className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-1/2">
                <span className="h-[20px] leading-[20px] text-[14px] font-semibold whitespace-nowrap">
                  {isEditing ? 'Save Changes' : 'Create Note'}
                </span>
                <span className="h-[20px] leading-[20px] text-[14px] font-semibold whitespace-nowrap">
                  {isEditing ? 'Save Changes' : 'Create Note'}
                </span>
              </div>
            </div>
            <div className="w-7 h-7 bg-white text-[#F26522] rounded-full flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45 shadow-sm">
              <ArrowRight size={14} className="text-[#F26522]" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
