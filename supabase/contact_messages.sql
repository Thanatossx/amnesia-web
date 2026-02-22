-- İletişim formu mesajları tablosu ve RLS
-- Supabase Dashboard > SQL Editor'da bu dosyayı çalıştırın (bir kez yeterli).
-- Hata alıyorsanız: "relation contact_messages does not exist" veya "permission denied"
-- bu dosyayı çalıştırmamışsınızdır.

-- Tablo (yoksa oluştur)
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages (created_at DESC);

COMMENT ON TABLE contact_messages IS 'İletişim sayfasından gelen mesajlar';

-- RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Eski politikaları kaldır (zaten varsa)
DROP POLICY IF EXISTS "contact_messages_insert" ON contact_messages;
DROP POLICY IF EXISTS "contact_messages_select" ON contact_messages;
DROP POLICY IF EXISTS "contact_messages_delete" ON contact_messages;

-- Herkes (anon) mesaj ekleyebilsin
CREATE POLICY "contact_messages_insert" ON contact_messages
  FOR INSERT WITH CHECK (true);

-- Herkes okuyabilsin (admin paneli anon key ile listeler)
CREATE POLICY "contact_messages_select" ON contact_messages
  FOR SELECT USING (true);

-- Admin panelinden silinebilsin
CREATE POLICY "contact_messages_delete" ON contact_messages
  FOR DELETE USING (true);
