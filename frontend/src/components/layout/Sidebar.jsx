import {
  CalendarDays,
  CircleHelp,
  Settings,
  Ticket,
  Trophy,
  Zap,
} from "lucide-react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  const token = localStorage.getItem("token");

  return (
    <aside className="sidebar">
      <div className="sidebar__section-label">Quick access</div>

      <nav className="sidebar__nav">
        <NavLink to="/">
          <Zap size={19} />
          Dashboard
        </NavLink>

        <NavLink to="/matches">
          <CalendarDays size={19} />
          Upcoming
        </NavLink>

        {token && (
          <NavLink to="/my-tickets">
            <Ticket size={19} />
            My Tickets
          </NavLink>
        )}

        <NavLink to="/leagues">
          <Trophy size={19} />
          Leagues
        </NavLink>
      </nav>

      <div className="sidebar__footer">
        <NavLink to="/settings">
          <Settings size={18} />
          Settings
        </NavLink>

        <NavLink to="/support">
          <CircleHelp size={18} />
          Support
        </NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;