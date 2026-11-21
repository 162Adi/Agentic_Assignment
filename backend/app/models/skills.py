from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class SkillExample(BaseModel):
    title: str
    input: str
    expected_output: str

class SkillMetadata(BaseModel):
    id: str
    name: str
    lab_id: int
    lab_title: str
    function_or_class: str
    description: str
    instructions: List[str]
    constraints: List[str]
    examples: List[SkillExample] = []
    related_tools: List[str] = []
    reusability: str
    source_snippet: Optional[str] = None
