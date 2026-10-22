import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

// Shared shell for every page under /admin once signed in.
// Staff accounts ("editor") only have access to post activities and news.
// Site settings, programs, committee, notices, and documents are developer-only.
export default function AdminLayout() {
  const { user, signOut, isDeveloper } = useAuth();

  const sections = isDeveloper
    ? [
        ["activities", "Activities & News"],
        ["settings", "Site settings"],
        ["programs", "Programs"],
        ["board", "Committee"],
        ["notices", "Notices"],
        ["resources", "Reports & documents"],
      ]
    : [
        ["activities", "Post Activities & News"],
      ];

  return (
    <div className="container page admin-page">
      <div className="admin-bar">
        <div>
          <h1>{isDeveloper ? "Site Administration (Developer)" : "Organization Admin Panel"}</h1>
          <p className="admin-signed-in-as">
            Signed in as <strong>{user?.email}</strong>{" "}
            <span
              style={{
                display: "inline-block",
                marginLeft: "0.5rem",
                padding: "0.15rem 0.5rem",
                fontSize: "0.75rem",
                fontWeight: 600,
                borderRadius: "4px",
                background: isDeveloper ? "#dbeafe" : "#dcfce7",
                color: isDeveloper ? "#1e40af" : "#166534",
              }}
            >
              {isDeveloper ? "Developer Mode" : "Staff (Posting Only)"}
            </span>
          </p>
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

      {!isDeveloper && (
        <div
          role="note"
          style={{
            marginBottom: "1.5rem",
            padding: "0.75rem 1rem",
            background: "#f0fdf4",
            borderLeft: "4px solid #16a34a",
            borderRadius: "4px",
            fontSize: "0.9rem",
            color: "#166534",
          }}
        >
          <strong>Staff Account:</strong> You have permission to create, edit, and publish news and activity posts with photos. Site settings, committee members, and policy documents are restricted to the site developer.
        </div>
      )}

      <div className="admin-section">
        <Outlet />
      </div>
    </div>
  );
}
