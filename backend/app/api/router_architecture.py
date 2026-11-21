from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from app.services.lab_data import get_architecture_for_lab, LAB_ARCHITECTURES

router = APIRouter(prefix="/architecture", tags=["Agent Architecture Visualizer"])

@router.get("")
async def list_all_architectures() -> List[Dict[str, Any]]:
    return list(LAB_ARCHITECTURES.values())

@router.get("/{lab_id}")
async def get_architecture(lab_id: int) -> Dict[str, Any]:
    arch = get_architecture_for_lab(lab_id)
    if not arch:
        raise HTTPException(status_code=404, detail=f"Architecture not found for Lab {lab_id}")
    return arch
