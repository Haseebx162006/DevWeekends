"""
DevNotes — Pydantic Models
Request/response schemas for the Notes API.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class NoteCreate(BaseModel):
    """Schema for creating a new note."""
    title: str = Field(..., min_length=1, max_length=200, description="Note title")
    content: str = Field(..., min_length=1, description="Note content (supports code blocks)")
    tags: list[str] = Field(default_factory=list, description="List of tags")
    favorite: bool = Field(default=False, description="Pin as favorite")


class NoteUpdate(BaseModel):
    """Schema for updating an existing note. All fields are optional."""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    content: Optional[str] = Field(None, min_length=1)
    tags: Optional[list[str]] = None
    favorite: Optional[bool] = None


class NoteResponse(BaseModel):
    """Schema for note responses returned to the client."""
    id: int
    title: str
    content: str
    tags: list[str]
    favorite: bool
    created_at: str
    updated_at: str
