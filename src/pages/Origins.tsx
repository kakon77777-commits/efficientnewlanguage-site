import { Nav } from '../components/Nav';
import {
  EmlUDefinitionSection,
  EmlUCapabilitiesSection,
  EmlPEmlURelationSection,
  EmlURoadmapSection,
  EmlUSourcesSection,
} from '../components/Sections';
import { Footer } from '../components/Footer';
import { Section, Kicker } from '../components/ui';
import { useContent } from '../lib/useContent';

/** The EML-U concept page (/origins) — where EML-P came from and what the
 *  original, broader theory still holds. Static and prerendered, like /docs;
 *  no interactive state here at all. */
export default function Origins() {
  const c = useContent();

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div aria-hidden className="bg-grid pointer-events-none fixed inset-0 -z-10 opacity-40" />
      <Nav />
      <main>
        <Section className="pt-32 pb-10 sm:pt-36">
          <Kicker>{c.origins.kicker}</Kicker>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{c.origins.title}</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-muted">{c.origins.lead}</p>
        </Section>
        <EmlUDefinitionSection />
        <EmlUCapabilitiesSection />
        <EmlPEmlURelationSection />
        <EmlURoadmapSection />
        <EmlUSourcesSection />
      </main>
      <Footer />
    </div>
  );
}
