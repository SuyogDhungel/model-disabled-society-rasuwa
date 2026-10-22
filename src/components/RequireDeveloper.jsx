import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Route guard for developer-only sections under /admin (Site settings,
// Programs, Committee, Notices, Resources).
// Staff accounts ("editor") only have permission to post and manage activities.
// If an editor attempts to visit developer-only URLs directly, redirect them to
// /admin/activities.
export default function RequireDeveloper({ children }) {
  const { user, isAdmin, isDeveloper, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container page">
        <p>Loading…</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!isDeveloper) {
    return <Navigate to="/admin/activities" replace />;
  }

  return children;
}
