// Computes a Build ID from both repos' commit SHAs and writes public/build-info.json,
// the single source of truth for the frontend's compiled-in Build ID (via vite.config.ts's
// `define`) and the Worker's /version endpoint (via build-worker.mjs's esbuild `define`).
// Must run before `vite build` so the file exists when both configs read it.
import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { resolveEmlRepo } from './lib/eml-repo.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

function sha(cwd) {
  try {
    return execSync('git rev-parse HEAD', { cwd, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return 'unknown';
  }
}

const EML_REPO = resolveEmlRepo();
const siteSha = sha(root);
const emlCoreSha = sha(EML_REPO);
const buildId = `eml-site-${siteSha.slice(0, 7)}-${emlCoreSha.slice(0, 7)}`;

const info = {
  build_id: buildId,
  site_sha: siteSha,
  eml_core_sha: emlCoreSha,
  node: process.version,
  package_manager: 'npm',
  environment: process.env.DEPLOY_ENV || 'production',
  built_at: new Date().toISOString(),
};

writeFileSync(resolve(root, 'public/build-info.json'), JSON.stringify(info, null, 2) + '\n');
console.log(`[build-meta] wrote public/build-info.json (${buildId})`);
