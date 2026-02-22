"use client";

import { useState, useEffect } from "react";
import type { Event, Applicant, ApplicantStatus } from "@/types";
import {
  getEvents,
  getApplicantsByEventId,
  updateApplicantStatus,
  deleteApplicant,
} from "@/lib/admin-api";

const STATUS_OPTIONS: { value: ApplicantStatus; label: string }[] = [
  { value: "bekliyor", label: "Bekliyor" },
  { value: "onaylandı", label: "Onaylandı" },
  { value: "reddedildi", label: "Reddedildi" },
  { value: "bilet_verildi", label: "Bilet Verildi" },
];

type EventFilter = "active" | "past";

export default function AdminApplicantsPage() {
  const [eventFilter, setEventFilter] = useState<EventFilter>("active");
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [applicantsLoading, setApplicantsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const loadEvents = async () => {
    setEventsLoading(true);
    setMessage(null);
    try {
      const activeOnly = eventFilter === "active";
      const data = await getEvents(activeOnly);
      setEvents(data);
      setSelectedEventId(data[0]?.id ?? "");
    } catch {
      setMessage({ type: "err", text: "Etkinlikler yüklenemedi." });
      setEvents([]);
      setSelectedEventId("");
    } finally {
      setEventsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [eventFilter]);

  const loadApplicants = async () => {
    if (!selectedEventId) {
      setApplicants([]);
      return;
    }
    setApplicantsLoading(true);
    try {
      const data = await getApplicantsByEventId(selectedEventId);
      setApplicants(data);
    } catch {
      setMessage({ type: "err", text: "Başvurular yüklenemedi." });
      setApplicants([]);
    } finally {
      setApplicantsLoading(false);
    }
  };

  useEffect(() => {
    loadApplicants();
  }, [selectedEventId]);

  const handleStatusChange = async (applicantId: string, newStatus: ApplicantStatus) => {
    setUpdatingId(applicantId);
    setMessage(null);
    try {
      await updateApplicantStatus(applicantId, newStatus);
      setApplicants((prev) =>
        prev.map((a) => (a.id === applicantId ? { ...a, status: newStatus } : a))
      );
      setMessage({ type: "ok", text: "Durum güncellendi." });
    } catch {
      setMessage({ type: "err", text: "Durum güncellenemedi." });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (applicantId: string) => {
    if (!confirm("Bu başvuruyu silmek istediğinize emin misiniz?")) return;
    setDeletingId(applicantId);
    setMessage(null);
    try {
      await deleteApplicant(applicantId);
      setApplicants((prev) => prev.filter((a) => a.id !== applicantId));
      setMessage({ type: "ok", text: "Başvuru silindi." });
    } catch {
      setMessage({ type: "err", text: "Silinemedi." });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-bright">Başvurular</h1>
      <p className="mt-1 text-text-muted">
        Etkinlik seçerek başvuruları listeleyin ve durumlarını güncelleyin.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <div>
          <label htmlFor="eventFilter" className="mb-1 block text-sm font-medium text-text-muted">
            Etkinlik türü
          </label>
          <select
            id="eventFilter"
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value as EventFilter)}
            className="rounded-lg border border-accent/30 bg-background-dark px-4 py-2.5 text-text outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          >
            <option value="active">Aktif Etkinlikler</option>
            <option value="past">Geçmiş Etkinlikler</option>
          </select>
        </div>
        <div className="min-w-[200px]">
          <label htmlFor="eventSelect" className="mb-1 block text-sm font-medium text-text-muted">
            Etkinlik
          </label>
          <select
            id="eventSelect"
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            disabled={eventsLoading}
            className="w-full rounded-lg border border-accent/30 bg-background-dark px-4 py-2.5 text-text outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 disabled:opacity-50"
          >
            <option value="">
              {eventsLoading ? "Yükleniyor…" : events.length === 0 ? "Etkinlik yok" : "Etkinlik seçin"}
            </option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {message && (
        <p
          className={`mt-4 text-sm ${message.type === "ok" ? "text-green-400" : "text-red-400"}`}
        >
          {message.text}
        </p>
      )}

      <div className="mt-8 overflow-hidden rounded-xl border border-accent/20 bg-background-dark">
        {applicantsLoading ? (
          <div className="p-8 text-center text-text-muted">Başvurular yükleniyor…</div>
        ) : !selectedEventId ? (
          <div className="p-8 text-center text-text-muted">
            Listelemek için bir etkinlik seçin.
          </div>
        ) : applicants.length === 0 ? (
          <div className="p-8 text-center text-text-muted">
            Bu etkinlik için henüz başvuru yok.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-accent/20 bg-background">
                  <th className="px-4 py-3 font-semibold text-text-bright">Ad Soyad</th>
                  <th className="px-4 py-3 font-semibold text-text-bright">Telefon</th>
                  <th className="px-4 py-3 font-semibold text-text-bright">Cevaplar</th>
                  <th className="px-4 py-3 font-semibold text-text-bright">Durum</th>
                  <th className="px-4 py-3 font-semibold text-text-bright text-right">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((applicant) => (
                  <tr
                    key={applicant.id}
                    className="border-b border-accent/10 transition-colors hover:bg-accent/5"
                  >
                    <td className="px-4 py-3 font-medium text-text">{applicant.full_name}</td>
                    <td className="px-4 py-3 text-text-muted">{applicant.phone ?? "—"}</td>
                    <td className="max-w-xs px-4 py-3">
                      <div className="space-y-1">
                        {Object.entries(applicant.answers).length === 0 ? (
                          <span className="text-text-muted">—</span>
                        ) : (
                          Object.entries(applicant.answers).map(([key, value]) => (
                            <div key={key} className="text-text-muted">
                              <span className="text-text-muted/80">{key}:</span>{" "}
                              {Array.isArray(value)
                                ? value.join(", ")
                                : typeof value === "boolean"
                                  ? value
                                    ? "Evet"
                                    : "Hayır"
                                  : String(value)}
                            </div>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={applicant.status}
                        onChange={(e) =>
                          handleStatusChange(applicant.id, e.target.value as ApplicantStatus)
                        }
                        disabled={updatingId === applicant.id}
                        className="rounded-lg border border-accent/30 bg-background px-3 py-2 text-text outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 disabled:opacity-50"
                      >
                        {STATUS_OPTIONS.map(({ value, label }) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(applicant.id)}
                        disabled={deletingId === applicant.id}
                        className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                      >
                        {deletingId === applicant.id ? "…" : "Sil"}
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
