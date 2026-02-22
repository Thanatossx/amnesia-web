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
                    className="border-b border-accent/10 transition-colors hover:bg-accent/5"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-text-muted">
                      {formatDate(msg.created_at)}
                    </td>
                    <td className="px-4 py-3 font-medium text-text">{msg.full_name}</td>
                    <td className="px-4 py-3 text-text-muted">{msg.phone}</td>
                    <td className="max-w-md px-4 py-3 text-text-muted">
                      <span className="line-clamp-2">{msg.message}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
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
    </div>
  );
}
