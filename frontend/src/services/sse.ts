export interface StreamEvent {
  type: 'start' | 'stdout' | 'stderr' | 'end' | 'error';
  content?: string;
  status?: string;
  exit_code?: number;
  duration_ms?: number;
  timestamp?: string;
}

export function subscribeToExecutionStream(
  executionId: string,
  callbacks: {
    onEvent: (event: StreamEvent) => void;
    onError?: (error: any) => void;
    onComplete?: () => void;
  }
): () => void {
  const url = `/api/executions/${executionId}/stream`;
  const eventSource = new EventSource(url);

  eventSource.onmessage = (e) => {
    try {
      const parsed: StreamEvent = JSON.parse(e.data);
      callbacks.onEvent(parsed);
      if (parsed.type === 'end') {
        eventSource.close();
        callbacks.onComplete?.();
      }
    } catch (err) {
      console.error('Error parsing SSE stream data:', err);
    }
  };

  eventSource.onerror = (err) => {
    callbacks.onError?.(err);
    eventSource.close();
  };

  return () => {
    eventSource.close();
  };
}
