// tsconfig.json's `@eml/*` paths must point at the EML language repo's actual
// package sources for `tsc --noEmit`/IDE intellisense to resolve them — but
// that repo lives at a different, unrelated absolute path on every machine
// (and inside a CI-checked-out subdirectory in GitHub Actions). Vite's own
// module resolution already goes through resolveEmlRepo() (vite.config.ts),
// so this script keeps tsconfig.json's paths in sync with the same source of
// truth. Runs as `postinstall` so a fresh `npm ci`/`npm install` always
// produces a working tsconfig.json, in CI and locally alike. Idempotent: on
// Neo's machine this always resolves to the same path already committed, so
// it produces no git diff.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { resolveEmlRepo } from './lib/eml-repo.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const tsconfigPath = resolve(root, 'tsconfig.json');

const EML = resolveEmlRepo();
const PACKAGES = ['types', 'parser', 'transpiler-python', 'transpiler-eml', 'interp', 'trace'];

// Targeted text substitution (not JSON.parse + re-stringify) so this doesn't
// reformat the rest of the file on every run — only the 6 @eml/* path values
// change, everything else stays byte-identical.
let text = readFileSync(tsconfigPath, 'utf8');
for (const name of PACKAGES) {
  const re = new RegExp(`("@eml/${name}":\\s*\\[)"[^"]*"(\\])`);
  text = text.replace(re, `$1"${EML}/packages/${name}/src/index.ts"$2`);
}

writeFileSync(tsconfigPath, text);
console.log(`[sync-tsconfig-paths] wrote tsconfig.json @eml/* paths -> ${EML}`);
