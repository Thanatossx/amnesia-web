"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { Applicant, ApplicantStatus, Event, FormQuestion } from "@/types";
import {
  getApplicant,
  getEventById,
  updateApplicantStatus,
  deleteApplicant,
} from "@/lib/admin-api";

const STATUS_OPTIONS: { value: ApplicantStatus; label: string }[] = [
  { value: "bekliyor", label: "Bekliyor" },
  { value: "onaylandı", label: "Onaylandı" },
  { value: "reddedildi", label: "Reddedildi" },
  { value: "bilet_verildi", label: "Bilet Verildi" },
];

function formatAnswer(value: unknown): string {
  if (value == null) return "—";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "boolean") return value ? "Evet" : "Hayır";
  return String(value);
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("tr-TR");
  } catch {
    return iso;
  }
}

export default function AdminApplicantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setMessage(null);
      try {
        const appData = await getApplicant(id);
        if (cancelled) return;
        setApplicant(appData ?? null);
        if (appData?.event_id) {
          const evData = await getEventById(appData.event_id);
          if (!cancelled) setEvent(evData ?? null);
        } else {
          setEvent(null);
        }
      } catch {
        if (!cancelled) setMessage({ type: "err", text: "Başvuru yüklenemedi." });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleStatusChange = async (newStatus: ApplicantStatus) => {
    if (!applicant) return;
    setUpdating(true);
    setMessage(null);
    try {
      await updateApplicantStatus(applicant.id, newStatus);
      setApplicant((prev) => (prev ? { ...prev, status: newStatus } : null));
      setMessage({ type: "ok", text: "Durum güncellendi." });
    } catch {
      setMessage({ type: "err", text: "Durum güncellenemedi." });
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!applicant || !confirm("Bu başvuruyu silmek istediğinize emin misiniz?")) return;
    try {
      await deleteApplicant(applicant.id);
      router.push("/admin/applicants");
    } catch {
      setMessage({ type: "err", text: "Silinemedi." });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-text-muted">Yükleniyor…</p>
      </div>
    );
  }

  if (!applicant) {
    return (
      <div>
        <Link
          href="/admin/applicants"
          className="text-sm text-text-muted hover:text-accent"
        >
          ← Başvurulara dön
        </Link>
        <p className="mt-4 text-red-400">Başvuru bulunamadı.</p>
      </div>
    );
  }

  const formQuestions: FormQuestion[] = (event?.form_questions ?? []).filter(
    (q) => q && typeof q.label === "string" && q.label.trim()
  ) as FormQuestion[];

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin/applicants"
        className="inline-block text-sm text-text-muted transition-colors hover:text-accent"
      >
        ← Başvurulara dön
      </Link>

      <div className="mt-6 flex flex-col gap-6 rounded-xl border border-accent/20 bg-background-dark p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-bright">{applicant.full_name}</h1>
            {event && (
              <p className="mt-1 text-text-muted">
                Etkinlik: {event.title}
              </p>
            )}
            <p className="mt-1 text-sm text-text-muted">
              Başvuru tarihi: {formatDate(applicant.created_at)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-text-muted">
              Durum:
              <select
                value={applicant.status}
                onChange={(e) => handleStatusChange(e.target.value as ApplicantStatus)}
                disabled={updating}
                className="rounded-lg border border-accent/30 bg-background px-3 py-2 text-text outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 disabled:opacity-50"
              >
                {STATUS_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-lg px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10"
            >
              Başvuruyu sil
            </button>
          </div>
        </div>

        {message && (
          <p
            className={`text-sm ${message.type === "ok" ? "text-green-400" : "text-red-400"}`}
          >
            {message.text}
          </p>
        )}

        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-text-muted">
              E-posta
            </dt>
            <dd className="mt-1 text-text">{applicant.email ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-text-muted">
              Telefon
            </dt>
            <dd className="mt-1 text-text">{applicant.phone ?? "—"}</dd>
          </div>
        </dl>

        {formQuestions.length > 0 && (
          <div className="border-t border-accent/10 pt-6">
            <h2 className="mb-4 text-lg font-semibold text-text-bright">
              Form cevapları
            </h2>
            <dl className="space-y-4">
              {formQuestions.map((q) => (
                <div key={q.id}>
                  <dt className="text-sm font-medium text-text-muted">{q.label}</dt>
                  <dd className="mt-1 whitespace-pre-wrap rounded-lg bg-background px-3 py-2 text-text">
                    {formatAnswer(applicant.answers[q.id])}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
