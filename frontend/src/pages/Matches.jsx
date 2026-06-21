import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Filter, MapPin, Search, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    api.get("/matches")
      .then((response) => setMatches(response.data.matches || []))
      .catch(() => setError("Failed to load matches. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => matches.filter((match) => {
    const text = `${match.home_team} ${match.away_team} ${match.league} ${match.stadium_name}`.toLowerCase();
    return text.includes(query.toLowerCase());
  }), [matches, query]);

  if (loading) return <div className="loading-state">Loading matches</div>;
  if (error) return <section className="empty-state"><div><h1>Something went wrong</h1><p>{error}</p></div></section>;

  return (
    <section className="page-shell matches-page">
      <div className="page-heading-row">
        <div><span className="eyebrow">Upcoming</span><h1>Match schedule</h1><p>Explore upcoming professional fixtures and secure your seats.</p></div>
        <button className="btn btn--ghost"><Filter size={17} /> Filter</button>
      </div>

      <div className="match-toolbar">
        <div className="search-field"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search teams, leagues or stadiums" /></div>
        <div className="match-toolbar__count">{filtered.length} fixtures</div>
      </div>

      {filtered.length === 0 && <div className="empty-card"><h2>No matches found</h2><p>Try another search or add fixtures from the admin panel.</p></div>}

      <div className="professional-match-grid">
        {filtered.map((match) => (
          <article className="professional-match-card" key={match.id}>
            <div className="professional-match-card__top">
              <span>{match.league}</span>
              <span><CalendarDays size={14} />{new Date(match.match_date).toLocaleDateString()}</span>
            </div>
            <div className="professional-match-card__teams">
              <div><span className="crest">{match.home_team_logo ? <img src={match.home_team_logo} alt="" /> : <ShieldCheck />}</span><strong>{match.home_team}</strong></div>
              <span className="versus">VS</span>
              <div><span className="crest">{match.away_team_logo ? <img src={match.away_team_logo} alt="" /> : <ShieldCheck />}</span><strong>{match.away_team}</strong></div>
            </div>
            <div className="professional-match-card__venue"><MapPin size={16} />{match.stadium_name} · {match.stadium_city}</div>
            <Link to={`/matches/${match.id}`} className="card-action">View ticket options <span>→</span></Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Matches;
