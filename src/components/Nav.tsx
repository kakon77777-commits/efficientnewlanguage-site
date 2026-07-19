import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useLang } from '../i18n';
import { useTheme } from '../theme';
import { useContent } from '../lib/useContent';
import { cn } from './ui';

export function Nav() {
  const { lang, setLang } = useLang();
  const { theme, setTheme } = useTheme();
  const c = useContent();
  const [scrolled, setScrolled] = useState(false);

  // Section anchors live on /app (the workbench) or /docs (the reference), so
  // nav links are absolute and work from any page.
  const DOCS_IDS = new Set(['symbols', 'architecture', 'opensource']);
  const hrefFor = (id: string) => (DOCS_IDS.has(id) ? `/docs#${id}` : `/app#${id}`);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <nav
        className={cn(
          'mx-auto flex h-14 w-full max-w-6xl items-center gap-4 rounded-xl border px-3 transition-colors duration-200 sm:px-4',
          scrolled ? 'border-line bg-base/85 backdrop-blur-md' : 'border-transparent bg-transparent',
        )}
      >
        <a href="/" className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-symbol/15 font-mono text-sm font-bold text-symbol">
            Σ
          </span>
          <span className="font-mono text-sm font-semibold tracking-tight">EML</span>
          <span className="hidden text-xs text-faint sm:inline">2026</span>
        </a>

        <div className="mx-auto hidden items-center gap-1 md:flex">
          {c.nav.links.map((l) => (
            <a
              key={l.id}
              href={hrefFor(l.id)}
              className="cursor-pointer rounded-md px-3 py-1.5 text-sm text-muted transition-colors duration-200 hover:bg-panel hover:text-fg"
            >
              {l.label}
            </a>
          ))}
          <a
            href="/cases"
            className="cursor-pointer rounded-md px-3 py-1.5 text-sm text-muted transition-colors duration-200 hover:bg-panel hover:text-fg"
          >
            {c.nav.cases}
          </a>
        </div>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          {/* Background colour: white / dark */}
          <div className="flex items-center rounded-lg border border-line bg-panel/60 p-0.5">
            {([
              ['light', Sun, 'Light background'],
              ['dark', Moon, 'Dark background'],
            ] as const).map(([t, Icon, label]) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                aria-label={label}
                aria-pressed={theme === t}
                className={cn(
                  'grid h-7 w-7 cursor-pointer place-items-center rounded-md transition-colors duration-200',
                  theme === t ? 'bg-symbol/20 text-symbol' : 'text-muted hover:text-fg',
                )}
              >
                <Icon size={14} />
              </button>
            ))}
          </div>
          <div className="flex items-center rounded-lg border border-line bg-panel/60 p-0.5 font-mono text-xs">
            {(['en', 'zh'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={cn(
                  'cursor-pointer rounded-md px-2.5 py-1 transition-colors duration-200',
                  lang === l ? 'bg-symbol/20 text-symbol' : 'text-muted hover:text-fg',
                )}
              >
                {l === 'en' ? 'EN' : '繁中'}
              </button>
            ))}
          </div>
          <a
            href="/app#playground"
            className="hidden cursor-pointer items-center rounded-lg bg-run px-3.5 py-1.5 text-sm font-semibold text-base transition-colors duration-200 hover:bg-run/90 sm:inline-flex"
          >
            {c.nav.tryIt}
          </a>
        </div>
      </nav>
    </header>
  );
}
