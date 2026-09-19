// Auth state for the /admin panel only. The public site never touches this.
//
// Signing in with a valid Supabase Auth account is not enough on its own:
// the account must also be listed in the ngo_admins table (see
// supabase/schema.sql). This mirrors suyog-dhungel-portfolio's own
// AuthContext -- signIn() checks the is_ngo_admin() RPC right after
// authenticating and signs the account back out if it isn't on the
// allowlist, so a stray Supabase Auth user can never edit the site.
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [authError, setAuthError] = useState("");
  const verifiedUserId = useRef("");

  const checkAdmin = useCallback(async (nextSession) => {
    if (!nextSession?.user) {
      verifiedUserId.current = "";
      setIsAdmin(false);
      return false;
    }
    if (verifiedUserId.current === nextSession.user.id) {
      setIsAdmin(true);
      return true;
    }
    const { data, error } = await supabase.rpc("is_ngo_admin");
    if (error) {
      setAuthError(error.message);
      setIsAdmin(false);
      return false;
    }
    const allowed = data === true;
    setIsAdmin(allowed);
    verifiedUserId.current = allowed ? nextSession.user.id : "";
    return allowed;
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;
    let active = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      if (data.session) await checkAdmin(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!active) return;
      setSession(newSession);
      setLoading(true);
      if (newSession) await checkAdmin(newSession);
      else setIsAdmin(false);
      if (active) setLoading(false);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [checkAdmin]);

  async function signIn(email, password) {
    setAuthError("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const allowed = await checkAdmin(data.session);
    if (!allowed) {
      await supabase.auth.signOut();
      throw new Error(
        "This account is signed in but is not listed as a site administrator. Add its user ID to ngo_admins in Supabase.",
      );
    }
    return data.session;
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  const value = {
    user: session?.user ?? null,
    isAdmin,
    loading,
    authError,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside an AuthProvider");
  return ctx;
}
