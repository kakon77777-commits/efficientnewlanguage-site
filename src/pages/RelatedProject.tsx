import { ChevronRight } from 'lucide-react';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { ProjectBadge, ProjectFacts, ProjectSections, RelatedHubGrid, RelatedOtherProjects } from '../components/RelatedSections';
import { Section, Kicker } from '../components/ui';
import { useLang } from '../i18n';
import { RELATED_PAGE, findRelatedProject } from '../content/related';

/** One sibling project's spec page (/related/<slug>), rendered entirely from the
 *  registry in content/related.ts. Static and prerendered; no interactive state.
 *  An unknown slug degrades to the hub content rather than a dead end — the SPA
 *  fallback can route any /related/* path here. */
export default function RelatedProject({ slug }: { slug: string }) {
  const { lang } = useLang();
  const project = findRelatedProject(slug);

  if (!project) {
    return (
      <div className="relative min-h-screen overflow-x-hidden">
        <div aria-hidden className="bg-grid pointer-events-none fixed inset-0 -z-10 opacity-40" />
        <Nav />
        <main>
          <Section className="pt-32 pb-16 sm:pt-36 sm:pb-24">
            <Kicker>{RELATED_PAGE.kicker[lang]}</Kicker>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{RELATED_PAGE.title[lang]}</h1>
            <p className="mt-3 max-w-3xl text-[15px] leading-7 text-amber">{RELATED_PAGE.notFound[lang]}</p>
            <RelatedHubGrid />
          </Section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div aria-hidden className="bg-grid pointer-events-none fixed inset-0 -z-10 opacity-40" />
      <Nav />
      <main>
        <Section className="pt-32 pb-4 sm:pt-36">
          <nav aria-label="breadcrumb" className="mb-6 flex items-center gap-1.5 font-mono text-xs text-faint">
            <a href="/related" className="cursor-pointer transition-colors duration-200 hover:text-fg">
              {RELATED_PAGE.kicker[lang]}
            </a>
            <ChevronRight size={13} />
            <span className="text-muted">{project.code}</span>
          </nav>

          <div className="flex items-start gap-4">
            <ProjectBadge project={project} size="lg" />
            <div className="min-w-0">
              <Kicker>{project.kicker[lang]}</Kicker>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{project.title[lang]}</h1>
            </div>
          </div>

          <p className="mt-4 font-mono text-xs text-muted">{project.expansion}</p>
          <p className="mt-4 max-w-3xl text-[15px] leading-7 text-muted">{project.lead[lang]}</p>
          <ProjectFacts project={project} />
        </Section>

        <ProjectSections project={project} />
        <RelatedOtherProjects current={project.slug} />
      </main>
      <Footer />
    </div>
  );
}
