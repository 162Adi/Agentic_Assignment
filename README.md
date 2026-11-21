# AGENTIC AI COMMAND CENTER
### *Explore. Orchestrate. Execute. Observe.*

A full-stack AI developer platform and orchestration command center for exploring, executing, and visualizing **14 Agentic AI Labs and 28 assignments (42 executable programs in total)**.

![Command Center Architecture](https://img.shields.io/badge/Agentic_AI-14_Labs_Verified-8b5cf6?style=for-the-badge)
![FastAPI Backend](https://img.shields.io/badge/Backend-FastAPI_Python_3.13-3b82f6?style=for-the-badge)
![React Frontend](https://img.shields.io/badge/Frontend-React_18_TypeScript_Vite-06b6d4?style=for-the-badge)
![SQLite Telemetry](https://img.shields.io/badge/Database-SQLite_Audit_Ledger-10b981?style=for-the-badge)

---

## 1. Overview

The **Agentic AI Command Center** transforms 14 foundational Agentic AI laboratory implementations into an interactive, production-grade AI engineering workspace. Every program runs in an isolated Python subprocess with real-time stdout/stderr streaming via Server-Sent Events (SSE), full source inspection via Monaco Editor, interactive React Flow workflow visualizations, a dynamic Tools and Skills Registry, a Memory Explorer, and automated evaluation suites.

### Core Capabilities

- **14 Labs & 42 Executable Programs**: Every lab retains its Reference Program (`main.py`), Assignment 1 (`assignment_1.py`), and Assignment 2 (`assignment_2.py`).
- **Real Subprocess Execution**: No fabricated simulations. Python programs execute in isolated subprocesses using `sys.executable` and argument arrays without `shell=True`.
- **Live Terminal Console**: Real-time output streaming via SSE with syntax-aware formatting, duration timers, auto-scroll, copy, and log downloads.
- **Workflow Visualizer**: Interactive React Flow graphs illustrating stateful execution loops, tool dispatchers, MCP connectors, parallel swarms, and safety approval gates.
- **Tools & Skills Registry**: Discoverable interfaces across all 14 labs, featuring standalone test sandbox execution for safe tools (e.g., calculator, word count, FAQ search).
- **Memory Explorer**: Detailed visualization of session working memory vs. persistent long-term stores, topic-scoped retrieval, staleness thresholds, and conflict detection.
- **SQLite Audit Persistence**: Execution history stored locally in SQLite with full duration metrics, exit codes, and stdout/stderr capture.
- **Evaluation Center**: Visualized analytics with Recharts tracking assertion suites, ground-truth validations, and adversarial injection tests.

---

## 2. Directory Structure

```text
Agentic_Indi/
│
├── frontend/                          # React + TypeScript + Vite Frontend
│   ├── src/
│   │   ├── components/                # Reusable UI components
│   │   │   ├── common/                # Stat cards, badges, Monaco code viewer, particles
│   │   │   ├── console/               # Live terminal console with search & download
│   │   │   └── graph/                 # Custom React Flow workflow nodes & detail drawers
│   │   ├── layouts/                   # Collapsible sidebar, top navbar, app shell
│   │   ├── pages/                     # 10 dedicated platform pages
│   │   ├── services/                  # Backend API client & SSE stream subscribers
│   │   ├── stores/                    # Zustand state management (theme, console, runs)
│   │   └── types/                     # Comprehensive TypeScript domain models
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── backend/                           # FastAPI Python Backend
│   ├── app/
│   │   ├── api/                       # API routers (health, labs, executions, tools, skills...)
│   │   ├── database/                  # SQLite async engine & telemetry storage
│   │   ├── models/                    # Pydantic schemas
│   │   ├── services/                  # Subprocess execution manager, lab metadata, evals
│   │   ├── config.py                  # Server configuration & CORS
│   │   └── main.py                    # FastAPI entry point
│   └── requirements.txt
│
├── Agentic_AI_14_Labs_Unified/        # Preserved original unified bundle
│   ├── labs/                          # Labs 1 through 14
│   ├── main.py                        # Unified runner CLI
│   └── run_all_tests.py               # Batch test suite (42/42 verified)
│
├── Lab_01_Agent_vs_Chatbot/           # Original individual lab directories
│   ├── main.py
│   ├── assignment_1.py
│   ├── assignment_2.py
│   └── README.md
├── ...
├── Lab_14_Capstone_Project_Studio/
│
├── main.py                            # Root CLI runner (python main.py --lab 7)
├── .env.example
├── .gitignore
└── README.md
```

---

## 3. Quick Start (Windows & VS Code)

### Prerequisites

- **Python**: 3.10+ (Standard library only for labs; FastAPI & Uvicorn for backend)
- **Node.js**: v18+ with `npm`

---

### Step 1: Start the FastAPI Backend

Open a terminal in the project root:

```powershell
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

- Backend API: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- Interactive Swagger API Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

### Step 2: Start the React Frontend

Open a second terminal window:

```powershell
cd frontend
npm install
npm run dev
```

- Open your browser at: **[http://localhost:5173](http://localhost:5173)**

---

## 4. Unified CLI Runner (Terminal)

The original CLI runner remains fully functional alongside the web platform.

Run any program directly from PowerShell:

```powershell
# Interactive CLI menu:
python main.py

# Run a specific lab reference program:
python main.py --lab 1

# Run Assignment 1 or Assignment 2:
python main.py --lab 1 --part assignment1
python main.py --lab 1 --part assignment2

# Run all 42 programs sequentially:
python main.py --all

# List all 14 labs:
python main.py --list
```

---

## 5. Lab Catalog (42 Programs)

| Lab | Name | Reference Program | Assignment 1 | Assignment 2 |
| :---: | :--- | :--- | :--- | :--- |
| **01** | **Agent vs Chatbot** | Goal -> Plan -> Observe Loop | Two Rounds of Feedback | Detect Scheduling Conflicts |
| **02** | **Tool-Using Agent** | Campus Data Assistant | Notification with Justified Use | Three-Tool Chaining Pipeline |
| **03** | **Skill Creation** | Research Summary Skill | Multi-Claim Source Scoring | Low-Evidence Input Handling |
| **04** | **Memory & Retrieval** | Multi-Session Project Memory | Topic-Scoped Retrieval | Memory Retention & Staleness |
| **05** | **MCP-Style Connector** | Mini Integration Layer | Discoverable `list_files` | Contract Validation & Errors |
| **06** | **Personal Agent Runtime** | OpenClaw 6-Subsystem Architecture | Per-User Rate Limiting | Failure Circuit Breaker |
| **07** | **Agentic Node Graph** | Campus App Builder DAG | Security Scan Gate | Tester Failure Rollback |
| **08** | **Parallel Swarm** | 4-Agent Hackathon Swarm | Marketing Agent Addition | Distributed Peer Critique |
| **09** | **Deep Research Agent** | AI Topic Briefing Synthesis | Contradicting Source Analysis | Source Quality Weighting |
| **10** | **Cloud Operations Agent**| Deployment Root Cause Analysis | Memory Leak Severity Triage | Safe Auto-Remediation Path |
| **11** | **Agentic SDLC Factory** | CSV Feature Delivery Pipeline | Concurrent CSV & PDF Stories | Independent Bug Catch Test |
| **12** | **Safety & Governance** | Multi-Layer Production Shield | Cost-Category Control Policy | Mandatory Re-Evaluation Gate |
| **13** | **Engineering Agents** | Vibration & Temp Sensor Monitor | Electrical Load Forecasting | Consecutive Warning Escalation |
| **14** | **Capstone Studio** | Campus Help-Desk Full Worklet | Self-Service Password Reset | Adversarial Prompt Injection Test |

---

## 6. Backend API Specification

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Live system health, uptime, and Python runtime info |
| `GET` | `/api/stats` | Aggregated statistics (total labs, executions, pass rates) |
| `GET` | `/api/labs` | Directory listing of all 14 labs with summaries |
| `GET` | `/api/labs/{id}` | Detailed metadata, README, and programs for a lab |
| `GET` | `/api/labs/{id}/code/{type}` | Read-only Python source code inspection |
| `POST` | `/api/executions` | Launches a program in an isolated Python subprocess |
| `GET` | `/api/executions` | Queries SQLite execution audit history |
| `GET` | `/api/executions/{id}` | Retrieves specific execution details and logs |
| `GET` | `/api/executions/{id}/stream`| Server-Sent Events (SSE) live streaming stdout/stderr |
| `POST` | `/api/executions/{id}/stop` | Safely terminates running subprocess |
| `POST` | `/api/executions/run-all` | Batch-executes all 42 programs sequentially |
| `GET` | `/api/tools` | Discovered tools across all labs |
| `POST` | `/api/tools/{id}/test` | Interactive standalone sandbox tool test |
| `GET` | `/api/skills` | Discovered skills with instructions & constraints |
| `GET` | `/api/memory` | Memory Explorer models, policies, and timelines |
| `GET` | `/api/evaluations` | Benchmark suites, assertion test cases, pass metrics |
| `GET` | `/api/architecture` | Node graph topologies for React Flow visualization |

---

## 7. Security & Execution Safety

- **Strict Allowlist**: Only the 42 known lab files can be executed. Arbitrary shell command input is completely prohibited.
- **No `shell=True`**: All subprocesses are spawned via `asyncio.create_subprocess_exec` using explicit argument arrays.
- **Timeout Protection**: Every process has a hard 120-second timeout ceiling to prevent infinite loops.
- **CORS Protection**: Access is restricted to authorized frontend origins.
- **Read-Only Code Inspection**: Code endpoints serve strictly sanitized read-only views; file modification via the browser is disabled.
