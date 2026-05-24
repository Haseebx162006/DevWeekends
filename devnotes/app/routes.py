"""
DevNotes — API Routes
RESTful endpoints for notes CRUD, search, filter, and favorites.
"""

import json
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Query
from .database import get_db
from .models import NoteCreate, NoteUpdate, NoteResponse

router = APIRouter(prefix="/api")


def _row_to_note(row) -> NoteResponse:
    """Convert a sqlite3.Row to a NoteResponse model."""
    return NoteResponse(
        id=row["id"],
        title=row["title"],
        content=row["content"],
        tags=json.loads(row["tags"]),
        favorite=bool(row["favorite"]),
        created_at=row["created_at"],
        updated_at=row["updated_at"],
    )


# ── Search & Filter (placed BEFORE /{id} to avoid path conflicts) ──────────


@router.get("/notes/search", response_model=list[NoteResponse])
def search_notes(q: str = Query(..., min_length=1, description="Search query")):
    """
    Search notes by title, content, or tags.
    Uses SQL LIKE for simple substring matching.
    """
    with get_db() as conn:
        pattern = f"%{q}%"
        rows = conn.execute(
            """
            SELECT * FROM notes
            WHERE title LIKE ? OR content LIKE ? OR tags LIKE ?
            ORDER BY favorite DESC, updated_at DESC
            """,
            (pattern, pattern, pattern),
        ).fetchall()
    return [_row_to_note(r) for r in rows]


@router.get("/notes/filter", response_model=list[NoteResponse])
def filter_by_tag(tag: str = Query(..., min_length=1, description="Tag to filter by")):
    """Filter notes that contain a specific tag."""
    with get_db() as conn:
        # Match the tag inside the JSON array string
        pattern = f'%"{tag}"%'
        rows = conn.execute(
            """
            SELECT * FROM notes
            WHERE tags LIKE ?
            ORDER BY favorite DESC, updated_at DESC
            """,
            (pattern,),
        ).fetchall()
    return [_row_to_note(r) for r in rows]


# ── CRUD Endpoints ──────────────────────────────────────────────────────────


@router.get("/notes", response_model=list[NoteResponse])
def get_all_notes():
    """Get all notes. Favorites appear first, then sorted by most recently updated."""
    with get_db() as conn:
        rows = conn.execute(
            "SELECT * FROM notes ORDER BY favorite DESC, updated_at DESC"
        ).fetchall()
    return [_row_to_note(r) for r in rows]


@router.post("/notes", response_model=NoteResponse, status_code=201)
def create_note(note: NoteCreate):
    """Create a new note."""
    now = datetime.now(timezone.utc).isoformat()
    tags_json = json.dumps(note.tags)

    with get_db() as conn:
        cursor = conn.execute(
            """
            INSERT INTO notes (title, content, tags, favorite, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (note.title, note.content, tags_json, int(note.favorite), now, now),
        )
        conn.commit()
        new_id = cursor.lastrowid

        row = conn.execute("SELECT * FROM notes WHERE id = ?", (new_id,)).fetchone()

    return _row_to_note(row)


@router.put("/notes/{note_id}", response_model=NoteResponse)
def update_note(note_id: int, note: NoteUpdate):
    """Update an existing note. Only provided fields are changed."""
    with get_db() as conn:
        existing = conn.execute(
            "SELECT * FROM notes WHERE id = ?", (note_id,)
        ).fetchone()

        if not existing:
            raise HTTPException(status_code=404, detail="Note not found")

        # Build update fields from provided values
        title = note.title if note.title is not None else existing["title"]
        content = note.content if note.content is not None else existing["content"]
        tags = json.dumps(note.tags) if note.tags is not None else existing["tags"]
        favorite = int(note.favorite) if note.favorite is not None else existing["favorite"]
        updated_at = datetime.now(timezone.utc).isoformat()

        conn.execute(
            """
            UPDATE notes
            SET title = ?, content = ?, tags = ?, favorite = ?, updated_at = ?
            WHERE id = ?
            """,
            (title, content, tags, favorite, updated_at, note_id),
        )
        conn.commit()

        row = conn.execute("SELECT * FROM notes WHERE id = ?", (note_id,)).fetchone()

    return _row_to_note(row)


@router.delete("/notes/{note_id}", status_code=204)
def delete_note(note_id: int):
    """Delete a note by its ID."""
    with get_db() as conn:
        existing = conn.execute(
            "SELECT id FROM notes WHERE id = ?", (note_id,)
        ).fetchone()

        if not existing:
            raise HTTPException(status_code=404, detail="Note not found")

        conn.execute("DELETE FROM notes WHERE id = ?", (note_id,))
        conn.commit()

    return None


# ── Favorite Toggle ─────────────────────────────────────────────────────────


@router.post("/notes/{note_id}/favorite", response_model=NoteResponse)
def toggle_favorite(note_id: int):
    """Toggle the favorite status of a note."""
    with get_db() as conn:
        existing = conn.execute(
            "SELECT * FROM notes WHERE id = ?", (note_id,)
        ).fetchone()

        if not existing:
            raise HTTPException(status_code=404, detail="Note not found")

        new_fav = 0 if existing["favorite"] else 1
        updated_at = datetime.now(timezone.utc).isoformat()

        conn.execute(
            "UPDATE notes SET favorite = ?, updated_at = ? WHERE id = ?",
            (new_fav, updated_at, note_id),
        )
        conn.commit()

        row = conn.execute("SELECT * FROM notes WHERE id = ?", (note_id,)).fetchone()

    return _row_to_note(row)
