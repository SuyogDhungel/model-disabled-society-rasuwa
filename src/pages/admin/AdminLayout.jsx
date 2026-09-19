import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

// Shared shell for every page under /admin once signed in: a nav across
// every editable section plus a sign-out button. Deliberately separate
// from the public Header/Footer so this never gets mixed into the public
// nav or the sitemap.
export default function AdminLayout() {
  const { user, signOut } = useAuth();

  const sections = [
    ["settings", "Site settings"],
    ["programs", "Programs"],
    ["board", "Committee"],
    ["notices", "News & notices"],
    ["resources", "Reports & documents"],
  ];

  return (
    <div className="container page admin-page">
      <div className="admin-bar">
        <div>
          <h1>Site administration</h1>
          <p className="admin-signed-in-as">Signed in as {user?.email}</p>
        </div>
        <button type="button" className="btn btn-secondary" onClick={() => signOut()}>
          Sign out
        </button>
      </div>

      <nav aria-label="Admin sections" className="admin-nav">
        {sections.map(([path, label]) => (
          <NavLink key={path} to={`/admin/${path}`} className={({ isActive }) => (isActive ? "is-active" : "")}>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="admin-section">
        <Outlet />
      </div>
    </div>
  );
}
