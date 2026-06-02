import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="navbar__logo">
        ScoreTicket
      </Link>

      <nav className="navbar__links">
        <Link to="/">Home</Link>
        <Link to="/matches">Matches</Link>
        <Link to="/my-tickets">My Tickets</Link>
        <Link to="/login">Login</Link>
      </nav>
    </header>
  );
}

export default Navbar;