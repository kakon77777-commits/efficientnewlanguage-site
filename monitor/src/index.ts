// Standalone synthetic-monitoring Worker (Phase 4 of the fault-prevention
// plan). Runs on its own cron trigger — separate from the main site's Pages
// deployment, since Pages Advanced Mode doesn't support scheduled events,
// only plain Workers do. Every 15 minutes: hits the production site's core
// routes and health endpoints, records pass/fail per check, and logs a
// single structured line (visible via `wrangler tail` / Workers Logs).
// Deliberately log-only for now — no alerting channel wired up yet.

interface Env {
  TARGET_ORIGIN: string;
}

interface CheckResult {
  name: string;
  ok: boolean;
  status?: number;
  detail?: string;
}

async function checkGet(origin: string, path: string): Promise<CheckResult> {
  try {
    const res = await fetch(`${origin}${path}`, { redirect: 'follow' });
    return { name: `GET ${path}`, ok: res.ok, status: res.status };
  } catch (err) {
    return { name: `GET ${path}`, ok: false, detail: String(err) };
  }
}

async function checkInterpret(origin: string): Promise<CheckResult> {
  const source = 'r^+2\nr^10 => x\nx^0\n';
  try {
    const res = await fetch(`${origin}/ai/tools/interpret`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ source }),
    });
    if (!res.ok) return { name: 'POST /ai/tools/interpret', ok: false, status: res.status };
    const body = (await res.json()) as { ok?: boolean; result?: { output?: string } };
    const ok = body.ok === true && body.result?.output === '1024\n';
    return { name: 'POST /ai/tools/interpret', ok, status: res.status, detail: ok ? undefined : JSON.stringify(body) };
  } catch (err) {
    return { name: 'POST /ai/tools/interpret', ok: false, detail: String(err) };
  }
}

async function checkBuildId(origin: string): Promise<CheckResult> {
  try {
    const res = await fetch(`${origin}/version`);
    if (!res.ok) return { name: 'build_id present', ok: false, status: res.status };
    const body = (await res.json()) as { build_id?: string };
    const ok = !!body.build_id && body.build_id !== 'unknown';
    return { name: 'build_id present', ok, detail: body.build_id };
  } catch (err) {
    return { name: 'build_id present', ok: false, detail: String(err) };
  }
}

async function runChecks(origin: string): Promise<CheckResult[]> {
  return Promise.all([
    checkGet(origin, '/'),
    checkGet(origin, '/app'),
    checkGet(origin, '/docs'),
    checkGet(origin, '/cases'),
    checkGet(origin, '/healthz'),
    checkGet(origin, '/readyz'),
    checkGet(origin, '/ai/manifest.json'),
    checkBuildId(origin),
    checkInterpret(origin),
  ]);
}

export default {
  async scheduled(_event: unknown, env: Env): Promise<void> {
    const results = await runChecks(env.TARGET_ORIGIN);
    const failed = results.filter((r) => !r.ok);
    const summary = {
      at: new Date().toISOString(),
      origin: env.TARGET_ORIGIN,
      ok: failed.length === 0,
      passed: results.length - failed.length,
      total: results.length,
      failed: failed.length > 0 ? failed : undefined,
    };
    console.log(JSON.stringify(summary));
  },

  // Manual trigger for local testing (`wrangler dev` -> curl the worker URL)
  // and for confirming the check logic itself without waiting for a cron tick.
  async fetch(_request: Request, env: Env): Promise<Response> {
    const results = await runChecks(env.TARGET_ORIGIN);
    const failed = results.filter((r) => !r.ok);
    return Response.json({
      at: new Date().toISOString(),
      origin: env.TARGET_ORIGIN,
      ok: failed.length === 0,
      results,
    });
  },
};
