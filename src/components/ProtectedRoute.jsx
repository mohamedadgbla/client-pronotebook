import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Blocks access to app pages unless logged in.
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="center muted">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
