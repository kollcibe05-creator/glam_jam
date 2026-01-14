import { NavLink, Link, useNavigate } from "react-router-dom";

function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  function handleLogout() {
    fetch("/logout", { method: "DELETE" }).then(() => {
      setUser(null);
      navigate("/login");
    });
  }

  return (
    <nav className="navbar">
      <Link to="/" className="logo">Sweet Homes</Link>

      <div>
        <NavLink to="/houses">Explore</NavLink>

        {user ? (
          <>
            <NavLink to="/favorites">Favorites</NavLink>
            <NavLink to="/my-bookings">My Trips</NavLink>

            {user.role?.name === "Admin" && (
              <NavLink to="/admin">Admin</NavLink>
            )}

            <span>Hello, {user.username}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signup">Signup</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
