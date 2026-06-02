import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="navbar">
      <Link to="/" className="navbar__logo">
        ScoreTicket
      </Link>

      <nav className="navbar__links">
        <Link to="/">Home</Link>
        <Link to="/matches">Matches</Link>

        {token ? (
          <>
            <Link to="/my-tickets">My Tickets</Link>
            <button className="navbar__logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;