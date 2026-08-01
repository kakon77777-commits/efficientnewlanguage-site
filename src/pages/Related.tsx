import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { RelatedHubGrid } from '../components/RelatedSections';
import { Section, Kicker } from '../components/ui';
import { useLang } from '../i18n';
import { RELATED_PAGE } from '../content/related';

/** The link area (/related) — a short intro plus one card per sibling language /
 *  specification project, each linking to its own page at /related/<slug>.
 *  Static and prerendered, like /docs and /origins; no interactive state. */
export default function Related() {
  const { lang } = useLang();

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div aria-hidden className="bg-grid pointer-events-none fixed inset-0 -z-10 opacity-40" />
      <Nav />
      <main>
        <Section id="related" className="pt-32 pb-16 sm:pt-36 sm:pb-24">
          <Kicker>{RELATED_PAGE.kicker[lang]}</Kicker>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{RELATED_PAGE.title[lang]}</h1>
          <p className="mt-3 max-w-3xl text-[15px] leading-7 text-muted">{RELATED_PAGE.lead[lang]}</p>
          <RelatedHubGrid />
          <p className="mt-8 max-w-3xl text-sm leading-6 text-faint">{RELATED_PAGE.note[lang]}</p>
        </Section>
      </main>
      <Footer />
    </div>
  );
}
