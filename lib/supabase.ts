import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js";

export function createClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase env eksik. .env.local içinde NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY tanımlayın."
    );
  }
  return createSupabaseClient(url, key);
}

/** Sunucu tarafında RLS'i aşmak için (sadece API route'larda kullanın). .env.local'e SUPABASE_SERVICE_ROLE_KEY ekleyin. */
export function createServerClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Supabase env eksik.");
  }
  return createSupabaseClient(url, key);
}
