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
  '/index.html': '<!doctype html><div id="root"></div>',
  '/ai/manifest.json': JSON.stringify({ examples: [{ id: '000-arithmetic' }] }),
  '/build-info.json': JSON.stringify({ build_id: 'eml-site-test-build', site_sha: 'abc1234', eml_core_sha: 'def5678' }),
};
const env = {
  ASSETS: {
    async fetch(req) {
      const p = new URL(req.url).pathname;
      if (ASSET_BODIES[p]) return new Response(ASSET_BODIES[p], { status: 200, headers: { 'content-type': 'application/octet-stream' } });
      return new Response('not found', { status: 404 });
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
await check('roundtrip hot -> ok:false (permanent forward-only)', async () => {
  const j = await (await post('/ai/tools/roundtrip', { source: HOT })).json();
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
await check('SPA fallback for /docs -> index.html', async () => {
  const res = await get('/docs');
  return res.status === 200 && (await res.text()).includes('id="root"');
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
