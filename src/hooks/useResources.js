import { useMemo } from "react";
import { useSiteContent } from "../context/SiteContentContext.jsx";

// Reports/publications now live inside the single site-content object (see
// SiteContentContext.jsx), already filtered to published-only.
export function useResources() {
  const { content, loading, offline } = useSiteContent();
  const resources = useMemo(
    () => [...content.resources].sort((a, b) => (b.year || "").localeCompare(a.year || "")),
    [content.resources],
  );
  return { resources, loading, error: offline ? "offline" : "" };
}
