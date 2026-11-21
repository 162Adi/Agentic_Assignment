from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class ExecutionRequest(BaseModel):
    lab_id: int = Field(..., ge=1, le=14, description="Lab identifier (1-14)")
    program_type: str = Field(..., pattern="^(main|assignment_1|assignment_2)$", description="Type of program to execute")

class ExecutionResponse(BaseModel):
    execution_id: str
    lab_id: int
    program_type: str
    status: str
    message: str

class ExecutionDetail(BaseModel):
    id: str
    lab_id: int
    program_type: str
    lab_title: str
    program_label: str
    status: str
    start_time: str
    end_time: Optional[str] = None
    duration_ms: int = 0
    exit_code: Optional[int] = None
    stdout: str = ""
    stderr: str = ""
    created_at: Optional[str] = None

class ExecutionStats(BaseModel):
    total_executions: int
    successful_executions: int
    failed_executions: int
    stopped_executions: int
    last_execution: Optional[ExecutionDetail] = None
