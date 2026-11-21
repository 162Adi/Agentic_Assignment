import time
from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any, Optional
from app.services.lab_data import get_all_tools, TOOLS_METADATA
from app.models.tools import ToolTestRequest, ToolTestResponse

router = APIRouter(prefix="/tools", tags=["Tools Registry"])

@router.get("")
async def list_tools() -> List[Dict[str, Any]]:
    return get_all_tools()

@router.get("/{tool_id}")
async def get_tool_detail(tool_id: str) -> Dict[str, Any]:
    tools = get_all_tools()
    for t in tools:
        if t["id"] == tool_id:
            return t
    raise HTTPException(status_code=404, detail=f"Tool '{tool_id}' not found.")

@router.post("/{tool_id}/test", response_model=ToolTestResponse)
async def test_tool_execution(tool_id: str, payload: ToolTestRequest) -> ToolTestResponse:
    tool = None
    for t in TOOLS_METADATA:
        if t["id"] == tool_id:
            tool = t
            break

    if not tool:
        raise HTTPException(status_code=404, detail=f"Tool '{tool_id}' not found.")

    t0 = time.perf_counter()
    params = payload.parameters or {}

    try:
        # Safe deterministic execution for testable tools
        if tool_id == "calculator":
            expr = str(params.get("expression", "0")).strip()
            # Strict safety check: only allow digits, spaces, and math operators
            allowed_chars = set("0123456789+-*/(). %")
            if not all(c in allowed_chars for c in expr):
                raise ValueError("Expression contains invalid or disallowed characters.")
            # Safe evaluation
            val = eval(expr, {"__builtins__": None}, {})
            t1 = time.perf_counter()
            return ToolTestResponse(
                tool_id=tool_id,
                success=True,
                output={"expression": expr, "result": val},
                execution_time_ms=round((t1 - t0) * 1000, 2)
            )

        elif tool_id == "tool_word_count":
            text = str(params.get("text", ""))
            words = text.split()
            sentences = [s for s in text.replace("!", ".").replace("?", ".").split(".") if s.strip()]
            t1 = time.perf_counter()
            return ToolTestResponse(
                tool_id=tool_id,
                success=True,
                output={
                    "character_count": len(text),
                    "word_count": len(words),
                    "sentence_count": len(sentences),
                    "estimated_reading_time_sec": round(len(words) / 3.5, 1)
                },
                execution_time_ms=round((t1 - t0) * 1000, 2)
            )

        elif tool_id == "mock_events_api":
            kw = str(params.get("date_or_keyword", "")).lower()
            events = [
                {"event": "Autonomous AI Agent Hackathon", "date": "2026-11-25", "venue": "Campus Hall B"},
                {"event": "Robotics Seminar with Dr. Chen", "date": "2026-11-28", "venue": "Engineering Lab 102"},
                {"event": "CS Career Fair & Sponsor Meet", "date": "2026-12-02", "venue": "Student Union"}
            ]
            matched = [e for e in events if kw in e["event"].lower() or kw in e["date"]] or events
            t1 = time.perf_counter()
            return ToolTestResponse(
                tool_id=tool_id,
                success=True,
                output={"matches": matched, "total_found": len(matched)},
                execution_time_ms=round((t1 - t0) * 1000, 2)
            )

        elif tool_id == "tool_search_faq":
            q = str(params.get("query", "")).lower()
            faqs = {
                "wifi": "To connect to campus WiFi, select 'Campus-Secure', enter your student email, and accept the security certificate.",
                "password": "To reset your student portal password, visit https://id.campus.edu/reset or contact the IT desk.",
                "printer": "Printers are available in Library 2F and Lab 304 using your student RFID card.",
                "dorm": "Dorm maintenance requests can be logged 24/7 via the campus help-desk portal."
            }
            ans = next((ans for key, ans in faqs.items() if key in q), "No direct FAQ article found. An IT helpdesk ticket should be dispatched.")
            t1 = time.perf_counter()
            return ToolTestResponse(
                tool_id=tool_id,
                success=True,
                output={"query": q, "matched_faq": ans},
                execution_time_ms=round((t1 - t0) * 1000, 2)
            )

        elif tool_id == "send_notification":
            rec = params.get("recipient", "user@campus.edu")
            msg = params.get("message", "Test notification")
            just = params.get("justification", "Testing sandbox")
            t1 = time.perf_counter()
            return ToolTestResponse(
                tool_id=tool_id,
                success=True,
                output={
                    "status": "QUEUED_SIMULATED",
                    "recipient": rec,
                    "message_preview": msg[:50] + "..." if len(msg) > 50 else msg,
                    "justification_logged": just,
                    "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
                },
                execution_time_ms=round((t1 - t0) * 1000, 2)
            )

        elif tool_id == "tool_create_ticket":
            cat = params.get("category", "General")
            issue = params.get("issue", "Issue description")
            prio = params.get("priority", "Medium")
            t1 = time.perf_counter()
            return ToolTestResponse(
                tool_id=tool_id,
                success=True,
                output={
                    "ticket_id": f"TCK-{int(time.time()) % 10000}",
                    "status": "OPEN",
                    "category": cat,
                    "issue_summary": issue,
                    "priority": prio,
                    "sla_response_hours": 4 if prio == "High" else 24
                },
                execution_time_ms=round((t1 - t0) * 1000, 2)
            )

        else:
            # Generic simulated handler for remaining tools
            t1 = time.perf_counter()
            return ToolTestResponse(
                tool_id=tool_id,
                success=True,
                output={
                    "status": "SIMULATED_SUCCESS",
                    "tool": tool["name"],
                    "inputs_received": params,
                    "note": "Deterministic test response from simulated agent backend."
                },
                execution_time_ms=round((t1 - t0) * 1000, 2)
            )

    except Exception as ex:
        t1 = time.perf_counter()
        return ToolTestResponse(
            tool_id=tool_id,
            success=False,
            output=None,
            error=str(ex),
            execution_time_ms=round((t1 - t0) * 1000, 2)
        )
