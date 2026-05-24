/**
 * DevNotes API client.
 * All calls go through the Vite proxy (/api → localhost:8000/api).
 */

import type { Note, NoteCreate, NoteUpdate } from './types';

const BASE = '/api';

async function request<T>(url: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `Request failed: ${res.status}`);
  }
  // 204 No Content (delete)
  if (res.status === 204) return undefined as T;
  return res.json();
}

/** Get all notes (favorites first, then by updated_at DESC). */
export const fetchNotes = () =>
  request<Note[]>(`${BASE}/notes`);

/** Create a new note. */
export const createNote = (data: NoteCreate) =>
  request<Note>(`${BASE}/notes`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

/** Update an existing note (partial). */
export const updateNote = (id: number, data: NoteUpdate) =>
  request<Note>(`${BASE}/notes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

/** Delete a note. */
export const deleteNote = (id: number) =>
  request<void>(`${BASE}/notes/${id}`, { method: 'DELETE' });

/** Toggle favorite status. */
export const toggleFavorite = (id: number) =>
  request<Note>(`${BASE}/notes/${id}/favorite`, { method: 'POST' });

/** Full-text search. */
export const searchNotes = (q: string) =>
  request<Note[]>(`${BASE}/notes/search?q=${encodeURIComponent(q)}`);

/** Filter by tag. */
export const filterByTag = (tag: string) =>
  request<Note[]>(`${BASE}/notes/filter?tag=${encodeURIComponent(tag)}`);
