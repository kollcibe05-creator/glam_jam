import { Navigate } from "react-router-dom";

function ProtectedRoute({ user, adminOnly = false, children, isLoading = false }) {
  // Show loader if user state is not yet determined
  if (isLoading) {
    return <div className="loader">Checking access...</div>;
  }

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect if admin-only route and user is not admin
  if (adminOnly && user.role?.name !== "Admin") {
    return <Navigate to="/" replace />;
  }

  // User is allowed
  return children;
}

export default ProtectedRoute;
