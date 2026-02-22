"use client";

import { useEffect, useState } from "react";
import { submitApplicant } from "@/lib/public-api";
import type { Event } from "@/types";

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

export default function ApplyModal({ isOpen, onClose, event }: ApplyModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
      setError(null);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!event) return;
    setError(null);
    setSubmitting(true);
    try {
      await submitApplicant({
        event_id: event.id,
        full_name: fullName,
        email,
        phone: phone || null,
        answers: {},
        status: "bekliyor",
      });
      setFullName("");
      setEmail("");
      setPhone("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Başvuru gönderilemedi.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-2xl border border-accent/30 bg-background-dark shadow-2xl shadow-accent/20 animate-fade-in-up">
        <div className="flex items-center justify-between border-b border-accent/20 px-6 py-5">
          <h2 id="modal-title" className="text-lg font-semibold text-text-bright">
            Başvuru — {event?.title ?? "Etkinlik"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-text-muted transition-colors hover:bg-accent/20 hover:text-text focus:outline-none focus:ring-2 focus:ring-accent/50"
            aria-label="Kapat"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form className="space-y-5 p-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="full_name" className="mb-1.5 block text-sm font-medium text-text-muted">
              Ad Soyad
            </label>
            <input
              id="full_name"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-accent/30 bg-background px-4 py-2.5 text-text placeholder:text-text-muted/50 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
              placeholder="Adınız Soyadınız"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-text-muted">
              E-posta
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-accent/30 bg-background px-4 py-2.5 text-text placeholder:text-text-muted/50 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
              placeholder="ornek@email.com"
            />
          </div>
          <div>
            <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-text-muted">
              Telefon
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-accent/30 bg-background px-4 py-2.5 text-text placeholder:text-text-muted/50 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
              placeholder="05XX XXX XX XX"
            />
          </div>
          {error && (
            <p className="rounded-xl bg-red-500/10 px-4 py-2.5 text-sm text-red-400 border border-red-500/20">
              {error}
            </p>
          )}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-accent/30 px-4 py-2.5 text-sm font-medium text-text transition-colors hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-glow-sm transition-all hover:bg-accent-light hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50"
            >
              {submitting ? "Gönderiliyor…" : "Başvuruyu Gönder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
