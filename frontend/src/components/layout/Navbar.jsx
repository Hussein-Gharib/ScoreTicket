import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Bell, Menu, UserRound, X } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const closeMenu = () => setOpen(false);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    closeMenu();
    navigate("/login");
  };

  return (
    <header className="site-header">
      <div className="navbar">
        <NavLink to="/" className="navbar__logo" onClick={closeMenu}>
          <img src="/logo-full.png" alt="ScoreTicket" className="navbar__logo-img" />
        </NavLink>

        <button className="navbar__menu-toggle" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav className={`navbar__links ${open ? "is-open" : ""}`}>
          <div className="navbar__primary-links">
            <NavLink to="/" onClick={closeMenu}>Home</NavLink>
            <NavLink to="/matches" onClick={closeMenu}>Matches</NavLink>
            {token && <NavLink to="/my-tickets" onClick={closeMenu}>My Tickets</NavLink>}
            {token && user?.role === "admin" && <NavLink to="/admin" onClick={closeMenu}>Admin</NavLink>}
          </div>

          <div className="navbar__account-links">
            {token ? (
              <>
                <button className="navbar__icon-button" aria-label="Notifications"><Bell size={19} /></button>
                <span className="navbar__user"><UserRound size={18} />{user?.full_name?.split(" ")[0] || "Account"}</span>
                <button className="navbar__logout" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <NavLink to="/login" onClick={closeMenu}>Login</NavLink>
                <NavLink to="/register" className="navbar__register" onClick={closeMenu}>Register</NavLink>
                <button className="navbar__icon-button" aria-label="Notifications"><Bell size={19} /></button>
                <button className="navbar__icon-button" aria-label="Profile"><UserRound size={19} /></button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
