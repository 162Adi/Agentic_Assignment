"""
Agentic AI Systems — Unified 14-Lab Root CLI Runner

Run any lab or assignment directly from the command line:
    python main.py
    python main.py --lab 7
    python main.py --lab 7 --part assignment1
    python main.py --all
    python main.py --list

All 42 executable programs are executed in isolated Python processes.
"""

from pathlib import Path
import argparse
import subprocess
import sys

ROOT = Path(__file__).resolve().parent

# Support labs in either root Lab_* directories or Agentic_AI_14_Labs_Unified/labs/
LABS = [
    (1, "Agent vs Chatbot — Study Planner", "Lab_01_Agent_vs_Chatbot"),
    (2, "Tool-Using Agent — Campus Data Assistant", "Lab_02_Tool_Using_Agent"),
    (3, "Skill Creation — Research Summary Skill", "Lab_03_Skill_Creation"),
    (4, "Memory and Retrieval — Project Memory", "Lab_04_Memory_and_Retrieval"),
    (5, "MCP-Style Connector — Mini Integration Layer", "Lab_05_MCP_Style_Connector"),
    (6, "Personal Agent Runtime — Skills, Tools, Memory, Audit", "Lab_06_Personal_Agent_Runtime"),
    (7, "Agentic Node Graph — Campus App Builder", "Lab_07_Agentic_Node_Graph"),
    (8, "Parallel Swarm — Hackathon Planner", "Lab_08_Parallel_Swarm"),
    (9, "Deep Research Agent — AI Topic Briefing", "Lab_09_Deep_Research_Agent"),
    (10, "Cloud Operations Agent — Failed Deployment", "Lab_10_Cloud_Operations_Agent"),
    (11, "Agentic SDLC Factory — Mini Software Team", "Lab_11_Agentic_SDLC_Factory"),
    (12, "Safety, Evaluation and Governance — Risky Agent Action", "Lab_12_Safety_Evaluation_Governance"),
    (13, "Discipline-Specific Engineering Agents — Mechanical / Civil / Electrical", "Lab_13_Discipline_Specific_Engineering_Agents"),
    (14, "Capstone Project Studio — Campus Help-Desk Agent", "Lab_14_Capstone_Project_Studio"),
]

PART_FILES = {
    "main": "main.py",
    "assignment1": "assignment_1.py",
    "assignment2": "assignment_2.py",
}

PART_LABELS = {
    "main": "Reference Program",
    "assignment1": "Assignment 1",
    "assignment2": "Assignment 2",
}

def resolve_script(folder: str, part: str) -> Path:
    # 1. Try unified package
    p1 = ROOT / "Agentic_AI_14_Labs_Unified" / "labs" / folder / PART_FILES[part]
    if p1.is_file():
        return p1
    # 2. Try root folder
    p2 = ROOT / folder / PART_FILES[part]
    if p2.is_file():
        return p2
    # 3. Try labs/ subdirectory
    p3 = ROOT / "labs" / folder / PART_FILES[part]
    if p3.is_file():
        return p3
    raise FileNotFoundError(f"Program file not found for {folder}/{PART_FILES[part]}")

def show_labs():
    print("\n========== AGENTIC AI COMMAND CENTER — 14 LABS ==========")
    for number, title, folder in LABS:
        print(f"  {number:02d}. {title}")
    print("\nEach lab includes: reference program, Assignment 1, Assignment 2 (42 total).")

def run_program(lab_number: int, part: str) -> bool:
    lab = next((item for item in LABS if item[0] == lab_number), None)
    if lab is None:
        raise ValueError(f"Invalid lab number: {lab_number}")

    _, title, folder = lab
    script = resolve_script(folder, part)

    print("\n" + "=" * 78)
    print(f"LAB {lab_number:02d}: {title}")
    print(f"PART: {PART_LABELS[part]} ({script.name})")
    print("=" * 78 + "\n", flush=True)

    completed = subprocess.run(
        [sys.executable, str(script)],
        cwd=str(script.parent),
        check=False,
    )
    if completed.returncode != 0:
        print(f"\n[FAILED] Lab {lab_number:02d} / {PART_LABELS[part]} (exit code {completed.returncode})")
        return False

    print(f"\n[COMPLETED] Lab {lab_number:02d} / {PART_LABELS[part]}")
    return True

def run_all() -> bool:
    total = 0
    passed = 0
    for lab_number, _, _ in LABS:
        for part in PART_FILES:
            total += 1
            if run_program(lab_number, part):
                passed += 1
    print("\n" + "=" * 78)
    print(f"UNIFIED RUN SUMMARY: {passed}/{total} programs completed successfully")
    print("=" * 78)
    return passed == total

def main():
    parser = argparse.ArgumentParser(description="Agentic AI Command Center — Unified CLI Runner")
    parser.add_argument("--lab", type=int, choices=range(1, 15), help="Lab number to run (1-14)")
    parser.add_argument("--part", choices=["main", "assignment1", "assignment2"], default="main", help="Program type")
    parser.add_argument("--all", action="store_true", help="Execute all 42 lab programs sequentially")
    parser.add_argument("--list", action="store_true", help="Display all 14 labs")

    args = parser.parse_args()

    if args.list:
        show_labs()
        return

    if args.all:
        ok = run_all()
        sys.exit(0 if ok else 1)

    if args.lab:
        ok = run_program(args.lab, args.part)
        sys.exit(0 if ok else 1)

    # Interactive Menu
    show_labs()
    print("\nAvailable actions:")
    print("  1. Run reference program")
    print("  2. Run Assignment 1")
    print("  3. Run Assignment 2")
    print("  4. Run all 42 programs")
    print("  5. Exit")

    choice = input("\nSelect action (1-5): ").strip()
    if choice == "4":
        ok = run_all()
        sys.exit(0 if ok else 1)
    if choice == "5":
        return

    part_map = {"1": "main", "2": "assignment1", "3": "assignment2"}
    if choice in part_map:
        lab_str = input("Enter lab number (1-14): ").strip()
        try:
            lab_num = int(lab_str)
            ok = run_program(lab_num, part_map[choice])
            sys.exit(0 if ok else 1)
        except (ValueError, IndexError):
            print("Invalid lab number.")
            sys.exit(1)

if __name__ == "__main__":
    main()
