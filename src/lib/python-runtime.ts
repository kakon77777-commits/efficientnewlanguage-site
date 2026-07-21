// Main-thread manager for the Pyodide Web Worker (whitepaper §4.2). Lazily
// creates a single worker on the *first* real Python execution — the runtime
// is never fetched just from loading the site, or even /terminal itself, only
// once a "python"/"eml equiv" command actually runs (§9.3 on-demand loading).
//
// Runaway/timed-out code is handled by terminating the worker outright and
// letting the next call spawn a fresh one — no SharedArrayBuffer, no COOP/COEP
// headers (that's true mid-execution interruption, explicitly out of scope
// for this round; see the Phase 2 plan). The cost is losing that worker's warm
// Pyodide state, which just means the next call pays a fresh load.
import type { PythonRunRequest, PythonRunResult } from './python-protocol';

export type PythonStatus = 'idle' | 'loading' | 'ready';

const DEFAULT_TIMEOUT_MS = 10_000;

let worker: Worker | null = null;
let nextRequestId = 0;
const pending = new Map<string, (result: PythonRunResult) => void>();
let status: PythonStatus = 'idle';
const listeners = new Set<(status: PythonStatus) => void>();

function setStatus(next: PythonStatus): void {
  status = next;
  listeners.forEach((cb) => cb(status));
}

export function getPythonStatus(): PythonStatus {
  return status;
}

export function onStatusChange(cb: (status: PythonStatus) => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function ensureWorker(): Worker {
  if (worker) return worker;
  setStatus('loading');
  const w = new Worker(new URL('../workers/python.worker.ts', import.meta.url), { type: 'module' });
  w.onmessage = (ev: MessageEvent<PythonRunResult>) => {
    setStatus('ready');
    const resolve = pending.get(ev.data.requestId);
    pending.delete(ev.data.requestId);
    resolve?.(ev.data);
  };
  worker = w;
  return w;
}

export function runPython(source: string, opts?: { timeoutMs?: number }): Promise<PythonRunResult> {
  const timeoutMs = opts?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const w = ensureWorker();
  const requestId = String(nextRequestId++);

  return new Promise<PythonRunResult>((resolve) => {
    let settled = false;

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      pending.delete(requestId);
      w.terminate();
      if (worker === w) {
        worker = null;
        setStatus('idle');
      }
      resolve({
        requestId,
        ok: false,
        stdout: '',
        stderr: '',
        durationMs: timeoutMs,
        error: { type: 'Timeout', message: `execution exceeded ${timeoutMs}ms and was terminated` },
      });
    }, timeoutMs);

    pending.set(requestId, (result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(result);
    });

    const request: PythonRunRequest = { requestId, source };
    w.postMessage(request);
  });
}
