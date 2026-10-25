import { supabase } from "./supabaseClient.js";

const ALLOWED_BUCKETS = new Set(["site-images", "report-files"]);

const BUCKET_RULES = {
  "site-images": {
    maxBytes: 10 * 1024 * 1024, // 10 MB
    allowedExtensions: new Set(["jpg", "jpeg", "png", "webp", "svg"]),
    label: "Image",
  },
  "report-files": {
    maxBytes: 25 * 1024 * 1024, // 25 MB
    allowedExtensions: new Set(["pdf", "doc", "docx", "xls", "xlsx"]),
    label: "Document",
  },
};

// Uploads a validated file to a Supabase Storage bucket and returns its public URL.
// Used by the admin panel for photos, activity media, and official report files.
export async function uploadFile(bucket, file) {
  if (!ALLOWED_BUCKETS.has(bucket)) {
    throw new Error(`Upload target bucket "${bucket}" is not authorized.`);
  }

  const rules = BUCKET_RULES[bucket];
  if (file.size > rules.maxBytes) {
    const maxMb = Math.round(rules.maxBytes / (1024 * 1024));
    throw new Error(`${rules.label} exceeds maximum allowed size of ${maxMb}MB.`);
  }

  const extension = (file.name.split(".").pop() || "").toLowerCase();
  if (!rules.allowedExtensions.has(extension)) {
    throw new Error(
      `File type ".${extension}" is not allowed. Permitted: ${Array.from(rules.allowedExtensions).join(", ")}.`,
    );
  }

  // Prevent directory traversal and normalize file name
  const baseName = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 50);
  const safeName = `${baseName || "file"}.${extension}`;
  const path = `${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
