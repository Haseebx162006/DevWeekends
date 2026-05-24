"""
DevNotes — FastAPI Application Entry Point
Serves the API and the single-page frontend.
"""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from .database import init_db
from .routes import router

# Resolve paths relative to the project root
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC_DIR = os.path.join(BASE_DIR, "static")
TEMPLATES_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "templates")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize the database on startup."""
    init_db()
    yield


app = FastAPI(
    title="DevNotes",
    description="Developer Notes & Snippet Manager",
    version="1.0.0",
    lifespan=lifespan,
)

# ── Middleware ───────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Static Files & Templates ────────────────────────────────────────────────

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
templates = Jinja2Templates(directory=TEMPLATES_DIR)

# ── API Routes ──────────────────────────────────────────────────────────────

app.include_router(router)

# ── Frontend ────────────────────────────────────────────────────────────────


@app.get("/")
async def serve_frontend(request: Request):
    """Serve the single-page frontend."""
    return templates.TemplateResponse("index.html", {"request": request})
