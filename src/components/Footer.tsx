import { useContent } from '../lib/useContent';
import { LINKS } from '../lib/links';
import { Section } from './ui';

export function Footer() {
  const c = useContent();
  return (
    <footer className="mt-8 border-t border-line py-12">
      <Section>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-md">
            <div className="flex items-center gap-2.5">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-symbol/15 font-mono text-sm font-bold text-symbol">
                Σ
              </span>
              <span className="font-mono text-sm font-semibold">EML 2026</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">{c.footer.tagline}</p>
          </div>
          <div className="text-sm text-faint sm:text-right">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 sm:justify-end">
              <a
                href={LINKS.company}
                target="_blank"
                rel="noreferrer"
                className="cursor-pointer text-symbol transition-colors duration-200 hover:underline"
              >
                evemisslab.com
              </a>
              <a
                href={`mailto:${LINKS.email}`}
                className="cursor-pointer transition-colors duration-200 hover:text-fg"
              >
                {c.footer.contact}: {LINKS.email}
              </a>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 sm:justify-end">
              <span className="font-mono text-xs text-faint">{c.footer.forAgents}:</span>
              <a href="/llms.txt" target="_blank" rel="noreferrer" className="cursor-pointer font-mono text-xs text-symbol transition-colors duration-200 hover:underline">
                llms.txt
              </a>
              <a href="/ai/index.md" target="_blank" rel="noreferrer" className="cursor-pointer font-mono text-xs text-symbol transition-colors duration-200 hover:underline">
                /ai/
              </a>
              <a href="/ai/tools/openapi.json" target="_blank" rel="noreferrer" className="cursor-pointer font-mono text-xs text-symbol transition-colors duration-200 hover:underline">
                OpenAPI
              </a>
            </div>
            <p className="mt-3">{c.footer.madeWith}</p>
            <p className="mt-2">{c.footer.rights}</p>
          </div>
        </div>
      </Section>
    </footer>
  );
}
