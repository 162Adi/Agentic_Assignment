import json
import asyncio
from fastapi import APIRouter, HTTPException, Query, Request
from typing import List, Dict, Any, Optional
from sse_starlette.sse import EventSourceResponse

from app.models.execution import ExecutionRequest, ExecutionResponse, ExecutionDetail
from app.services.execution_service import execution_manager
from app.database.db import (
    list_executions,
    get_execution,
    clear_executions_history
)
from app.services.lab_data import LABS_METADATA

router = APIRouter(prefix="/executions", tags=["Executions"])

@router.post("", response_model=ExecutionResponse)
async def launch_execution(payload: ExecutionRequest):
    try:
        execution_id = await execution_manager.start_execution(
            lab_id=payload.lab_id,
            program_type=payload.program_type
        )
        return ExecutionResponse(
            execution_id=execution_id,
            lab_id=payload.lab_id,
            program_type=payload.program_type,
            status="running",
            message=f"Process spawned for Lab {payload.lab_id} ({payload.program_type})"
        )
    except FileNotFoundError as fnf:
        raise HTTPException(status_code=404, detail=str(fnf))
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as ex:
        raise HTTPException(status_code=500, detail=f"Failed to start execution: {str(ex)}")

@router.get("", response_model=List[Dict[str, Any]])
async def get_executions_history(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    lab_id: Optional[int] = Query(None, ge=1, le=14),
    status: Optional[str] = Query(None)
):
    return await list_executions(limit=limit, offset=offset, lab_id=lab_id, status=status)

@router.get("/{execution_id}")
async def get_execution_by_id(execution_id: str):
    record = await get_execution(execution_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"Execution {execution_id} not found.")
    return record

@router.get("/{execution_id}/stream")
async def stream_execution_output(execution_id: str, request: Request):
    async def event_generator():
        async for event in execution_manager.stream_output(execution_id):
            if await request.is_disconnected():
                break
            yield {
                "event": "message",
                "data": json.dumps(event)
            }

    return EventSourceResponse(event_generator())

@router.post("/{execution_id}/stop")
async def stop_execution_process(execution_id: str):
    stopped = await execution_manager.stop_execution(execution_id)
    if not stopped:
        raise HTTPException(status_code=404, detail=f"Execution {execution_id} not running or not found.")
    return {"status": "stopped", "message": f"Execution {execution_id} has been terminated."}

@router.delete("")
async def clear_history():
    count = await clear_executions_history()
    return {"status": "cleared", "deleted_count": count}

@router.post("/run-all")
async def run_all_lab_programs():
    """Batch executes all 42 programs sequentially in background task."""
    batch_id = f"batch_{int(asyncio.get_event_loop().time())}"

    async def _batch_runner():
        for lab in LABS_METADATA:
            for p_type in ["main", "assignment_1", "assignment_2"]:
                try:
                    eid = await execution_manager.start_execution(lab["id"], p_type)
                    # Wait for completion before starting next
                    active = execution_manager.get_active(eid)
                    if active:
                        while not active.is_done:
                            await asyncio.sleep(0.3)
                except Exception:
                    pass

    asyncio.create_task(_batch_runner())
    return {
        "status": "started",
        "batch_id": batch_id,
        "message": "Initiated automated batch execution of all 42 lab programs."
    }
