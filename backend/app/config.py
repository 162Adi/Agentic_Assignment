from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent
WORKSPACE_ROOT = BASE_DIR.parent

# Labs directory resolution - supports both unified labs/ structure and root Lab_* folders
UNIFIED_LABS_DIR = WORKSPACE_ROOT / "Agentic_AI_14_Labs_Unified" / "labs"
ROOT_LABS_DIR = WORKSPACE_ROOT

DATABASE_PATH = Path(os.getenv("DATABASE_PATH", str(BASE_DIR / "command_center.db")))

HOST = os.getenv("HOST", "127.0.0.1")
PORT = int(os.getenv("PORT", "8000"))
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "*"
]
