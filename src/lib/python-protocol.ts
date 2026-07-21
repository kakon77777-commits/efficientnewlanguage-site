// Message shapes shared between the main thread (lib/python-runtime.ts) and
// the Pyodide worker (workers/python.worker.ts) — kept in one place so the
// two sides of the postMessage boundary can't silently drift apart.

export interface PythonRunRequest {
  requestId: string;
  source: string;
}

export interface PythonRunResult {
  requestId: string;
  ok: boolean;
  stdout: string;
  stderr: string;
  durationMs: number;
  error?: { type: string; message: string };
}
