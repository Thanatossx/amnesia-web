-- =============================================================================
-- AMNESIA - Supabase tam kurulum (tek seferde çalıştır)
-- Supabase Dashboard > SQL Editor'a yapıştırıp Run ile çalıştırın.
-- Tablolar zaten varsa "already exists" uyarıları alabilirsiniz; RLS kısmı yine uygulanır.
--
-- Afiş yükleme için: Storage > New bucket > "posters" adında public bucket oluşturun.
-- Bucket Policies: Allow public read; Allow anon insert (veya service role ile yükleyin).
-- =============================================================================

-- UUID extension (Supabase'de genelde zaten açıktır)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. EVENTS (Etkinlikler)
-- ============================================
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  poster_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  event_date TIMESTAMPTZ NOT NULL,
  form_questions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_event_date ON events (event_date);
CREATE INDEX IF NOT EXISTS idx_events_is_active ON events (is_active);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events (created_at DESC);

COMMENT ON TABLE events IS 'Rave etkinlikleri';
COMMENT ON COLUMN events.form_questions IS 'Etkinliğe özel başvuru formu soruları (JSON array)';

-- ============================================
-- 2. APPLICANTS (Başvurular)
-- ============================================
CREATE TABLE IF NOT EXISTS applicants (
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

CREATE INDEX IF NOT EXISTS idx_applicants_event_id ON applicants (event_id);
CREATE INDEX IF NOT EXISTS idx_applicants_status ON applicants (status);
CREATE INDEX IF NOT EXISTS idx_applicants_email ON applicants (email);
CREATE INDEX IF NOT EXISTS idx_applicants_created_at ON applicants (created_at DESC);

COMMENT ON TABLE applicants IS 'Etkinlik başvuruları';
COMMENT ON COLUMN applicants.answers IS 'Form sorularına verilen cevaplar (soru_id/anahtar -> cevap)';
COMMENT ON COLUMN applicants.status IS 'bekliyor | onaylandı | reddedildi | bilet_verildi';

-- ============================================
-- 3. YOUTUBE_VIDEOS (Videolar)
-- ============================================
CREATE TABLE IF NOT EXISTS youtube_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_youtube_videos_is_active ON youtube_videos (is_active);
CREATE INDEX IF NOT EXISTS idx_youtube_videos_created_at ON youtube_videos (created_at DESC);

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

-- =============================================================================
-- RLS (Row Level Security) politikaları
-- =============================================================================

-- EVENTS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "events_select" ON events;
DROP POLICY IF EXISTS "events_insert" ON events;
DROP POLICY IF EXISTS "events_update" ON events;
DROP POLICY IF EXISTS "events_delete" ON events;
CREATE POLICY "events_select" ON events FOR SELECT USING (true);
CREATE POLICY "events_insert" ON events FOR INSERT WITH CHECK (true);
CREATE POLICY "events_update" ON events FOR UPDATE USING (true);
CREATE POLICY "events_delete" ON events FOR DELETE USING (true);

-- APPLICANTS
ALTER TABLE applicants ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "applicants_select" ON applicants;
DROP POLICY IF EXISTS "applicants_insert" ON applicants;
DROP POLICY IF EXISTS "applicants_update" ON applicants;
DROP POLICY IF EXISTS "applicants_delete" ON applicants;
CREATE POLICY "applicants_select" ON applicants FOR SELECT USING (true);
CREATE POLICY "applicants_insert" ON applicants FOR INSERT WITH CHECK (true);
CREATE POLICY "applicants_update" ON applicants FOR UPDATE USING (true);
CREATE POLICY "applicants_delete" ON applicants FOR DELETE USING (true);

-- YOUTUBE_VIDEOS
ALTER TABLE youtube_videos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "youtube_videos_select" ON youtube_videos;
DROP POLICY IF EXISTS "youtube_videos_insert" ON youtube_videos;
DROP POLICY IF EXISTS "youtube_videos_update" ON youtube_videos;
DROP POLICY IF EXISTS "youtube_videos_delete" ON youtube_videos;
CREATE POLICY "youtube_videos_select" ON youtube_videos FOR SELECT USING (true);
CREATE POLICY "youtube_videos_insert" ON youtube_videos FOR INSERT WITH CHECK (true);
CREATE POLICY "youtube_videos_update" ON youtube_videos FOR UPDATE USING (true);
CREATE POLICY "youtube_videos_delete" ON youtube_videos FOR DELETE USING (true);

-- CONTACT_MESSAGES
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "contact_messages_insert" ON contact_messages;
DROP POLICY IF EXISTS "contact_messages_select" ON contact_messages;
DROP POLICY IF EXISTS "contact_messages_delete" ON contact_messages;
CREATE POLICY "contact_messages_insert" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "contact_messages_select" ON contact_messages FOR SELECT USING (true);
CREATE POLICY "contact_messages_delete" ON contact_messages FOR DELETE USING (true);

-- ABOUT_SECTIONS
ALTER TABLE about_sections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "about_sections_select" ON about_sections;
DROP POLICY IF EXISTS "about_sections_insert" ON about_sections;
DROP POLICY IF EXISTS "about_sections_update" ON about_sections;
DROP POLICY IF EXISTS "about_sections_delete" ON about_sections;
CREATE POLICY "about_sections_select" ON about_sections FOR SELECT USING (true);
CREATE POLICY "about_sections_insert" ON about_sections FOR INSERT WITH CHECK (true);
CREATE POLICY "about_sections_update" ON about_sections FOR UPDATE USING (true);
CREATE POLICY "about_sections_delete" ON about_sections FOR DELETE USING (true);
