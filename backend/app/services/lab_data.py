import ast
from pathlib import Path
from typing import Dict, List, Optional, Any
from app.config import UNIFIED_LABS_DIR, ROOT_LABS_DIR, WORKSPACE_ROOT

# Map of 14 Labs with complete metadata
LABS_METADATA = [
    {
        "id": 1,
        "title": "Agent vs Chatbot — Study Planner",
        "folder": "Lab_01_Agent_vs_Chatbot",
        "category": "Foundational Patterns",
        "description": "Distinguishes proactive autonomous agents from reactive conversational chatbots via a Goal -> Plan -> Act -> Observe -> Revise loop.",
        "learning_objective": "Understand stateful execution loops, satisfaction conditions, iterative plan mutation, and conflict resolution without restarting agent loops.",
        "icon": "Calendar",
        "workflow_summary": "Goal Definition -> Plan Formulation -> Tool Query -> Plan Construction -> Feedback Observation -> In-Place Revision",
        "memory_type": "Session Plan State Object with Iteration Log",
        "evaluation_type": "Schedule satisfaction check and conflict detection assertions",
        "governance_type": "Deterministic constraint verification (no busy-slot overlaps)",
        "programs": [
            {
                "key": "main",
                "title": "Reference Program",
                "filename": "main.py",
                "description": "Executes the core Goal -> Plan -> Act -> Observe loop. Reads schedule, generates weekly plan, and revises Tuesday on feedback.",
                "expected_output_summary": "Goal satisfied, weekly plan built, Tuesday revised to 20:00-22:00, 7 iteration logs printed."
            },
            {
                "key": "assignment_1",
                "title": "Assignment 1: Two Rounds of Feedback",
                "filename": "assignment_1.py",
                "description": "Applies two independent feedback cycles (Tuesday evening and Friday 1-hour) verifying in-place mutation of the same plan object.",
                "expected_output_summary": "Both feedback rounds applied. Verifies: 'Same plan object throughout both revisions: True'."
            },
            {
                "key": "assignment_2",
                "title": "Assignment 2: Detect a Scheduling Conflict",
                "filename": "assignment_2.py",
                "description": "Detects conflicts with busy days (Wednesday and Friday), reports conflicts, simulates user resolution, and finalizes.",
                "expected_output_summary": "Conflict detected for Wednesday and Friday, resolved, finalized plan excludes conflicting slots."
            }
        ]
    },
    {
        "id": 2,
        "title": "Tool-Using Agent — Campus Data Assistant",
        "folder": "Lab_02_Tool_Using_Agent",
        "category": "Tool Augmentation",
        "description": "Implements an agent that plans tool invocations, dynamically selects tools, executes them with parameters, and synthesizes answers.",
        "learning_objective": "Master parameter validation, multi-tool chaining, deterministic tool dispatch, and tool justification audits.",
        "icon": "Wrench",
        "workflow_summary": "User Query -> Intent Parser -> Tool Planner -> Tool Execution -> Result Aggregator -> Response",
        "memory_type": "Tool Execution Call Log and Context State",
        "evaluation_type": "Ground-truth value comparison on CSV parsing and arithmetic",
        "governance_type": "Tool parameter validation & safe read-only operations",
        "programs": [
            {
                "key": "main",
                "title": "Reference Program",
                "filename": "main.py",
                "description": "Answers campus questions by dispatching to calculator, read_csv, or mock_events_api based on queries.",
                "expected_output_summary": "Answers 3 diverse campus questions with step-by-step tool invocation traces."
            },
            {
                "key": "assignment_1",
                "title": "Assignment 1: Notification Tool with Justified Use",
                "filename": "assignment_1.py",
                "description": "Adds a simulated email notification tool, enforcing policy that notifications must be accompanied by explicit reason logs.",
                "expected_output_summary": "Tool execution trace confirms email dispatched with required justification string."
            },
            {
                "key": "assignment_2",
                "title": "Assignment 2: Three-Tool Chain",
                "filename": "assignment_2.py",
                "description": "Executes a pipeline: read CSV with categories -> filter records by category -> compute average using calculator.",
                "expected_output_summary": "Three-tool chain executes in sequence to compute category averages."
            }
        ]
    },
    {
        "id": 3,
        "title": "Skill Creation — Research Summary Skill",
        "folder": "Lab_03_Skill_Creation",
        "category": "Prompt & Skill Engineering",
        "description": "Encapsulates reusable agent capability into a modular skill: extracts primary claims, supporting evidence, limitations, and takeaways.",
        "learning_objective": "Design reusable, parameter-driven skills with strict contract validation, multi-claim parsing, and evidence thresholding.",
        "icon": "FileText",
        "workflow_summary": "Article Text -> Sentence Tokenization -> Claim Extraction -> Evidence Mapping -> Limitation Check -> Structured Skill Output",
        "memory_type": "Stateless Skill Execution Envelope",
        "evaluation_type": "Evidence scoring and claim coverage evaluation against test cases",
        "governance_type": "Low-evidence rejection threshold and contract compliance",
        "programs": [
            {
                "key": "main",
                "title": "Reference Program",
                "filename": "main.py",
                "description": "Applies Research Summary Skill to paper excerpt and conducts reusability check on another domain.",
                "expected_output_summary": "Outputs structured claim, evidence, limitation, and actionable takeaway."
            },
            {
                "key": "assignment_1",
                "title": "Assignment 1: Multi-Claim Source",
                "filename": "assignment_1.py",
                "description": "Extends skill to extract multiple distinct claims with individual evidence scores and rankings.",
                "expected_output_summary": "Extracts 2 claims with separate evidence scores and ranked synthesis."
            },
            {
                "key": "assignment_2",
                "title": "Assignment 2: Low-Evidence Input Handling",
                "filename": "assignment_2.py",
                "description": "Tests skill robustness against inputs with zero or weak evidence; enforces cautious fallback output.",
                "expected_output_summary": "Correctly flags 'INSUFFICIENT_EVIDENCE' limitation when claims lack quantitative support."
            }
        ]
    },
    {
        "id": 4,
        "title": "Memory and Retrieval — Project Memory",
        "folder": "Lab_04_Memory_and_Retrieval",
        "category": "Memory & State Management",
        "description": "Multi-session project assistant separating ephemeral session state from long-term memory, with topic-scoped retrieval and conflict detection.",
        "learning_objective": "Differentiate working memory from persistent stores, handle source tagging, conflict detection, and TTL/staleness expiry.",
        "icon": "Database",
        "workflow_summary": "User Input -> Session Context Check -> Long-Term Memory Retrieval -> Conflict Detection -> Permission Gate -> Stored Fact Update",
        "memory_type": "Multi-tier: Ephemeral Session State + Persistent Fact Store with Author & Timestamp Metadata",
        "evaluation_type": "Topic scoping accuracy, conflict detection verification, staleness test",
        "governance_type": "Role-based memory write permissions (e.g. read-only student vs admin write)",
        "programs": [
            {
                "key": "main",
                "title": "Reference Program",
                "filename": "main.py",
                "description": "Stores and retrieves facts across sessions, demonstrates source tagging, and flags conflicting deadline updates.",
                "expected_output_summary": "Answers questions citing fact sources; detects and warns about conflicting project deadlines."
            },
            {
                "key": "assignment_1",
                "title": "Assignment 1: Topic-Scoped Retrieval",
                "filename": "assignment_1.py",
                "description": "Retrieves only memories matching an explicit topic filter, preventing cross-topic contamination.",
                "expected_output_summary": "Filters memory retrieval strictly by requested topic ('backend' vs 'design')."
            },
            {
                "key": "assignment_2",
                "title": "Assignment 2: Memory Retention and Staleness",
                "filename": "assignment_2.py",
                "description": "Introduces staleness threshold (e.g. 30 days) where old facts are marked stale and require re-confirmation.",
                "expected_output_summary": "Identifies stale facts and warns user before relying on outdated information."
            }
        ]
    },
    {
        "id": 5,
        "title": "MCP-Style Connector — Mini Integration Layer",
        "folder": "Lab_05_MCP_Style_Connector",
        "category": "Protocol & Integration",
        "description": "Builds a client-server integration layer inspired by Model Context Protocol (MCP) using capability discovery manifests and typed contracts.",
        "learning_objective": "Implement client discovery, RPC-like tool invocations, manifest schema validation, and typed error handling.",
        "icon": "Layers",
        "workflow_summary": "Client Init -> Discover Manifest -> Inspect Capabilities -> Invoke Tool/Resource -> Validate Schema -> Server Response",
        "memory_type": "Server Capability Manifest & Client Session Cache",
        "evaluation_type": "Manifest contract conformance and invalid capability invocation tests",
        "governance_type": "Schema validation and unknown tool invocation rejection",
        "programs": [
            {
                "key": "main",
                "title": "Reference Program",
                "filename": "main.py",
                "description": "MCPClient discovers server capabilities (`read_file`, `query_db`, `call_api`) and invokes them through typed requests.",
                "expected_output_summary": "Client discovers 3 tools and executes queries with structured responses."
            },
            {
                "key": "assignment_1",
                "title": "Assignment 1: Add Discoverable 'list_files' Capability",
                "filename": "assignment_1.py",
                "description": "Adds a 4th capability `list_files` to MCPServer manifest; client discovers and executes file listing.",
                "expected_output_summary": "Client dynamically discovers new `list_files` capability and lists directory contents."
            },
            {
                "key": "assignment_2",
                "title": "Assignment 2: Connector Contract Validation & Error Handling",
                "filename": "assignment_2.py",
                "description": "Tests client response to unknown capabilities, missing parameters, and simulated server errors.",
                "expected_output_summary": "Gracefully catches and returns structured error envelopes without crashing."
            }
        ]
    },
    {
        "id": 6,
        "title": "Personal Agent Runtime — Skills, Tools, Memory, Audit",
        "folder": "Lab_06_Personal_Agent_Runtime",
        "category": "Agent Architecture",
        "description": "Constructs an OpenClaw/OpenCLA style modular personal agent runtime with 6 decoupled subsystems: Interface, Runtime, Skills, Tools, Memory, and Audit.",
        "learning_objective": "Architect decoupled agent runtimes, enforce append-only audit logging, implement per-user rate limiting and error retry counts.",
        "icon": "Cpu",
        "workflow_summary": "User Task -> Interface -> Runtime Dispatch -> Skill Selection -> Tool Execution -> Memory Update -> Audit Record",
        "memory_type": "User-Scoped ScopedMemory with Append-Only Audit Trail",
        "evaluation_type": "Rate limiting bounds, retry exhaustion, and audit log completeness checks",
        "governance_type": "Append-only immutable audit trail and user rate limiting",
        "programs": [
            {
                "key": "main",
                "title": "Reference Program",
                "filename": "main.py",
                "description": "Executes tasks via SummarizeNotesSkill, DraftEmailSkill, and TranslateTextSkill with audit trails and user memory.",
                "expected_output_summary": "Dispatches 3 diverse user tasks through skills with full audit entries printed."
            },
            {
                "key": "assignment_1",
                "title": "Assignment 1: Per-User Rate Limiting",
                "filename": "assignment_1.py",
                "description": "Enforces max task execution quota per user (e.g. max 2 tasks); blocks excess executions.",
                "expected_output_summary": "Allows first 2 requests; rejects 3rd request with 'Rate limit exceeded' audit entry."
            },
            {
                "key": "assignment_2",
                "title": "Assignment 2: Retry with Failure Circuit Breaker",
                "filename": "assignment_2.py",
                "description": "Tracks consecutive failures in runtime; triggers cooldown circuit breaker when failures exceed threshold.",
                "expected_output_summary": "Simulates failure, records prior failures, and triggers circuit breaker."
            }
        ]
    },
    {
        "id": 7,
        "title": "Agentic Node Graph — Campus App Builder",
        "folder": "Lab_07_Agentic_Node_Graph",
        "category": "Graph Workflows",
        "description": "Models a multi-step campus application builder as a directed acyclic node graph where each node has explicit owners, inputs, and failure gates.",
        "learning_objective": "Design directed acyclic workflow graphs, manage node execution state transitions, and handle human-in-the-loop gating.",
        "icon": "GitBranch",
        "workflow_summary": "Requirements Node -> Planner Node -> Builder Node -> Security Scan Gate -> Tester Node -> Reviewer Node -> Human Approval Gate",
        "memory_type": "Graph Shared Context Envelope Passed Node-to-Node",
        "evaluation_type": "Node state transitions, test pass criteria, and security gate compliance",
        "governance_type": "Human-in-the-loop deployment authorization gate & security vulnerability scan",
        "programs": [
            {
                "key": "main",
                "title": "Reference Program",
                "filename": "main.py",
                "description": "Executes 6-node pipeline from requirements to human approval gate with state transitions.",
                "expected_output_summary": "Each node runs sequentially; final human gate confirms build approval."
            },
            {
                "key": "assignment_1",
                "title": "Assignment 1: Security Scan Node Insertion",
                "filename": "assignment_1.py",
                "description": "Inserts dedicated security scanning node between builder and tester that blocks build on detected vulnerabilities.",
                "expected_output_summary": "Graph runs through security scan; validates code safety before passing to tester."
            },
            {
                "key": "assignment_2",
                "title": "Assignment 2: Automated Rollback on Tester Failure",
                "filename": "assignment_2.py",
                "description": "Simulates a unit test failure in Tester node; triggers automated rollback state and aborts human gate.",
                "expected_output_summary": "Tester node fails -> graph routes to 'ROLLBACK_TRIGGERED' status."
            }
        ]
    },
    {
        "id": 8,
        "title": "Parallel Swarm — Hackathon Planner",
        "folder": "Lab_08_Parallel_Swarm",
        "category": "Multi-Agent Swarms",
        "description": "Orchestrates concurrent specialized role agents (Research, Logistics, Budget, Judging) whose outputs are merged and resolved for conflicts.",
        "learning_objective": "Coordinate parallel agent execution, merge heterogeneous structured outputs, detect resource conflicts, and execute distributed critique.",
        "icon": "Users",
        "workflow_summary": "Coordinator Init -> Fan-Out to 4+ Role Agents -> Concurrent Execution -> Merge Collector -> Conflict Detection -> Consensus Resolution",
        "memory_type": "Swarm Consensus Blackboard with Role Sub-Sections",
        "evaluation_type": "Cross-role conflict detection and budget constraint verification",
        "governance_type": "Budget cap policy enforcement ($5,000 limit) and venue capacity constraints",
        "programs": [
            {
                "key": "main",
                "title": "Reference Program",
                "filename": "main.py",
                "description": "Runs 4 parallel agents (Research, Logistics, Budget, Judging), merges outputs into unified hackathon plan.",
                "expected_output_summary": "Coordinator merges all 4 agent proposals into coherent schedule and budget."
            },
            {
                "key": "assignment_1",
                "title": "Assignment 1: Marketing Agent Addition",
                "filename": "assignment_1.py",
                "description": "Adds 5th concurrent agent (Marketing Agent) to swarm with promotional channels and timeline.",
                "expected_output_summary": "Merged plan incorporates marketing outreach milestones alongside logistics."
            },
            {
                "key": "assignment_2",
                "title": "Assignment 2: Distributed Peer Critique Phase",
                "filename": "assignment_2.py",
                "description": "Adds 2nd phase where agents critique each other's proposals (e.g. Budget critiques Logistics overspending).",
                "expected_output_summary": "Critique matrix displayed; conflicts resolved with revised allocations."
            }
        ]
    },
    {
        "id": 9,
        "title": "Deep Research Agent — AI Topic Briefing",
        "folder": "Lab_09_Deep_Research_Agent",
        "category": "Deep Research",
        "description": "Conducts multi-source evidence extraction, cross-source contradiction detection, gap analysis, and traceable synthesis.",
        "learning_objective": "Build evidence tables, detect contradictions between independent sources, calculate weighted credibility, and generate traceable citations.",
        "icon": "Search",
        "workflow_summary": "Topic Query -> Source Ingestion -> Evidence Matrix Extraction -> Contradiction Analysis -> Gap Identification -> Executive Briefing",
        "memory_type": "Evidence Table Matrix with Source Provenance Links",
        "evaluation_type": "Citation trace completeness and contradiction detection accuracy",
        "governance_type": "Uncited claim rejection & source quality weighting",
        "programs": [
            {
                "key": "main",
                "title": "Reference Program",
                "filename": "main.py",
                "description": "Builds evidence table from 3 academic/industry sources and synthesizes a briefing on agent autonomy.",
                "expected_output_summary": "Generates evidence table, notes points of consensus and open gaps, produces executive summary."
            },
            {
                "key": "assignment_1",
                "title": "Assignment 1: Directly Contradicting Source",
                "filename": "assignment_1.py",
                "description": "Introduces 4th source with direct contradictory claim on benchmark latency; agent highlights disagreement.",
                "expected_output_summary": "Explicitly highlights contradiction between Source B and Source D in synthesis."
            },
            {
                "key": "assignment_2",
                "title": "Assignment 2: Source Quality Weighting",
                "filename": "assignment_2.py",
                "description": "Applies quality multipliers (peer-reviewed vs blog) to determine predominant consensus when sources clash.",
                "expected_output_summary": "Calculates weighted evidence scores to substantiate final recommendations."
            }
        ]
    },
    {
        "id": 10,
        "title": "Cloud Operations Agent — Failed Deployment",
        "folder": "Lab_10_Cloud_Operations_Agent",
        "category": "Autonomous Operations",
        "description": "Monitors deployment telemetry, correlates error spikes with code releases, classifies severity, drafts remediation, and enforces approval gates.",
        "learning_objective": "Perform telemetry log correlation, automate root cause analysis, classify incident severity (SEV1-SEV3), and enforce risk-governed approval gates.",
        "icon": "CloudLightning",
        "workflow_summary": "Telemetry Stream -> Log & Metric Ingestion -> Anomaly Detection -> Git Change Correlation -> Severity Classification -> Human Approval Gate -> Rollback",
        "memory_type": "Incident Context & Telemetry Timeline Cache",
        "evaluation_type": "Root cause identification accuracy and severity classification precision",
        "governance_type": "Mandatory human sign-off on SEV1 destructive/production actions",
        "programs": [
            {
                "key": "main",
                "title": "Reference Program",
                "filename": "main.py",
                "description": "Diagnoses connection timeout spike after commit #a4f91c; classifies SEV1, drafts rollback approval.",
                "expected_output_summary": "Identifies bad database pool commit, flags SEV1, pauses at approval gate."
            },
            {
                "key": "assignment_1",
                "title": "Assignment 1: Memory Leak Incident Diagnosis",
                "filename": "assignment_1.py",
                "description": "Tests agent on a gradual memory leak pattern; classifies SEV2 and recommends cache restart.",
                "expected_output_summary": "Correlates OOM errors, classifies SEV2, proposes container memory ceiling increase."
            },
            {
                "key": "assignment_2",
                "title": "Assignment 2: Safe Auto-Remediation Path",
                "filename": "assignment_2.py",
                "description": "Enables automatic execution for low-risk non-destructive actions while keeping high-risk actions gated.",
                "expected_output_summary": "Low-risk cache flush proceeds automatically; production rollback requests explicit confirmation."
            }
        ]
    },
    {
        "id": 11,
        "title": "Agentic SDLC Factory — Mini Software Team",
        "folder": "Lab_11_Agentic_SDLC_Factory",
        "category": "Autonomous Software Engineering",
        "description": "Automates end-to-end software delivery: Requirements Agent -> Design Agent -> Coding Agent -> Testing Agent -> Review Agent -> Release.",
        "learning_objective": "Orchestrate multi-role software pipelines, run automated test suites against agent-written code, and catch regressions before release.",
        "icon": "Code",
        "workflow_summary": "User Story -> Requirements Analysis -> Architecture Design -> Code Generation -> Test Suite Execution -> Code Review -> Release Packaging",
        "memory_type": "Artifact Repository (User Stories, Code Modules, Test Reports)",
        "evaluation_type": "Automated test suite with 100% assertion pass requirement",
        "governance_type": "Human story sign-off gate & zero-test-failure release block",
        "programs": [
            {
                "key": "main",
                "title": "Reference Program",
                "filename": "main.py",
                "description": "Runs complete SDLC pipeline implementing a CSV export feature; runs unit tests and creates release.",
                "expected_output_summary": "Passes all 3 unit test cases and publishes verified release artifact."
            },
            {
                "key": "assignment_1",
                "title": "Assignment 1: Concurrent CSV and PDF Stories",
                "filename": "assignment_1.py",
                "description": "Executes two concurrent feature stories (CSV export and PDF summary export) through the SDLC pipeline.",
                "expected_output_summary": "Both features developed, tested independently, and bundled into release."
            },
            {
                "key": "assignment_2",
                "title": "Assignment 2: Independent Test Catches Deliberate Bug",
                "filename": "assignment_2.py",
                "description": "Injects an off-by-one bug into the generated code; verifies testing agent catches bug and aborts release.",
                "expected_output_summary": "Testing agent reports 1 failure, blocks release, logs regression details."
            }
        ]
    },
    {
        "id": 12,
        "title": "Safety, Evaluation and Governance — Risky Agent Action",
        "folder": "Lab_12_Safety_Evaluation_Governance",
        "category": "AI Governance & Safety",
        "description": "Implements a multi-layer governance shield for agents proposing infrastructure modifications: RBAC, safety evaluation, human approval, and audit.",
        "learning_objective": "Construct defense-in-depth safety layers, enforce cost and blast-radius thresholds, implement proposal re-evaluation policies, and scrub PII.",
        "icon": "ShieldCheck",
        "workflow_summary": "Action Request -> Identity & RBAC Check -> PII Scrubbing -> Risk & Cost Evaluation -> Human Approval Gate -> Action Dispatch -> Audit Log",
        "memory_type": "Tamper-Evident Audit Ledger with Hash Verification",
        "evaluation_type": "Safety rule suite: permission check, blast radius limit, cost threshold",
        "governance_type": "Multi-tier approval policy, rollback evidence mandate, and cost category gates",
        "programs": [
            {
                "key": "main",
                "title": "Reference Program",
                "filename": "main.py",
                "description": "Evaluates a proposed server resize; verifies permission, evaluates safety score, requires approval, logs audit entry.",
                "expected_output_summary": "Safety evaluation passes, requires human approval, records audit ledger."
            },
            {
                "key": "assignment_1",
                "title": "Assignment 1: Cost-Category Control & Adversarial Test",
                "filename": "assignment_1.py",
                "description": "Blocks proposals exceeding monthly budget thresholds or lacking declared cost categories.",
                "expected_output_summary": "Rejects missing-cost proposal with 'ADVERSARIAL_REJECT' error."
            },
            {
                "key": "assignment_2",
                "title": "Assignment 2: Mandatory Periodic Re-Evaluation",
                "filename": "assignment_2.py",
                "description": "Enforces policy that agent evaluation credentials expire after every 5 proposals, requiring fresh evaluation.",
                "expected_output_summary": "Allows 5 proposals; 6th proposal triggers re-evaluation before proceeding."
            }
        ]
    },
    {
        "id": 13,
        "title": "Discipline-Specific Engineering Agents — Mechanical / Civil / Electrical",
        "folder": "Lab_13_Discipline_Specific_Engineering_Agents",
        "category": "Domain Engineering Agents",
        "description": "Applies agentic paradigms (telemetry reading, classification, trend analysis, safety envelopes) to mechanical maintenance and electrical load balancing.",
        "learning_objective": "Apply agent reasoning to cyber-physical sensor systems, implement physical safety limits, detect consecutive warnings, and forecast loads.",
        "icon": "Activity",
        "workflow_summary": "Sensor Ingestion -> Condition Classification -> Trend Vector Calculation -> Physical Safety Threshold Gate -> Preventive Recommendation",
        "memory_type": "Sliding Window Sensor Log & Trend History",
        "evaluation_type": "Physical constraint checks (vibration < 5.0 mm/s, temperature < 85C, power < 95%)",
        "governance_type": "Hard safety cutoff gate when physical thresholds are breached",
        "programs": [
            {
                "key": "main",
                "title": "Reference Program",
                "filename": "main.py",
                "description": "Monitors mechanical pump vibration and temperature logs, classifies condition, calculates trend, issues alerts.",
                "expected_output_summary": "Detects rising bearing temperature trend, recommends lubrication maintenance before failure."
            },
            {
                "key": "assignment_1",
                "title": "Assignment 1: Electrical Engineering Load Forecasting",
                "filename": "assignment_1.py",
                "description": "Analyzes industrial power logs, classifies grid load, forecasts next hour load, checks electrical safety gates.",
                "expected_output_summary": "Identifies peak load surge, forecasts threshold breach, triggers shedding recommendation."
            },
            {
                "key": "assignment_2",
                "title": "Assignment 2: Escalation on Three Consecutive Warnings",
                "filename": "assignment_2.py",
                "description": "Enforces policy escalating to emergency shutdown if 3 consecutive warning readings occur.",
                "expected_output_summary": "Tracks 3 consecutive warning states and triggers emergency escalation."
            }
        ]
    },
    {
        "id": 14,
        "title": "Capstone Project Studio — Campus Help-Desk Agent",
        "folder": "Lab_14_Capstone_Project_Studio",
        "category": "Integrated Capstone",
        "description": "Comprehensive capstone combining all 13 prior modules into a production-grade campus help-desk agent: skills, tools, node graph, memory, and automated evaluations.",
        "learning_objective": "Synthesize end-to-end agentic architectures: intake sanitization, FAQ retrieval, skill invocation, ticket dispatch, memory tracking, and regression testing.",
        "icon": "Award",
        "workflow_summary": "User Query Intake -> Safety & PII Sanitizer -> Triage Skill -> FAQ Tool Lookup -> Ticket Creation Tool -> Memory Record -> Evaluation Benchmark",
        "memory_type": "Comprehensive Capstone Memory with Session Tickets and Audit Trail",
        "evaluation_type": "Automated regression test suite with accuracy and adversarial injection tests",
        "governance_type": "PII screening, safety classification, and automated regression verification",
        "programs": [
            {
                "key": "main",
                "title": "Reference Program",
                "filename": "main.py",
                "description": "Runs complete campus help-desk worklet across 3 student cases and runs automated evaluation suite.",
                "expected_output_summary": "Resolves WiFi inquiry via FAQ, creates ticket for hardware repair, passes 100% evaluation."
            },
            {
                "key": "assignment_1",
                "title": "Assignment 1: Self-Service Password Reset Skill",
                "filename": "assignment_1.py",
                "description": "Adds specialized Password Reset Skill that validates student identity and generates secure temporary token.",
                "expected_output_summary": "Identifies password reset intent, validates ID format, securely issues reset token."
            },
            {
                "key": "assignment_2",
                "title": "Assignment 2: Expanded Evaluation & Adversarial Prompt Test",
                "filename": "assignment_2.py",
                "description": "Expands evaluation battery with adversarial prompt injection trying to force unauthorized ticket deletion.",
                "expected_output_summary": "Blocks adversarial injection attempt; passes all regression and safety tests."
            }
        ]
    }
]

# Discovered Tools across all labs
TOOLS_METADATA = [
    {
        "id": "read_existing_schedule",
        "name": "read_existing_schedule",
        "lab_id": 1,
        "lab_title": "Lab 01: Agent vs Chatbot",
        "function_name": "read_existing_schedule",
        "description": "Simulated schedule query tool that retrieves student's existing commitments and busy days.",
        "parameters": [],
        "return_type": "Dict[str, List[str]]",
        "is_read_only": True,
        "has_side_effects": False,
        "is_simulated": True,
        "can_test_standalone": True,
        "sample_input": {}
    },
    {
        "id": "calculator",
        "name": "calculator",
        "lab_id": 2,
        "lab_title": "Lab 02: Tool-Using Agent",
        "function_name": "calculator",
        "description": "Performs mathematical arithmetic expressions safely (addition, subtraction, multiplication, division).",
        "parameters": [
            {"name": "expression", "type": "str", "description": "Arithmetic string e.g. '12 * 8' or '100 / 4'", "required": True}
        ],
        "return_type": "float | int",
        "is_read_only": True,
        "has_side_effects": False,
        "is_simulated": False,
        "can_test_standalone": True,
        "sample_input": {"expression": "125 * 4 + 50"}
    },
    {
        "id": "read_csv",
        "name": "read_csv",
        "lab_id": 2,
        "lab_title": "Lab 02: Tool-Using Agent",
        "function_name": "read_csv",
        "description": "Reads and parses tabular campus records (grades, courses, club rosters) into structured rows.",
        "parameters": [
            {"name": "filename", "type": "str", "description": "Path or identifier for target CSV dataset", "required": True}
        ],
        "return_type": "List[Dict[str, Any]]",
        "is_read_only": True,
        "has_side_effects": False,
        "is_simulated": True,
        "can_test_standalone": True,
        "sample_input": {"filename": "courses.csv"}
    },
    {
        "id": "mock_events_api",
        "name": "mock_events_api",
        "lab_id": 2,
        "lab_title": "Lab 02: Tool-Using Agent",
        "function_name": "mock_events_api",
        "description": "Queries campus event calendar for upcoming workshops, seminars, and club activities.",
        "parameters": [
            {"name": "date_or_keyword", "type": "str", "description": "Date or search keyword", "required": True}
        ],
        "return_type": "List[Dict[str, str]]",
        "is_read_only": True,
        "has_side_effects": False,
        "is_simulated": True,
        "can_test_standalone": True,
        "sample_input": {"date_or_keyword": "hackathon"}
    },
    {
        "id": "send_notification",
        "name": "send_notification",
        "lab_id": 2,
        "lab_title": "Lab 02: Tool-Using Agent (Assignment 1)",
        "function_name": "send_notification",
        "description": "Sends campus notifications or email alerts to students with required justification.",
        "parameters": [
            {"name": "recipient", "type": "str", "description": "Student email or identifier", "required": True},
            {"name": "message", "type": "str", "description": "Notification content body", "required": True},
            {"name": "justification", "type": "str", "description": "Policy justification for outbound alert", "required": True}
        ],
        "return_type": "Dict[str, Any]",
        "is_read_only": False,
        "has_side_effects": True,
        "is_simulated": True,
        "can_test_standalone": True,
        "sample_input": {"recipient": "alex@campus.edu", "message": "Workshop starts in 1 hour", "justification": "Event reminder policy"}
    },
    {
        "id": "read_file",
        "name": "read_file",
        "lab_id": 5,
        "lab_title": "Lab 05: MCP-Style Connector",
        "function_name": "read_file",
        "description": "MCP capability that reads content from approved repository file paths.",
        "parameters": [
            {"name": "path", "type": "str", "description": "Relative file path", "required": True}
        ],
        "return_type": "str",
        "is_read_only": True,
        "has_side_effects": False,
        "is_simulated": True,
        "can_test_standalone": True,
        "sample_input": {"path": "README.md"}
    },
    {
        "id": "query_db",
        "name": "query_db",
        "lab_id": 5,
        "lab_title": "Lab 05: MCP-Style Connector",
        "function_name": "query_db",
        "description": "MCP capability that executes structured database queries with parameters.",
        "parameters": [
            {"name": "query", "type": "str", "description": "SQL query or table identifier", "required": True}
        ],
        "return_type": "List[Dict[str, Any]]",
        "is_read_only": True,
        "has_side_effects": False,
        "is_simulated": True,
        "can_test_standalone": True,
        "sample_input": {"query": "SELECT * FROM campus_services"}
    },
    {
        "id": "call_api",
        "name": "call_api",
        "lab_id": 5,
        "lab_title": "Lab 05: MCP-Style Connector",
        "function_name": "call_api",
        "description": "MCP capability for dispatching external HTTP API requests with endpoint and payload.",
        "parameters": [
            {"name": "endpoint", "type": "str", "description": "API URL path", "required": True},
            {"name": "payload", "type": "Dict[str, Any]", "description": "Request body data", "required": False}
        ],
        "return_type": "Dict[str, Any]",
        "is_read_only": False,
        "has_side_effects": True,
        "is_simulated": True,
        "can_test_standalone": True,
        "sample_input": {"endpoint": "/v1/status", "payload": {"check": "health"}}
    },
    {
        "id": "list_files",
        "name": "list_files",
        "lab_id": 5,
        "lab_title": "Lab 05: MCP-Style Connector (Assignment 1)",
        "function_name": "list_files",
        "description": "MCP capability that dynamically enumerates files in authorized directory.",
        "parameters": [
            {"name": "directory", "type": "str", "description": "Directory path", "required": True}
        ],
        "return_type": "List[str]",
        "is_read_only": True,
        "has_side_effects": False,
        "is_simulated": True,
        "can_test_standalone": True,
        "sample_input": {"directory": "."}
    },
    {
        "id": "tool_word_count",
        "name": "tool_word_count",
        "lab_id": 6,
        "lab_title": "Lab 06: Personal Agent Runtime",
        "function_name": "tool_word_count",
        "description": "Calculates word count, sentence count, and character statistics for arbitrary text.",
        "parameters": [
            {"name": "text", "type": "str", "description": "Input text content", "required": True}
        ],
        "return_type": "Dict[str, int]",
        "is_read_only": True,
        "has_side_effects": False,
        "is_simulated": False,
        "can_test_standalone": True,
        "sample_input": {"text": "Autonomous agents perceive their environment and act to achieve goals."}
    },
    {
        "id": "tool_lookup_contact",
        "name": "tool_lookup_contact",
        "lab_id": 6,
        "lab_title": "Lab 06: Personal Agent Runtime",
        "function_name": "tool_lookup_contact",
        "description": "Retrieves verified contact card (email, office, department) from directory.",
        "parameters": [
            {"name": "name", "type": "str", "description": "Person name or alias", "required": True}
        ],
        "return_type": "Dict[str, str]",
        "is_read_only": True,
        "has_side_effects": False,
        "is_simulated": True,
        "can_test_standalone": True,
        "sample_input": {"name": "Dr. Sarah Chen"}
    },
    {
        "id": "tool_read_sensor_log",
        "name": "tool_read_sensor_log",
        "lab_id": 13,
        "lab_title": "Lab 13: Discipline-Specific Engineering Agents",
        "function_name": "tool_read_sensor_log",
        "description": "Reads cyber-physical industrial sensor logs (vibration, bearing temp, RPM) for mechanical health diagnosis.",
        "parameters": [
            {"name": "equipment_id", "type": "str", "description": "Turbine or pump ID", "required": True}
        ],
        "return_type": "List[Dict[str, float]]",
        "is_read_only": True,
        "has_side_effects": False,
        "is_simulated": True,
        "can_test_standalone": True,
        "sample_input": {"equipment_id": "PUMP-402"}
    },
    {
        "id": "read_power_log",
        "name": "read_power_log",
        "lab_id": 13,
        "lab_title": "Lab 13: Discipline-Specific Engineering Agents (Assignment 1)",
        "function_name": "read_power_log",
        "description": "Reads electrical substation power telemetry (megawatts, power factor, frequency).",
        "parameters": [
            {"name": "substation_id", "type": "str", "description": "Substation identifier", "required": True}
        ],
        "return_type": "List[Dict[str, float]]",
        "is_read_only": True,
        "has_side_effects": False,
        "is_simulated": True,
        "can_test_standalone": True,
        "sample_input": {"substation_id": "SUB-NORTH"}
    },
    {
        "id": "tool_search_faq",
        "name": "tool_search_faq",
        "lab_id": 14,
        "lab_title": "Lab 14: Capstone Project Studio",
        "function_name": "tool_search_faq",
        "description": "Searches campus knowledge base for official answers to student inquiries.",
        "parameters": [
            {"name": "query", "type": "str", "description": "Search query terms", "required": True}
        ],
        "return_type": "Optional[Dict[str, str]]",
        "is_read_only": True,
        "has_side_effects": False,
        "is_simulated": True,
        "can_test_standalone": True,
        "sample_input": {"query": "how do I connect to campus wifi?"}
    },
    {
        "id": "tool_create_ticket",
        "name": "tool_create_ticket",
        "lab_id": 14,
        "lab_title": "Lab 14: Capstone Project Studio",
        "function_name": "tool_create_ticket",
        "description": "Dispatches a verified helpdesk support ticket to IT / Facilities with priority.",
        "parameters": [
            {"name": "user_id", "type": "str", "description": "Student or staff ID", "required": True},
            {"name": "category", "type": "str", "description": "Hardware, Network, Academic, Facility", "required": True},
            {"name": "issue", "type": "str", "description": "Detailed description of problem", "required": True},
            {"name": "priority", "type": "str", "description": "Low, Medium, High", "required": False, "default": "Medium"}
        ],
        "return_type": "Dict[str, Any]",
        "is_read_only": False,
        "has_side_effects": True,
        "is_simulated": True,
        "can_test_standalone": True,
        "sample_input": {"user_id": "stu_8821", "category": "Hardware", "issue": "Monitor flickers in Lab 304", "priority": "Medium"}
    },
    {
        "id": "tool_check_ticket_status",
        "name": "tool_check_ticket_status",
        "lab_id": 14,
        "lab_title": "Lab 14: Capstone Project Studio",
        "function_name": "tool_check_ticket_status",
        "description": "Checks the live status, assigned technician, and updates for an existing ticket.",
        "parameters": [
            {"name": "ticket_id", "type": "str", "description": "Helpdesk ticket identifier", "required": True}
        ],
        "return_type": "Dict[str, Any]",
        "is_read_only": True,
        "has_side_effects": False,
        "is_simulated": True,
        "can_test_standalone": True,
        "sample_input": {"ticket_id": "TCK-1001"}
    }
]

# Discovered Skills across all labs
SKILLS_METADATA = [
    {
        "id": "research_summary_skill",
        "name": "Research Summary Skill",
        "lab_id": 3,
        "lab_title": "Lab 03: Skill Creation",
        "function_or_class": "apply_research_summary_skill",
        "description": "Transforms dense academic or technical passages into structured briefing capsules: primary claim, supporting empirical evidence, explicit limitations, and practical takeaway.",
        "instructions": [
            "1. Split input into discrete sentence units.",
            "2. Identify primary thesis or hypothesis sentence.",
            "3. Extract quantitative or empirical evidence metrics.",
            "4. Detect acknowledged caveats, limitations, or boundary conditions.",
            "5. Synthesize single-sentence operational takeaway."
        ],
        "constraints": [
            "Do not extrapolate beyond facts directly stated in the text.",
            "If no quantitative evidence exists, explicitly label evidence as 'NONE' or 'LOW'.",
            "Limitation field must not be empty."
        ],
        "examples": [
            {
                "title": "Transformer Attention Paper",
                "input": "We observe that 8-head self-attention improves BLEU score by 2.1 points over recurrent baselines on WMT 2014 English-to-German. However, memory scaling is quadratic in sequence length.",
                "expected_output": "Claim: 8-head attention improves translation BLEU by 2.1 pts. Evidence: +2.1 BLEU on WMT 2014. Limitation: Quadratic memory scaling. Takeaway: Use attention for high accuracy where sequence length fits GPU memory."
            }
        ],
        "related_tools": ["split_sentences"],
        "reusability": "High — applies to biomedical, engineering, computer science, and policy research papers.",
        "source_snippet": "def apply_research_summary_skill(text: str) -> dict:\n    sentences = split_sentences(text)\n    # Extracts claim, evidence, limitation, and actionable takeaway\n    return {\n        'claim': sentences[0],\n        'evidence': [s for s in sentences if any(c.isdigit() for c in s)],\n        'limitations': [s for s in sentences if 'however' in s.lower()],\n        'takeaway': '...'\n    }"
    },
    {
        "id": "multi_claim_skill",
        "name": "Multi-Claim Research Skill",
        "lab_id": 3,
        "lab_title": "Lab 03: Skill Creation (Assignment 1)",
        "function_or_class": "apply_multi_claim_skill",
        "description": "Analyzes complex literature containing multiple competing or orthogonal claims; computes evidence scores and ranks them by evidentiary support.",
        "instructions": [
            "1. Identify sentence candidates representing distinct hypotheses.",
            "2. Compute evidence score (0-100) based on numeric metrics and sample size.",
            "3. Rank claims descending by evidence score.",
            "4. Output comparative claim table."
        ],
        "constraints": [
            "Each claim must have its own distinct evidence score.",
            "Rank must be strictly sorted by score."
        ],
        "examples": [
            {
                "title": "Dual-Hypothesis Clinical Trial",
                "input": "Compound A reduced symptoms by 45% across 500 patients. Secondary analysis suggested Compound B improved sleep in 12 subjects.",
                "expected_output": "Claim 1 (Score 90): Compound A symptom reduction. Claim 2 (Score 35): Compound B sleep improvement."
            }
        ],
        "related_tools": ["evidence_score"],
        "reusability": "High — multi-hypothesis clinical or market research.",
        "source_snippet": "def apply_multi_claim_skill(text: str) -> list:\n    # Computes evidence scores for each distinct claim\n    ..."
    },
    {
        "id": "summarize_notes_skill",
        "name": "SummarizeNotesSkill",
        "lab_id": 6,
        "lab_title": "Lab 06: Personal Agent Runtime",
        "function_or_class": "SummarizeNotesSkill",
        "description": "Distills meeting transcripts, lecture notes, or daily standup logs into bulleted action items and decisions.",
        "instructions": [
            "1. Ingest raw notes text.",
            "2. Extract major topics and decisions made.",
            "3. Enumerate action items with assignees.",
            "4. Compute word count stats using tool_word_count."
        ],
        "constraints": [
            "Must preserve exact assignee names.",
            "Must invoke tool_word_count to measure compression ratio."
        ],
        "examples": [
            {
                "title": "Sprint Planning Meeting",
                "input": "Team met at 10 AM. Alice will finish auth module by Friday. Bob will test SQLite migration. Launch target is Nov 30.",
                "expected_output": "Decisions: Launch Nov 30. Action Items: Alice (auth by Fri), Bob (test SQLite migration)."
            }
        ],
        "related_tools": ["tool_word_count"],
        "reusability": "Universal workplace productivity skill.",
        "source_snippet": "class SummarizeNotesSkill:\n    def execute(self, text: str, tools, memory):\n        stats = tools['tool_word_count'](text)\n        ..."
    },
    {
        "id": "draft_email_skill",
        "name": "DraftEmailSkill",
        "lab_id": 6,
        "lab_title": "Lab 06: Personal Agent Runtime",
        "function_name": "DraftEmailSkill",
        "function_or_class": "DraftEmailSkill",
        "description": "Drafts polite, professional business correspondence using recipient directory lookup and tone modulation.",
        "instructions": [
            "1. Lookup recipient details using tool_lookup_contact.",
            "2. Format formal greeting and clear subject line.",
            "3. Concisely state objective and call to action.",
            "4. Sign with user's sender identity stored in memory."
        ],
        "constraints": [
            "Must verify recipient email exists in contact store.",
            "Keep body under 150 words."
        ],
        "examples": [
            {
                "title": "Meeting Request",
                "input": "Draft email to Dr. Sarah Chen requesting thesis advisory meeting next Thursday.",
                "expected_output": "Subject: Thesis Advisory Meeting Request — Next Thursday\nDear Dr. Chen, ..."
            }
        ],
        "related_tools": ["tool_lookup_contact"],
        "reusability": "High — universal email drafting assistant.",
        "source_snippet": "class DraftEmailSkill:\n    def execute(self, prompt: str, tools, memory):\n        contact = tools['tool_lookup_contact'](...)\n        ..."
    },
    {
        "id": "translate_text_skill",
        "name": "TranslateTextSkill",
        "lab_id": 6,
        "lab_title": "Lab 06: Personal Agent Runtime",
        "function_or_class": "TranslateTextSkill",
        "description": "Translates communication across English, Spanish, French, German, and Hindi with cultural tone preservation.",
        "instructions": [
            "1. Detect source language and target language parameter.",
            "2. Translate semantics accurately preserving technical terms.",
            "3. Maintain formatting and punctuation."
        ],
        "constraints": [
            "Do not alter code blocks, URLs, or proper nouns."
        ],
        "examples": [
            {
                "title": "Welcome Greeting",
                "input": "Translate 'Welcome to the Agentic AI Command Center' to Spanish.",
                "expected_output": "'Bienvenido al Centro de Comando de IA Agéntica'"
            }
        ],
        "related_tools": [],
        "reusability": "High — multi-lingual agent interfaces.",
        "source_snippet": "class TranslateTextSkill:\n    def execute(self, text: str, target_lang: str):\n        ..."
    },
    {
        "id": "triage_skill",
        "name": "TriageSkill",
        "lab_id": 14,
        "lab_title": "Lab 14: Capstone Project Studio",
        "function_or_class": "triage_skill",
        "description": "Analyzes inbound help-desk queries, categorizes into domain (Network, Hardware, Software, Account), assigns priority, and determines automated vs human dispatch.",
        "instructions": [
            "1. Scan input text for urgency indicators and system keywords.",
            "2. Assign classification category.",
            "3. Assign priority (Low, Medium, High, Critical).",
            "4. Determine whether an existing FAQ answers the inquiry or a new ticket must be opened."
        ],
        "constraints": [
            "Safety issues or data breaches must always be flagged Critical.",
            "Vague requests must request clarification before ticket creation."
        ],
        "examples": [
            {
                "title": "WiFi Dropout in Dorms",
                "input": "WiFi has been disconnected in dorm block B since 8am.",
                "expected_output": "Category: Network, Priority: High, Next Action: tool_search_faq('dorm wifi outage')"
            }
        ],
        "related_tools": ["tool_search_faq", "tool_create_ticket"],
        "reusability": "High — applicable to any IT service desk or customer support triage.",
        "source_snippet": "def triage_skill(user_message: str) -> dict:\n    # Categorizes and assigns priority for campus inquiries\n    ..."
    },
    {
        "id": "password_reset_skill",
        "name": "PasswordResetSkill",
        "lab_id": 14,
        "lab_title": "Lab 14: Capstone Project Studio (Assignment 1)",
        "function_or_class": "password_reset_skill",
        "description": "Handles automated identity verification, MFA check, and one-time password reset token generation for locked campus accounts.",
        "instructions": [
            "1. Validate student ID format (stu_XXXX).",
            "2. Verify student security challenge question.",
            "3. Generate secure cryptographic 8-character temporary pin.",
            "4. Log password reset event to security audit log."
        ],
        "constraints": [
            "Never display temporary pin in plain unmasked logs.",
            "Reject IDs that fail regex validation."
        ],
        "examples": [
            {
                "title": "Account Locked Out",
                "input": "Student stu_9182 locked out of student portal after 3 failed password attempts.",
                "expected_output": "Status: Verified. Reset token generated: ****9182. Token expires in 15 minutes."
            }
        ],
        "related_tools": ["tool_create_ticket"],
        "reusability": "High — automated account access recovery.",
        "source_snippet": "def password_reset_skill(student_id: str, secret_answer: str) -> dict:\n    # Secure self-service password reset skill\n    ..."
    }
]

# Workflows for React Flow visualizer for each of the 14 Labs
LAB_ARCHITECTURES = {
    1: {
        "lab_id": 1,
        "lab_title": "Lab 01: Agent vs Chatbot — Study Planner",
        "pattern_name": "Proactive Goal Loop",
        "pattern_description": "Proactive stateful loop with explicit satisfaction checks and in-place plan mutation.",
        "nodes": [
            {"id": "goal", "label": "Goal Specification", "type": "input", "description": "Gathers student subjects, target hours, and unavailable days.", "relevant_function": "next_step", "position": {"x": 100, "y": 150}},
            {"id": "plan", "label": "Plan Formulation", "type": "agent", "description": "Calculates daily study slot allocations based on goals.", "relevant_function": "_build_plan", "position": {"x": 300, "y": 150}},
            {"id": "tool", "label": "Schedule Tool", "type": "tool", "description": "Queries existing commitments to detect busy days.", "relevant_function": "read_existing_schedule", "position": {"x": 500, "y": 50}},
            {"id": "observe", "label": "Observe & Check", "type": "agent", "description": "Verifies whether goal satisfaction condition is met.", "relevant_function": "satisfied", "position": {"x": 500, "y": 250}},
            {"id": "revise", "label": "In-Place Revise", "type": "gate", "description": "Mutates plan slots on feedback without restarting from scratch.", "relevant_function": "revise", "position": {"x": 700, "y": 150}},
            {"id": "output", "label": "Finalized Plan", "type": "output", "description": "Emits conflict-free finalized weekly schedule.", "relevant_function": "run", "position": {"x": 900, "y": 150}}
        ],
        "edges": [
            {"id": "e1-2", "source": "goal", "target": "plan", "label": "missing requirements"},
            {"id": "e2-3", "source": "plan", "target": "tool", "label": "fetch busy slots"},
            {"id": "e3-4", "source": "tool", "target": "observe", "label": "calendar data"},
            {"id": "e2-4", "source": "plan", "target": "observe", "label": "draft schedule"},
            {"id": "e4-5", "source": "observe", "target": "revise", "label": "user feedback"},
            {"id": "e5-6", "source": "revise", "target": "output", "label": "satisfied: true"}
        ]
    },
    2: {
        "lab_id": 2,
        "lab_title": "Lab 02: Tool-Using Agent — Campus Data Assistant",
        "pattern_name": "Dynamic Tool Dispatcher",
        "pattern_description": "Parses user queries, dynamically selects tools from registry, chains outputs, and returns answer.",
        "nodes": [
            {"id": "query", "label": "User Query", "type": "input", "description": "Campus student question (grades, event times, calculations).", "position": {"x": 50, "y": 150}},
            {"id": "planner", "label": "Tool Planner", "type": "agent", "description": "Selects appropriate tool and extracts arguments.", "relevant_function": "answer", "position": {"x": 250, "y": 150}},
            {"id": "t_calc", "label": "Calculator Tool", "type": "tool", "description": "Executes arithmetic calculations.", "relevant_function": "calculator", "position": {"x": 480, "y": 50}},
            {"id": "t_csv", "label": "CSV Reader Tool", "type": "tool", "description": "Extracts tabular records and grades.", "relevant_function": "read_csv", "position": {"x": 480, "y": 150}},
            {"id": "t_api", "label": "Events API Tool", "type": "tool", "description": "Queries upcoming campus events.", "relevant_function": "mock_events_api", "position": {"x": 480, "y": 250}},
            {"id": "validate", "label": "Result Validator", "type": "gate", "description": "Validates tool output types and errors.", "relevant_function": "_call", "position": {"x": 700, "y": 150}},
            {"id": "response", "label": "Synthesized Answer", "type": "output", "description": "Emits grounded response with tool audit trace.", "position": {"x": 900, "y": 150}}
        ],
        "edges": [
            {"id": "e2-1", "source": "query", "target": "planner", "label": "parse intent"},
            {"id": "e2-2a", "source": "planner", "target": "t_calc", "label": "math query"},
            {"id": "e2-2b", "source": "planner", "target": "t_csv", "label": "data query"},
            {"id": "e2-2c", "source": "planner", "target": "t_api", "label": "event query"},
            {"id": "e2-3a", "source": "t_calc", "target": "validate", "label": "result"},
            {"id": "e2-3b", "source": "t_csv", "target": "validate", "label": "rows"},
            {"id": "e2-3c", "source": "t_api", "target": "validate", "label": "json"},
            {"id": "e2-4", "source": "validate", "target": "response", "label": "verified answer"}
        ]
    },
    3: {
        "lab_id": 3,
        "lab_title": "Lab 03: Skill Creation — Research Summary Skill",
        "pattern_name": "Modular Skill Capsule",
        "pattern_description": "Modular extraction skill with sentence tokenization, claim-evidence mapping, and limitation detection.",
        "nodes": [
            {"id": "article", "label": "Research Paper Text", "type": "input", "description": "Academic excerpt or technical manuscript.", "position": {"x": 100, "y": 150}},
            {"id": "tokenize", "label": "Sentence Parser", "type": "agent", "description": "Splits text into discrete propositional sentences.", "relevant_function": "split_sentences", "position": {"x": 300, "y": 150}},
            {"id": "claims", "label": "Claim Extractor", "type": "skill", "description": "Isolates core scientific hypothesis.", "relevant_function": "apply_research_summary_skill", "position": {"x": 500, "y": 80}},
            {"id": "evidence", "label": "Evidence Scorer", "type": "skill", "description": "Detects empirical statistics and evidence strength.", "relevant_function": "evidence_score", "position": {"x": 500, "y": 220}},
            {"id": "limitation", "label": "Limitation Guard", "type": "gate", "description": "Identifies caveats or flags low-evidence warnings.", "relevant_function": "apply_low_evidence_skill", "position": {"x": 700, "y": 150}},
            {"id": "capsule", "label": "Structured Briefing", "type": "output", "description": "Emits claim, evidence, limitations, and practical takeaway.", "position": {"x": 900, "y": 150}}
        ],
        "edges": [
            {"id": "e3-1", "source": "article", "target": "tokenize", "label": "raw text"},
            {"id": "e3-2a", "source": "tokenize", "target": "claims", "label": "sentences"},
            {"id": "e3-2b", "source": "tokenize", "target": "evidence", "label": "numeric tokens"},
            {"id": "e3-3a", "source": "claims", "target": "limitation", "label": "claims"},
            {"id": "e3-3b", "source": "evidence", "target": "limitation", "label": "evidence score"},
            {"id": "e3-4", "source": "limitation", "target": "capsule", "label": "validated summary"}
        ]
    },
    4: {
        "lab_id": 4,
        "lab_title": "Lab 04: Memory and Retrieval — Project Memory",
        "pattern_name": "Multi-Tier Memory Architecture",
        "pattern_description": "Separates working session memory from persistent facts, with topic scoping and conflict alerts.",
        "nodes": [
            {"id": "input", "label": "User Input Statement", "type": "input", "description": "Inbound user message or query across multiple sessions.", "position": {"x": 80, "y": 150}},
            {"id": "session", "label": "Working Session State", "type": "agent", "description": "Maintains ephemeral context of current dialogue.", "relevant_function": "set_session_fact", "position": {"x": 280, "y": 70}},
            {"id": "longterm", "label": "Long-Term Fact Store", "type": "tool", "description": "Stores timestamped records with author provenance.", "relevant_function": "ProjectMemory", "position": {"x": 280, "y": 230}},
            {"id": "conflict", "label": "Conflict Detector", "type": "gate", "description": "Flags contradictory updates to existing facts.", "relevant_function": "write", "position": {"x": 500, "y": 150}},
            {"id": "retrieval", "label": "Topic-Scoped Retriever", "type": "agent", "description": "Filters memory strictly to relevant topic and non-stale facts.", "relevant_function": "retrieve", "position": {"x": 700, "y": 150}},
            {"id": "output", "label": "Source-Tagged Answer", "type": "output", "description": "Answers questions citing specific memory record IDs.", "relevant_function": "answer", "position": {"x": 900, "y": 150}}
        ],
        "edges": [
            {"id": "e4-1", "source": "input", "target": "session", "label": "dialogue turn"},
            {"id": "e4-2", "source": "input", "target": "longterm", "label": "fact statement"},
            {"id": "e4-3", "source": "longterm", "target": "conflict", "label": "new vs stored"},
            {"id": "e4-4", "source": "conflict", "target": "retrieval", "label": "consistent facts"},
            {"id": "e4-5", "source": "session", "target": "retrieval", "label": "active context"},
            {"id": "e4-6", "source": "retrieval", "target": "output", "label": "provenance link"}
        ]
    },
    5: {
        "lab_id": 5,
        "lab_title": "Lab 05: MCP-Style Connector — Mini Integration Layer",
        "pattern_name": "Protocol Manifest Connector",
        "pattern_description": "Capability discovery and schema-checked execution layer inspired by Model Context Protocol.",
        "nodes": [
            {"id": "client", "label": "MCP Client", "type": "input", "description": "Agent client requesting external system actions.", "relevant_function": "MCPClient", "position": {"x": 100, "y": 150}},
            {"id": "manifest", "label": "Capability Discovery", "type": "agent", "description": "Queries server manifest for exposed tools and resources.", "relevant_function": "discover", "position": {"x": 320, "y": 150}},
            {"id": "server", "label": "MCP Server Core", "type": "gate", "description": "Validates invocation request against capability schema.", "relevant_function": "MCPServer", "position": {"x": 540, "y": 150}},
            {"id": "res_file", "label": "Resource: read_file", "type": "tool", "description": "Approved file read handler.", "relevant_function": "read_file", "position": {"x": 760, "y": 50}},
            {"id": "res_db", "label": "Resource: query_db", "type": "tool", "description": "Database query interface.", "relevant_function": "query_db", "position": {"x": 760, "y": 150}},
            {"id": "res_api", "label": "Resource: call_api", "type": "tool", "description": "HTTP outbound interface.", "relevant_function": "call_api", "position": {"x": 760, "y": 250}},
            {"id": "envelope", "label": "Response Envelope", "type": "output", "description": "Typed RPC response or structured error object.", "position": {"x": 980, "y": 150}}
        ],
        "edges": [
            {"id": "e5-1", "source": "client", "target": "manifest", "label": "handshake"},
            {"id": "e5-2", "source": "manifest", "target": "server", "label": "capability list"},
            {"id": "e5-3a", "source": "server", "target": "res_file", "label": "file request"},
            {"id": "e5-3b", "source": "server", "target": "res_db", "label": "db request"},
            {"id": "e5-3c", "source": "server", "target": "res_api", "label": "api request"},
            {"id": "e5-4a", "source": "res_file", "target": "envelope", "label": "content"},
            {"id": "e5-4b", "source": "res_db", "target": "envelope", "label": "records"},
            {"id": "e5-4c", "source": "res_api", "target": "envelope", "label": "payload"}
        ]
    },
    6: {
        "lab_id": 6,
        "lab_title": "Lab 06: Personal Agent Runtime — OpenClaw Architecture",
        "pattern_name": "Decoupled Agent Runtime",
        "pattern_description": "Six-subsystem runtime: Interface, Runtime, Skills Registry, Tools, Memory, and Audit Ledger.",
        "nodes": [
            {"id": "interface", "label": "Interface Layer", "type": "input", "description": "Receives user tasks and normalizes requests.", "relevant_function": "receive_task", "position": {"x": 50, "y": 150}},
            {"id": "runtime", "label": "Agent Runtime", "type": "agent", "description": "Orchestrates dispatch, rate limits, and error retries.", "relevant_function": "run_task", "position": {"x": 260, "y": 150}},
            {"id": "skills", "label": "Skills Registry", "type": "skill", "description": "Selects registered skill (Summarize, Email, Translate).", "relevant_function": "select_skill", "position": {"x": 480, "y": 60}},
            {"id": "tools", "label": "Tools Registry", "type": "tool", "description": "Word count and contact directory lookup.", "relevant_function": "tool_word_count", "position": {"x": 480, "y": 240}},
            {"id": "memory", "label": "User Scoped Memory", "type": "agent", "description": "Preserves per-user facts and preferences.", "relevant_function": "Memory", "position": {"x": 700, "y": 60}},
            {"id": "audit", "label": "Append-Only Audit", "type": "gate", "description": "Immutable ledger logging every task action.", "relevant_function": "Audit", "position": {"x": 700, "y": 240}},
            {"id": "output", "label": "Completed Task Result", "type": "output", "description": "Emits verified task output with audit token.", "position": {"x": 920, "y": 150}}
        ],
        "edges": [
            {"id": "e6-1", "source": "interface", "target": "runtime", "label": "dispatch"},
            {"id": "e6-2", "source": "runtime", "target": "skills", "label": "match skill"},
            {"id": "e6-3", "source": "runtime", "target": "tools", "label": "bind tools"},
            {"id": "e6-4", "source": "skills", "target": "memory", "label": "read/write state"},
            {"id": "e6-5", "source": "tools", "target": "audit", "label": "record usage"},
            {"id": "e6-6", "source": "memory", "target": "output", "label": "contextualized"},
            {"id": "e6-7", "source": "audit", "target": "output", "label": "audit verified"}
        ]
    },
    7: {
        "lab_id": 7,
        "lab_title": "Lab 07: Agentic Node Graph — Campus App Builder",
        "pattern_name": "Stateful Node Graph Pipeline",
        "pattern_description": "Sequential DAG with explicit node ownership, automated rollback on failure, and security gating.",
        "nodes": [
            {"id": "req", "label": "Requirements Node", "type": "input", "description": "Parses app specs into concrete user stories.", "relevant_function": "requirement_node", "position": {"x": 50, "y": 150}},
            {"id": "plan", "label": "Planner Node", "type": "agent", "description": "Designs schema, routes, and component tree.", "relevant_function": "planner_node", "position": {"x": 220, "y": 150}},
            {"id": "build", "label": "Builder Node", "type": "agent", "description": "Generates source code and asset configurations.", "relevant_function": "builder_node", "position": {"x": 390, "y": 150}},
            {"id": "security", "label": "Security Scan Node", "type": "gate", "description": "Checks code for vulnerabilities and dependency flaws.", "relevant_function": "security_scan_node", "position": {"x": 560, "y": 80}},
            {"id": "test", "label": "Tester Node", "type": "gate", "description": "Executes unit and integration test suites.", "relevant_function": "tester_node", "position": {"x": 560, "y": 220}},
            {"id": "review", "label": "Reviewer Node", "type": "agent", "description": "Performs code style and architecture review.", "relevant_function": "reviewer_node", "position": {"x": 730, "y": 150}},
            {"id": "gate", "label": "Human Gate Node", "type": "output", "description": "Mandatory manual sign-off before production deploy.", "relevant_function": "human_gate_node", "position": {"x": 920, "y": 150}}
        ],
        "edges": [
            {"id": "e7-1", "source": "req", "target": "plan", "label": "user stories"},
            {"id": "e7-2", "source": "plan", "target": "build", "label": "architecture spec"},
            {"id": "e7-3a", "source": "build", "target": "security", "label": "code artifacts"},
            {"id": "e7-3b", "source": "build", "target": "test", "label": "test suite"},
            {"id": "e7-4a", "source": "security", "target": "review", "label": "security pass"},
            {"id": "e7-4b", "source": "test", "target": "review", "label": "tests passed"},
            {"id": "e7-5", "source": "review", "target": "gate", "label": "ready for release"}
        ]
    },
    8: {
        "lab_id": 8,
        "lab_title": "Lab 08: Parallel Swarm — Hackathon Planner",
        "pattern_name": "Parallel Role Swarm with Consensus",
        "pattern_description": "Concurrently executes specialized role agents, merges output, detects conflicts, and runs peer critique.",
        "nodes": [
            {"id": "coord", "label": "Swarm Coordinator", "type": "input", "description": "Dispatches requirements to 4+ concurrent role agents.", "relevant_function": "run_swarm", "position": {"x": 80, "y": 180}},
            {"id": "ag_res", "label": "Research Agent", "type": "agent", "description": "Identifies tracks, topics, and technical challenges.", "relevant_function": "research_agent", "position": {"x": 300, "y": 40}},
            {"id": "ag_log", "label": "Logistics Agent", "type": "agent", "description": "Plans venue, hardware, and catering schedule.", "relevant_function": "logistics_agent", "position": {"x": 300, "y": 120}},
            {"id": "ag_bud", "label": "Budget Agent", "type": "agent", "description": "Enforces $5,000 budget cap across categories.", "relevant_function": "budget_agent", "position": {"x": 300, "y": 200}},
            {"id": "ag_jud", "label": "Judging Agent", "type": "agent", "description": "Designs rubric and recruits technical judges.", "relevant_function": "judging_agent", "position": {"x": 300, "y": 280}},
            {"id": "ag_mkt", "label": "Marketing Agent", "type": "agent", "description": "Coordinates social outreach and sponsor announcements.", "relevant_function": "marketing_agent", "position": {"x": 300, "y": 360}},
            {"id": "merge", "label": "Consensus Collector", "type": "gate", "description": "Merges heterogeneous JSON outputs and resolves budget conflicts.", "relevant_function": "merge", "position": {"x": 580, "y": 180}},
            {"id": "critique", "label": "Peer Critique Phase", "type": "agent", "description": "Agents cross-examine each other's allocations.", "relevant_function": "distributed_critique", "position": {"x": 780, "y": 180}},
            {"id": "plan", "label": "Final Master Plan", "type": "output", "description": "Balanced, conflict-free hackathon blueprint.", "position": {"x": 980, "y": 180}}
        ],
        "edges": [
            {"id": "e8-1a", "source": "coord", "target": "ag_res"},
            {"id": "e8-1b", "source": "coord", "target": "ag_log"},
            {"id": "e8-1c", "source": "coord", "target": "ag_bud"},
            {"id": "e8-1d", "source": "coord", "target": "ag_jud"},
            {"id": "e8-1e", "source": "coord", "target": "ag_mkt"},
            {"id": "e8-2a", "source": "ag_res", "target": "merge"},
            {"id": "e8-2b", "source": "ag_log", "target": "merge"},
            {"id": "e8-2c", "source": "ag_bud", "target": "merge"},
            {"id": "e8-2d", "source": "ag_jud", "target": "merge"},
            {"id": "e8-2e", "source": "ag_mkt", "target": "merge"},
            {"id": "e8-3", "source": "merge", "target": "critique", "label": "draft plan"},
            {"id": "e8-4", "source": "critique", "target": "plan", "label": "consensus"}
        ]
    },
    9: {
        "lab_id": 9,
        "lab_title": "Lab 09: Deep Research Agent — AI Topic Briefing",
        "pattern_name": "Multi-Source Evidence Matrix",
        "pattern_description": "Ingests heterogeneous sources, builds evidence matrix, highlights contradictions, and synthesizes briefing.",
        "nodes": [
            {"id": "query", "label": "Research Question", "type": "input", "description": "Complex topic e.g. Autonomous Agent Scalability.", "position": {"x": 80, "y": 150}},
            {"id": "sources", "label": "Multi-Source Ingestion", "type": "agent", "description": "Ingests academic papers, industry benchmarks, and blogs.", "relevant_function": "build_evidence_table", "position": {"x": 280, "y": 150}},
            {"id": "matrix", "label": "Evidence Matrix", "type": "tool", "description": "Tabulates claims, empirical metrics, and source URLs.", "relevant_function": "compare", "position": {"x": 500, "y": 150}},
            {"id": "contradiction", "label": "Contradiction Analyzer", "type": "gate", "description": "Flags clashing empirical figures and assigns quality weights.", "relevant_function": "compare_with_contradiction", "position": {"x": 700, "y": 150}},
            {"id": "synthesis", "label": "Executive Briefing", "type": "output", "description": "Produces traceable briefing with citations and caveats.", "relevant_function": "synthesize", "position": {"x": 920, "y": 150}}
        ],
        "edges": [
            {"id": "e9-1", "source": "query", "target": "sources", "label": "topic"},
            {"id": "e9-2", "source": "sources", "target": "matrix", "label": "extracted data"},
            {"id": "e9-3", "source": "matrix", "target": "contradiction", "label": "claims table"},
            {"id": "e9-4", "source": "contradiction", "target": "synthesis", "label": "weighted facts"}
        ]
    },
    10: {
        "lab_id": 10,
        "lab_title": "Lab 10: Cloud Operations Agent — Failed Deployment",
        "pattern_name": "Incident Diagnosis & Remediator",
        "pattern_description": "Monitors deployment metrics, classifies incident severity, correlates Git commits, and enforces approval gates.",
        "nodes": [
            {"id": "telemetry", "label": "Telemetry & Log Stream", "type": "input", "description": "Error rate spikes, HTTP 500 logs, and CPU metrics.", "position": {"x": 60, "y": 150}},
            {"id": "incident", "label": "Incident Detector", "type": "agent", "description": "Pinpoints exact timestamp when error threshold exceeded.", "relevant_function": "find_incident_start", "position": {"x": 250, "y": 150}},
            {"id": "git", "label": "Git Change Correlator", "type": "tool", "description": "Correlates incident start time with recent commits.", "relevant_function": "correlate_with_recent_changes", "position": {"x": 450, "y": 70}},
            {"id": "sev", "label": "Severity Classifier", "type": "gate", "description": "Classifies SEV1 (outage) vs SEV2 (degraded) vs SEV3.", "relevant_function": "classify_severity", "position": {"x": 450, "y": 230}},
            {"id": "remedy", "label": "Remediation Engine", "type": "agent", "description": "Drafts rollback or restart actions and risk score.", "relevant_function": "diagnose_and_propose", "position": {"x": 660, "y": 150}},
            {"id": "approval", "label": "Human Approval Gate", "type": "gate", "description": "SEV1 actions require explicit operator confirmation.", "relevant_function": "draft_approval_request", "position": {"x": 860, "y": 80}},
            {"id": "dispatch", "label": "Action Dispatcher", "type": "output", "description": "Executes container rollback or cache flush.", "relevant_function": "handle_action", "position": {"x": 860, "y": 220}}
        ],
        "edges": [
            {"id": "e10-1", "source": "telemetry", "target": "incident", "label": "metrics"},
            {"id": "e10-2a", "source": "incident", "target": "git", "label": "timestamp"},
            {"id": "e10-2b", "source": "incident", "target": "sev", "label": "error count"},
            {"id": "e10-3a", "source": "git", "target": "remedy", "label": "bad commit"},
            {"id": "e10-3b", "source": "sev", "target": "remedy", "label": "severity level"},
            {"id": "e10-4a", "source": "remedy", "target": "approval", "label": "SEV1 proposal"},
            {"id": "e10-4b", "source": "remedy", "target": "dispatch", "label": "low-risk auto"},
            {"id": "e10-5", "source": "approval", "target": "dispatch", "label": "human approved"}
        ]
    },
    11: {
        "lab_id": 11,
        "lab_title": "Lab 11: Agentic SDLC Factory — Mini Software Team",
        "pattern_name": "Autonomous Software Lifecycle",
        "pattern_description": "End-to-end SDLC pipeline from story breakdown to design, code, automated tests, review, and release.",
        "nodes": [
            {"id": "story", "label": "Feature User Story", "type": "input", "description": "E.g. Student grade CSV & PDF export with filters.", "relevant_function": "requirement_agent", "position": {"x": 50, "y": 150}},
            {"id": "design", "label": "Design Agent", "type": "agent", "description": "Formulates interface contract and data transformations.", "relevant_function": "design_agent", "position": {"x": 230, "y": 150}},
            {"id": "code", "label": "Coding Agent", "type": "agent", "description": "Synthesizes production Python implementation.", "relevant_function": "coding_agent", "position": {"x": 410, "y": 150}},
            {"id": "test", "label": "Testing Agent", "type": "gate", "description": "Runs automated assertion suite; catches regressions.", "relevant_function": "testing_agent", "position": {"x": 590, "y": 150}},
            {"id": "review", "label": "Review Agent", "type": "agent", "description": "Verifies complexity, comments, and security standards.", "relevant_function": "review_agent", "position": {"x": 760, "y": 80}},
            {"id": "docs", "label": "Docs Agent", "type": "agent", "description": "Generates API markdown documentation.", "relevant_function": "docs_agent", "position": {"x": 760, "y": 220}},
            {"id": "release", "label": "Release Agent", "type": "output", "description": "Packages and tags validated software release artifact.", "relevant_function": "release_agent", "position": {"x": 950, "y": 150}}
        ],
        "edges": [
            {"id": "e11-1", "source": "story", "target": "design", "label": "spec"},
            {"id": "e11-2", "source": "design", "target": "code", "label": "contract"},
            {"id": "e11-3", "source": "code", "target": "test", "label": "functions"},
            {"id": "e11-4a", "source": "test", "target": "review", "label": "tests passed"},
            {"id": "e11-4b", "source": "test", "target": "docs", "label": "api schema"},
            {"id": "e11-5a", "source": "review", "target": "release", "label": "approved"},
            {"id": "e11-5b", "source": "docs", "target": "release", "label": "readme bundled"}
        ]
    },
    12: {
        "lab_id": 12,
        "lab_title": "Lab 12: Safety, Evaluation and Governance — Risky Agent Action",
        "pattern_name": "Defense-in-Depth Safety Shield",
        "pattern_description": "Multi-stage guardrail enforcing RBAC permissions, PII scrubbing, cost gates, approval, and audit logs.",
        "nodes": [
            {"id": "req", "label": "Action Request", "type": "input", "description": "High-risk infrastructure modification proposal.", "position": {"x": 60, "y": 150}},
            {"id": "rbac", "label": "Permission & RBAC", "type": "gate", "description": "Validates operator role against action scope.", "relevant_function": "evaluate", "position": {"x": 240, "y": 70}},
            {"id": "pii", "label": "PII & Privacy Scrubber", "type": "gate", "description": "Detects and masks sensitive credentials and personal data.", "position": {"x": 240, "y": 230}},
            {"id": "eval", "label": "Safety Evaluator", "type": "agent", "description": "Computes risk score, blast radius, and financial cost.", "relevant_function": "propose_change", "position": {"x": 460, "y": 150}},
            {"id": "gate", "label": "Human Approval Gate", "type": "gate", "description": "Requires two-person verification for production updates.", "relevant_function": "apply_after_approval", "position": {"x": 680, "y": 150}},
            {"id": "audit", "label": "Tamper-Evident Ledger", "type": "tool", "description": "Logs SHA-256 hashed audit record of all actions.", "relevant_function": "_log", "position": {"x": 880, "y": 70}},
            {"id": "dispatch", "label": "Action Execution", "type": "output", "description": "Safe, governed execution of verified change.", "position": {"x": 880, "y": 230}}
        ],
        "edges": [
            {"id": "e12-1a", "source": "req", "target": "rbac", "label": "credentials"},
            {"id": "e12-1b", "source": "req", "target": "pii", "label": "parameters"},
            {"id": "e12-2a", "source": "rbac", "target": "eval", "label": "authorized"},
            {"id": "e12-2b", "source": "pii", "target": "eval", "label": "scrubbed"},
            {"id": "e12-3", "source": "eval", "target": "gate", "label": "risk score"},
            {"id": "e12-4a", "source": "gate", "target": "audit", "label": "approval proof"},
            {"id": "e12-4b", "source": "gate", "target": "dispatch", "label": "authorized"}
        ]
    },
    13: {
        "lab_id": 13,
        "lab_title": "Lab 13: Discipline-Specific Engineering Agents",
        "pattern_name": "Cyber-Physical Telemetry Agent",
        "pattern_description": "Mechanical predictive maintenance & electrical load balancing with physical safety envelopes.",
        "nodes": [
            {"id": "sensors", "label": "Sensor Log Ingestion", "type": "input", "description": "Continuous vibration, bearing temp, or power telemetry.", "relevant_function": "tool_read_sensor_log", "position": {"x": 80, "y": 150}},
            {"id": "classify", "label": "Condition Classifier", "type": "agent", "description": "Labels reading as NORMAL, WARNING, or CRITICAL.", "relevant_function": "classify_condition", "position": {"x": 280, "y": 150}},
            {"id": "trend", "label": "Trend Vector Analyzer", "type": "tool", "description": "Calculates derivative slope over sliding time window.", "relevant_function": "trend_direction", "position": {"x": 480, "y": 70}},
            {"id": "safety", "label": "Physical Safety Gate", "type": "gate", "description": "Enforces hard engineering thresholds (e.g. 85C max temp).", "relevant_function": "safety_check", "position": {"x": 480, "y": 230}},
            {"id": "recommend", "label": "Action Recommendation", "type": "output", "description": "Prescribes maintenance or load-shedding dispatch.", "relevant_function": "predictive_maintenance_agent", "position": {"x": 720, "y": 150}}
        ],
        "edges": [
            {"id": "e13-1", "source": "sensors", "target": "classify", "label": "telemetry"},
            {"id": "e13-2a", "source": "classify", "target": "trend", "label": "series"},
            {"id": "e13-2b", "source": "classify", "target": "safety", "label": "state"},
            {"id": "e13-3a", "source": "trend", "target": "recommend", "label": "vector"},
            {"id": "e13-3b", "source": "safety", "target": "recommend", "label": "clearance"}
        ]
    },
    14: {
        "lab_id": 14,
        "lab_title": "Lab 14: Capstone Project Studio — Campus Help-Desk Agent",
        "pattern_name": "Full-Stack Enterprise Agent Architecture",
        "pattern_description": "Comprehensive capstone unifying skills, tools, node graph, persistent memory, and regression test suites.",
        "nodes": [
            {"id": "intake", "label": "Student Query Intake", "type": "input", "description": "Incoming campus inquiry or technical issue.", "position": {"x": 50, "y": 150}},
            {"id": "safety", "label": "PII & Safety Check", "type": "gate", "description": "Sanitizes message, checks for adversarial prompt injection.", "position": {"x": 220, "y": 150}},
            {"id": "triage", "label": "Triage & Routing Skill", "type": "skill", "description": "Categorizes topic, urgency, and routing destination.", "relevant_function": "triage_skill", "position": {"x": 400, "y": 150}},
            {"id": "faq", "label": "Knowledge Tool (FAQ)", "type": "tool", "description": "Searches campus articles for instant resolution.", "relevant_function": "tool_search_faq", "position": {"x": 590, "y": 60}},
            {"id": "ticket", "label": "Ticket Dispatch Tool", "type": "tool", "description": "Creates structured IT support ticket with SLA.", "relevant_function": "tool_create_ticket", "position": {"x": 590, "y": 240}},
            {"id": "memory", "label": "Capstone Audit Memory", "type": "agent", "description": "Stores ticket ID, student session state, and history.", "relevant_function": "CapstoneMemory", "position": {"x": 780, "y": 150}},
            {"id": "eval", "label": "Regression Benchmark", "type": "output", "description": "Runs 100% automated regression evaluation battery.", "relevant_function": "run_evaluation", "position": {"x": 970, "y": 150}}
        ],
        "edges": [
            {"id": "e14-1", "source": "intake", "target": "safety", "label": "inbound message"},
            {"id": "e14-2", "source": "safety", "target": "triage", "label": "sanitized query"},
            {"id": "e14-3a", "source": "triage", "target": "faq", "label": "informational"},
            {"id": "e14-3b", "source": "triage", "target": "ticket", "label": "actionable issue"},
            {"id": "e14-4a", "source": "faq", "target": "memory", "label": "faq match"},
            {"id": "e14-4b", "source": "ticket", "target": "memory", "label": "ticket record"},
            {"id": "e14-5", "source": "memory", "target": "eval", "label": "suite validation"}
        ]
    }
}

def get_all_labs() -> List[Dict[str, Any]]:
    return LABS_METADATA

def get_lab_by_id(lab_id: int) -> Optional[Dict[str, Any]]:
    for lab in LABS_METADATA:
        if lab["id"] == lab_id:
            return lab
    return None

def resolve_lab_folder(lab_folder_name: str) -> Optional[Path]:
    # Check unified labs first
    p1 = UNIFIED_LABS_DIR / lab_folder_name
    if p1.is_dir():
        return p1
    # Check root workspace
    p2 = ROOT_LABS_DIR / lab_folder_name
    if p2.is_dir():
        return p2
    return None

def get_program_path(lab_id: int, program_type: str) -> Optional[Path]:
    filename_map = {
        "main": "main.py",
        "assignment_1": "assignment_1.py",
        "assignment_2": "assignment_2.py"
    }
    fname = filename_map.get(program_type)
    if not fname:
        return None

    lab = get_lab_by_id(lab_id)
    if not lab:
        return None

    folder = resolve_lab_folder(lab["folder"])
    if not folder:
        return None

    script_path = folder / fname
    if script_path.is_file():
        return script_path
    return None

def get_tools_for_lab(lab_id: int) -> List[Dict[str, Any]]:
    return [t for t in TOOLS_METADATA if t["lab_id"] == lab_id]

def get_all_tools() -> List[Dict[str, Any]]:
    return TOOLS_METADATA

def get_skills_for_lab(lab_id: int) -> List[Dict[str, Any]]:
    return [s for s in SKILLS_METADATA if s["lab_id"] == lab_id]

def get_all_skills() -> List[Dict[str, Any]]:
    return SKILLS_METADATA

def get_architecture_for_lab(lab_id: int) -> Optional[Dict[str, Any]]:
    return LAB_ARCHITECTURES.get(lab_id)
