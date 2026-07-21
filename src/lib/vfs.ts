// Minimal virtual file system for the Web Terminal (whitepaper §8). Scoped to
// a single /workspace namespace for this MVP — the whitepaper's /system,
// /examples, /output layering isn't needed yet; a flat path->content map
// already supports everything the Phase 1 acceptance test requires, and
// leaves room to add more paths later without a schema change.
import { BUILD_ID, EML_CORE_SHA } from '../app/version';

export type Vfs = Record<string, string>;

const STORAGE_KEY = 'eml.terminal.vfs';
export const DEFAULT_ENTRY = '/workspace/main.eml';
const DEFAULT_SOURCE = 'N^+100\nΣ(i^2, i in [1:N]) => r\nr^0\n';

export function defaultVfs(): Vfs {
  return { [DEFAULT_ENTRY]: DEFAULT_SOURCE };
}

export function loadVfs(): Vfs | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as Vfs) : null;
  } catch {
    return null;
  }
}

export function saveVfs(vfs: Vfs): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vfs));
  } catch {
    /* storage unavailable — holds for this session only */
  }
}

export function vfsList(vfs: Vfs): string[] {
  return Object.keys(vfs).sort();
}

/** Matches the whitepaper's §8.2 WorkspaceSnapshot schema. */
interface WorkspaceSnapshot {
  schema: 'eml-workspace-v1';
  id: string;
  createdAt: string;
  updatedAt: string;
  entry: string;
  files: Record<string, { encoding: 'utf-8'; content: string }>;
  runtime: { emlVersion: string; siteVersion: string };
}

export function buildSnapshot(vfs: Vfs, entry: string): WorkspaceSnapshot {
  const files: WorkspaceSnapshot['files'] = {};
  for (const [path, content] of Object.entries(vfs)) {
    files[path] = { encoding: 'utf-8', content };
  }
  const now = new Date().toISOString();
  return {
    schema: 'eml-workspace-v1',
    id: `eml-workspace-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
    entry,
    files,
    runtime: { emlVersion: EML_CORE_SHA, siteVersion: BUILD_ID },
  };
}

export function downloadJson(filename: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
