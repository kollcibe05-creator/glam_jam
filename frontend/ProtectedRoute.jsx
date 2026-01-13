import { Navigate } from "react-router-dom";

// Refactored version to handle the "initial load" state
function ProtectedRoute({ user, isLoading, children, adminOnly = false }) {
  // 1. Wait until the session check is finished
  if (isLoading) {
    return <div className="loader">Verifying session...</div>;
  }

  // 2. If not logged in after check, go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Admin check
  if (adminOnly && user.role?.name !== "Admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}