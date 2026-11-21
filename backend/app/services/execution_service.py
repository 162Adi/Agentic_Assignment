import asyncio
import os
import sys
import uuid
import time
import subprocess
import threading
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Optional, Any, AsyncGenerator

from app.services.lab_data import get_program_path, get_lab_by_id
from app.database.db import create_execution, update_execution, get_execution

PROGRAM_LABELS = {
    "main": "Reference Program",
    "assignment_1": "Assignment 1",
    "assignment_2": "Assignment 2"
}

class ActiveExecution:
    def __init__(self, execution_id: str, lab_id: int, program_type: str, lab_title: str):
        self.execution_id = execution_id
        self.lab_id = lab_id
        self.program_type = program_type
        self.lab_title = lab_title
        self.program_label = PROGRAM_LABELS.get(program_type, program_type)
        self.process: Optional[subprocess.Popen] = None
        self.listeners: List[asyncio.Queue] = []
        self.stdout_lines: List[str] = []
        self.stderr_lines: List[str] = []
        self.is_done = False
        self.is_stopped = False
        self.start_time = datetime.now(timezone.utc).isoformat()
        self.end_time: Optional[str] = None
        self.exit_code: Optional[int] = None
        self.duration_ms: int = 0

    def add_listener(self) -> asyncio.Queue:
        q = asyncio.Queue()
        # Replay past lines to new listener
        for line in self.stdout_lines:
            q.put_nowait({"type": "stdout", "content": line})
        for line in self.stderr_lines:
            q.put_nowait({"type": "stderr", "content": line})
        if self.is_done:
            status = "stopped" if self.is_stopped else ("success" if self.exit_code == 0 else "failed")
            q.put_nowait({
                "type": "end",
                "status": status,
                "exit_code": self.exit_code,
                "duration_ms": self.duration_ms
            })
        self.listeners.append(q)
        return q

    def remove_listener(self, q: asyncio.Queue):
        if q in self.listeners:
            self.listeners.remove(q)

    def broadcast(self, event: Dict[str, Any]):
        for q in list(self.listeners):
            try:
                q.put_nowait(event)
            except Exception:
                pass

class ExecutionManager:
    def __init__(self):
        self.active_runs: Dict[str, ActiveExecution] = {}

    def get_active(self, execution_id: str) -> Optional[ActiveExecution]:
        return self.active_runs.get(execution_id)

    async def start_execution(self, lab_id: int, program_type: str) -> str:
        # Validate allowlist
        if lab_id < 1 or lab_id > 14:
            raise ValueError(f"Invalid lab_id: {lab_id}. Must be between 1 and 14.")
        if program_type not in ["main", "assignment_1", "assignment_2"]:
            raise ValueError(f"Invalid program_type: {program_type}.")

        script_path = get_program_path(lab_id, program_type)
        if not script_path or not script_path.is_file():
            raise FileNotFoundError(f"Script not found for Lab {lab_id} ({program_type}). Path: {script_path}")

        lab = get_lab_by_id(lab_id)
        lab_title = lab["title"] if lab else f"Lab {lab_id}"
        execution_id = str(uuid.uuid4())

        active = ActiveExecution(execution_id, lab_id, program_type, lab_title)
        self.active_runs[execution_id] = active

        # Record in DB as running
        await create_execution({
            "id": execution_id,
            "lab_id": lab_id,
            "program_type": program_type,
            "lab_title": lab_title,
            "program_label": active.program_label,
            "status": "running",
            "start_time": active.start_time,
            "stdout": "",
            "stderr": ""
        })

        # Launch background runner thread
        loop = asyncio.get_running_loop()
        asyncio.create_task(self._run_process(active, script_path, loop))
        return execution_id

    async def _run_process(self, active: ActiveExecution, script_path: Path, loop: asyncio.AbstractEventLoop):
        t0 = time.time()
        active.broadcast({
            "type": "start",
            "lab_id": active.lab_id,
            "program_type": active.program_type,
            "execution_id": active.execution_id,
            "timestamp": active.start_time
        })

        try:
            # Safe process spawn with argument array (never shell=True)
            active.process = subprocess.Popen(
                [sys.executable, "-u", str(script_path)],
                cwd=str(script_path.parent),
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                bufsize=1,
                encoding="utf-8",
                errors="replace"
            )

            def read_stdout():
                try:
                    for line in iter(active.process.stdout.readline, ""):
                        active.stdout_lines.append(line)
                        loop.call_soon_threadsafe(active.broadcast, {"type": "stdout", "content": line})
                    active.process.stdout.close()
                except Exception:
                    pass

            def read_stderr():
                try:
                    for line in iter(active.process.stderr.readline, ""):
                        active.stderr_lines.append(line)
                        loop.call_soon_threadsafe(active.broadcast, {"type": "stderr", "content": line})
                    active.process.stderr.close()
                except Exception:
                    pass

            t_out = threading.Thread(target=read_stdout, daemon=True)
            t_err = threading.Thread(target=read_stderr, daemon=True)
            t_out.start()
            t_err.start()

            # Wait for process exit in background thread with timeout
            try:
                exit_code = await asyncio.to_thread(active.process.wait, timeout=120)
                active.exit_code = exit_code
            except subprocess.TimeoutExpired:
                active.is_stopped = True
                active.broadcast({"type": "stderr", "content": "\n[TIMEOUT] Execution exceeded 120 seconds limit.\n"})
                try:
                    active.process.kill()
                except Exception:
                    pass
                active.exit_code = -1

            t_out.join(timeout=1.0)
            t_err.join(timeout=1.0)

        except Exception as ex:
            error_msg = f"\n[EXECUTION ERROR] Failed to run process: {str(ex)}\n"
            active.stderr_lines.append(error_msg)
            active.broadcast({"type": "stderr", "content": error_msg})
            active.exit_code = 1

        t1 = time.time()
        active.duration_ms = int((t1 - t0) * 1000)
        active.end_time = datetime.now(timezone.utc).isoformat()
        active.is_done = True

        status = "stopped" if active.is_stopped else ("success" if active.exit_code == 0 else "failed")

        active.broadcast({
            "type": "end",
            "status": status,
            "exit_code": active.exit_code,
            "duration_ms": active.duration_ms,
            "end_time": active.end_time
        })

        # Update SQLite DB
        await update_execution(active.execution_id, {
            "status": status,
            "end_time": active.end_time,
            "duration_ms": active.duration_ms,
            "exit_code": active.exit_code,
            "stdout": "".join(active.stdout_lines),
            "stderr": "".join(active.stderr_lines)
        })

    async def stop_execution(self, execution_id: str) -> bool:
        active = self.active_runs.get(execution_id)
        if not active:
            return False
        if active.is_done:
            return True

        active.is_stopped = True
        if active.process:
            try:
                active.process.terminate()
                await asyncio.sleep(0.2)
                if active.process.poll() is None:
                    active.process.kill()
            except Exception:
                pass
        active.broadcast({"type": "stderr", "content": "\n[STOPPED] Execution was cancelled by user.\n"})
        return True

    async def stream_output(self, execution_id: str) -> AsyncGenerator[Dict[str, Any], None]:
        active = self.active_runs.get(execution_id)
        if not active:
            # Check DB if it was a past run
            record = await get_execution(execution_id)
            if record:
                if record["stdout"]:
                    yield {"type": "stdout", "content": record["stdout"]}
                if record["stderr"]:
                    yield {"type": "stderr", "content": record["stderr"]}
                yield {
                    "type": "end",
                    "status": record["status"],
                    "exit_code": record["exit_code"],
                    "duration_ms": record["duration_ms"]
                }
            else:
                yield {"type": "error", "content": f"Execution {execution_id} not found."}
            return

        queue = active.add_listener()
        try:
            while True:
                msg = await queue.get()
                yield msg
                if msg.get("type") == "end":
                    break
        finally:
            active.remove_listener(queue)

execution_manager = ExecutionManager()
