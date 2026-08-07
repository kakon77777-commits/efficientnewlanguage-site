// Smoke test for the bundled edge worker (dist/_worker.js). Imports the real
// built worker, mocks env.ASSETS, and exercises every tool + the resource-limit
// guards. Run after a build: `npm run test:worker`.
import { pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const workerPath = resolve(here, '..', 'dist', '_worker.js');
const worker = (await import(pathToFileURL(workerPath).href)).default;

const ASSET_BODIES = {
  '/ai/index.md': '# EML AI-Native Interface Layer\n',
  '/llms.txt': '# Efficient New Language / EML\n',
  '/': '<!doctype html><div id="root"></div>',
  '/docs/': '<!doctype html><div id="root"><main id="symbols"></main></div>',
  '/ai/manifest.json': JSON.stringify({ examples: [{ id: '000-arithmetic' }] }),
  '/build-info.json': JSON.stringify({ build_id: 'eml-site-test-build', site_sha: 'abc1234', eml_core_sha: 'def5678' }),
};

// Every branch below is a shape MEASURED against production
// (efficientnewlanguage.org, 2026-08-07), not invented. That distinction is the
// whole point of this block: the previous mock answered 404 for every unknown
// path, and the real binding never does — it answers 308 with `Location: /`.
// The SPA-fallback test therefore passed against a worker condition
// (`res.status === 404`) that had never once been true in production, while
// /app and /terminal were being redirected to the homepage. A mock that cannot
// reproduce production's answer is a gate that cannot fail.
//
//   /index.html                      -> 308  Location: /
//   /docs /cases /origins            -> 308  Location: /docs/        (dir exists)
//   /app /terminal /zzz /nope/deep   -> 308  Location: /             (no such dir)
//   /ai/nope /assets/nope.js         -> 404                          (dir exists, file doesn't)
//   /nope.json                       -> 404
const PRERENDERED_DIRS = new Set(['/docs', '/cases', '/origins', '/related']);
const REAL_DIRS = new Set(['ai', 'assets']);
const redirect308 = (location) => new Response(null, { status: 308, headers: { location } });

const env = {
  ASSETS: {
    async fetch(req) {
      const p = new URL(req.url).pathname;
      if (ASSET_BODIES[p]) return new Response(ASSET_BODIES[p], { status: 200, headers: { 'content-type': 'application/octet-stream' } });
      if (p === '/index.html') return redirect308('/');
      if (PRERENDERED_DIRS.has(p)) return redirect308(`${p}/`);
      const firstSegment = p.split('/')[1] || '';
      if (REAL_DIRS.has(firstSegment) || /\.[a-z0-9]+$/i.test(p)) return new Response('not found', { status: 404 });
      return redirect308('/');
    },
  },
};

const BASE = 'https://efficientnewlanguage.org';
const post = (path, body) =>
  worker.fetch(new Request(BASE + path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }), env);
const get = (path) => worker.fetch(new Request(BASE + path), env);

let pass = 0, fail = 0;
const log = [];
async function check(name, fn) {
  try {
    const r = await fn();
    if (r === true) { pass++; log.push(`  PASS  ${name}`); }
    else { fail++; log.push(`  FAIL  ${name} -> ${r}`); }
  } catch (e) { fail++; log.push(`  FAIL  ${name} -> threw ${e.message}`); }
}

const SUM = 'N^+100\nΣ(i^2, i in [1:N]) => r\nr^0';
// `@cold` functions round-trip as of the language repo's Phase E1 (function
// definitions) — only `@hot` remains a PERMANENT round-trip gap (the forward
// emitter renders it as a bare comment, never a real decorator, so the
// reverse lexer — which never tokenizes comments — can't recover it). Use
// `@hot` here, not `@cold`, to keep testing the actually-still-true invariant.
const HOT = '@hot\ndef greet(name):\n    name^0\n    return name\n\ngreet(5)\n';
const RETRY_DECORATED = '@retry\ndef greet(name):\n    name^0\n    return name\n\ngreet(5)\n';

await check('/healthz -> ok', async () => {
  const j = await (await get('/healthz')).json();
  return j.ok === true && j.service === 'eml-site-worker';
});
await check('/readyz -> ok when index+manifest present', async () => {
  const j = await (await get('/readyz')).json();
  return j.ok === true && j.index_html === true && j.manifest_json === true;
});
await check('/version -> mirrors build-info.json', async () => {
  const j = await (await get('/version')).json();
  return j.build_id === 'eml-site-test-build' && j.site_sha === 'abc1234' && j.eml_core_sha === 'def5678';
});
await check('health ok + honest limits', async () => {
  const j = await (await get('/ai/tools/health')).json();
  return j.ok && j.status === 'healthy' && j.tools.length === 6 && j.limits.max_exponent && !('max_execution_time_ms' in j.limits);
});
await check('transpile-python sum -> exact Python', async () => {
  const j = await (await post('/ai/tools/transpile-python', { source: SUM })).json();
  return j.ok && j.result.python === 'N = 100\nr = sum(i**2 for i in range(1, N+1))\nprint(r)\n' && j.input_hash.startsWith('sha256:');
});
await check('interpret sum -> 338350', async () => {
  const j = await (await post('/ai/tools/interpret', { source: SUM })).json();
  return j.ok && j.result.output === '338350\n' && j.result.eventCount === 6;
});
await check('trace sum -> 6 events, 0 anomalies', async () => {
  const j = await (await post('/ai/tools/trace', { source: SUM })).json();
  return j.ok && j.result.summary.total === 6 && j.result.anomalies.length === 0;
});
await check('roundtrip sum -> fixpoint', async () => {
  const j = await (await post('/ai/tools/roundtrip', { source: SUM })).json();
  return j.ok && j.result.ok === true;
});
// `@hot` used to be a guaranteed round-trip MISMATCH: it compiles to a marker
// comment (there is no Python decorator for "do not cache"), the reverse lexer
// dropped it like any other comment, and the annotation silently vanished. The
// reverse lexer now tokenizes that one comment shape, so it survives.
await check('roundtrip hot -> fixpoint (@hot now survives)', async () => {
  const j = await (await post('/ai/tools/roundtrip', { source: HOT })).json();
  return j.ok === true && j.result.ok === true;
});
// A custom decorator is what @hot used to be — preserved outbound as an
// informational comment, with nothing to read it back. Keeps the "a real
// round-trip failure is reported via result.ok, not errors[]" path covered.
await check('roundtrip custom decorator -> ok:false (still forward-only)', async () => {
  const j = await (await post('/ai/tools/roundtrip', { source: RETRY_DECORATED })).json();
  return j.ok === false && j.result.ok === false;
});
await check('parse sum -> Program ast (3 stmts)', async () => {
  const j = await (await post('/ai/tools/parse', { source: SUM })).json();
  return j.ok && j.result.ast.type === 'Program' && j.result.ast.body.length === 3;
});
await check('transpile-eml reverse of augmented Python', async () => {
  const j = await (await post('/ai/tools/transpile-eml', { source: 'x = 100\nx += 10\nx *= 2\nprint(x)' })).json();
  return j.ok && j.result.eml === 'x^+100\nx^+10\nx^*2\nx^0\n';
});
await check('bad request -> 400', async () => {
  const res = await post('/ai/tools/parse', { notsource: 1 });
  return res.status === 400 && (await res.json()).errors[0].code === 'E_BAD_REQUEST';
});
await check('payload too large -> 413', async () => {
  const res = await post('/ai/tools/parse', { source: 'x'.repeat(20001) });
  return res.status === 413;
});
await check('GET on POST tool -> 405', async () => (await get('/ai/tools/parse')).status === 405);
await check('OPTIONS preflight -> 204 + CORS', async () => {
  const res = await worker.fetch(new Request(BASE + '/ai/tools/parse', { method: 'OPTIONS' }), env);
  return res.status === 204 && res.headers.get('access-control-allow-origin') === '*';
});
await check('/ai/ -> index.md as text/markdown', async () => {
  const res = await get('/ai/');
  return res.status === 200 && res.headers.get('content-type').includes('text/markdown');
});
await check('missing /ai/ doc 404s (no SPA hijack)', async () => (await get('/ai/specs/nope.json')).status === 404);
await check('missing extension-less /ai/ path 404s too', async () => (await get('/ai/nope')).status === 404);

// The two client-only routes. Neither is prerendered (main.tsx renders them
// with createRoot rather than hydrating), so neither has a directory in dist,
// so the asset binding bounces both to the root — carrying the fragment with
// them, which is how /app#playground became /#playground and put the reader
// back on the homepage. What must be true is that the worker answers the route
// itself: 200, real markup, NOT a redirect that changes the URL.
for (const route of ['/app', '/terminal']) {
  await check(`SPA fallback: ${route} -> 200 shell, not a bounce to /`, async () => {
    const res = await get(route);
    if (res.status !== 200) return `status ${res.status} location ${res.headers.get('location')}`;
    return (await res.text()).includes('id="root"') || 'no #root in body';
  });
}
await check('SPA fallback: unknown route -> 200 shell (client router decides)', async () => {
  const res = await get('/zzz-not-a-route');
  return res.status === 200 && (await res.text()).includes('id="root"');
});
// Prerendered routes are NOT SPA fallbacks — they have a real directory and
// must keep redirecting to their own trailing-slash form, not be swallowed by
// the fallback above.
await check('/docs -> 308 to /docs/ (prerendered dir, not the fallback)', async () => {
  const res = await get('/docs');
  return res.status === 308 && res.headers.get('location') === '/docs/';
});
await check('/docs/ -> 200 prerendered content', async () => {
  const res = await get('/docs/');
  return res.status === 200 && (await res.text()).includes('id="symbols"');
});

// Resource-limit guards (DoS).
await check('huge BigInt exponent rejected fast', async () => {
  const t0 = Date.now();
  const j = await (await post('/ai/tools/interpret', { source: 'r^+3\nr^1000000000' })).json();
  return j.ok === false && j.errors[0].code === 'E_RESOURCE_LIMIT' && Date.now() - t0 < 300;
});
await check('repeated self-squaring rejected fast', async () => {
  const src = 'r^+2\n' + Array.from({ length: 40 }, () => 'r^*r').join('\n');
  const t0 = Date.now();
  const j = await (await post('/ai/tools/trace', { source: src })).json();
  return j.ok === false && j.errors[0].code === 'E_RESOURCE_LIMIT' && Date.now() - t0 < 300;
});
await check('deep nesting -> E_RESOURCE_LIMIT (not E_INTERNAL)', async () => {
  const j = await (await post('/ai/tools/parse', { source: 'x^+' + '('.repeat(5000) + '1' + ')'.repeat(5000) })).json();
  return j.ok === false && j.errors[0].code === 'E_RESOURCE_LIMIT';
});
await check('normal math not false-positived (2^10=1024)', async () => {
  const j = await (await post('/ai/tools/interpret', { source: 'r^+2\nr^10 => x\nx^0' })).json();
  return j.ok && j.result.output === '1024\n';
});

console.log(log.join('\n'));
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
