import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import type { Event } from "@/types";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const supabase = createServerClient();
    const updates: Record<string, unknown> = {};
    if (typeof body.title === "string") updates.title = body.title.trim();
    if (body.description !== undefined) updates.description = body.description;
    if (body.poster_url !== undefined) updates.poster_url = body.poster_url;
    if (typeof body.is_active === "boolean") updates.is_active = body.is_active;
    if (typeof body.event_date === "string") updates.event_date = body.event_date;
    if (Array.isArray(body.form_questions)) updates.form_questions = body.form_questions;
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "Güncellenecek alan yok" }, { status: 400 });
    }
    const { data: row, error } = await supabase
      .from("events")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(row as Event);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Etkinlik güncellenemedi" },
      { status: 500 }
    );
  }
}
