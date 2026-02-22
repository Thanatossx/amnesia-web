import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

const BUCKET = "posters";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file || !file.size) {
      return NextResponse.json({ error: "Dosya gerekli" }, { status: 400 });
    }
    const supabase = createClient();
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
    const { data, error } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (error) {
      const isBucketNotFound =
        error.message?.toLowerCase().includes("bucket") &&
        (error.message?.toLowerCase().includes("not found") || error.message?.toLowerCase().includes("could not find"));
      const message = isBucketNotFound
        ? "Storage bucket bulunamadı. Supabase Dashboard > Storage > New bucket > adı 'posters' yazın, Public işaretleyin, oluşturun. Alternatif: Afiş alanında dosya seçmek yerine afiş URL'si yapıştırabilirsiniz."
        : error.message;
      return NextResponse.json({ error: message }, { status: 400 });
    }
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
    return NextResponse.json({ url: urlData.publicUrl });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Yükleme başarısız" },
      { status: 500 }
    );
  }
}
