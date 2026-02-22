import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import type { Event } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!title) {
      return NextResponse.json({ error: "Etkinlik başlığı gerekli" }, { status: 400 });
    }
    const supabase = createServerClient();
    const { data: row, error } = await supabase
      .from("events")
      .insert({
        title,
        description: body.description ?? null,
        poster_url: body.poster_url ?? null,
        is_active: body.is_active ?? true,
        event_date: body.event_date,
        form_questions: Array.isArray(body.form_questions) ? body.form_questions : [],
      })
      .select()
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(row as Event);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Etkinlik oluşturulamadı" },
      { status: 500 }
    );
  }
}
