"""
DevNotes — Database Layer
SQLite connection management and table initialization.
All queries use parameterized placeholders to prevent SQL injection.
"""

import sqlite3
import os
from contextlib import contextmanager

# Database file path — stored in the project root
DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "notes.db")


def init_db():
    """Create the notes table if it doesn't already exist."""
    with get_db() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS notes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                tags TEXT DEFAULT '[]',
                favorite INTEGER DEFAULT 0,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
        """)
        conn.commit()


@contextmanager
def get_db():
    """
    Context manager for database connections.
    Ensures the connection is properly closed after use.
    Uses Row factory for dict-like access.
    """
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()
