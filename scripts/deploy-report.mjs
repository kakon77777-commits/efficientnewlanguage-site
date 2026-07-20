// Generates a small deploy report from the just-downloaded dist/ artifact
// plus deploy-time facts passed in via env vars. Run from the CI `deploy`
// job right after `wrangler pages deploy` succeeds; uploaded as a workflow
// artifact (not committed — it's a record of one specific deploy, not
// project state).
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const dist = resolve(root, 'dist');

const buildInfo = JSON.parse(readFileSync(join(dist, 'build-info.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(join(dist, 'ai/manifest.json'), 'utf8'));
const assetCount = readdirSync(join(dist, 'assets')).length;

const report = {
  build_id: buildInfo.build_id,
  site_sha: buildInfo.site_sha,
  eml_core_sha: buildInfo.eml_core_sha,
  built_at: buildInfo.built_at,
  case_count: manifest.examples?.length ?? 0,
  asset_file_count: assetCount,
  deploy_url: process.env.DEPLOY_URL ?? null,
  branch: process.env.DEPLOY_BRANCH ?? null,
  is_production: process.env.DEPLOY_BRANCH === 'main',
  deployed_at: process.env.DEPLOY_TIMESTAMP ?? null,
};

writeFileSync(resolve(root, 'deploy-report.json'), JSON.stringify(report, null, 2) + '\n');
console.log('[deploy-report] wrote deploy-report.json');
console.log(JSON.stringify(report, null, 2));
