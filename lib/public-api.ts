/**
 * Ana sayfa için Supabase veri çekme.
 * Admin'den eklenen etkinlik ve videolar buradan gelir.
 */

import { createClient } from "@/lib/supabase";
import type { Event, YoutubeVideo, ContactMessageInsert, ApplicantInsert, AboutSection } from "@/types";

export async function getActiveEvents(): Promise<Event[]> {
  const supabase = createClient();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("is_active", true)
    .gte("event_date", now)
    .order("event_date", { ascending: true });
  if (error) return [];
  return (data ?? []) as Event[];
}

export async function getPastEvents(): Promise<Event[]> {
  const supabase = createClient();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: false });
  if (error) return [];
  const events = (data ?? []) as Event[];
  return events.filter((e) => new Date(e.event_date) < new Date(now) || !e.is_active);
}

export async function getYoutubeVideos(limit = 3): Promise<YoutubeVideo[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("youtube_videos")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return [];
  return (data ?? []) as YoutubeVideo[];
}

export async function submitContactMessage(data: ContactMessageInsert): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("contact_messages").insert({
    full_name: data.full_name.trim(),
    phone: data.phone.trim(),
    message: data.message.trim(),
  });
  if (error) throw new Error(error.message);
}

export async function getAboutSections(): Promise<AboutSection[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("about_sections")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) return [];
  return (data ?? []) as AboutSection[];
}

export async function submitApplicant(data: ApplicantInsert): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("applicants").insert({
    event_id: data.event_id,
    full_name: data.full_name.trim(),
    email: data.email?.trim() || null,
    phone: data.phone?.trim() || null,
    answers: data.answers ?? {},
    status: "bekliyor",
  });
  if (error) throw new Error(error.message);
}
