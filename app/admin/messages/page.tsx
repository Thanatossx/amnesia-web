"use client";

import { useState, useEffect } from "react";
import type { ContactMessage } from "@/types";
import { getContactMessages, deleteContactMessage } from "@/lib/admin-api";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getContactMessages();
        setMessages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Mesajlar yüklenemedi.");
        setMessages([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => e.key === "Escape" && setSelectedMessage(null);
    if (selectedMessage) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [selectedMessage]);

  const handleDelete = async (id: string) => {
    if (!confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;
    setDeletingId(id);
    setError(null);
    try {
      await deleteContactMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Silinemedi.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-bright">İletişim Mesajları</h1>
      <p className="mt-1 text-text-muted">
        İletişim sayfasından gelen mesajlar burada listelenir.
      </p>

      {error && (
        <p className="mt-4 text-sm text-red-400">{error}</p>
      )}

      <div className="mt-8 overflow-hidden rounded-xl border border-accent/20 bg-background-dark">
        {loading ? (
          <div className="p-8 text-center text-text-muted">Yükleniyor…</div>
        ) : messages.length === 0 ? (
          <div className="p-8 text-center text-text-muted">
            Henüz mesaj yok.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] text-left text-sm">
              <thead>
                <tr className="border-b border-accent/20 bg-background">
                  <th className="px-4 py-3 font-semibold text-text-bright">Tarih</th>
                  <th className="px-4 py-3 font-semibold text-text-bright">Ad Soyad</th>
                  <th className="px-4 py-3 font-semibold text-text-bright">Telefon</th>
                  <th className="px-4 py-3 font-semibold text-text-bright">Mesaj</th>
                  <th className="px-4 py-3 font-semibold text-text-bright text-right">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg) => (
                  <tr
                    key={msg.id}
                    onClick={() => setSelectedMessage(msg)}
                    className="cursor-pointer border-b border-accent/10 transition-colors hover:bg-accent/5"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-text-muted">
                      {formatDate(msg.created_at)}
                    </td>
                    <td className="px-4 py-3 font-medium text-text">{msg.full_name}</td>
                    <td className="px-4 py-3 text-text-muted">{msg.phone}</td>
                    <td className="max-w-md px-4 py-3 text-text-muted">
                      <span className="line-clamp-2">{msg.message}</span>
                    </td>
                    <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleDelete(msg.id)}
                        disabled={deletingId === msg.id}
                        className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                      >
                        {deletingId === msg.id ? "…" : "Sil"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mesaj detay modal */}
      {selectedMessage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="message-modal-title"
        >
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedMessage(null)}
          />
          <div className="relative flex max-h-[85vh] w-full max-w-lg flex-col rounded-xl border border-accent/20 bg-background-dark shadow-xl">
            <div className="flex shrink-0 items-center justify-between border-b border-accent/20 px-5 py-4">
              <h2 id="message-modal-title" className="text-lg font-semibold text-text-bright">
                İletişim mesajı
              </h2>
              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="rounded-lg p-2 text-text-muted transition-colors hover:bg-accent/20 hover:text-text"
                aria-label="Kapat"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Tarih</p>
                <p className="mt-0.5 text-text">{formatDate(selectedMessage.created_at)}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Ad Soyad</p>
                <p className="mt-0.5 text-text">{selectedMessage.full_name}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Telefon</p>
                <p className="mt-0.5 text-text">{selectedMessage.phone}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Mesaj</p>
                <p className="mt-0.5 whitespace-pre-wrap text-text">{selectedMessage.message}</p>
              </div>
            </div>
            <div className="flex shrink-0 justify-end gap-2 border-t border-accent/20 p-4">
              <button
                type="button"
                onClick={() => handleDelete(selectedMessage.id).then(() => setSelectedMessage(null))}
                disabled={deletingId === selectedMessage.id}
                className="rounded-lg px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 disabled:opacity-50"
              >
                {deletingId === selectedMessage.id ? "…" : "Mesajı sil"}
              </button>
              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="rounded-lg border border-accent/30 bg-background px-4 py-2 text-sm font-medium text-text hover:bg-accent/10"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
