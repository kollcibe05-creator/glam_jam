import { NavLink, useNavigate, Link } from "react-router-dom";

function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    fetch("/logout", { method: "DELETE" }).then(() => {
      setUser(null);
      navigate("/login");
    });
  };

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">🏠</span>
          <span className="logo-text">GlamJam</span>
        </Link>

        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? "active-link" : ""}>
            Explore
          </NavLink>

          {user ? (
            <>
              <NavLink to="/favorites" className={({ isActive }) => isActive ? "active-link" : ""}>
                Favorites
              </NavLink>
              
              <NavLink to="/my-bookings" className={({ isActive }) => isActive ? "active-link" : ""}>
                My Trips
              </NavLink>

              {user.role?.name === "Admin" && (
                <NavLink to="/admin" className="admin-badge">
                  Admin Panel
                </NavLink>
              )}

              <div className="user-menu">
                <span className="username">Hi, {user.username}</span>
                <button onClick={handleLogout} className="btn-logout">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-link">Login</Link>
              <Link to="/signup" className="btn-primary signup-btn">Signup</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;