from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from app.services.evaluation_service import get_evaluation_overview, get_evaluation_for_lab

router = APIRouter(prefix="/evaluations", tags=["Evaluations"])

@router.get("")
async def get_all_evaluations() -> Dict[str, Any]:
    return get_evaluation_overview()

@router.get("/{lab_id}")
async def get_lab_evaluation(lab_id: int) -> Dict[str, Any]:
    res = get_evaluation_for_lab(lab_id)
    if not res:
        raise HTTPException(status_code=404, detail=f"No evaluation suite defined for Lab {lab_id}")
    return res
