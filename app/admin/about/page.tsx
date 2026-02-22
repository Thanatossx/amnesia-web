"use client";

import { useState, useEffect } from "react";
import type { AboutSection } from "@/types";

const HERO_SORT = 0;

async function fetchSections(): Promise<AboutSection[]> {
  const res = await fetch("/api/admin/about");
  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    throw new Error(j?.error || "Liste alınamadı");
  }
  return res.json();
}

async function createSection(body: { title: string; content: string; sort_order: number }): Promise<AboutSection> {
  const res = await fetch("/api/admin/about", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(j?.error || "Eklenemedi");
  return j;
}

async function updateSection(id: string, body: { title?: string; content?: string }): Promise<AboutSection> {
  const res = await fetch(`/api/admin/about/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(j?.error || "Güncellenemedi");
  return j;
}

async function deleteSection(id: string): Promise<void> {
  const res = await fetch(`/api/admin/about/${id}`, { method: "DELETE" });
  const j = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(j?.error || "Silinemedi");
}

export default function AdminAboutPage() {
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [heroTitle, setHeroTitle] = useState("");
  const [heroContent, setHeroContent] = useState("");
  const [heroSaving, setHeroSaving] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [addSectionLoading, setAddSectionLoading] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSections();
      setSections(data);
      const hero = data.find((s) => s.sort_order === HERO_SORT);
      if (hero) {
        setHeroTitle(hero.title);
        setHeroContent(hero.content);
      } else {
        setHeroTitle("");
        setHeroContent("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yüklenemedi.");
      setSections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const heroSection = sections.find((s) => s.sort_order === HERO_SORT);
  const contentSections = sections.filter((s) => s.sort_order !== HERO_SORT);

  const saveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setHeroSaving(true);
    try {
      if (heroSection) {
        await updateSection(heroSection.id, {
          title: heroTitle.trim() || "Hakkımızda",
          content: heroContent.trim() || "",
        });
        setSuccessMessage("Sayfa başlığı güncellendi.");
      } else {
        await createSection({
          title: heroTitle.trim() || "Hakkımızda",
          content: heroContent.trim() || "",
          sort_order: HERO_SORT,
        });
        setSuccessMessage("Sayfa başlığı kaydedildi.");
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kaydedilemedi.");
    } finally {
      setHeroSaving(false);
    }
  };

  const addSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setError(null);
    setSuccessMessage(null);
    setAddSectionLoading(true);
    try {
      const nextOrder =
        contentSections.length === 0
          ? 1
          : Math.max(...contentSections.map((s) => s.sort_order), 0) + 1;
      await createSection({
        title: newTitle.trim(),
        content: newContent.trim(),
        sort_order: nextOrder,
      });
      setNewTitle("");
      setNewContent("");
      setSuccessMessage("Bölüm eklendi.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Eklenemedi.");
    } finally {
      setAddSectionLoading(false);
    }
  };

  const startEdit = (s: AboutSection) => {
    setEditingId(s.id);
    setEditTitle(s.title);
    setEditContent(s.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setError(null);
    setSuccessMessage(null);
    setEditSaving(true);
    try {
      await updateSection(editingId, {
        title: editTitle.trim(),
        content: editContent.trim(),
      });
      setEditingId(null);
      setEditTitle("");
      setEditContent("");
      setSuccessMessage("Bölüm güncellendi.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Güncellenemedi.");
    } finally {
      setEditSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu bölümü silmek istediğinize emin misiniz?")) return;
    setDeletingId(id);
    setError(null);
    setSuccessMessage(null);
    try {
      await deleteSection(id);
      setSuccessMessage("Bölüm silindi.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Silinemedi.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-bright">Hakkımızda İçeriği</h1>
      <p className="mt-1 text-text-muted">
        Sayfa başlığı, alt metin ve aşağıdaki bölümleri buradan düzenleyin.
      </p>

      {error && (
        <p className="mt-4 text-sm text-red-400">{error}</p>
      )}
      {successMessage && (
        <p className="mt-4 text-sm text-green-400">{successMessage}</p>
      )}

      {loading ? (
        <div className="mt-8 text-text-muted">Yükleniyor…</div>
      ) : (
        <div className="mt-8 space-y-10">
          {/* Hero (sayfa başlığı / alt metin) */}
          <section className="rounded-xl border border-accent/20 bg-background-dark p-6">
            <h2 className="text-lg font-semibold text-text-bright">Sayfa başlığı ve alt metin</h2>
            <form onSubmit={saveHero} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-muted">Başlık</label>
                <input
                  type="text"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  placeholder="Örn: Rave kültürü ve AMNESIA"
                  className="mt-1 w-full rounded-lg border border-accent/20 bg-background px-3 py-2 text-text placeholder:text-text-muted/60"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted">Alt metin</label>
                <textarea
                  value={heroContent}
                  onChange={(e) => setHeroContent(e.target.value)}
                  placeholder="Örn: Elektronik müziğin kalp atışı..."
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-accent/20 bg-background px-3 py-2 text-text placeholder:text-text-muted/60"
                />
              </div>
              <button
                type="submit"
                disabled={heroSaving}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-50"
              >
                {heroSaving ? "Kaydediliyor…" : heroSection ? "Güncelle" : "Kaydet"}
              </button>
            </form>
          </section>

          {/* Yeni bölüm ekle */}
          <section className="rounded-xl border border-accent/20 bg-background-dark p-6">
            <h2 className="text-lg font-semibold text-text-bright">Yeni bölüm ekle</h2>
            <form onSubmit={addSection} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-muted">Bölüm başlığı</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Örn: Rave Party Nedir?"
                  className="mt-1 w-full rounded-lg border border-accent/20 bg-background px-3 py-2 text-text placeholder:text-text-muted/60"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted">Metin</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Bölüm metnini yazın..."
                  rows={4}
                  className="mt-1 w-full rounded-lg border border-accent/20 bg-background px-3 py-2 text-text placeholder:text-text-muted/60"
                />
              </div>
              <button
                type="submit"
                disabled={addSectionLoading || !newTitle.trim()}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-50"
              >
                {addSectionLoading ? "Ekleniyor…" : "Bölüm ekle"}
              </button>
            </form>
          </section>

          {/* Mevcut bölümler (hero hariç) */}
          <section className="rounded-xl border border-accent/20 bg-background-dark p-6">
            <h2 className="text-lg font-semibold text-text-bright">Mevcut bölümler</h2>
            {contentSections.length === 0 ? (
              <p className="mt-4 text-text-muted">Henüz bölüm yok. Yukarıdan ekleyebilirsiniz.</p>
            ) : (
              <ul className="mt-4 space-y-4">
                {contentSections.map((s) => (
                  <li
                    key={s.id}
                    className="rounded-lg border border-accent/10 bg-background/50 p-4"
                  >
                    {editingId === s.id ? (
                      <form onSubmit={saveEdit} className="space-y-3">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full rounded border border-accent/20 bg-background px-3 py-2 text-text"
                          placeholder="Başlık"
                        />
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={3}
                          className="w-full rounded border border-accent/20 bg-background px-3 py-2 text-text"
                          placeholder="Metin"
                        />
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            disabled={editSaving}
                            className="rounded-lg bg-accent px-3 py-1.5 text-sm text-white disabled:opacity-50"
                          >
                            {editSaving ? "…" : "Kaydet"}
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="rounded-lg border border-accent/20 px-3 py-1.5 text-sm text-text-muted hover:bg-accent/10"
                          >
                            İptal
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <h3 className="font-medium text-text-bright">{s.title}</h3>
                        <p className="mt-1 line-clamp-2 text-sm text-text-muted">{s.content || "—"}</p>
                        <div className="mt-3 flex gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(s)}
                            className="rounded-lg border border-accent/20 px-3 py-1.5 text-sm text-text-muted hover:bg-accent/10"
                          >
                            Düzenle
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(s.id)}
                            disabled={deletingId === s.id}
                            className="rounded-lg px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                          >
                            {deletingId === s.id ? "…" : "Sil"}
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
