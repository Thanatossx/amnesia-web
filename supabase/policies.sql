-- RLS (Row Level Security) politikaları
-- Tablolar oluşturulduktan SONRA bu dosyayı SQL Editor'da çalıştırın.
-- Böylece uygulama Supabase'e bağlanıp veri okuyup yazabilir.

-- ============================================
-- EVENTS: Herkes okuyabilsin, sadece service role yazabilsin
-- Geliştirme için: anon da insert/update/delete yapabilsin (isterseniz kullanın)
-- ============================================
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "events_select" ON events
  FOR SELECT USING (true);

-- Geliştirme: herkes etkinlik ekleyebilsin/güncelleyebilsin (production'da kaldırın)
CREATE POLICY "events_insert" ON events
  FOR INSERT WITH CHECK (true);
CREATE POLICY "events_update" ON events
  FOR UPDATE USING (true);
CREATE POLICY "events_delete" ON events
  FOR DELETE USING (true);

-- ============================================
-- APPLICANTS: Herkes başvuru ekleyebilsin, herkes okuyabilsin/güncelleyebilsin
-- (Production'da: INSERT herkese, SELECT/UPDATE/DELETE sadece admin'e kısıtlayın)
-- ============================================
ALTER TABLE applicants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "applicants_select" ON applicants
  FOR SELECT USING (true);
CREATE POLICY "applicants_insert" ON applicants
  FOR INSERT WITH CHECK (true);
CREATE POLICY "applicants_update" ON applicants
  FOR UPDATE USING (true);
CREATE POLICY "applicants_delete" ON applicants
  FOR DELETE USING (true);

-- ============================================
-- YOUTUBE_VIDEOS: Herkes okuyabilsin, yazma geliştirme için açık
-- ============================================
ALTER TABLE youtube_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "youtube_videos_select" ON youtube_videos
  FOR SELECT USING (true);
CREATE POLICY "youtube_videos_insert" ON youtube_videos
  FOR INSERT WITH CHECK (true);
CREATE POLICY "youtube_videos_update" ON youtube_videos
  FOR UPDATE USING (true);
CREATE POLICY "youtube_videos_delete" ON youtube_videos
  FOR DELETE USING (true);

-- ============================================
-- CONTACT_MESSAGES: İletişim formu mesajları
-- ============================================
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "contact_messages_insert" ON contact_messages;
DROP POLICY IF EXISTS "contact_messages_select" ON contact_messages;
DROP POLICY IF EXISTS "contact_messages_delete" ON contact_messages;

CREATE POLICY "contact_messages_insert" ON contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "contact_messages_select" ON contact_messages
  FOR SELECT USING (true);

CREATE POLICY "contact_messages_delete" ON contact_messages
  FOR DELETE USING (true);

-- ============================================
-- ABOUT_SECTIONS: Hakkımızda sayfası
-- ============================================
ALTER TABLE about_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "about_sections_select" ON about_sections
  FOR SELECT USING (true);
CREATE POLICY "about_sections_insert" ON about_sections
  FOR INSERT WITH CHECK (true);
CREATE POLICY "about_sections_update" ON about_sections
  FOR UPDATE USING (true);
CREATE POLICY "about_sections_delete" ON about_sections
  FOR DELETE USING (true);
