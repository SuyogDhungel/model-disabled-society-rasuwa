import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Route guard for everything under /admin except the login page itself.
// Not logged in → bounce to /admin/login, remembering where they were headed
// so a bookmark to e.g. /admin/notices still works after signing in.
export default function RequireAuth({ children }) {
  const { user, isAdmin, loading } = useAuth();
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

  return children;
}
