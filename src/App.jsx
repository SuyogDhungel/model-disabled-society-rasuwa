import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import RouteFocusManager from "./components/RouteFocusManager.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import { useLanguage } from "./context/LanguageContext.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Programs from "./pages/Programs.jsx";
import Notices from "./pages/Notices.jsx";
import Resources from "./pages/Resources.jsx";
import Contact from "./pages/Contact.jsx";
import PolicyPage from "./pages/PolicyPage.jsx";
import NotFound from "./pages/NotFound.jsx";

// Lazy-loaded: the admin panel is only ever used by the site's
// maintainer(s), so there's no reason to ship its code to every visitor's
// first page load. React Router only fetches these chunks when someone
// actually navigates to a /admin/* URL.
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin.jsx"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout.jsx"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings.jsx"));
const AdminCollection = lazy(() => import("./pages/admin/AdminCollection.jsx"));

export default function App() {
  const { t } = useLanguage();

  return (
    <>
      <a className="skip-link" href="#main-content">
        {t.nav.skipToContent}
      </a>
      <Header />
      <RouteFocusManager />
      <main id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/contact" element={<Contact />} />
          {["accessibility", "privacy", "safeguarding"].map((type) => (
            <Route key={type} path={"/" + type} element={<PolicyPage type={type} />} />
          ))}

          {/*
            Admin routes — deliberately not in the Header nav, not in
            sitemap.xml, and blocked in robots.txt. /admin/login is public
            (it's how you sign in); everything else under /admin requires an
            authenticated AND allow-listed Supabase account via RequireAuth.
            Wrapped in Suspense because the admin components above are
            lazy-loaded.
          */}
          <Route
            path="/admin/login"
            element={
              <Suspense fallback={<div className="container page">Loading…</div>}>
                <AdminLogin />
              </Suspense>
            }
          />
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <Suspense fallback={<div className="container page">Loading…</div>}>
                  <AdminLayout />
                </Suspense>
              </RequireAuth>
            }
          >
            <Route index element={<Navigate to="settings" replace />} />
            <Route
              path="settings"
              element={
                <Suspense fallback={<p>Loading…</p>}>
                  <AdminSettings />
                </Suspense>
              }
            />
            {["programs", "board", "notices", "resources"].map((type) => (
              <Route
                key={type}
                path={type}
                element={
                  <Suspense fallback={<p>Loading…</p>}>
                    <AdminCollection type={type} />
                  </Suspense>
                }
              />
            ))}
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
