"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { Event } from "@/types";
import type { YoutubeVideo } from "@/types";
import { getActiveEvents, getPastEvents, getYoutubeVideos } from "@/lib/public-api";
import { getYoutubeEmbedUrl } from "./lib/youtube";
import ApplyModal from "./components/ApplyModal";

function formatEventDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent/30 border-t-accent-secondary" />
      <p className="text-sm text-text-muted">Yükleniyor…</p>
    </div>
  );
}

function EmptyCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-accent/10 bg-background-dark/80 py-16 px-6 text-center">
      <div className="mb-4 rounded-full bg-accent/10 p-4">
        <svg className="h-8 w-8 text-accent-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <p className="text-text-muted">{children}</p>
    </div>
  );
}

export default function HomePage() {
  const [activeEvents, setActiveEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalEvent, setModalEvent] = useState<Event | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [active, past, youtube] = await Promise.all([
          getActiveEvents(),
          getPastEvents(),
          getYoutubeVideos(3),
        ]);
        setActiveEvents(active);
        setPastEvents(past);
        setVideos(youtube);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const openApplyModal = (event: Event) => {
    setModalEvent(event);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero + Active Events */}
      <section className="relative overflow-hidden border-b border-accent/20 bg-gradient-to-b from-background via-background to-background-dark">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(76,29,149,0.15),transparent)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 sm:py-20">
          <div className="mb-14 text-center animate-fade-in">
            <h1 className="text-4xl font-bold tracking-[0.15em] text-text-bright drop-shadow-sm sm:text-5xl md:text-6xl">
              AMNESIA
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-text-muted">
              Rave party deneyiminizin başladığı yer.
            </p>
          </div>

          <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent-secondary sm:text-sm">
            Yaklaşan Etkinlikler
          </h2>
          <div className="mb-2 h-0.5 w-12 rounded-full bg-accent/50" />
          {loading ? (
            <LoadingSpinner />
          ) : activeEvents.length === 0 ? (
            <EmptyCard>Henüz yaklaşan etkinlik yok.</EmptyCard>
          ) : (
            <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-2">
              {activeEvents.map((event) => (
                <article
                  key={event.id}
                  className="group animate-fade-in-up overflow-hidden rounded-2xl border border-accent/20 bg-background-dark shadow-glow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-glow"
                >
                  <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[3/4]">
                    {event.poster_url ? (
                      <Image
                        src={event.poster_url}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 50vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent-dark/30" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">
                      <time className="text-sm font-medium text-accent-secondary">
                        {formatEventDate(event.event_date)}
                      </time>
                      <h3 className="mt-1.5 text-2xl font-bold tracking-tight text-white drop-shadow-lg sm:text-3xl">
                        {event.title}
                      </h3>
                    </div>
                  </div>
                  <div className="p-6 sm:p-7">
                    {event.description && (
                      <p className="mb-5 line-clamp-2 text-text-muted">{event.description}</p>
                    )}
                    <button
                      type="button"
                      onClick={() => openApplyModal(event)}
                      className="w-full rounded-xl bg-accent py-3.5 font-semibold text-white shadow-glow-sm transition-all duration-200 hover:bg-accent-light hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
                    >
                      Hemen Başvur
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Past Events */}
      <section className="border-b border-accent/20 bg-background-dark py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent-secondary sm:text-sm">
            Geçmiş Partiler
          </h2>
          <div className="mb-6 h-0.5 w-12 rounded-full bg-accent/50" />
          {loading ? (
            <LoadingSpinner />
          ) : pastEvents.length === 0 ? (
            <EmptyCard>Henüz geçmiş etkinlik yok.</EmptyCard>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pastEvents.map((event) => (
                <article
                  key={event.id}
                  className="group overflow-hidden rounded-xl border border-accent/10 bg-background transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/25 hover:shadow-glow-sm"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    {event.poster_url ? (
                      <Image
                        src={event.poster_url}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-accent/10" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent opacity-70 transition-opacity group-hover:opacity-80" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-lg font-bold text-white drop-shadow-md">
                        {event.title}
                      </h3>
                      <time className="mt-1.5 block text-xs text-text-muted">
                        {formatEventDate(event.event_date)}
                      </time>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* YouTube Videos */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent-secondary sm:text-sm">
            Videolar
          </h2>
          <div className="mb-6 h-0.5 w-12 rounded-full bg-accent/50" />
          {loading ? (
            <LoadingSpinner />
          ) : videos.length === 0 ? (
            <EmptyCard>Henüz video yok.</EmptyCard>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => {
                const embedUrl = getYoutubeEmbedUrl(video.video_url);
                return (
                  <article
                    key={video.id}
                    className="overflow-hidden rounded-xl border border-accent/10 bg-background-dark transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/25 hover:shadow-glow-sm"
                  >
                    <div className="relative aspect-video bg-background-muted">
                      {embedUrl ? (
                        <iframe
                          src={embedUrl}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0 h-full w-full"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-text-muted">
                          Geçersiz video linki
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-text line-clamp-2">{video.title}</h3>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <ApplyModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setModalEvent(null);
        }}
        event={modalEvent}
      />
    </div>
  );
}
