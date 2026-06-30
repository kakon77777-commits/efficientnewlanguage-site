import type { ReactNode } from 'react';

export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}

/** A page section with anchor offset for the fixed nav and consistent rhythm. */
export function Section({
  id,
  children,
  className,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn('scroll-mt-24 px-5 sm:px-8', className)}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

export function Kicker({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-symbol">
      <span className="inline-block h-px w-6 bg-symbol/60" />
      {children}
    </div>
  );
}

export function SectionHead({ kicker, title, lead }: { kicker: string; title: string; lead?: string }) {
  return (
    <div className="max-w-3xl">
      <Kicker>{kicker}</Kicker>
      <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">{title}</h2>
      {lead && <p className="mt-3 text-[15px] leading-7 text-muted">{lead}</p>}
    </div>
  );
}

/** A monospaced code surface used across the site. */
export function Code({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <pre
      className={cn(
        'scroll-thin overflow-auto rounded-xl border border-line bg-sunken p-4 font-mono text-[13.5px] leading-relaxed',
        className,
      )}
    >
      {children}
    </pre>
  );
}
