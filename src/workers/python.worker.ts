// The Python/WASM execution layer (whitepaper §4.2) — Pyodide runs here,
// never on the main thread. Must be a `type: module` worker: pyodide.asm.mjs
// is an ES module, and classic workers using importScripts() aren't
// supported (confirmed against pyodide.org/en/stable/usage/webworker.html).
//
// Loaded straight from the official CDN, not bundled into the site's own
// build — the whole point (whitepaper §9.3) is that nothing Python-related
// downloads until a user actually runs a "python"/"eml equiv" command.
// @ts-expect-error - CDN URL import has no local .d.ts; PyodideInterface below covers what we use.
import { loadPyodide } from 'https://cdn.jsdelivr.net/pyodide/v314.0.2/full/pyodide.mjs';
import type { PythonRunRequest, PythonRunResult } from '../lib/python-protocol';

interface PyodideInterface {
  runPythonAsync(code: string): Promise<unknown>;
  loadPackagesFromImports(code: string): Promise<void>;
  setStdout(options: { batched: (msg: string) => void }): void;
  setStderr(options: { batched: (msg: string) => void }): void;
}

// The app's tsconfig uses the `DOM` lib (for the main-thread/React code), which
// declares a conflicting global `postMessage` (window.postMessage requires a
// targetOrigin argument a worker's postMessage doesn't have). Rather than add
// `WebWorker` to the shared tsconfig, cast to the minimal shape this file
// actually needs.
interface WorkerScope {
  postMessage(message: PythonRunResult): void;
  onmessage: ((ev: MessageEvent<PythonRunRequest>) => void) | null;
}
const scope = globalThis as unknown as WorkerScope;

const pyodideReady: Promise<PyodideInterface> = loadPyodide();

scope.onmessage = async (ev) => {
  const { requestId, source } = ev.data;
  const started = Date.now();
  const stdoutChunks: string[] = [];
  const stderrChunks: string[] = [];

  try {
    const pyodide = await pyodideReady;
    pyodide.setStdout({ batched: (msg) => stdoutChunks.push(msg) });
    pyodide.setStderr({ batched: (msg) => stderrChunks.push(msg) });
    await pyodide.loadPackagesFromImports(source);
    await pyodide.runPythonAsync(source);
    scope.postMessage({
      requestId,
      ok: true,
      stdout: stdoutChunks.join('\n'),
      stderr: stderrChunks.join('\n'),
      durationMs: Date.now() - started,
    });
  } catch (e) {
    scope.postMessage({
      requestId,
      ok: false,
      stdout: stdoutChunks.join('\n'),
      stderr: stderrChunks.join('\n'),
      durationMs: Date.now() - started,
      error: { type: e instanceof Error ? e.name : 'Error', message: e instanceof Error ? e.message : String(e) },
    });
  }
};
