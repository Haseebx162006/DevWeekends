import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Plus, FileText, Star, Tag, Loader2, ArrowRight } from 'lucide-react';
import { Shader, Swirl, ChromaFlow, FlutedGlass, FilmGrain } from 'shaders/react';
import type { Note, ToastMessage } from './types';
import * as api from './api';
import NoteCard from './components/NoteCard';
import NoteModal from './components/NoteModal';
import DeleteModal from './components/DeleteModal';
import ToastContainer from './components/Toast';

export default function App() {
  // ── State ──────────────────────────────────────────────────────
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingNote, setDeletingNote] = useState<Note | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const toastIdRef = useRef(0);

  // ── Helpers ────────────────────────────────────────────────────
  const addToast = useCallback((message: string, type: ToastMessage['type'] = 'success') => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Data Loading ───────────────────────────────────────────────
  const loadNotes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.fetchNotes();
      setNotes(data);
    } catch {
      addToast('Failed to load notes', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  // ── Search (debounced) ─────────────────────────────────────────
  const searchTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      setActiveTag('all');

      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);

      if (!query.trim()) {
        loadNotes();
        return;
      }

      searchTimerRef.current = setTimeout(async () => {
        try {
          const data = await api.searchNotes(query.trim());
          setNotes(data);
        } catch {
          addToast('Search failed', 'error');
        }
      }, 300);
    },
    [loadNotes, addToast],
  );

  // ── Tag Filter ─────────────────────────────────────────────────
  const handleTagFilter = useCallback(
    async (tag: string) => {
      setActiveTag(tag);
      setSearchQuery('');

      try {
        if (tag === 'all') {
          await loadNotes();
        } else if (tag === 'favorites') {
          const data = await api.fetchNotes();
          setNotes(data.filter((n) => n.favorite));
        } else {
          const data = await api.filterByTag(tag);
          setNotes(data);
        }
      } catch {
        addToast('Filter failed', 'error');
      }
    },
    [loadNotes, addToast],
  );

  // ── CRUD Operations ────────────────────────────────────────────
  const handleCreateOrUpdate = useCallback(
    async (data: { title: string; content: string; tags: string[]; favorite: boolean }) => {
      try {
        if (editingNote) {
          await api.updateNote(editingNote.id, data);
          addToast('Note updated');
        } else {
          await api.createNote(data);
          addToast('Note created');
        }
        setModalOpen(false);
        setEditingNote(null);
        await loadNotes();
      } catch {
        addToast(editingNote ? 'Failed to update note' : 'Failed to create note', 'error');
      }
    },
    [editingNote, loadNotes, addToast],
  );

  const handleDelete = useCallback(async () => {
    if (!deletingNote) return;
    try {
      await api.deleteNote(deletingNote.id);
      addToast('Note deleted');
      setDeleteModalOpen(false);
      setDeletingNote(null);
      await loadNotes();
    } catch {
      addToast('Failed to delete note', 'error');
    }
  }, [deletingNote, loadNotes, addToast]);

  const handleToggleFavorite = useCallback(
    async (id: number) => {
      try {
        await api.toggleFavorite(id);
        await loadNotes();
      } catch {
        addToast('Failed to toggle favorite', 'error');
      }
    },
    [loadNotes, addToast],
  );

  // ── Keyboard Shortcuts ─────────────────────────────────────────
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // ── Derived Data ───────────────────────────────────────────────
  const [allNotesForTags, setAllNotesForTags] = useState<Note[]>([]);
  useEffect(() => {
    api.fetchNotes().then(setAllNotesForTags).catch(() => {});
  }, [notes]);

  const allUniqueTags = Array.from(new Set(allNotesForTags.flatMap((n) => n.tags))).sort();

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen bg-[#EFEFEF] text-gray-900 font-sans selection:bg-[#F26522] selection:text-white">

      {/* SHADER BACKGROUND FROM AXION */}
      <div className="fixed inset-0 z-0 pointer-events-none w-full h-full opacity-60">
        <Shader className="w-full h-full">
          <Swirl colorA="#ffffff" colorB="#f0f0f0" detail={1.7} />
          <ChromaFlow
            baseColor="#ffffff"
            downColor="#ff5f03"
            leftColor="#ff5f03"
            rightColor="#ff5f03"
            upColor="#ff5f03"
            momentum={13}
            radius={3.5}
          />
          <FlutedGlass
            aberration={0.61}
            angle={31}
            frequency={8}
            highlight={0.12}
            highlightSoftness={0}
            lightAngle={-90}
            refraction={4}
            shape="rounded"
            softness={1}
            speed={0.15}
          />
          <FilmGrain strength={0.05} />
        </Shader>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* ── Header / Navbar (Axion pill style) ──────────────────── */}
      <header className="sticky top-0 z-30 w-full px-2 sm:px-3 pt-4 sm:pt-5 pb-3">
        <div className="max-w-[1440px] mx-auto">
          <nav className="bg-white rounded-full p-[5px] flex items-center justify-between shadow-sm border border-gray-100/50">
            {/* Left: Logo + Brand */}
            <div className="flex items-center gap-4 pl-2">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-900 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-105 duration-300">
                <FileText size={16} className="text-white" />
              </div>
              <h1 className="hidden sm:block text-[14px] font-bold text-gray-900 tracking-tight">
                Dev<span className="text-[#F26522]">Notes</span>
              </h1>

              {/* Search */}
              <div className="hidden md:block relative ml-4">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search notes..."
                  className="w-[220px] lg:w-[280px] pl-9 pr-14 py-2 bg-gray-50 border border-gray-200/50 rounded-full text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#F26522] focus:bg-white transition-all"
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-gray-400 bg-white border border-gray-200 rounded px-1.5 py-0.5 select-none">
                  Ctrl+K
                </kbd>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 pr-1">
              {/* Note count badge */}
              <span className="hidden lg:inline text-[13px] text-gray-500">
                {allNotesForTags.length} note{allNotesForTags.length !== 1 ? 's' : ''}
              </span>

              {/* New Note CTA (Axion-style pill button) */}
              <button
                onClick={() => {
                  setEditingNote(null);
                  setModalOpen(true);
                }}
                className="group flex items-center bg-[#F26522] hover:bg-[#e05a1a] text-white rounded-full pl-4 sm:pl-5 pr-2 py-2 gap-2 sm:gap-3 cursor-pointer transition-colors duration-300 select-none"
              >
                <div className="overflow-hidden h-[20px]">
                  <div className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-1/2">
                    <span className="h-[20px] leading-[20px] text-[13px] font-medium whitespace-nowrap flex items-center gap-1.5">
                      <Plus size={14} />
                      <span className="hidden sm:inline">New Note</span>
                    </span>
                    <span className="h-[20px] leading-[20px] text-[13px] font-medium whitespace-nowrap flex items-center gap-1.5">
                      <Plus size={14} />
                      <span className="hidden sm:inline">New Note</span>
                    </span>
                  </div>
                </div>
                <div className="w-6 h-6 bg-white text-[#F26522] rounded-full flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45">
                  <ArrowRight size={13} className="text-[#F26522]" />
                </div>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* ── Mobile Search ───────────────────────────────────────── */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200/50 rounded-full text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#F26522] transition-all shadow-sm"
          />
        </div>
      </div>

      {/* ── Tag Filter Bar ──────────────────────────────────────── */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-2">
          {/* All Notes */}
          <button
            onClick={() => handleTagFilter('all')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap transition-all duration-300 ${
              activeTag === 'all'
                ? 'bg-gray-900 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200/50 hover:border-gray-300 hover:text-gray-900'
            }`}
          >
            <FileText size={12} />
            All Notes
          </button>

          {/* Favorites */}
          <button
            onClick={() => handleTagFilter('favorites')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap transition-all duration-300 ${
              activeTag === 'favorites'
                ? 'bg-[#F26522] text-white shadow-sm shadow-[#F26522]/20'
                : 'bg-white text-gray-600 border border-gray-200/50 hover:border-[#F26522]/40 hover:text-[#F26522]'
            }`}
          >
            <Star size={12} />
            Favorites
          </button>

          {/* Divider */}
          {allUniqueTags.length > 0 && (
            <div className="w-px h-5 bg-gray-300 mx-1 shrink-0" />
          )}

          {/* Dynamic tags */}
          {allUniqueTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagFilter(tag)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap transition-all duration-300 ${
                activeTag === tag
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200/50 hover:border-gray-300 hover:text-gray-900'
              }`}
            >
              <Tag size={10} />
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* ── Main Content ────────────────────────────────────────── */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 size={28} className="text-[#F26522] animate-spin" />
            <p className="text-[14px] text-gray-500">Loading notes...</p>
          </div>
        ) : notes.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-32 gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white border border-gray-200/50 flex items-center justify-center shadow-sm">
              <FileText size={28} className="text-gray-300" />
            </div>
            <div className="text-center">
              <h3 className="text-[16px] font-semibold text-gray-900 mb-1">
                {searchQuery ? 'No matching notes' : 'No notes yet'}
              </h3>
              <p className="text-[13px] text-gray-500">
                {searchQuery
                  ? 'Try a different search term or tag'
                  : 'Create your first note to get started'}
              </p>
            </div>
            {!searchQuery && (
              <button
                onClick={() => {
                  setEditingNote(null);
                  setModalOpen(true);
                }}
                className="group flex items-center bg-[#F26522] hover:bg-[#e05a1a] text-white rounded-full pl-5 pr-2 py-2 gap-3 cursor-pointer transition-colors duration-300 mt-2 select-none"
              >
                <div className="overflow-hidden h-[20px]">
                  <div className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-1/2">
                    <span className="h-[20px] leading-[20px] text-[13px] font-medium whitespace-nowrap">Create your first note</span>
                    <span className="h-[20px] leading-[20px] text-[13px] font-medium whitespace-nowrap">Create your first note</span>
                  </div>
                </div>
                <div className="w-6 h-6 bg-white text-[#F26522] rounded-full flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45">
                  <ArrowRight size={13} className="text-[#F26522]" />
                </div>
              </button>
            )}
          </div>
        ) : (
          /* Notes grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {notes.map((note, i) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={(n) => {
                  setEditingNote(n);
                  setModalOpen(true);
                }}
                onDelete={(n) => {
                  setDeletingNote(n);
                  setDeleteModalOpen(true);
                }}
                onToggleFavorite={handleToggleFavorite}
                style={{ animationDelay: `${i * 50}ms` }}
              />
            ))}
          </div>
        )}

        {/* Stats footer */}
        {!loading && notes.length > 0 && (
          <div className="mt-10 pt-5 border-t border-gray-300/50 flex items-center justify-between text-[12px] text-gray-400 font-medium">
            <span>
              {notes.length} note{notes.length !== 1 ? 's' : ''}
              {activeTag !== 'all' && ` · filtered by "${activeTag}"`}
            </span>
            <span>
              {notes.filter((n) => n.favorite).length} pinned
            </span>
          </div>
        )}
      </main>

      </div>

      {/* ── Modals ──────────────────────────────────────────────── */}
      <NoteModal
        isOpen={modalOpen}
        note={editingNote}
        onClose={() => {
          setModalOpen(false);
          setEditingNote(null);
        }}
        onSubmit={handleCreateOrUpdate}
      />

      <DeleteModal
        isOpen={deleteModalOpen}
        noteTitle={deletingNote?.title ?? ''}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setDeletingNote(null);
        }}
      />

      {/* ── Toasts ──────────────────────────────────────────────── */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
