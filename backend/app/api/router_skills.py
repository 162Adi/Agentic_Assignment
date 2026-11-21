from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.services.lab_data import get_all_skills

router = APIRouter(prefix="/skills", tags=["Skills Registry"])

@router.get("")
async def list_skills() -> List[Dict[str, Any]]:
    return get_all_skills()

@router.get("/{skill_id}")
async def get_skill_detail(skill_id: str) -> Dict[str, Any]:
    skills = get_all_skills()
    for s in skills:
        if s["id"] == skill_id:
            return s
    raise HTTPException(status_code=404, detail=f"Skill '{skill_id}' not found.")
