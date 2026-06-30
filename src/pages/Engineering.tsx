import { Nav } from '../components/Nav';
import { Hero } from '../components/Hero';
import { Playground } from '../components/Playground';
import { WhatSection, LoopSection, FeaturesSection, AiLayerSection } from '../components/Sections';
import { Footer } from '../components/Footer';

/** The engineering workbench (/app) — the "evidence" experience: see it, run it. */
export default function Engineering() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div aria-hidden className="bg-grid pointer-events-none fixed inset-0 -z-10 opacity-40" />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[480px]"
        style={{ background: 'radial-gradient(60% 60% at 50% 0%, rgba(56,189,248,0.10), transparent 70%)' }}
      />
      <Nav />
      <main>
        <Hero />
        <WhatSection />
        <LoopSection />
        <Playground />
        <FeaturesSection />
        <AiLayerSection />
      </main>
      <Footer />
    </div>
  );
}
