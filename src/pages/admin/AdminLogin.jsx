import { useRef, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { isSupabaseConfigured } from "../../lib/supabaseClient.js";

// English-only by design: this page is a private tool for the site's
// maintainer(s), not public content, so it doesn't need the bilingual
// treatment the rest of the site has. It still follows the same
// accessible-forms pattern as ContactForm.jsx (labelled fields, one error
// region per field, a polite live-region for status messages).
export default function AdminLogin() {
  const { user, isAdmin, signIn } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const emailRef = useRef(null);

  if (!isSupabaseConfigured) {
    return (
      <div className="container page">
        <h1>Admin sign-in</h1>
        <p className="lede">
          The site isn't connected to Supabase yet, so there's no admin login to sign in to. See
          EDITING_GUIDE.md for the one-time setup steps (create a Supabase project, run
          supabase/schema.sql, add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, create your
          admin user in the Supabase dashboard, then add that user's ID to the ngo_admins table).
        </p>
      </div>
    );
  }

  if (user && isAdmin) {
    const redirectTo = location.state?.from?.pathname || "/admin";
    return <Navigate to={redirectTo} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter both your email and password.");
      emailRef.current?.focus();
      return;
    }

    setSubmitting(true);
    try {
      await signIn(email.trim(), password);
    } catch (err) {
      if (err?.message === "Invalid login credentials") {
        setError("That email or password wasn't recognised. Double-check both and try again.");
      } else if (err?.message?.includes("not listed as a site administrator")) {
        setError(err.message);
      } else {
        setError("Something went wrong signing in. Please try again in a moment.");
      }
      emailRef.current?.focus();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container page admin-page">
      <h1>Admin sign-in</h1>
      <p className="lede">
        For the person(s) who maintain this site's content. If you're a visitor looking for public
        information, use the navigation above instead.
      </p>

      <form noValidate onSubmit={handleSubmit} className="contact-form admin-login-form">
        <div className="field">
          <label htmlFor="admin-email">Email address</label>
          <input
            id="admin-email"
            name="email"
            type="email"
            autoComplete="email"
            ref={emailRef}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(error)}
          />
        </div>

        <div className="field">
          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "admin-login-error" : undefined}
          />
        </div>

        {error ? (
          <p id="admin-login-error" className="field-error" role="alert">
            {error}
          </p>
        ) : null}

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
