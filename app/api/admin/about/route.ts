import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import type { AboutSection } from "@/types";

export async function GET() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("about_sections")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(data ?? []);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Liste alınamadı" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const content = typeof body.content === "string" ? body.content.trim() : "";
    const sort_order = typeof body.sort_order === "number" ? body.sort_order : 0;
    if (!title) {
      return NextResponse.json({ error: "Başlık gerekli" }, { status: 400 });
    }
    const supabase = createClient();
    const { data: row, error } = await supabase
      .from("about_sections")
      .insert({ title: title || "Hakkımızda", content, sort_order })
      .select()
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(row as AboutSection);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Eklenemedi" },
      { status: 500 }
    );
  }
}
