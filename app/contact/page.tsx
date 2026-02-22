"use client";

import { useState } from "react";
import { submitContactMessage } from "@/lib/public-api";

export default function ContactPage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);
    if (!fullName.trim() || !phone.trim() || !message.trim()) {
      setFeedback({ type: "err", text: "Ad soyad, telefon ve mesaj alanları zorunludur." });
      return;
    }
    setSubmitting(true);
    try {
      await submitContactMessage({ full_name: fullName, phone, message });
      setFeedback({ type: "ok", text: "Mesajınız alındı. En kısa sürede size dönüş yapacağız." });
      setFullName("");
      setPhone("");
      setMessage("");
    } catch (err) {
      setFeedback({
        type: "err",
        text: err instanceof Error ? err.message : "Gönderilirken bir hata oluştu.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="mb-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-secondary sm:text-sm">
          İletişim
        </p>
        <div className="mt-2 h-0.5 w-12 rounded-full bg-accent/50" />
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-text-bright sm:text-5xl">
          Bize ulaşın
        </h1>
        <p className="mt-4 text-lg text-text-muted">
          Sorularınız veya önerileriniz için formu doldurun.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-accent/20 bg-background-dark/80 p-6 shadow-glow-sm sm:p-8"
      >
        <div className="space-y-6">
          <div>
            <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-text-muted">
              Ad Soyad *
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-accent/30 bg-background px-4 py-3 text-text outline-none transition placeholder:text-text-muted/50 focus:border-accent focus:ring-2 focus:ring-accent/30"
              placeholder="Adınız Soyadınız"
            />
          </div>
          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-medium text-text-muted">
              Telefon *
            </label>
            <input
              id="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-accent/30 bg-background px-4 py-3 text-text outline-none transition placeholder:text-text-muted/50 focus:border-accent focus:ring-2 focus:ring-accent/30"
              placeholder="XXXXXXX"
            />
          </div>
          <div>
            <label htmlFor="message" className="mb-2 block text-sm font-medium text-text-muted">
              Mesaj / Açıklama *
            </label>
            <textarea
              id="message"
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full resize-none rounded-xl border border-accent/30 bg-background px-4 py-3 text-text outline-none transition placeholder:text-text-muted/50 focus:border-accent focus:ring-2 focus:ring-accent/30"
              placeholder="Mesajınızı buraya yazın..."
            />
          </div>
        </div>

        {feedback && (
          <div
            className={`mt-6 rounded-xl px-4 py-3 text-sm ${
              feedback.type === "ok"
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}
          >
            {feedback.text}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-xl bg-accent py-3.5 font-semibold text-white shadow-glow-sm transition-all hover:bg-accent-light hover:shadow-glow disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background sm:w-auto sm:px-10"
        >
          {submitting ? "Gönderiliyor…" : "Gönder"}
        </button>
      </form>
    </div>
  );
}
