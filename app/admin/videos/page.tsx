"use client";

import { useState, useEffect } from "react";
import type { YoutubeVideo } from "@/types";
import { getVideos, addVideo, updateVideo, deleteVideo } from "@/lib/admin-api";

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingVideo, setEditingVideo] = useState<YoutubeVideo | null>(null);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const loadVideos = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const data = await getVideos();
      setVideos(data);
    } catch (err) {
      setMessage({
        type: "err",
        text: err instanceof Error ? err.message : "Videolar yüklenemedi.",
      });
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const startEdit = (video: YoutubeVideo) => {
    setEditingVideo(video);
    setTitle(video.title);
    setVideoUrl(video.video_url);
  };

  const cancelEdit = () => {
    setEditingVideo(null);
    setTitle("");
    setVideoUrl("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!title.trim() || !videoUrl.trim()) {
      setMessage({ type: "err", text: "Başlık ve video linki gerekli." });
      return;
    }
    setSubmitting(true);
    try {
      if (editingVideo) {
        await updateVideo(editingVideo.id, { title: title.trim(), video_url: videoUrl.trim() });
        setMessage({ type: "ok", text: "Video güncellendi." });
        cancelEdit();
      } else {
        await addVideo({ title: title.trim(), video_url: videoUrl.trim(), is_active: true });
        setMessage({ type: "ok", text: "Video eklendi. Ana sayfada görünecektir." });
        setTitle("");
        setVideoUrl("");
      }
      loadVideos();
    } catch (err) {
      setMessage({
        type: "err",
        text: err instanceof Error ? err.message : "Kaydedilirken hata oluştu.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteVideo(id);
      setVideos((prev) => prev.filter((v) => v.id !== id));
      setMessage({ type: "ok", text: "Video silindi." });
    } catch (err) {
      setMessage({
        type: "err",
        text: err instanceof Error ? err.message : "Silinirken hata oluştu.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-bright">YouTube Videoları</h1>
      <p className="mt-1 text-text-muted">
        Ana sayfada görünecek videoları ekleyin veya silin.
      </p>

      <div className="mt-8 rounded-xl border border-accent/20 bg-background-dark p-6">
        <h2 className="mb-4 text-lg font-semibold text-text-bright">
          {editingVideo ? "Videoyu Düzenle" : "Yeni Video Ekle"}
        </h2>
        <form onSubmit={handleSave} className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="videoTitle" className="mb-1 block text-sm font-medium text-text-muted">
              Başlık
            </label>
            <input
              id="videoTitle"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn: AMNESIA Aftermovie 2024"
              className="w-full rounded-lg border border-accent/30 bg-background px-4 py-2.5 text-text outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="videoUrl" className="mb-1 block text-sm font-medium text-text-muted">
              YouTube Linki
            </label>
            <input
              id="videoUrl"
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full rounded-lg border border-accent/30 bg-background px-4 py-2.5 text-text outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </div>
          {editingVideo && (
            <button type="button" onClick={cancelEdit} className="rounded-lg border border-accent/30 px-4 py-2.5 font-medium text-text hover:bg-accent/10">
              İptal
            </button>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-accent px-4 py-2.5 font-medium text-white transition-colors hover:bg-accent-light disabled:opacity-50"
          >
            {submitting ? "Kaydediliyor…" : editingVideo ? "Güncelle" : "Ekle"}
          </button>
        </form>
      </div>

      {message && (
        <p
          className={`mt-4 text-sm ${message.type === "ok" ? "text-green-400" : "text-red-400"}`}
        >
          {message.text}
        </p>
      )}

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-text-bright">Mevcut Videolar</h2>
        {loading ? (
          <p className="text-text-muted">Yükleniyor…</p>
        ) : videos.length === 0 ? (
          <p className="rounded-xl border border-accent/10 bg-background-dark p-6 text-text-muted">
            Henüz video yok. Yukarıdan ekleyebilirsiniz.
          </p>
        ) : (
          <ul className="space-y-3">
            {videos.map((video) => (
              <li
                key={video.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-accent/10 bg-background-dark p-4 transition-colors hover:border-accent/20"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-text-bright">{video.title}</p>
                  <p className="truncate text-sm text-text-muted">{video.video_url}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(video)}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-accent-secondary hover:bg-accent/20"
                  >
                    Düzenle
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(video.id)}
                  disabled={deletingId === video.id}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
                >
                    {deletingId === video.id ? "Siliniyor…" : "Sil"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
