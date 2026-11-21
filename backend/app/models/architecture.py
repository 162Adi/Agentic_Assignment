from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class WorkflowNode(BaseModel):
    id: str
    label: str
    type: str  # default, input, output, agent, tool, gate, skill
    description: str
    owner: Optional[str] = None
    input_type: Optional[str] = None
    output_type: Optional[str] = None
    relevant_function: Optional[str] = None
    position: Dict[str, float]  # {'x': 100, 'y': 200}
    status: str = "idle"  # idle, active, completed, failed, approval_required

class WorkflowEdge(BaseModel):
    id: str
    source: str
    target: str
    label: Optional[str] = None
    animated: bool = True
    condition: Optional[str] = None

class LabArchitecture(BaseModel):
    lab_id: int
    lab_title: str
    pattern_name: str
    pattern_description: str
    nodes: List[WorkflowNode]
    edges: List[WorkflowEdge]
