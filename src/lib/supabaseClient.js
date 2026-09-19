// Supabase client — the one place this project talks to the backend.
//
// SETUP: this file reads two values from environment variables, which live
// in a local ".env" file (never committed — see .gitignore) and, for the
// live site, in Vercel's project "Environment Variables" settings:
//
//   VITE_SUPABASE_URL              — Project Settings → API → Project URL
//   VITE_SUPABASE_PUBLISHABLE_KEY  — Project Settings → API → publishable key
//                                    (older Supabase projects call this the
//                                    "anon" key; VITE_SUPABASE_ANON_KEY also
//                                    works as a fallback name)
//
// This key is safe to expose in client-side code (that's what it's for) as
// long as Row Level Security policies are in place on every table — see
// supabase/schema.sql, which sets those up. Never put the "service_role"
// key here; that one bypasses RLS entirely and must never reach the browser.
//
// See EDITING_GUIDE.md for the full one-time setup walkthrough.
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  // Don't throw — the public site should still render (with "content not
  // available yet" states) even before Supabase is wired up, and the admin
  // routes show a clear setup message instead of a blank crash screen.
  console.warn(
    "[supabaseClient] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set. " +
      "Live content and the /admin panel won't work until they are — see EDITING_GUIDE.md."
  );
}

// A harmless placeholder URL when unconfigured, purely so createClient()
// doesn't throw during local development before .env exists.
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);
