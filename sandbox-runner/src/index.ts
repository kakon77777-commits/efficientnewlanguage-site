/**
 * EML Web Terminal Phase 3 — Remote Sandbox Runner (MVP scope: real CPython
 * execution only, per EML_Web_Terminal_技術白皮書_v0.1.md §4.3/§14).
 *
 * Deliberately NOT linked from any public UI yet: no documented way to
 * restrict a Sandbox container's outbound network access was found in
 * Cloudflare's Sandbox SDK docs (checked the overview, platform/limits,
 * configuration, and api reference pages), so this endpoint is gated behind
 * a shared-secret bearer token instead of being safe for anonymous traffic.
 */
import { getSandbox, type Sandbox } from '@cloudflare/sandbox';

export { Sandbox } from '@cloudflare/sandbox';

interface Env {
  Sandbox: DurableObjectNamespace<Sandbox>;
  RUNNER_TOKEN: string;
}

const MAX_FILES = 20;
const MAX_FILE_BYTES = 256 * 1024;
const MIN_TIMEOUT_MS = 1000;
const MAX_TIMEOUT_MS = 10_000;
const MAX_OUTPUT_CHARS = 65536;

interface RunRequest {
  entry?: unknown;
  files?: unknown;
  timeoutMs?: unknown;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

async function sha256Hex(s: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function isAuthorized(request: Request, env: Env): Promise<boolean> {
  const header = request.headers.get('authorization') ?? '';
  const match = /^Bearer (.+)$/.exec(header);
  if (!match) return false;
  const [given, expected] = await Promise.all([sha256Hex(match[1]), sha256Hex(env.RUNNER_TOKEN)]);
  return given === expected;
}

/** Rejects absolute paths and any `..` traversal segment; confines every
 *  file to the sandbox's /workspace directory. */
function isSafeRelativePath(path: string): boolean {
  if (!path || path.startsWith('/') || path.includes('\\')) return false;
  return path.split('/').every((seg) => seg !== '' && seg !== '.' && seg !== '..');
}

function truncate(s: string): string {
  return s.length > MAX_OUTPUT_CHARS ? `${s.slice(0, MAX_OUTPUT_CHARS)}\n…(truncated)` : s;
}

function validateRunRequest(body: RunRequest): { ok: true; entry: string; files: Record<string, string>; timeoutMs: number } | { ok: false; error: string } {
  if (typeof body.entry !== 'string' || !isSafeRelativePath(body.entry)) {
    return { ok: false, error: 'missing or unsafe "entry" path' };
  }
  if (typeof body.files !== 'object' || body.files === null || Array.isArray(body.files)) {
    return { ok: false, error: 'missing "files" object' };
  }
  const files = body.files as Record<string, unknown>;
  const entries = Object.entries(files);
  if (entries.length === 0 || entries.length > MAX_FILES) {
    return { ok: false, error: `"files" must have 1-${MAX_FILES} entries` };
  }
  const safeFiles: Record<string, string> = {};
  for (const [path, content] of entries) {
    if (!isSafeRelativePath(path)) return { ok: false, error: `unsafe file path: ${path}` };
    if (typeof content !== 'string') return { ok: false, error: `file content must be a string: ${path}` };
    if (content.length > MAX_FILE_BYTES) return { ok: false, error: `file exceeds ${MAX_FILE_BYTES} bytes: ${path}` };
    safeFiles[path] = content;
  }
  if (!(body.entry in files)) {
    return { ok: false, error: '"entry" must be one of the provided "files"' };
  }
  let timeoutMs = MAX_TIMEOUT_MS;
  if (body.timeoutMs !== undefined) {
    if (typeof body.timeoutMs !== 'number' || !Number.isFinite(body.timeoutMs)) {
      return { ok: false, error: '"timeoutMs" must be a number' };
    }
    timeoutMs = Math.min(MAX_TIMEOUT_MS, Math.max(MIN_TIMEOUT_MS, Math.floor(body.timeoutMs)));
  }
  return { ok: true, entry: body.entry, files: safeFiles, timeoutMs };
}

async function handleRun(request: Request, env: Env): Promise<Response> {
  if (!(await isAuthorized(request, env))) {
    return json({ ok: false, error: 'unauthorized' }, 401);
  }

  let body: RunRequest;
  try {
    body = (await request.json()) as RunRequest;
  } catch {
    return json({ ok: false, error: 'request body must be valid JSON' }, 400);
  }

  const validated = validateRunRequest(body);
  if (!validated.ok) {
    return json({ ok: false, error: validated.error }, 400);
  }
  const { entry, files, timeoutMs } = validated;

  const jobId = crypto.randomUUID();
  const sandbox = getSandbox(env.Sandbox, jobId);
  const startedAt = Date.now();

  try {
    for (const [path, content] of Object.entries(files)) {
      await sandbox.writeFile(`/workspace/${path}`, content);
    }

    // sandbox.exec()'s own `timeout` option does NOT reliably kill a running
    // process (verified live: a 15s time.sleep() ran to completion with
    // timeout:3000 set) — race it ourselves and let the `finally` below's
    // destroy() do the actual killing. The abandoned exec is left to settle
    // in the background; its result is discarded either way.
    const execPromise = sandbox.exec(`python3 ${entry}`, { cwd: '/workspace' });
    execPromise.catch(() => {});
    const timedOut = Symbol('timeout');
    const result = await Promise.race([
      execPromise,
      new Promise<typeof timedOut>((resolve) => setTimeout(() => resolve(timedOut), timeoutMs)),
    ]);

    if (result === timedOut) {
      return json({
        jobId,
        ok: false,
        exitCode: null,
        stdout: '',
        stderr: '',
        durationMs: Date.now() - startedAt,
        error: `execution exceeded ${timeoutMs}ms and was terminated`,
      });
    }

    return json({
      jobId,
      ok: result.success,
      exitCode: result.exitCode,
      stdout: truncate(result.stdout),
      stderr: truncate(result.stderr),
      durationMs: Date.now() - startedAt,
    });
  } catch (err) {
    return json({
      jobId,
      ok: false,
      exitCode: null,
      stdout: '',
      stderr: '',
      durationMs: Date.now() - startedAt,
      error: err instanceof Error ? err.message : String(err),
    });
  } finally {
    await sandbox.destroy();
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (pathname === '/healthz') {
      return json({ ok: true, service: 'eml-site-sandbox-runner' });
    }

    if (pathname === '/api/run') {
      if (request.method !== 'POST') {
        return json({ ok: false, error: 'use POST' }, 405);
      }
      return handleRun(request, env);
    }

    return json({ ok: false, error: 'not found' }, 404);
  },
};
