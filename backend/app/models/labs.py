from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ProgramMetadata(BaseModel):
    key: str  # 'main', 'assignment_1', 'assignment_2'
    title: str
    filename: str
    description: str
    docstring: str
    line_count: int
    functions: List[str] = []
    classes: List[str] = []
    expected_output_summary: str

class LabSummary(BaseModel):
    id: int
    title: str
    folder: str
    category: str
    description: str
    learning_objective: str
    icon: str
    program_count: int = 3
    tools_count: int = 0
    skills_count: int = 0
    has_evaluation: bool = False
    has_memory: bool = False

class LabDetail(LabSummary):
    programs: List[ProgramMetadata]
    tools: List[str] = []
    skills: List[str] = []
    memory_type: str
    evaluation_type: str
    governance_type: str
    workflow_summary: str
    readme_content: Optional[str] = None
