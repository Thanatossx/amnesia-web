-- =============================================================================
-- RLS hatası düzeltme: "new row violates row-level security policy"
-- Bu dosyayı Supabase Dashboard > SQL Editor'da çalıştırın.
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

-- E-posta zorunluluğunu kaldır (mevcut tablolar için)
ALTER TABLE applicants ALTER COLUMN email DROP NOT NULL;
