from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class MemoryRecordItem(BaseModel):
    id: str
    topic: str
    content: str
    author: str
    timestamp: str
    is_session: bool
    is_long_term: bool
    is_stale: bool = False
    access_permission: str = "open"

class LabMemoryOverview(BaseModel):
    lab_id: int
    lab_title: str
    memory_type: str  # in-memory, session-scoped, multi-session, user-scoped
    persistence: str  # ephemeral (process life), disk, none
    records: List[MemoryRecordItem] = []
    features: List[str] = []
    conflict_policy: str
    retrieval_strategy: str
