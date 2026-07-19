/**
 * Cloudflare Pages advanced-mode worker (bundled to dist/_worker.js by
 * scripts/build-worker.mjs). Responsibilities:
 *   1. Canonical host: 301 the long alias -> the short brand domain.
 *   2. /api/geo — visitor country from Cloudflare's edge (language auto-detect).
 *   3. /ai/tools/* — the EML AI-Native Interface Layer's bounded, machine-callable
 *      tools, running the REAL EML toolchain (bundled below). No arbitrary code
 *      execution, no filesystem, no shell, no outbound network. See
 *      docs: /ai/tools/tools.md, contract: /ai/tools/openapi.json.
 *   4. /ai/ static surface — correct content-types (advanced mode ignores _headers)
 *      + permissive CORS so agents can fetch the corpus cross-origin.
 *   5. SPA fallback so client routes (/app, /docs) resolve to index.html.
 *   6. Long-cache headers for fingerprinted assets.
 *
 * The imports below are the same browser-safe packages that power the in-browser
 * playground (run-from-source). They contain no node: APIs (the only node file
 * sink lives in @eml/trace/node, which is never imported here).
 */
import { transpileEmlToPython } from '@eml/transpiler-python';
import { transpilePythonToEml, roundTripFromEml } from '@eml/transpiler-eml';
import { interpret } from '@eml/interp';
import { toJsonl, summarize, findAnomalies } from '@eml/trace';

const CANONICAL_HOST = 'efficientnewlanguage.org';
const REDIRECT_HOSTS = new Set(['httpefficientnewlanguage.org', 'www.httpefficientnewlanguage.org']);

const VERSION = {
  eml_lang: 'EML-LANG-2026-v1.0',
  eml_impl: '0.1.0',
  ai_layer_version: '0.1.0',
  tool_version: '0.1.0',
};
const MAX_SOURCE = 20000;
// Bounds for the executing tools. Integer arithmetic is arbitrary-precision
// BigInt, so a tiny program can request an astronomically large number
// (e.g. r ** 1e9) and exhaust CPU/memory — these caps are enforced statically
// before evaluation. The advertised limits below are the ones actually enforced.
const MAX_NESTING = 256; // raw bracket/paren depth, checked before parse (bounds parser recursion)
const MAX_EXPONENT = 4096; // largest literal power exponent
const MAX_GROWTH_LOG2 = 20; // log2 of the cumulative integer-magnitude multiplier (interpret/trace)
const MAX_RANGE_SPAN = 5_000_000; // largest literal inclusive-range span
const MAX_STEPS = 2_000_000; // interpreter evaluation-step budget (loop iterations + calls)

const TOOL_NAMES = [
  'eml.parse',
  'eml.transpile_python',
  'eml.transpile_eml',
  'eml.interpret',
  'eml.trace',
  'eml.roundtrip',
];

const LIMITS = {
  max_source_length: MAX_SOURCE,
  max_nesting_depth: MAX_NESTING,
  max_exponent: MAX_EXPONENT,
  max_eval_steps: MAX_STEPS,
  allow_network: false,
  allow_filesystem: false,
  allow_shell: false,
  arbitrary_code_execution: false,
};

// Map a POST tool path segment to its catalog tool name.
const POST_TOOLS: Record<string, string> = {
  parse: 'eml.parse',
  'transpile-python': 'eml.transpile_python',
  'transpile-eml': 'eml.transpile_eml',
  interpret: 'eml.interpret',
  trace: 'eml.trace',
  roundtrip: 'eml.roundtrip',
};

type Diag = { severity: string; code: string; message: string; span?: { line: number; column: number } };
type ToolErr = { code: string; message: string; position?: { line: number; column: number }; recoverable?: boolean };

function corsHeaders(extra: Record<string, string> = {}): Record<string, string> {
  return {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
    ...extra,
  };
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders({ 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }),
  });
}

function diagToErr(d: Diag): ToolErr {
  return {
    code: d.code,
    message: d.message,
    position: d.span ? { line: d.span.line, column: d.span.column } : undefined,
    recoverable: d.severity !== 'error',
  };
}

async function sha256(s: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  const hex = Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return `sha256:${hex}`;
}

function envelope(tool: string, input_hash: string, trace_id: string, ok: boolean, result: unknown, errors: ToolErr[], warnings: ToolErr[]) {
  return { ok, tool, version: VERSION, input_hash, result, warnings, errors, trace_id };
}

function errorBody(tool: string, errors: ToolErr[], trace_id: string, input_hash = '') {
  return { ok: false, tool, version: VERSION, input_hash, result: null, warnings: [], errors, trace_id };
}

// Cheap pre-parse guard: maximum bracket/paren nesting in the raw source. The
// recursive-descent parser has no depth limit, so deeply nested input would
// overflow the stack (a RangeError); reject it up front with a clean code.
function rawNestingDepth(s: string): number {
  let depth = 0;
  let max = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '(' || c === '[' || c === '{') {
      if (++depth > max) max = depth;
    } else if (c === ')' || c === ']' || c === '}') {
      if (depth > 0) depth--;
    }
  }
  return max;
}

// Static magnitude guard for the executing tools. Integer arithmetic is exact
// (BigInt), so bound the cumulative bit-growth from powers and self-multiplication
// before evaluating. Returns a reason string when the program is rejected.
function complexityError(ast: unknown): string | null {
  let growthLog2 = 0;
  let reason: string | null = null;
  const isNumLit = (n: any) => n && n.type === 'NumberLiteral';
  const visit = (node: any, depth: number) => {
    if (reason || !node || typeof node !== 'object') return;
    if (depth > MAX_NESTING) {
      reason = 'expression nesting too deep';
      return;
    }
    const ty = node.type;
    if (ty === 'Power' && isNumLit(node.exponent)) {
      const e = Math.abs(node.exponent.value);
      if (e > MAX_EXPONENT) {
        reason = `exponent ${e} exceeds the ${MAX_EXPONENT} limit`;
        return;
      }
      growthLog2 += Math.log2(Math.max(2, e));
    } else if ((ty === 'AugmentedAssign' || ty === 'OverlayAssign') && node.op === '*' && !isNumLit(node.value)) {
      growthLog2 += 1; // x *= <non-constant> can square a growing value
    } else if (ty === 'Binary' && node.op === '*' && !isNumLit(node.left) && !isNumLit(node.right)) {
      growthLog2 += 1;
    } else if (ty === 'Range' && isNumLit(node.start) && isNumLit(node.end)) {
      if (Math.abs(node.end.value - node.start.value) > MAX_RANGE_SPAN) {
        reason = 'range span exceeds the sandbox limit';
        return;
      }
    }
    if (growthLog2 > MAX_GROWTH_LOG2) {
      reason = 'integer magnitude exceeds the sandbox limit';
      return;
    }
    for (const k in node) {
      const v = node[k];
      if (Array.isArray(v)) {
        for (const x of v) visit(x, depth + 1);
      } else if (v && typeof v === 'object') {
        visit(v, depth + 1);
      }
    }
  };
  visit(ast, 0);
  return reason;
}

// Never echo raw host-engine messages (V8 "Maximum call stack size exceeded",
// "Maximum BigInt size exceeded") to clients — map them to a stable domain code.
function sanitizeError(err: unknown): { error: ToolErr; status: number } {
  const msg = err instanceof Error ? err.message : String(err);
  if (err instanceof RangeError || /call stack|BigInt|too large|Maximum/i.test(msg)) {
    return { error: { code: 'E_RESOURCE_LIMIT', message: 'input too complex or computed result too large', recoverable: false }, status: 200 };
  }
  return { error: { code: 'E_INTERNAL', message: 'internal error while processing source', recoverable: false }, status: 500 };
}

function resourceLimit(toolName: string, message: string, trace_id: string, input_hash: string): Response {
  return json(errorBody(toolName, [{ code: 'E_RESOURCE_LIMIT', message, recoverable: false }], trace_id, input_hash), 200);
}

async function handleTool(toolName: string, request: Request): Promise<Response> {
  const trace_id = `eml-trace-${crypto.randomUUID()}`;

  let body: { source?: unknown } = {};
  try {
    body = (await request.json()) as { source?: unknown };
  } catch {
    return json(errorBody(toolName, [{ code: 'E_BAD_REQUEST', message: 'Request body must be valid JSON.', recoverable: true }], trace_id), 400);
  }
  const source = body?.source;
  if (typeof source !== 'string') {
    return json(errorBody(toolName, [{ code: 'E_BAD_REQUEST', message: 'Missing required string field: "source".', recoverable: true }], trace_id), 400);
  }
  if (source.length > MAX_SOURCE) {
    return json(errorBody(toolName, [{ code: 'E_PAYLOAD_TOO_LARGE', message: `"source" exceeds the ${MAX_SOURCE}-character limit.`, recoverable: false }], trace_id), 413);
  }

  const input_hash = await sha256(source);

  if (rawNestingDepth(source) > MAX_NESTING) {
    return resourceLimit(toolName, `nesting depth exceeds the ${MAX_NESTING} limit`, trace_id, input_hash);
  }

  try {
    switch (toolName) {
      case 'eml.parse': {
        const t = transpileEmlToPython(source);
        const errors = t.diagnostics.filter((d) => d.severity === 'error').map(diagToErr);
        const warnings = t.diagnostics.filter((d) => d.severity === 'warning').map(diagToErr);
        const result = { ast: t.ast, normalized: t.normalized, tokenCount: t.tokens.length };
        return json(envelope(toolName, input_hash, trace_id, t.ok, result, errors, warnings));
      }
      case 'eml.transpile_python': {
        const t = transpileEmlToPython(source);
        const errors = t.diagnostics.filter((d) => d.severity === 'error').map(diagToErr);
        const warnings = t.diagnostics.filter((d) => d.severity === 'warning').map(diagToErr);
        const result = {
          python: t.python,
          imports: t.imports,
          metadata: {
            symbolsUsed: t.metadata.symbolsUsed,
            declaredNames: t.metadata.declaredNames,
            emlLines: t.metadata.emlLines,
            pythonLines: t.metadata.pythonLines,
          },
        };
        return json(envelope(toolName, input_hash, trace_id, t.ok, result, errors, warnings));
      }
      case 'eml.transpile_eml': {
        const r = transpilePythonToEml(source);
        const errors: ToolErr[] = r.ok ? [] : [{ code: 'E_PARSE', message: r.error || 'reverse Python->EML failed', recoverable: true }];
        return json(envelope(toolName, input_hash, trace_id, r.ok, { eml: r.eml }, errors, []));
      }
      case 'eml.interpret': {
        const pre = transpileEmlToPython(source);
        if (pre.ok) {
          const cerr = complexityError(pre.ast);
          if (cerr) return resourceLimit(toolName, cerr, trace_id, input_hash);
        }
        const i = interpret(source, { maxSteps: MAX_STEPS });
        const errors = i.diagnostics.filter((d) => d.severity === 'error').map(diagToErr);
        if (i.error) errors.push({ code: i.error.type || 'E_RUNTIME', message: i.error.message, recoverable: false });
        const result = { output: i.output, outputLines: i.outputLines, unsupported: i.unsupported, eventCount: i.events.length };
        return json(envelope(toolName, input_hash, trace_id, i.ok, result, errors, []));
      }
      case 'eml.trace': {
        const pre = transpileEmlToPython(source);
        if (pre.ok) {
          const cerr = complexityError(pre.ast);
          if (cerr) return resourceLimit(toolName, cerr, trace_id, input_hash);
        }
        const i = interpret(source, { maxSteps: MAX_STEPS });
        const anomalies = findAnomalies(i.events);
        const errors = i.diagnostics.filter((d) => d.severity === 'error').map(diagToErr);
        if (i.error) errors.push({ code: i.error.type || 'E_RUNTIME', message: i.error.message, recoverable: false });
        const result = { jsonl: toJsonl(i.events), summary: summarize(i.events), anomalies, eventCount: i.events.length };
        return json(envelope(toolName, input_hash, trace_id, i.ok, result, errors, []));
      }
      case 'eml.roundtrip': {
        const r = roundTripFromEml(source);
        return json(envelope(toolName, input_hash, trace_id, r.ok, { ok: r.ok, steps: r.steps, message: r.message }, [], []));
      }
      default:
        return json(errorBody(toolName, [{ code: 'E_NOT_FOUND', message: 'Unknown tool.' }], trace_id, input_hash), 404);
    }
  } catch (err) {
    const { error, status } = sanitizeError(err);
    return json(errorBody(toolName, [error], trace_id, input_hash), status);
  }
}

function healthBody() {
  return { ok: true, status: 'healthy', version: VERSION, trace_proto: 'phosphor-jsonl-v1', tools: TOOL_NAMES, limits: LIMITS };
}

// Content-type for the static /ai/ surface (advanced mode ignores _headers).
function aiContentType(pathname: string): string | null {
  if (pathname.endsWith('.md')) return 'text/markdown; charset=utf-8';
  if (pathname.endsWith('.ebnf')) return 'text/plain; charset=utf-8';
  if (pathname.endsWith('.jsonl')) return 'application/x-ndjson; charset=utf-8';
  if (pathname.endsWith('.json')) return 'application/json; charset=utf-8';
  if (pathname.endsWith('.txt')) return 'text/plain; charset=utf-8';
  if (pathname.endsWith('.xml')) return 'application/xml; charset=utf-8';
  return null;
}

export default {
  async fetch(request: Request, env: { ASSETS: { fetch: (req: Request) => Promise<Response> } }): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    // 1. Canonical host.
    if (REDIRECT_HOSTS.has(url.hostname)) {
      url.hostname = CANONICAL_HOST;
      return Response.redirect(url.toString(), 301);
    }

    // 1b. Health / readiness / version — checked early so monitoring never
    // depends on anything downstream (SPA fallback, tool layer, etc).
    if (pathname === '/healthz') {
      return json({ ok: true, service: 'eml-site-worker' });
    }
    if (pathname === '/readyz') {
      try {
        // Fetch '/', not '/index.html' — the ASSETS binding 308-redirects the
        // latter to the former, and a redirect response's `.ok` is false even
        // though the site is perfectly healthy.
        const [idx, manifest] = await Promise.all([
          env.ASSETS.fetch(new Request(new URL('/', url), request)),
          env.ASSETS.fetch(new Request(new URL('/ai/manifest.json', url), request)),
        ]);
        const ok = idx.ok && manifest.ok;
        return json({ ok, index_html: idx.ok, manifest_json: manifest.ok }, ok ? 200 : 503);
      } catch {
        return json({ ok: false, error: 'readiness check failed' }, 503);
      }
    }
    if (pathname === '/version') {
      const res = await env.ASSETS.fetch(new Request(new URL('/build-info.json', url), request));
      if (res.ok) return json(await res.json());
      return json({ build_id: 'unknown' });
    }

    // CORS preflight for the tool layer.
    if (request.method === 'OPTIONS' && (pathname.startsWith('/ai/tools/') || pathname === '/api/geo')) {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    // 2. Edge geo.
    if (pathname === '/api/geo') {
      const cf = (request as Request & { cf?: { country?: string } }).cf;
      const country = cf?.country || request.headers.get('cf-ipcountry') || '';
      return new Response(JSON.stringify({ country }), {
        headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
      });
    }

    // 3. Agent Tool Layer.
    if (pathname.startsWith('/ai/tools/')) {
      const seg = pathname.slice('/ai/tools/'.length).replace(/\/+$/, '');
      if (request.method === 'GET' && seg === 'health') {
        return json(healthBody());
      }
      const toolName = POST_TOOLS[seg];
      if (toolName) {
        if (request.method !== 'POST') {
          return json(errorBody(toolName, [{ code: 'E_METHOD_NOT_ALLOWED', message: 'Use POST with a JSON body { "source": "..." }.' }], `eml-trace-${crypto.randomUUID()}`), 405);
        }
        return handleTool(toolName, request);
      }
      // Unknown /ai/tools/* path that is not a static doc — fall through to assets
      // so the markdown docs (parse.md, etc.) still serve.
    }

    // 4a. Bare /ai or /ai/ -> the machine index (avoid SPA fallback hijacking it).
    if (pathname === '/ai' || pathname === '/ai/') {
      const res = await env.ASSETS.fetch(new Request(new URL('/ai/index.md', url), request));
      return withText(res, 'text/markdown; charset=utf-8');
    }

    // 5. Static assets.
    let res = await env.ASSETS.fetch(request);

    // SPA fallback: a GET for an extension-less route that 404s -> index.html.
    // /ai/ paths never SPA-fallback (a missing machine doc must 404, not render the app).
    const looksLikeRoute =
      request.method === 'GET' &&
      !pathname.startsWith('/assets/') &&
      !pathname.startsWith('/ai/') &&
      !/\.[a-z0-9]+$/i.test(pathname);
    if (res.status === 404 && looksLikeRoute) {
      res = await env.ASSETS.fetch(new Request(new URL('/index.html', url), request));
    }

    // Long-cache fingerprinted assets.
    if (pathname.startsWith('/assets/')) {
      const cached = new Response(res.body, res);
      cached.headers.set('cache-control', 'public, max-age=31536000, immutable');
      return cached;
    }

    // 4b. Correct content-type + CORS for the machine surface.
    if (pathname.startsWith('/ai/') || pathname === '/llms.txt' || pathname === '/sitemap.xml' || pathname === '/robots.txt') {
      const ct = aiContentType(pathname);
      const out = new Response(res.body, res);
      if (ct) out.headers.set('content-type', ct);
      out.headers.set('access-control-allow-origin', '*');
      out.headers.set('cache-control', 'public, max-age=300, must-revalidate');
      return out;
    }

    return res;
  },
};

function withText(res: Response, contentType: string): Response {
  const out = new Response(res.body, res);
  out.headers.set('content-type', contentType);
  out.headers.set('access-control-allow-origin', '*');
  out.headers.set('cache-control', 'public, max-age=300, must-revalidate');
  return out;
}
