-- Amnesia - Supabase veritabanı şeması
-- Bu dosyayı Supabase Dashboard > SQL Editor'da çalıştırın.

-- UUID extension (Supabase'de genelde zaten açıktır)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. EVENTS (Etkinlikler)
-- ============================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  poster_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  event_date TIMESTAMPTZ NOT NULL,
  form_questions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- İndeksler (sorgu performansı için)
CREATE INDEX idx_events_event_date ON events (event_date);
CREATE INDEX idx_events_is_active ON events (is_active);
CREATE INDEX idx_events_created_at ON events (created_at DESC);

COMMENT ON TABLE events IS 'Rave etkinlikleri';
COMMENT ON COLUMN events.form_questions IS 'Etkinliğe özel başvuru formu soruları (JSON array)';

-- ============================================
-- 2. APPLICANTS (Başvurular)
-- ============================================
CREATE TABLE applicants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events (id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  answers JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'bekliyor' CHECK (
    status IN ('bekliyor', 'onaylandı', 'reddedildi', 'bilet_verildi')
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_applicants_event_id ON applicants (event_id);
CREATE INDEX idx_applicants_status ON applicants (status);
CREATE INDEX idx_applicants_email ON applicants (email);
CREATE INDEX idx_applicants_created_at ON applicants (created_at DESC);

COMMENT ON TABLE applicants IS 'Etkinlik başvuruları';
COMMENT ON COLUMN applicants.answers IS 'Form sorularına verilen cevaplar (soru_id/anahtar -> cevap)';
COMMENT ON COLUMN applicants.status IS 'bekliyor | onaylandı | reddedildi | bilet_verildi';

-- ============================================
-- 3. YOUTUBE_VIDEOS (Videolar)
-- ============================================
CREATE TABLE youtube_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_youtube_videos_is_active ON youtube_videos (is_active);
CREATE INDEX idx_youtube_videos_created_at ON youtube_videos (created_at DESC);

COMMENT ON TABLE youtube_videos IS 'YouTube video kayıtları';

-- ============================================
-- 4. CONTACT_MESSAGES (İletişim mesajları)
-- ============================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages (created_at DESC);

COMMENT ON TABLE contact_messages IS 'İletişim sayfasından gelen mesajlar';

-- ============================================
-- 5. ABOUT_SECTIONS (Hakkımızda blokları)
-- ============================================
CREATE TABLE IF NOT EXISTS about_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_about_sections_sort ON about_sections (sort_order);

COMMENT ON TABLE about_sections IS 'Hakkımızda sayfası: başlık ve metin blokları. sort_order=0 hero alanı (sayfa başlığı/alt başlık).';
