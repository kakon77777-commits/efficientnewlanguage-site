// Resolves EML_REPO (the local checkout of the EML language repo) and fails
// loudly if it doesn't exist on disk. Previously each script silently fell
// back to a hardcoded local absolute path with no existence check — a missing
// or wrong EML_REPO produced a broken build (unknown SHAs, empty case corpus,
// missing packages) instead of a clear error at the point of failure.
import { existsSync } from 'node:fs';

const DEFAULT_EML_REPO = 'D:/Ai/work together/EML';

export function resolveEmlRepo() {
  const repo = process.env.EML_REPO || DEFAULT_EML_REPO;
  if (!existsSync(repo)) {
    throw new Error(
      `EML_REPO not found at "${repo}". Set the EML_REPO environment variable to your local ` +
        `checkout of the EML language repo (e.g. EML_REPO=/path/to/efficientnewlanguage), or ` +
        `ensure it's checked out at the default location.`,
    );
  }
  return repo;
}
