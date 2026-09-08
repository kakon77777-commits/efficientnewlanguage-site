// Parses a generated case document (public/ai/examples/<id>.eml.md) into the
// structured pieces /cases/<id> renders as real HTML.
//
// The corpus generator (scripts/generate-corpus.impl.ts) emits every page with
// the same shape, and that uniformity is measured rather than assumed: across
// all 762 pages there are exactly four headings present in every one — EML,
// Python, stdout, Round-trip — plus "Trace event types" in 760. So the four are
// parsed as required and everything else is optional. A page that stops
// matching does not silently render an empty section: parseCaseDoc throws, and
// the prerenderer fails the build rather than publishing a blank page.

export interface CaseDoc {
  id: string;
  /** '012' — the numeric prefix of the id, which is also the corpus ordering. */
  number: string;
  /** 'Armstrong number checker' — the H1 with its `Example NNN — ` prefix removed. */
  title: string;
  /** The prose paragraph between the H1 and the first `## ` heading. */
  description: string;
  eml: string;
  python: string;
  stdout: string;
  /** The Round-trip line, backticks stripped: `ok: true — round-trip fixpoint…`. */
  roundTrip: string;
  /** eml:run:start, eml:def, … — empty when the page carries no such section. */
  traceEvents: string[];
  /** The page's own `updated:` stamp, or null. Never today's date as a fallback:
   *  a missing stamp is a fact, and inventing one is how the sitemap's lastmod
   *  bug happened. */
  updated: string | null;
}

/** The fenced block of a given language inside a section body. */
function fence(body: string, lang: string): string | null {
  const m = new RegExp('```' + lang + '\\n([\\s\\S]*?)```').exec(body);
  return m ? m[1]!.replace(/\n+$/, '') : null;
}

/** Splits the document into `## ` sections, keyed by heading text. */
function sections(markdown: string): Map<string, string> {
  const out = new Map<string, string>();
  const parts = markdown.split(/^## /m);
  for (const part of parts.slice(1)) {
    const nl = part.indexOf('\n');
    if (nl < 0) continue;
    out.set(part.slice(0, nl).trim(), part.slice(nl + 1));
  }
  return out;
}

export function parseCaseDoc(id: string, markdown: string): CaseDoc {
  const h1 = /^# (.+)$/m.exec(markdown);
  if (!h1) throw new Error(`[case-doc] ${id}: no H1`);
  const heading = h1[1]!.trim();
  const title = heading.replace(/^Example\s+\d+\s+—\s+/, '').trim();

  // Everything between the H1 and the first `## `, collapsed to one paragraph.
  const afterH1 = markdown.slice(h1.index + h1[0].length);
  const beforeFirstSection = afterH1.split(/^## /m)[0] ?? '';
  const description = beforeFirstSection
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)[0]
    ?.replace(/\s*\n\s*/g, ' ')
    .trim() ?? '';

  const secs = sections(markdown);
  const need = (heading: string, lang: string): string => {
    const body = secs.get(heading);
    if (body === undefined) throw new Error(`[case-doc] ${id}: missing section "${heading}"`);
    const code = fence(body, lang);
    if (code === null) throw new Error(`[case-doc] ${id}: section "${heading}" has no \`\`\`${lang} block`);
    return code;
  };

  const roundTripBody = secs.get('Round-trip');
  if (roundTripBody === undefined) throw new Error(`[case-doc] ${id}: missing section "Round-trip"`);
  const roundTrip = (roundTripBody.split(/\n\s*\n/)[0] ?? '').replace(/`/g, '').replace(/\s*\n\s*/g, ' ').trim();

  // 760 of 762 pages say "Trace event types"; two older ones title it
  // differently. Matched by prefix so neither is dropped, and an absent section
  // yields [] rather than a thrown error — it is genuinely optional.
  let traceEvents: string[] = [];
  for (const [head, body] of secs) {
    if (!head.startsWith('Trace')) continue;
    const line = (body.split(/\n\s*\n/)[0] ?? '').trim();
    if (!line || line.startsWith('```')) continue;
    traceEvents = line
      .split(/\s*·\s*/)
      .map((s) => s.replace(/`/g, '').trim())
      .filter(Boolean);
    break;
  }

  const stamped = /updated:\s*(\d{4}-\d{2}-\d{2})/.exec(markdown);

  return {
    id,
    number: (/^\d+/.exec(id) ?? [''])[0],
    title,
    description,
    eml: need('EML', 'eml'),
    python: need('Python (deterministic transpilation)', 'python'),
    stdout: need('stdout (executed)', 'text'),
    roundTrip,
    traceEvents,
    updated: stamped ? stamped[1]! : null,
  };
}

/** Plain text for a `<meta name="description">`: no markdown, one line, and
 *  short enough that a search engine shows the whole sentence rather than
 *  cutting it mid-clause. */
export function metaDescription(doc: CaseDoc): string {
  const text = `EML case ${doc.number} — ${doc.title}. ${doc.description}`
    .replace(/`/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= 155) return text;
  const cut = text.slice(0, 155);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 80 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:—-]+$/, '') + '…';
}
