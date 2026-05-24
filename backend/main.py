import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from routes import router

# Resolve paths relative to the project root
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST_DIR = os.path.join(BASE_DIR, "dist")

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

# ── API Routes ──────────────────────────────────────────────────────────────
app.include_router(router)

# ── Frontend (SPA) ──────────────────────────────────────────────────────────
if os.path.exists(DIST_DIR):
    assets_path = os.path.join(DIST_DIR, "assets")
    if os.path.exists(assets_path):
        app.mount("/assets", StaticFiles(directory=assets_path), name="assets")

    @app.get("/{catchall:path}")
    def read_index(catchall: str):
        file_path = os.path.join(DIST_DIR, catchall)
        if catchall and os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        
        index_file = os.path.join(DIST_DIR, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"message": "Vite static files not built yet."}
else:
    @app.get("/{catchall:path}")
    def read_index(catchall: str):
        return {"message": "FastAPI is running. Build the frontend using 'npm run build'."}
