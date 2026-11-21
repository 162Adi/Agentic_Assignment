from fastapi import APIRouter
from typing import Dict, Any
import sys
import platform
import time
from datetime import datetime, timezone
from app.database.db import get_execution_stats
from app.services.lab_data import LABS_METADATA

router = APIRouter(tags=["Health & Stats"])
START_TIME = time.time()

@router.get("/health")
async def health_check() -> Dict[str, Any]:
    uptime_sec = int(time.time() - START_TIME)
    return {
        "status": "healthy",
        "service": "Agentic AI Command Center Backend",
        "version": "1.0.0",
        "uptime_seconds": uptime_sec,
        "python_version": sys.version.split()[0],
        "platform": platform.platform(),
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@router.get("/stats")
async def get_overview_stats() -> Dict[str, Any]:
    db_stats = await get_execution_stats()
    return {
        "total_labs": len(LABS_METADATA),
        "total_programs": 42,
        "total_assignments": 28,
        "reference_programs": 14,
        "backend_status": "online",
        "total_executions": db_stats["total_executions"],
        "successful_executions": db_stats["successful_executions"],
        "failed_executions": db_stats["failed_executions"],
        "stopped_executions": db_stats["stopped_executions"],
        "last_execution": db_stats["last_execution"]
    }
