import { Navigate } from "react-router-dom";

function ProtectedRoute({ user, children, adminOnly = false }) {
  // If not logged in, go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If route is admin-only but user is not an Admin, go to home
  if (adminOnly && user.role?.name !== "Admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}