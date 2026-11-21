export interface ProgramMetadata {
  key: 'main' | 'assignment_1' | 'assignment_2';
  title: string;
  filename: string;
  description: string;
  expected_output_summary: string;
  line_count?: number;
  exists?: boolean;
}

export interface LabSummary {
  id: number;
  title: string;
  folder: string;
  category: string;
  description: string;
  learning_objective: string;
  icon: string;
  program_count: number;
  tools_count: number;
  skills_count: number;
  has_memory: boolean;
  has_evaluation: boolean;
  governance_type: string;
}

export interface LabDetail extends LabSummary {
  workflow_summary: string;
  memory_type: string;
  evaluation_type: string;
  programs: ProgramMetadata[];
  tools: ToolMetadata[];
  skills: SkillMetadata[];
  readme_content?: string;
}

export interface ExecutionRecord {
  id: string;
  lab_id: number;
  program_type: 'main' | 'assignment_1' | 'assignment_2';
  lab_title: string;
  program_label: string;
  status: 'running' | 'success' | 'failed' | 'stopped';
  start_time: string;
  end_time?: string;
  duration_ms: number;
  exit_code?: number;
  stdout: string;
  stderr: string;
  created_at?: string;
}

export interface OverviewStats {
  total_labs: number;
  total_programs: number;
  total_assignments: number;
  reference_programs: number;
  backend_status: 'online' | 'offline';
  total_executions: number;
  successful_executions: number;
  failed_executions: number;
  stopped_executions: number;
  last_execution?: ExecutionRecord;
}

export interface ToolParameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
  default?: any;
}

export interface ToolMetadata {
  id: string;
  name: string;
  lab_id: number;
  lab_title: string;
  function_name: string;
  description: string;
  parameters: ToolParameter[];
  return_type: string;
  is_read_only: boolean;
  has_side_effects: boolean;
  is_simulated: boolean;
  can_test_standalone: boolean;
  sample_input?: Record<string, any>;
}

export interface SkillExample {
  title: string;
  input: string;
  expected_output: string;
}

export interface SkillMetadata {
  id: string;
  name: string;
  lab_id: number;
  lab_title: string;
  function_or_class: string;
  description: string;
  instructions: string[];
  constraints: string[];
  examples: SkillExample[];
  related_tools: string[];
  reusability: string;
  source_snippet?: string;
}

export interface MemoryRecordItem {
  id: string;
  topic: string;
  content: string;
  author: string;
  timestamp: string;
  is_session: boolean;
  is_long_term: boolean;
  is_stale: boolean;
  access_permission: string;
}

export interface LabMemoryOverview {
  lab_id: number;
  lab_title: string;
  memory_type: string;
  persistence: string;
  persistence_note: string;
  conflict_policy: string;
  retrieval_strategy: string;
  features: string[];
  sample_records: MemoryRecordItem[];
}

export interface TestCase {
  name: string;
  description: string;
  expected: string;
  actual?: string;
  passed: boolean;
  details?: string;
}

export interface EvaluationSuite {
  lab_id: number;
  lab_title: string;
  evaluation_type: string;
  total_tests: number;
  passed_tests: number;
  failed_tests: number;
  score_percentage: number;
  test_cases: TestCase[];
  summary: string;
}

export interface EvaluationOverview {
  total_suites: number;
  total_tests: number;
  overall_passed: number;
  overall_failed: number;
  overall_pass_rate: number;
  suites: EvaluationSuite[];
}

export interface WorkflowNodeData {
  id: string;
  label: string;
  type: 'default' | 'input' | 'output' | 'agent' | 'tool' | 'gate' | 'skill';
  description: string;
  relevant_function?: string;
  position: { x: number; y: number };
  status?: 'idle' | 'active' | 'completed' | 'failed' | 'approval_required';
}

export interface WorkflowEdgeData {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
}

export interface LabArchitecture {
  lab_id: number;
  lab_title: string;
  pattern_name: string;
  pattern_description: string;
  nodes: WorkflowNodeData[];
  edges: WorkflowEdgeData[];
}
