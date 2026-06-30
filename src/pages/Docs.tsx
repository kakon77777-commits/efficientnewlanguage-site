import { FileText, BookOpen, Github } from 'lucide-react';
import { Nav } from '../components/Nav';
import { SymbolsSection, CliSection, ArchSection, OssSection } from '../components/Sections';
import { Footer } from '../components/Footer';
import { Section, Kicker } from '../components/ui';
import { useLang } from '../i18n';
import { LINKS } from '../lib/links';

const REPO = LINKS.github;

/** The reference (/docs) — spec, symbol catalog, architecture, license, GitHub. */
export default function Docs() {
  const { lang } = useLang();
  const t = (en: string, zh: string) => (lang === 'zh' ? zh : en);

  const cards = [
    {
      icon: FileText,
      title: t('Language spec v1.0', '語言規格 v1.0'),
      desc: t('The normative grammar, semantics and diagnostics.', '正式的語法、語意與診斷定義。'),
      href: `${REPO}/blob/main/docs/EML-LANG-2026-v1.0.md`,
    },
    {
      icon: BookOpen,
      title: t('Whitepaper', '白皮書'),
      desc: t('The design rationale and roadmap.', '設計理念與路線圖。'),
      href: `${REPO}/blob/main/docs/whitepaper.md`,
    },
    {
      icon: Github,
      title: t('Source on GitHub', 'GitHub 原始碼'),
      desc: t('Apache-2.0. Read it, fork it, build on it.', 'Apache-2.0。讀它、fork、拿去延伸。'),
      href: REPO,
    },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div aria-hidden className="bg-grid pointer-events-none fixed inset-0 -z-10 opacity-40" />
      <Nav />
      <main>
        <Section className="pt-32 pb-10 sm:pt-36">
          <Kicker>{t('Reference', '參考文件')}</Kicker>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t('Docs & spec', '文件與規格')}</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-muted">
            {t(
              'The evidence layer: the formal language spec, the symbol catalog, the architecture, and the open-source license. Everything here is checked into the public repository.',
              '證據層：正式語言規格、符號表、架構，以及開源授權。這裡的一切都收在公開的版本庫裡。',
            )}
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {cards.map((c) => (
              <a
                key={c.title}
                href={c.href}
                target="_blank"
                rel="noreferrer"
                className="group cursor-pointer rounded-xl border border-line bg-surface/60 p-5 transition-colors duration-200 hover:border-symbol/40"
              >
                <c.icon size={20} className="text-symbol" />
                <h3 className="mt-3 text-base font-semibold text-fg">{c.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-muted">{c.desc}</p>
              </a>
            ))}
          </div>
        </Section>
        <SymbolsSection />
        <CliSection />
        <ArchSection />
        <OssSection />
      </main>
      <Footer />
    </div>
  );
}
