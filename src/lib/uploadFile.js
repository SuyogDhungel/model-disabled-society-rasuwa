import { supabase } from "./supabaseClient.js";

// Uploads a file to a Supabase Storage bucket and returns its public URL.
// Used by the admin panel for board-member photos and report/notice files.
// Both buckets this project uses ("board-photos", "report-files") are
// created as PUBLIC buckets (see supabase/schema.sql), so a public URL
// works immediately with no extra signing step.
export async function uploadFile(bucket, file) {
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const path = `${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
