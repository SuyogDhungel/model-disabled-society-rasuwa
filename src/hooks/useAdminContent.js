import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient.js";
import { useSiteContent } from "../context/SiteContentContext.jsx";

// Everything under /admin reads and writes through this hook instead of
// SiteContentContext's public RPC: it reads the unfiltered row (drafts and
// unverified committee members included, so you can see and finish them)
// and saves the whole object back in one update.
//
// Save conflicts: every save is conditioned on the row's updated_at still
// matching what this tab last loaded. If someone else (or another browser
// tab) saved in between, the update matches zero rows and this reports a
// conflict instead of silently overwriting their change -- the same
// protection the Cloudflare/D1 build's revision check gives.
export function useAdminContent() {
  const { content, setContent } = useSiteContent();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const lastUpdatedAt = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    const { data, error } = await supabase
      .from("site_content")
      .select("content, updated_at")
      .eq("id", "main")
      .single();
    if (error) {
      setLoadError("Couldn't load site content: " + error.message);
    } else {
      setContent(data.content);
      lastUpdatedAt.current = data.updated_at;
    }
    setLoading(false);
  }, [setContent]);

  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(
    async (nextContent) => {
      setSaving(true);
      setStatus("");
      try {
        let query = supabase
          .from("site_content")
          .update({ content: nextContent })
          .eq("id", "main");
        if (lastUpdatedAt.current) {
          query = query.eq("updated_at", lastUpdatedAt.current);
        }
        const { data, error } = await query
          .select("content, updated_at")
          .single();

        if (error) {
          if (error.code === "PGRST116") {
            setStatus(
              "Could not save: another editor saved changes since you loaded this page. Reload to see the latest version before trying again.",
            );
            return false;
          }
          throw error;
        }

        setContent(data.content);
        lastUpdatedAt.current = data.updated_at;
        setStatus("Saved successfully.");
        return true;
      } catch (err) {
        setStatus("Could not save: " + err.message);
        return false;
      } finally {
        setSaving(false);
      }
    },
    [setContent],
  );

  return {
    content,
    setContent,
    loading,
    loadError,
    saving,
    status,
    setStatus,
    save,
    reload: load,
  };
}
