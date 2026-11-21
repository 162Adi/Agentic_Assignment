import {
  LabSummary,
  LabDetail,
  ExecutionRecord,
  OverviewStats,
  ToolMetadata,
  SkillMetadata,
  LabMemoryOverview,
  EvaluationOverview,
  EvaluationSuite,
  LabArchitecture,
} from '../types';

const API_BASE = '/api';

export async function fetchHealth(): Promise<{ status: string; uptime_seconds: number; python_version: string }> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Backend health check failed');
  return res.json();
}

export async function fetchStats(): Promise<OverviewStats> {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error('Failed to fetch overview stats');
  return res.json();
}

export async function fetchLabs(): Promise<LabSummary[]> {
  const res = await fetch(`${API_BASE}/labs`);
  if (!res.ok) throw new Error('Failed to fetch labs');
  return res.json();
}

export async function fetchLabDetail(labId: number): Promise<LabDetail> {
  const res = await fetch(`${API_BASE}/labs/${labId}`);
  if (!res.ok) throw new Error(`Failed to fetch Lab ${labId}`);
  return res.json();
}

export async function fetchSourceCode(
  labId: number,
  programType: string
): Promise<{ source_code: string; line_count: number; filename: string }> {
  const res = await fetch(`${API_BASE}/labs/${labId}/code/${programType}`);
  if (!res.ok) throw new Error('Failed to fetch source code');
  return res.json();
}

export async function launchExecution(
  labId: number,
  programType: 'main' | 'assignment_1' | 'assignment_2'
): Promise<{ execution_id: string; status: string; message: string }> {
  const res = await fetch(`${API_BASE}/executions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lab_id: labId, program_type: programType }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to start execution');
  }
  return res.json();
}

export async function fetchExecutions(params?: {
  limit?: number;
  offset?: number;
  lab_id?: number;
  status?: string;
}): Promise<ExecutionRecord[]> {
  const query = new URLSearchParams();
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.offset) query.set('offset', String(params.offset));
  if (params?.lab_id) query.set('lab_id', String(params.lab_id));
  if (params?.status) query.set('status', params.status);

  const res = await fetch(`${API_BASE}/executions?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch executions');
  return res.json();
}

export async function fetchExecution(executionId: string): Promise<ExecutionRecord> {
  const res = await fetch(`${API_BASE}/executions/${executionId}`);
  if (!res.ok) throw new Error('Failed to fetch execution detail');
  return res.json();
}

export async function stopExecution(executionId: string): Promise<{ status: string; message: string }> {
  const res = await fetch(`${API_BASE}/executions/${executionId}/stop`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to stop execution');
  return res.json();
}

export async function clearExecutions(): Promise<{ status: string; deleted_count: number }> {
  const res = await fetch(`${API_BASE}/executions`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to clear execution history');
  return res.json();
}

export async function runAllPrograms(): Promise<{ batch_id: string; message: string }> {
  const res = await fetch(`${API_BASE}/executions/run-all`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to trigger batch execution');
  return res.json();
}

export async function fetchTools(): Promise<ToolMetadata[]> {
  const res = await fetch(`${API_BASE}/tools`);
  if (!res.ok) throw new Error('Failed to fetch tools registry');
  return res.json();
}

export async function testTool(
  toolId: string,
  parameters: Record<string, any>
): Promise<{ tool_id: string; success: boolean; output: any; error?: string; execution_time_ms: number }> {
  const res = await fetch(`${API_BASE}/tools/${toolId}/test`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tool_id: toolId, parameters }),
  });
  if (!res.ok) throw new Error('Tool test invocation failed');
  return res.json();
}

export async function fetchSkills(): Promise<SkillMetadata[]> {
  const res = await fetch(`${API_BASE}/skills`);
  if (!res.ok) throw new Error('Failed to fetch skills registry');
  return res.json();
}

export async function fetchAllMemory(): Promise<LabMemoryOverview[]> {
  const res = await fetch(`${API_BASE}/memory`);
  if (!res.ok) throw new Error('Failed to fetch memory data');
  return res.json();
}

export async function fetchLabMemory(labId: number): Promise<LabMemoryOverview> {
  const res = await fetch(`${API_BASE}/memory/${labId}`);
  if (!res.ok) throw new Error(`Failed to fetch memory for Lab ${labId}`);
  return res.json();
}

export async function fetchEvaluations(): Promise<EvaluationOverview> {
  const res = await fetch(`${API_BASE}/evaluations`);
  if (!res.ok) throw new Error('Failed to fetch evaluations');
  return res.json();
}

export async function fetchLabEvaluation(labId: number): Promise<EvaluationSuite> {
  const res = await fetch(`${API_BASE}/evaluations/${labId}`);
  if (!res.ok) throw new Error(`Failed to fetch evaluation for Lab ${labId}`);
  return res.json();
}

export async function fetchAllArchitectures(): Promise<LabArchitecture[]> {
  const res = await fetch(`${API_BASE}/architecture`);
  if (!res.ok) throw new Error('Failed to fetch architectures');
  return res.json();
}

export async function fetchLabArchitecture(labId: number): Promise<LabArchitecture> {
  const res = await fetch(`${API_BASE}/architecture/${labId}`);
  if (!res.ok) throw new Error(`Failed to fetch architecture for Lab ${labId}`);
  return res.json();
}
