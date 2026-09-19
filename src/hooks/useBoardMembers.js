import { useMemo } from "react";
import { useSiteContent } from "../context/SiteContentContext.jsx";

// The Executive Committee roster now lives inside the single site-content
// object. get_public_site_content() already filters this down to
// published AND verified members before the public site ever sees it, so
// an unconfirmed OCR-transcribed name never appears here.
export function useBoardMembers() {
  const { content, loading, offline } = useSiteContent();
  const members = useMemo(
    () => [...content.board].sort((a, b) => a.sortOrder - b.sortOrder),
    [content.board],
  );
  return { members, loading, error: offline ? "offline" : "" };
}
