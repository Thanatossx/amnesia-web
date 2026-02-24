/**
 * Admin paneli Supabase API.
 */

import { createClient } from "@/lib/supabase";
import type { Event, EventInsert, EventUpdate, Applicant, ApplicantStatus, YoutubeVideo, YoutubeVideoInsert, YoutubeVideoUpdate, ContactMessage, AboutSection, AboutSectionInsert, AboutSectionUpdate } from "@/types";

export async function createEvent(data: EventInsert): Promise<Event> {
  const supabase = createClient();
  const { data: row, error } = await supabase
    .from("events")
    .insert({
      title: data.title,
      description: data.description ?? null,
      poster_url: data.poster_url || null,
      is_active: data.is_active ?? true,
      event_date: data.event_date,
      form_questions: data.form_questions ?? [],
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return row as Event;
}

export async function getEvents(activeOnly?: boolean): Promise<Event[]> {
  const supabase = createClient();
  let query = supabase.from("events").select("*").order("event_date", { ascending: false });
  if (activeOnly === true) {
    query = query.eq("is_active", true).gte("event_date", new Date().toISOString());
  } else if (activeOnly === false) {
    query = query.eq("is_active", false);
  }
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as Event[];
}

export async function getEventById(id: string): Promise<Event | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from("events").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data as Event | null;
}

export async function updateEvent(id: string, data: EventUpdate): Promise<Event> {
  const supabase = createClient();
  const { data: row, error } = await supabase
    .from("events")
    .update({
      ...(data.title != null && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.poster_url !== undefined && { poster_url: data.poster_url }),
      ...(data.is_active !== undefined && { is_active: data.is_active }),
      ...(data.event_date != null && { event_date: data.event_date }),
      ...(data.form_questions !== undefined && { form_questions: data.form_questions }),
    })
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return row as Event;
}

export async function deleteEvent(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function getVideos(): Promise<YoutubeVideo[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("youtube_videos")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as YoutubeVideo[];
}

export async function addVideo(data: YoutubeVideoInsert): Promise<YoutubeVideo> {
  const supabase = createClient();
  const { data: row, error } = await supabase
    .from("youtube_videos")
    .insert({
      title: data.title,
      video_url: data.video_url,
      is_active: data.is_active ?? true,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return row as YoutubeVideo;
}

export async function updateVideo(id: string, data: YoutubeVideoUpdate): Promise<YoutubeVideo> {
  const supabase = createClient();
  const { data: row, error } = await supabase
    .from("youtube_videos")
    .update(data)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return row as YoutubeVideo;
}

export async function deleteVideo(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("youtube_videos").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function getApplicantsByEventId(eventId: string): Promise<Applicant[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("applicants")
    .select("*")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Applicant[];
}

export async function getApplicant(id: string): Promise<Applicant | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from("applicants").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data as Applicant | null;
}

export async function updateApplicantStatus(applicantId: string, status: ApplicantStatus): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("applicants")
    .update({ status })
    .eq("id", applicantId);
  if (error) throw new Error(error.message);
}

export async function deleteApplicant(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("applicants").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as ContactMessage[];
}

export async function deleteContactMessage(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function getAboutSections(): Promise<AboutSection[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("about_sections")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as AboutSection[];
}

export async function createAboutSection(data: AboutSectionInsert): Promise<AboutSection> {
  const supabase = createClient();
  const { data: row, error } = await supabase
    .from("about_sections")
    .insert({
      title: data.title,
      content: data.content,
      sort_order: data.sort_order ?? 0,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return row as AboutSection;
}

export async function updateAboutSection(id: string, data: AboutSectionUpdate): Promise<AboutSection> {
  const supabase = createClient();
  const { data: row, error } = await supabase
    .from("about_sections")
    .update(data)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return row as AboutSection;
}

export async function deleteAboutSection(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("about_sections").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
