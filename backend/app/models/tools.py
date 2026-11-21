from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class ToolParameter(BaseModel):
    name: str
    type: str
    description: str
    required: bool = True
    default: Optional[Any] = None

class ToolMetadata(BaseModel):
    id: str
    name: str
    lab_id: int
    lab_title: str
    function_name: str
    description: str
    parameters: List[ToolParameter] = []
    return_type: str
    is_read_only: bool
    has_side_effects: bool
    is_simulated: bool = True
    can_test_standalone: bool = False
    sample_input: Optional[Dict[str, Any]] = None

class ToolTestRequest(BaseModel):
    tool_id: str
    parameters: Dict[str, Any]

class ToolTestResponse(BaseModel):
    tool_id: str
    success: bool
    output: Any
    error: Optional[str] = None
    execution_time_ms: float
