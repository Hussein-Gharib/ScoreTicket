import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="navbar">
    <NavLink to="/" className="navbar__logo">
        <img src="/logo-full.png" alt="ScoreTicket" className="navbar__logo-img" />
    </NavLink>

      <nav className="navbar__links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/matches">Matches</NavLink>

        {token ? (
          <>
            {user?.role === "admin" && <NavLink to="/admin">Admin</NavLink>}

            <NavLink to="/my-tickets">My Tickets</NavLink>

            <button className="navbar__logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;