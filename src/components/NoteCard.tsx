import type { ReactNode } from 'react';
import { Star, Edit3, Trash2, Pin } from 'lucide-react';
import type { Note } from '../types';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
  onToggleFavorite: (id: number) => void;
  style?: React.CSSProperties;
}

/**
 * Render code blocks: lines between ``` fences become <pre><code>.
 * Everything else is treated as plain text paragraphs.
 */
function renderContent(content: string) {
  const parts: ReactNode[] = [];
  const lines = content.split('\n');
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    if (lines[i].startsWith('```')) {
      const lang = lines[i].slice(3).trim();
      i++;
      const codeLines: string[] = [];
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++;
      parts.push(
        <div key={key++} className="relative mt-3 mb-2">
          {lang && (
            <span className="absolute top-2.5 right-3 text-[10px] uppercase tracking-wider text-gray-400 font-mono select-none">
              {lang}
            </span>
          )}
          <pre className="bg-gray-900 rounded-xl p-4 overflow-x-auto text-[13px] leading-relaxed shadow-sm">
            <code className="text-gray-100 font-['JetBrains_Mono',monospace]">
              {codeLines.join('\n')}
            </code>
          </pre>
        </div>
      );
    } else {
      const textLines: string[] = [];
      while (i < lines.length && !lines[i].startsWith('```')) {
        textLines.push(lines[i]);
        i++;
      }
      const text = textLines.join('\n').trim();
      if (text) {
        parts.push(
          <p key={key++} className="text-gray-600 text-[13px] leading-[1.7] whitespace-pre-wrap">
            {text}
          </p>
        );
      }
    }
  }
  return parts;
}

/** Format relative time string. */
function timeAgo(dateStr: string): string {
  const now = Date.now();
  const d = new Date(dateStr).getTime();
  const diff = now - d;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function NoteCard({ note, onEdit, onDelete, onToggleFavorite, style }: NoteCardProps) {
  return (
    <article
      style={style}
      className="group relative bg-white/95 border border-gray-100/50 rounded-2xl p-5 flex flex-col gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-gray-200 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:scale-[1.01] backdrop-blur-sm animate-cardIn"
    >
      {/* Pinned badge */}
      {note.favorite && (
        <div className="absolute -top-2 -right-2 w-7 h-7 bg-[#F26522] rounded-full flex items-center justify-center shadow-md shadow-[#F26522]/30">
          <Pin size={12} className="text-white" />
        </div>
      )}

      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-gray-900 font-semibold text-[15px] leading-snug truncate pr-2">
            {note.title}
          </h3>
          <span className="text-[11px] text-gray-400 mt-0.5 block font-medium">
            {timeAgo(note.updated_at)}
          </span>
        </div>

        {/* Actions — visible on hover */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shrink-0">
          <button
            onClick={() => onToggleFavorite(note.id)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              note.favorite
                ? 'bg-[#F26522]/10 text-[#F26522]'
                : 'text-gray-400 hover:text-[#F26522] hover:bg-[#F26522]/10'
            }`}
            title={note.favorite ? 'Unpin' : 'Pin as favorite'}
          >
            {note.favorite ? <Star size={14} fill="currentColor" /> : <Star size={14} />}
          </button>

          <button
            onClick={() => onEdit(note)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300"
            title="Edit note"
          >
            <Edit3 size={13} />
          </button>

          <button
            onClick={() => onDelete(note)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300"
            title="Delete note"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Content preview */}
      <div className="flex-1 overflow-hidden max-h-[160px]">
        {renderContent(note.content)}
      </div>

      {/* Tags */}
      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1 mt-auto">
          {note.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200/50"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
