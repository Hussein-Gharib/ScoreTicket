import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronRight, Clock3, MapPin, ShieldCheck, Ticket, Trophy, Users } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function Home() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    api.get("/matches")
      .then((response) => setMatches(response.data.matches || []))
      .catch(() => setMatches([]));
  }, []);

  const featured = matches[0];
  const upcoming = useMemo(() => matches.slice(0, 4), [matches]);

  return (
    <div className="dashboard-page page-shell">
      <section className="dashboard-hero">
        <div>
          <span className="eyebrow">Live sports marketplace</span>
          <h1>Football nights.<br />Premium access.</h1>
          <p>Discover the biggest fixtures, compare ticket categories, and secure your place in the stadium.</p>
          <div className="hero-actions">
            <Link className="btn btn--primary" to="/matches">Explore matches <ChevronRight size={18} /></Link>
            <Link className="btn btn--ghost" to="/register">Create account</Link>
          </div>
        </div>

        <article className="hero-match glass-card">
          <div className="hero-match__head"><span>FEATURED MATCH</span><span className="live-dot">ON SALE</span></div>
          <div className="hero-match__teams">
            <div className="team-badge">{featured?.home_team_logo ? <img src={featured.home_team_logo} alt="" /> : <ShieldCheck />}</div>
            <div>
              <strong>{featured?.home_team || "Barcelona"}</strong>
              <span>VS</span>
              <strong>{featured?.away_team || "Real Madrid"}</strong>
            </div>
            <div className="team-badge">{featured?.away_team_logo ? <img src={featured.away_team_logo} alt="" /> : <ShieldCheck />}</div>
          </div>
          <div className="hero-match__meta">
            <span><CalendarDays size={16} />{featured ? new Date(featured.match_date).toLocaleDateString() : "24 Oct 2026"}</span>
            <span><MapPin size={16} />{featured?.stadium_name || "Camp Nou"}</span>
          </div>
          <Link to={featured ? `/matches/${featured.id}` : "/matches"} className="hero-match__cta">View tickets <ChevronRight size={18} /></Link>
        </article>
      </section>

      <section className="metric-grid">
        <article><Ticket /><div><strong>12K+</strong><span>Tickets delivered</span></div></article>
        <article><Users /><div><strong>8.4K</strong><span>Active supporters</span></div></article>
        <article><Trophy /><div><strong>18</strong><span>Top competitions</span></div></article>
        <article><Clock3 /><div><strong>24/7</strong><span>Digital access</span></div></article>
      </section>

      <section className="dashboard-section">
        <div className="section-title-row">
          <div><span className="eyebrow">Match schedule</span><h2>Upcoming fixtures</h2></div>
          <Link to="/matches">View all <ChevronRight size={17} /></Link>
        </div>

        <div className="schedule-list">
          {upcoming.length === 0 ? (
            <div className="empty-card"><h3>No matches available</h3><p>Add matches from the admin panel to see them here.</p></div>
          ) : upcoming.map((match) => (
            <Link to={`/matches/${match.id}`} className="schedule-row" key={match.id}>
              <div className="schedule-row__date"><strong>{new Date(match.match_date).getDate()}</strong><span>{new Date(match.match_date).toLocaleString("en", { month: "short" })}</span></div>
              <div className="schedule-row__league">{match.league}</div>
              <div className="schedule-row__teams"><strong>{match.home_team}</strong><span>vs</span><strong>{match.away_team}</strong></div>
              <div className="schedule-row__venue"><MapPin size={15} />{match.stadium_name}</div>
              <ChevronRight size={19} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
