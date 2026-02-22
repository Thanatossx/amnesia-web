"use client";

import { useState, useEffect } from "react";
import type { Event, FormQuestion } from "@/types";
import { getEvents, createEvent, updateEvent, deleteEvent } from "@/lib/admin-api";

const QUESTION_TYPES: { value: FormQuestion["type"]; label: string }[] = [
  { value: "text", label: "Metin" },
  { value: "textarea", label: "Uzun Metin" },
  { value: "tel", label: "Telefon" },
  { value: "select", label: "Seçenek Listesi" },
  { value: "checkbox", label: "Onay Kutusu" },
];

function generateId(): string {
  return `q-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function toDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [posterUrl, setPosterUrl] = useState("");
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [questions, setQuestions] = useState<FormQuestion[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadEvents = async () => {
    setEventsLoading(true);
    try {
      const data = await getEvents();
      setEvents(data);
    } finally {
      setEventsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { id: generateId(), label: "", type: "text", required: false },
    ]);
  };

  const updateQuestion = (id: string, updates: Partial<FormQuestion>) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
  };

  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const openEdit = (event: Event) => {
    setEditingEvent(event);
    setTitle(event.title);
    setDescription(event.description ?? "");
    setEventDate(toDatetimeLocal(event.event_date));
    setIsActive(event.is_active);
    setPosterUrl(event.poster_url ?? "");
    setPosterPreview(event.poster_url ?? null);
    setQuestions(Array.isArray(event.form_questions) ? event.form_questions : []);
  };

  const closeEdit = () => {
    setEditingEvent(null);
    setTitle("");
    setDescription("");
    setEventDate("");
    setIsActive(true);
    setPosterUrl("");
    setPosterPreview(null);
    setQuestions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);
    try {
      const poster_url = posterUrl.trim() || editingEvent?.poster_url || null;
      const eventDateIso = new Date(eventDate).toISOString();
      const form_questions = questions
        .filter((q) => q.label.trim())
        .map((q) => ({
          id: q.id,
          label: q.label.trim(),
          type: q.type,
          required: q.required ?? false,
          ...((q.type === "select" || q.type === "checkbox") && {
            options: (Array.isArray(q.options) ? q.options : []).map((o) => String(o).trim()).filter(Boolean),
          }),
        }));

      if (editingEvent) {
        await updateEvent(editingEvent.id, {
          title,
          description: description || null,
          poster_url: poster_url ?? undefined,
          is_active: isActive,
          event_date: eventDateIso,
          form_questions,
        });
        setMessage({ type: "ok", text: "Etkinlik güncellendi." });
        closeEdit();
      } else {
        await createEvent({
          title,
          description: description || null,
          poster_url,
          is_active: true,
          event_date: eventDateIso,
          form_questions,
        });
        setMessage({ type: "ok", text: "Etkinlik oluşturuldu. Ana sayfada görünecektir." });
        setTitle("");
        setDescription("");
        setEventDate("");
        setPosterUrl("");
        setPosterPreview(null);
        setQuestions([]);
      }
      loadEvents();
    } catch (err) {
      setMessage({
        type: "err",
        text: err instanceof Error ? err.message : "Bir hata oluştu.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu etkinliği silmek istediğinize emin misiniz? Bağlı başvurular da silinir.")) return;
    setDeletingId(id);
    setMessage(null);
    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      setMessage({ type: "ok", text: "Etkinlik silindi." });
    } catch (err) {
      setMessage({ type: "err", text: err instanceof Error ? err.message : "Silinemedi." });
    } finally {
      setDeletingId(null);
    }
  };

  const showForm = editingEvent || !editingEvent; // form always visible for create; when editing, modal
  const isEdit = !!editingEvent;

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-bright">Etkinlikler</h1>
      <p className="mt-1 text-text-muted">
        Yeni etkinlik ekleyin veya mevcut etkinlikleri düzenleyip silin.
      </p>

      {/* Mevcut etkinlikler listesi */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-text-bright">Mevcut Etkinlikler</h2>
        {eventsLoading ? (
          <p className="text-text-muted">Yükleniyor…</p>
        ) : events.length === 0 ? (
          <p className="rounded-xl border border-accent/10 bg-background-dark p-6 text-text-muted">
            Henüz etkinlik yok.
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-accent/20 bg-background-dark">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-accent/20 bg-background">
                  <th className="px-4 py-3 font-semibold text-text-bright">Etkinlik</th>
                  <th className="px-4 py-3 font-semibold text-text-bright">Tarih</th>
                  <th className="px-4 py-3 font-semibold text-text-bright">Durum</th>
                  <th className="px-4 py-3 font-semibold text-text-bright text-right">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev.id} className="border-b border-accent/10 hover:bg-accent/5">
                    <td className="px-4 py-3 font-medium text-text">{ev.title}</td>
                    <td className="px-4 py-3 text-text-muted">
                      {new Date(ev.event_date).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          ev.is_active ? "bg-green-500/20 text-green-400" : "bg-text-muted/20 text-text-muted"
                        }`}
                      >
                        {ev.is_active ? "Aktif" : "Geçmiş"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => openEdit(ev)}
                        className="mr-2 rounded-lg px-3 py-1.5 text-sm font-medium text-accent-secondary hover:bg-accent/20"
                      >
                        Düzenle
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(ev.id)}
                        disabled={deletingId === ev.id}
                        className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                      >
                        {deletingId === ev.id ? "…" : "Sil"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Yeni etkinlik formu veya düzenleme modalı */}
      <div className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-text-bright">
          {isEdit ? "Etkinliği Düzenle" : "Yeni Etkinlik Oluştur"}
        </h2>
        {isEdit && (
          <p className="mb-4 text-sm text-text-muted">
            &quot;{editingEvent?.title}&quot; üzerinde değişiklik yapıyorsunuz. İptal için formu kapatın.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="rounded-xl border border-accent/20 bg-background-dark p-6">
            <h3 className="mb-4 text-lg font-semibold text-text-bright">Temel Bilgiler</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="mb-1 block text-sm font-medium text-text-muted">Etkinlik Adı *</label>
                <input
                  id="title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-accent/30 bg-background px-4 py-2.5 text-text outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                  placeholder="Örn: AMNESIA NIGHT VOL.2"
                />
              </div>
              <div>
                <label htmlFor="eventDate" className="mb-1 block text-sm font-medium text-text-muted">Etkinlik Tarihi *</label>
                <input
                  id="eventDate"
                  type="datetime-local"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full rounded-lg border border-accent/30 bg-background px-4 py-2.5 text-text outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-text-muted">Durum (gösterim)</label>
                <select
                  value={isActive ? "active" : "past"}
                  onChange={(e) => setIsActive(e.target.value === "active")}
                  className="w-full rounded-lg border border-accent/30 bg-background px-4 py-2.5 text-text outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                >
                  <option value="active">Güncel (yaklaşan etkinliklerde göster)</option>
                  <option value="past">Geçmiş (geçmiş partilerde göster)</option>
                </select>
                <p className="mt-1 text-xs text-text-muted">
                  Tarih geçince etkinlik otomatik geçmişe düşer. İsterseniz manuel de geçmiş/güncel yapabilirsiniz.
                </p>
              </div>
              <div>
                <label htmlFor="description" className="mb-1 block text-sm font-medium text-text-muted">Açıklama</label>
                <textarea
                  id="description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-accent/30 bg-background px-4 py-2.5 text-text outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                  placeholder="Kısa etkinlik açıklaması"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-accent/20 bg-background-dark p-6">
            <h3 className="mb-4 text-lg font-semibold text-text-bright">Afiş</h3>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              {posterPreview ? (
                <div className="h-40 w-40 shrink-0 overflow-hidden rounded-lg border border-accent/20 bg-background">
                  <img src={posterPreview} alt="Afiş önizleme" className="h-full w-full object-cover" />
                </div>
              ) : null}
              <div className="flex-1 space-y-2">
                <p className="text-sm text-text-muted">Afiş görselinin URL&apos;sini yapıştırın (örn. Imgur, Supabase Storage). Önerilen: 800×1200 px.</p>
                <input
                  type="url"
                  value={posterUrl}
                  onChange={(e) => {
                    setPosterUrl(e.target.value);
                    setPosterPreview(e.target.value.trim() || null);
                  }}
                  placeholder="https://... afiş görseli URL adresi"
                  className="w-full rounded-lg border border-accent/30 bg-background px-3 py-2 text-sm text-text placeholder:text-text-muted outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-accent/20 bg-background-dark p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text-bright">Form soruları</h3>
              <button type="button" onClick={addQuestion} className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-light">
                Soru Ekle
              </button>
            </div>
            {questions.length === 0 ? (
              <p className="text-sm text-text-muted">Henüz soru yok.</p>
            ) : (
              <ul className="space-y-4">
                {questions.map((q) => (
                  <li key={q.id} className="flex flex-col gap-3 rounded-lg border border-accent/10 bg-background p-4">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={q.label}
                        onChange={(e) => updateQuestion(q.id, { label: e.target.value })}
                        placeholder="Soru metni"
                        className="flex-1 rounded-lg border border-accent/30 bg-background-dark px-3 py-2 text-sm text-text outline-none focus:border-accent"
                      />
                      <select
                        value={q.type}
                        onChange={(e) => {
                          const newType = e.target.value as FormQuestion["type"];
                          const updates: Partial<FormQuestion> = { type: newType };
                          if ((newType === "select" || newType === "checkbox") && !Array.isArray(q.options)) updates.options = [];
                          updateQuestion(q.id, updates);
                        }}
                        className="rounded-lg border border-accent/30 bg-background-dark px-3 py-2 text-sm text-text outline-none focus:border-accent"
                      >
                        {QUESTION_TYPES.map(({ value, label }) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                      <label className="flex items-center gap-2 text-sm text-text-muted">
                        <input type="checkbox" checked={q.required ?? false} onChange={(e) => updateQuestion(q.id, { required: e.target.checked })} className="rounded border-accent/30 text-accent" />
                        Zorunlu
                      </label>
                      <button type="button" onClick={() => removeQuestion(q.id)} className="rounded-lg p-2 text-red-400 hover:bg-red-500/10" aria-label="Soru sil">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                    {(q.type === "select" || q.type === "checkbox") && (
                      <div className="space-y-2">
                        <p className="text-xs text-text-muted">
                          {q.type === "select" ? "Açılır listede görünecek seçenekler." : "Her biri ayrı onay kutusu olarak görünür."} Tek tek ekleyin.
                        </p>
                        {(Array.isArray(q.options) ? q.options : []).map((opt, optIndex) => (
                          <div key={`${q.id}-opt-${optIndex}`} className="flex gap-2">
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => {
                                const next = [...(q.options ?? [])];
                                next[optIndex] = e.target.value;
                                updateQuestion(q.id, { options: next });
                              }}
                              placeholder={q.type === "select" ? `Seçenek ${optIndex + 1}` : `Kutu ${optIndex + 1}`}
                              className="flex-1 rounded-lg border border-accent/30 bg-background-dark px-3 py-2 text-sm text-text outline-none focus:border-accent"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const next = (q.options ?? []).filter((_, i) => i !== optIndex);
                                updateQuestion(q.id, { options: next });
                              }}
                              className="rounded-lg p-2 text-red-400 hover:bg-red-500/10"
                              aria-label="Seçeneği sil"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => updateQuestion(q.id, { options: [...(q.options ?? []), ""] })}
                          className="rounded-lg border border-dashed border-accent/40 bg-accent/5 px-4 py-2 text-sm font-medium text-accent-secondary hover:bg-accent/10"
                        >
                          + Seçenek ekle
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {message && (
            <p className={message.type === "ok" ? "text-sm text-green-400" : "text-sm text-red-400"}>{message.text}</p>
          )}

          <div className="flex gap-3">
            {isEdit && (
              <button type="button" onClick={closeEdit} className="rounded-xl border border-accent/30 px-6 py-3 font-medium text-text hover:bg-accent/10">
                İptal
              </button>
            )}
            <button type="submit" disabled={submitting} className="rounded-xl bg-accent px-6 py-3 font-semibold text-white hover:bg-accent-light disabled:opacity-50">
              {submitting ? "Kaydediliyor…" : isEdit ? "Güncelle" : "Etkinliği Oluştur"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
