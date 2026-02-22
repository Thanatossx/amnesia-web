/**
 * Amnesia - Supabase tablolarına karşılık gelen TypeScript tipleri
 */

// ============================================
// Events (Etkinlikler)
// ============================================

/** Form sorusu (form_questions array elemanı) */
export interface FormQuestion {
  id: string;
  label: string;
  type: "text" | "textarea" | "email" | "tel" | "select" | "checkbox";
  required?: boolean;
  options?: string[]; // select için
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  poster_url: string | null;
  is_active: boolean;
  event_date: string; // ISO 8601
  form_questions: FormQuestion[];
  created_at: string;
}

/** Yeni etkinlik eklerken (id ve created_at DB tarafından) */
export type EventInsert = Omit<Event, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};

/** Etkinlik güncellerken (tüm alanlar opsiyonel) */
export type EventUpdate = Partial<Omit<Event, "id" | "created_at">>;

// ============================================
// Applicants (Başvurular)
// ============================================

export type ApplicantStatus = "bekliyor" | "onaylandı" | "reddedildi" | "bilet_verildi";

/** answers: form_questions'taki id/label'a göre cevaplar */
export type ApplicantAnswers = Record<string, string | string[] | boolean>;

export interface Applicant {
  id: string;
  event_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  answers: ApplicantAnswers;
  status: ApplicantStatus;
  created_at: string;
}

/** Yeni başvuru eklerken */
export type ApplicantInsert = Omit<Applicant, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};

/** Başvuru güncellerken (örn. status değişimi) */
export type ApplicantUpdate = Partial<Omit<Applicant, "id" | "event_id" | "created_at">>;

// ============================================
// YouTube Videos
// ============================================

export interface YoutubeVideo {
  id: string;
  title: string;
  video_url: string;
  is_active: boolean;
  created_at: string;
}

/** Yeni video eklerken */
export type YoutubeVideoInsert = Omit<YoutubeVideo, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};

/** Video güncellerken */
export type YoutubeVideoUpdate = Partial<Omit<YoutubeVideo, "id" | "created_at">>;

// ============================================
// İlişkili tipler (join / select ile)
// ============================================

/** Başvuru + etkinlik bilgisi (event title vb.) */
export interface ApplicantWithEvent extends Applicant {
  event?: Pick<Event, "id" | "title" | "event_date"> | null;
}

// ============================================
// Contact Messages (İletişim mesajları)
// ============================================

export interface ContactMessage {
  id: string;
  full_name: string;
  phone: string;
  message: string;
  created_at: string;
}

export type ContactMessageInsert = Omit<ContactMessage, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};

// ============================================
// About Sections (Hakkımızda blokları)
// ============================================

export interface AboutSection {
  id: string;
  title: string;
  content: string;
  sort_order: number;
  created_at: string;
}

export type AboutSectionInsert = Omit<AboutSection, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};

export type AboutSectionUpdate = Partial<Omit<AboutSection, "id" | "created_at">>;
