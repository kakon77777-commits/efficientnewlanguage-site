// Shared case-corpus loading for anything that isn't Playground.tsx (which
// keeps its own inlined, already-shipped version of this same logic — not
// touched here, to avoid any risk to that working code path).

export interface CaseEntry {
  id: string;
  path: string;
  title?: string;
  description?: string;
}

/** Pulls the raw EML source out of a generated case doc's fenced ```eml block
 *  (see public/ai/examples/*.eml.md) — mirrors Playground.tsx's helper of the
 *  same name/behavior. */
function extractEmlSource(doc: string): string | null {
  const m = doc.match(/```eml\n([\s\S]*?)```/);
  return m ? m[1].trimEnd() : null;
}

export async function listCases(): Promise<CaseEntry[]> {
  const res = await fetch('/ai/manifest.json');
  const manifest = await res.json();
  return (manifest.examples ?? []) as CaseEntry[];
}

export async function loadCaseSource(caseId: string): Promise<{ id: string; source: string }> {
  const cases = await listCases();
  const entry = cases.find((c) => c.id === caseId);
  if (!entry) throw new Error(`case not found: ${caseId}`);
  const doc = await (await fetch(entry.path)).text();
  const source = extractEmlSource(doc);
  if (!source) throw new Error(`no eml block in case doc: ${caseId}`);
  return { id: caseId, source };
}
