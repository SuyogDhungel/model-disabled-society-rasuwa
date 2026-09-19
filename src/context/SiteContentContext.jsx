// The single source of truth for every backend-editable piece of the site:
// organization details, the logo, the hero image, About/home text, policy
// pages, programs, the committee roster, notices and resources. Everything
// under /admin edits this one object and saves it back as a whole; every
// public page reads from it instead of a hardcoded string or asset import,
// so a change in the admin panel (e.g. a new logo) shows up everywhere the
// value is used -- the header, the hero section, the browser tab preview --
// without touching any component code.
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient.js";
import { defaultSiteContent } from "../data/defaultSiteContent.js";

const SiteContentContext = createContext(null);

export function SiteContentProvider({ children }) {
  const [content, setContent] = useState(defaultSiteContent);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [offline, setOffline] = useState(false);

  // Public, filtered view (drafts and unverified committee members removed
  // server-side by get_public_site_content()) -- used by every page except
  // the admin panel, which reads the unfiltered row directly instead (see
  // useAdminContent.js).
  const refreshPublic = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.rpc("get_public_site_content");
    if (error || !data || Object.keys(data).length === 0) {
      setOffline(true);
    } else {
      setContent(data);
      setOffline(false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (window.location.pathname.startsWith("/admin")) {
      setLoading(false);
      return;
    }
    refreshPublic();
  }, [refreshPublic]);

  return (
    <SiteContentContext.Provider
      value={{ content, setContent, loading, offline, refreshPublic }}
    >
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const ctx = useContext(SiteContentContext);
  if (!ctx)
    throw new Error("useSiteContent must be used inside a SiteContentProvider");
  return ctx;
}
