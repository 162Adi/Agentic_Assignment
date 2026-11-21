from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any, Optional
from app.services.lab_data import (
    get_all_labs,
    get_lab_by_id,
    get_program_path,
    resolve_lab_folder,
    get_tools_for_lab,
    get_skills_for_lab
)

router = APIRouter(prefix="/labs", tags=["Labs"])

@router.get("")
async def list_labs() -> List[Dict[str, Any]]:
    labs = get_all_labs()
    summaries = []
    for l in labs:
        tools = get_tools_for_lab(l["id"])
        skills = get_skills_for_lab(l["id"])
        summaries.append({
            "id": l["id"],
            "title": l["title"],
            "folder": l["folder"],
            "category": l["category"],
            "description": l["description"],
            "learning_objective": l["learning_objective"],
            "icon": l["icon"],
            "program_count": len(l.get("programs", [])),
            "tools_count": len(tools),
            "skills_count": len(skills),
            "has_memory": "Memory" in l.get("memory_type", ""),
            "has_evaluation": True,
            "governance_type": l.get("governance_type", "")
        })
    return summaries

@router.get("/{lab_id}")
async def get_lab_detail(lab_id: int) -> Dict[str, Any]:
    lab = get_lab_by_id(lab_id)
    if not lab:
        raise HTTPException(status_code=404, detail=f"Lab {lab_id} not found.")

    folder = resolve_lab_folder(lab["folder"])
    readme_content = None
    if folder:
        readme_path = folder / "README.md"
        if readme_path.is_file():
            readme_content = readme_path.read_text(encoding="utf-8", errors="replace")

    tools = get_tools_for_lab(lab_id)
    skills = get_skills_for_lab(lab_id)

    # Enrich program info with line count and docstring
    programs_enriched = []
    for prog in lab.get("programs", []):
        p_path = get_program_path(lab_id, prog["key"])
        line_count = 0
        if p_path and p_path.is_file():
            try:
                line_count = len(p_path.read_text(encoding="utf-8", errors="replace").splitlines())
            except Exception:
                pass
        programs_enriched.append({
            **prog,
            "line_count": line_count,
            "exists": p_path is not None and p_path.is_file()
        })

    return {
        **lab,
        "programs": programs_enriched,
        "tools": tools,
        "skills": skills,
        "readme_content": readme_content
    }

@router.get("/{lab_id}/code/{program_type}")
async def get_lab_source_code(lab_id: int, program_type: str) -> Dict[str, Any]:
    if program_type not in ["main", "assignment_1", "assignment_2"]:
        raise HTTPException(status_code=400, detail="Invalid program_type. Must be 'main', 'assignment_1', or 'assignment_2'.")

    p_path = get_program_path(lab_id, program_type)
    if not p_path or not p_path.is_file():
        raise HTTPException(status_code=404, detail=f"Source file not found for Lab {lab_id} ({program_type}).")

    code = p_path.read_text(encoding="utf-8", errors="replace")
    return {
        "lab_id": lab_id,
        "program_type": program_type,
        "filename": p_path.name,
        "filepath": str(p_path),
        "line_count": len(code.splitlines()),
        "source_code": code
    }
