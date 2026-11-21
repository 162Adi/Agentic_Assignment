import { create } from 'zustand';

export interface ConsoleLine {
  id: string;
  type: 'stdout' | 'stderr' | 'info' | 'system';
  text: string;
  timestamp: string;
}

interface ExecutionState {
  currentExecutionId: string | null;
  isRunning: boolean;
  activeLabId: number | null;
  activeProgramType: 'main' | 'assignment_1' | 'assignment_2';
  status: 'idle' | 'running' | 'success' | 'failed' | 'stopped';
  exitCode: number | null;
  durationMs: number;
  logs: ConsoleLine[];
  autoScroll: boolean;

  setExecution: (labId: number, programType: 'main' | 'assignment_1' | 'assignment_2', executionId?: string) => void;
  startExecution: (executionId: string) => void;
  appendLog: (type: 'stdout' | 'stderr' | 'info' | 'system', text: string) => void;
  finishExecution: (status: 'success' | 'failed' | 'stopped', exitCode?: number, durationMs?: number) => void;
  clearConsole: () => void;
  setAutoScroll: (autoScroll: boolean) => void;
  resetAll: () => void;
}

export const useExecutionStore = create<ExecutionState>((set) => ({
  currentExecutionId: null,
  isRunning: false,
  activeLabId: null,
  activeProgramType: 'main',
  status: 'idle',
  exitCode: null,
  durationMs: 0,
  logs: [],
  autoScroll: true,

  setExecution: (labId, programType, executionId) =>
    set({
      activeLabId: labId,
      activeProgramType: programType,
      currentExecutionId: executionId || null,
    }),

  startExecution: (executionId) =>
    set({
      currentExecutionId: executionId,
      isRunning: true,
      status: 'running',
      exitCode: null,
      durationMs: 0,
      logs: [
        {
          id: `sys-${Date.now()}`,
          type: 'system',
          text: `[SYSTEM] Process spawned (ID: ${executionId}). Streaming live stdout/stderr...`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ],
    }),

  appendLog: (type, text) =>
    set((state) => ({
      logs: [
        ...state.logs,
        {
          id: `log-${Date.now()}-${Math.random()}`,
          type,
          text,
          timestamp: new Date().toLocaleTimeString(),
        },
      ],
    })),

  finishExecution: (status, exitCode, durationMs) =>
    set((state) => ({
      isRunning: false,
      status,
      exitCode: exitCode ?? state.exitCode,
      durationMs: durationMs ?? state.durationMs,
      logs: [
        ...state.logs,
        {
          id: `sys-${Date.now()}`,
          type: 'system',
          text: `[SYSTEM] Process exited with status '${status}' (code: ${exitCode ?? 0}) in ${durationMs ?? 0}ms.`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ],
    })),

  clearConsole: () => set({ logs: [] }),
  setAutoScroll: (autoScroll) => set({ autoScroll }),
  resetAll: () =>
    set({
      currentExecutionId: null,
      isRunning: false,
      status: 'idle',
      exitCode: null,
      durationMs: 0,
      logs: [],
    }),
}));
