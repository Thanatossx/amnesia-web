"use client";

import type { AboutSection } from "@/types";

const HERO_SORT = 0;

const SECTION_ICONS = [
  "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3",
  "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
];

interface AboutContentProps {
  sections: AboutSection[];
}

export default function AboutContent({ sections }: AboutContentProps) {
  const hero = sections.find((s) => s.sort_order === HERO_SORT);
  const contentSections = sections.filter((s) => s.sort_order !== HERO_SORT);

  const title = hero?.title?.trim() || "Rave kültürü ve AMNESIA";
  const subtitle = hero?.content?.trim() || "Elektronik müziğin kalp atışı; unutulmaz gecelerin adresi.";

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="mb-14">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-secondary sm:text-sm">
          Hakkımızda
        </p>
        <div className="mt-2 h-0.5 w-12 rounded-full bg-accent/50" />
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-text-bright sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-lg text-text-muted">
          {subtitle}
        </p>
      </header>

      <section className="space-y-12">
        {contentSections.length === 0 ? (
          <p className="rounded-2xl border border-accent/20 bg-background-dark/80 p-8 text-center text-text-muted">
            İçerik yakında eklenecek.
          </p>
        ) : (
          contentSections.map((block, index) => (
            <article
              key={block.id}
              className="rounded-2xl border border-accent/20 bg-background-dark/80 p-6 shadow-glow-sm transition-shadow hover:shadow-glow sm:p-8"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20">
                <svg
                  className="h-6 w-6 text-accent-secondary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d={SECTION_ICONS[index % SECTION_ICONS.length]}
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-text-bright">
                {block.title || "Bölüm"}
              </h2>
              <div className="mt-4 space-y-4 leading-relaxed text-text-muted">
                {block.content
                  ? block.content.split(/\n\n+/).map((para, i) => (
                      <p key={i}>{para.trim()}</p>
                    ))
                  : null}
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
