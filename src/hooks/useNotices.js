import { useMemo } from "react";
import { useSiteContent } from "../context/SiteContentContext.jsx";

// Notices now live inside the single site-content object (see
// SiteContentContext.jsx), already filtered to published-only by the
// get_public_site_content() database function -- no separate fetch needed.
export function useNotices() {
  const { content, loading, offline } = useSiteContent();
  const notices = useMemo(
    () =>
      [...content.notices].sort((a, b) => {
        const da = Date.parse(a.date || "") || 0;
        const db = Date.parse(b.date || "") || 0;
        return db - da;
      }),
    [content.notices],
  );
  return { notices, loading, error: offline ? "offline" : "" };
}
