"use client";

import { useEffect, useRef, useState } from "react";
import { submitApplicant } from "@/lib/public-api";
import type { Event, FormQuestion, ApplicantAnswers } from "@/types";

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

const inputClasses =
  "w-full rounded-xl border border-accent/30 bg-background px-4 py-2.5 text-text placeholder:text-text-muted/50 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30";

export default function ApplyModal({ isOpen, onClose, event }: ApplyModalProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [answers, setAnswers] = useState<ApplicantAnswers>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const formQuestions: FormQuestion[] = (event?.form_questions ?? [])
    .filter((q) => q && typeof q.label === "string" && q.label.trim())
    .map((q) => ({
      ...q,
      id: q.id || `q-${Math.random()}`,
      label: q.label.trim(),
      type: q.type || "text",
      required: !!q.required,
      ...(q.type === "select" && { options: Array.isArray(q.options) ? q.options : [] }),
    }));

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
      setError(null);
      setSuccess(false);
      setFullName("");
      setPhone("");
      setAnswers({});
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
        successTimeoutRef.current = null;
      }
    };
  }, [isOpen, onClose]);

  function setAnswer(id: string, value: string | string[] | boolean) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!event) return;
    setError(null);
    setSubmitting(true);
    try {
      await submitApplicant({
        event_id: event.id,
        full_name: fullName.trim(),
        email: null,
        phone: phone.trim() || null,
        answers,
        status: "bekliyor",
      });
      setFullName("");
      setPhone("");
      setAnswers({});
      setSuccess(true);
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
      successTimeoutRef.current = setTimeout(() => {
        successTimeoutRef.current = null;
        setSuccess(false);
        onClose();
      }, 2000);
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
      <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl border border-accent/30 bg-background-dark shadow-2xl shadow-accent/20 animate-fade-in-up">
        <div className="flex shrink-0 items-center justify-between border-b border-accent/20 px-6 py-5">
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
        {success ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <p className="text-lg font-medium text-green-400">
              Başvuruyu başarıyla gönderdiniz.
            </p>
            <p className="text-sm text-text-muted">
              Pencere birkaç saniye içinde kapanacak.
            </p>
          </div>
        ) : (
        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
          <div className="scroll-area min-h-0 flex-1 space-y-5 overflow-y-auto p-6">
          <div>
            <label htmlFor="apply-full_name" className="mb-1.5 block text-sm font-medium text-text-muted">
              Ad Soyad <span className="text-red-400">*</span>
            </label>
            <input
              id="apply-full_name"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={inputClasses}
              placeholder="Adınız Soyadınız"
            />
          </div>
          <div>
            <label htmlFor="apply-phone" className="mb-1.5 block text-sm font-medium text-text-muted">
              Telefon <span className="text-red-400">*</span>
            </label>
            <input
              id="apply-phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClasses}
              placeholder="XXXXXXX"
            />
          </div>

          {formQuestions.length === 0 ? (
            <p className="rounded-xl border border-accent/20 bg-background/50 px-4 py-3 text-sm text-text-muted">
              Bu etkinlik için henüz soru eklenmemiş. Lütfen admin panelinden etkinliğe form soruları ekleyin.
            </p>
          ) : null}

          {formQuestions.map((q) => (
            <div key={q.id}>
              <label htmlFor={q.id} className="mb-1.5 block text-sm font-medium text-text-muted">
                <span className="whitespace-pre-wrap">{q.label}</span>
                {(q.required ?? false) && <span className="text-red-400"> *</span>}
              </label>
              {q.type === "text" && (
                <input
                  id={q.id}
                  type="text"
                  required={q.required ?? false}
                  value={(answers[q.id] as string) ?? ""}
                  onChange={(e) => setAnswer(q.id, e.target.value)}
                  className={inputClasses}
                  placeholder={q.label}
                />
              )}
              {q.type === "textarea" && (
                <textarea
                  id={q.id}
                  required={q.required ?? false}
                  value={(answers[q.id] as string) ?? ""}
                  onChange={(e) => setAnswer(q.id, e.target.value)}
                  rows={3}
                  className={inputClasses}
                  placeholder={q.label}
                />
              )}
              {q.type === "tel" && (
                <input
                  id={q.id}
                  type="tel"
                  value={(answers[q.id] as string) ?? ""}
                  onChange={(e) => setAnswer(q.id, e.target.value)}
                  className={inputClasses}
                  placeholder="XXXXXXX"
                />
              )}
              {q.type === "select" && (
                <select
                  id={q.id}
                  required={q.required ?? false}
                  value={(answers[q.id] as string) ?? ""}
                  onChange={(e) => setAnswer(q.id, e.target.value)}
                  className={inputClasses}
                >
                  <option value="">Seçiniz</option>
                  {(Array.isArray(q.options) ? q.options : []).map((opt, i) => (
                    <option key={`${q.id}-${i}-${opt}`} value={String(opt)}>
                      {String(opt)}
                    </option>
                  ))}
                </select>
              )}
              {q.type === "checkbox" && (() => {
                const opts = Array.isArray(q.options) ? q.options : [];
                if (opts.length === 0) {
                  return (
                    <label className="flex items-center gap-2">
                      <input
                        id={q.id}
                        type="checkbox"
                        checked={(answers[q.id] as boolean) ?? false}
                        onChange={(e) => setAnswer(q.id, e.target.checked)}
                        className="rounded border-accent/30 text-accent"
                      />
                      <span className="text-sm text-text-muted">Evet</span>
                    </label>
                  );
                }
                const selected = (answers[q.id] as string[] | undefined) ?? [];
                const toggle = (val: string) => {
                  const next = selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val];
                  setAnswer(q.id, next);
                };
                return (
                  <div className="space-y-2">
                    {opts.map((opt, i) => (
                      <label key={`${q.id}-${i}-${opt}`} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selected.includes(String(opt))}
                          onChange={() => toggle(String(opt))}
                          className="rounded border-accent/30 text-accent"
                        />
                        <span className="text-sm text-text-muted">{String(opt) || `Seçenek ${i + 1}`}</span>
                      </label>
                    ))}
                  </div>
                );
              })()}
            </div>
          ))}

          {error && (
            <p className="rounded-xl bg-red-500/10 px-4 py-2.5 text-sm text-red-400 border border-red-500/20">
              {error}
            </p>
          )}
          </div>
          <div className="flex shrink-0 gap-3 border-t border-accent/20 p-6">
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
        )}
      </div>
    </div>
  );
}
