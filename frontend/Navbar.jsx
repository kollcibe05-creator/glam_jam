import { Link, useNavigate } from "react-router-dom";

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
      <Link to="/" style={{ textDecoration: 'none', color: 'var(--primary)' }}>
        <h1 style={{ margin: 0 }}>AirBnB Clone</h1>
      </Link>
      <div className="links" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/">Explore</Link>
        {user ? (
          <>
            <Link to="/favorites">Favorites</Link>
            {user.role?.name === "Admin" && <Link to="/admin">Admin Panel</Link>}
            <button onClick={handleLogout} className="btn-rent" style={{ width: 'auto', padding: '8px 15px' }}>
                Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup" className="btn-primary" style={{ textDecoration: 'none' }}>Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;