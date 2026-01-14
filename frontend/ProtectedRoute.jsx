import { Navigate } from "react-router-dom";

function ProtectedRoute({ user, adminOnly = false, children }) {
  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin-only route
  if (adminOnly && user.role?.name !== "Admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
