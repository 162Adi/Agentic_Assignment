import sqlite3
from typing import Optional, List, Dict, Any
from app.config import DATABASE_PATH

CREATE_TABLES_SQL = """
PRAGMA journal_mode = WAL;
CREATE TABLE IF NOT EXISTS executions (
    id TEXT PRIMARY KEY,
    lab_id INTEGER NOT NULL,
    program_type TEXT NOT NULL,
    lab_title TEXT NOT NULL,
    program_label TEXT NOT NULL,
    status TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT,
    duration_ms INTEGER DEFAULT 0,
    exit_code INTEGER,
    stdout TEXT DEFAULT '',
    stderr TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_executions_lab_id ON executions(lab_id);
CREATE INDEX IF NOT EXISTS idx_executions_created_at ON executions(created_at DESC);
"""

def _get_connection():
    DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DATABASE_PATH, timeout=10.0)
    conn.row_factory = sqlite3.Row
    return conn

def init_db_sync():
    conn = _get_connection()
    try:
        conn.executescript(CREATE_TABLES_SQL)
        conn.commit()
    finally:
        conn.close()

async def init_db():
    init_db_sync()

def create_execution_sync(data: Dict[str, Any]):
    conn = _get_connection()
    try:
        conn.execute(
            """
            INSERT INTO executions (
                id, lab_id, program_type, lab_title, program_label,
                status, start_time, end_time, duration_ms, exit_code, stdout, stderr
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                data["id"],
                data["lab_id"],
                data["program_type"],
                data["lab_title"],
                data["program_label"],
                data.get("status", "running"),
                data["start_time"],
                data.get("end_time"),
                data.get("duration_ms", 0),
                data.get("exit_code"),
                data.get("stdout", ""),
                data.get("stderr", ""),
            )
        )
        conn.commit()
    finally:
        conn.close()

async def create_execution(data: Dict[str, Any]) -> None:
    create_execution_sync(data)

def update_execution_sync(execution_id: str, updates: Dict[str, Any]):
    fields = []
    values = []
    for k, v in updates.items():
        fields.append(f"{k} = ?")
        values.append(v)
    values.append(execution_id)

    query = f"UPDATE executions SET {', '.join(fields)} WHERE id = ?"
    conn = _get_connection()
    try:
        conn.execute(query, values)
        conn.commit()
    finally:
        conn.close()

async def update_execution(execution_id: str, updates: Dict[str, Any]) -> None:
    update_execution_sync(execution_id, updates)

def get_execution_sync(execution_id: str) -> Optional[Dict[str, Any]]:
    conn = _get_connection()
    try:
        cursor = conn.execute("SELECT * FROM executions WHERE id = ?", (execution_id,))
        row = cursor.fetchone()
        return dict(row) if row else None
    finally:
        conn.close()

async def get_execution(execution_id: str) -> Optional[Dict[str, Any]]:
    return get_execution_sync(execution_id)

def list_executions_sync(
    limit: int = 50,
    offset: int = 0,
    lab_id: Optional[int] = None,
    status: Optional[str] = None
) -> List[Dict[str, Any]]:
    query = "SELECT * FROM executions WHERE 1=1"
    params: list = []
    if lab_id is not None:
        query += " AND lab_id = ?"
        params.append(lab_id)
    if status is not None:
        query += " AND status = ?"
        params.append(status)
    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
    params.extend([limit, offset])

    conn = _get_connection()
    try:
        cursor = conn.execute(query, params)
        rows = cursor.fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()

async def list_executions(
    limit: int = 50,
    offset: int = 0,
    lab_id: Optional[int] = None,
    status: Optional[str] = None
) -> List[Dict[str, Any]]:
    return list_executions_sync(limit, offset, lab_id, status)

def get_execution_stats_sync() -> Dict[str, Any]:
    conn = _get_connection()
    try:
        total = conn.execute("SELECT COUNT(*) as total FROM executions").fetchone()["total"]
        success = conn.execute("SELECT COUNT(*) as s FROM executions WHERE status = 'success'").fetchone()["s"]
        failed = conn.execute("SELECT COUNT(*) as f FROM executions WHERE status = 'failed'").fetchone()["f"]
        stopped = conn.execute("SELECT COUNT(*) as st FROM executions WHERE status = 'stopped'").fetchone()["st"]
        last_row = conn.execute("SELECT * FROM executions ORDER BY created_at DESC LIMIT 1").fetchone()
        last_execution = dict(last_row) if last_row else None

        return {
            "total_executions": total,
            "successful_executions": success,
            "failed_executions": failed,
            "stopped_executions": stopped,
            "last_execution": last_execution
        }
    finally:
        conn.close()

async def get_execution_stats() -> Dict[str, Any]:
    return get_execution_stats_sync()

def clear_executions_history_sync() -> int:
    conn = _get_connection()
    try:
        cursor = conn.execute("DELETE FROM executions")
        conn.commit()
        return cursor.rowcount
    finally:
        conn.close()

async def clear_executions_history() -> int:
    return clear_executions_history_sync()
