import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Bell,
  Menu,
  Search,
  UserRound,
  X,
} from "lucide-react";

function getSavedUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

function Navbar() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(getSavedUser);
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") || ""
  );

  const token = localStorage.getItem("token");

  const closeMenu = () => {
    setOpen(false);
  };

  useEffect(() => {
    const updateProfileInformation = () => {
      setUser(getSavedUser());
      setProfileImage(localStorage.getItem("profileImage") || "");
    };

    window.addEventListener(
      "userUpdated",
      updateProfileInformation
    );

    window.addEventListener(
      "storage",
      updateProfileInformation
    );

    return () => {
      window.removeEventListener(
        "userUpdated",
        updateProfileInformation
      );

      window.removeEventListener(
        "storage",
        updateProfileInformation
      );
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    closeMenu();
    navigate("/login");
  };

  const handleProfileClick = () => {
    closeMenu();
    navigate("/settings");
  };

  const displayedUsername =
    user?.username ||
    user?.full_name?.split(" ")[0] ||
    "Account";

  return (
    <header className="topbar">
      <div className="topbar__inner">
        <NavLink
          to="/"
          className="brand"
          onClick={closeMenu}
        >
          <span className="brand__mark">ST</span>

          <span>
            <strong>SCORETICKET</strong>
            <small>ARENA PRO</small>
          </span>
        </NavLink>

        <nav className="topbar__desktop-nav">
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/matches">Matches</NavLink>

          {token && (
            <NavLink to="/my-tickets">
              Tickets
            </NavLink>
          )}

          {token && user?.role === "admin" && (
            <NavLink to="/admin">
              Admin
            </NavLink>
          )}
        </nav>

        <div className="topbar__actions">
          <button
            className="icon-button"
            type="button"
            aria-label="Search"
          >
            <Search size={19} />
          </button>

          <button
            className="icon-button"
            type="button"
            aria-label="Notifications"
          >
            <Bell size={19} />
          </button>

          {token ? (
            <>
              <button
                type="button"
                className="user-chip"
                onClick={handleProfileClick}
                aria-label="Open account settings"
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={`${displayedUsername} profile`}
                    className="topbar-profile-image"
                  />
                ) : (
                  <span className="topbar-profile-fallback">
                    <UserRound size={17} />
                  </span>
                )}

                <span>{displayedUsername}</span>
              </button>

              <button
                className="text-button"
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink
              className="text-button"
              to="/login"
            >
              Login
            </NavLink>
          )}

          <button
            className="mobile-menu"
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div
        className={`mobile-drawer ${
          open ? "is-open" : ""
        }`}
      >
        <NavLink to="/" onClick={closeMenu}>
          Dashboard
        </NavLink>

        <NavLink to="/matches" onClick={closeMenu}>
          Matches
        </NavLink>

        {token && (
          <NavLink
            to="/my-tickets"
            onClick={closeMenu}
          >
            My Tickets
          </NavLink>
        )}

        {token && user?.role === "admin" && (
          <NavLink
            to="/admin"
            onClick={closeMenu}
          >
            Admin
          </NavLink>
        )}

        {token && (
          <NavLink
            to="/settings"
            onClick={closeMenu}
          >
            Settings
          </NavLink>
        )}

        {!token && (
          <NavLink
            to="/register"
            onClick={closeMenu}
          >
            Create Account
          </NavLink>
        )}
      </div>
    </header>
  );
}

export default Navbar;