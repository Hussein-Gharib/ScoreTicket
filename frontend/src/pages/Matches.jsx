import { useEffect, useState } from "react";
import { CalendarDays, MapPin, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/matches").then((response) => setMatches(response.data.matches || []))
      .catch(() => setError("Failed to load matches. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-state">Loading matches</div>;
  if (error) return <section className="empty-state"><div><h1>Something went wrong</h1><p>{error}</p></div></section>;

  return (
    <section className="page-shell matches-page">
      <div className="section-header"><span>Upcoming fixtures</span><h1>Choose your next match</h1><p>Discover elite football experiences and secure your place in the stadium.</p></div>
      {matches.length === 0 && <div className="empty-card"><h2>No matches available</h2><p>Upcoming matches will appear here soon.</p></div>}
      <div className="matches-grid">
        {matches.map((match) => (
          <article className="match-card" key={match.id}>
            <div className="match-card__top"><span className="match-card__league">{match.league}</span><span className="match-card__date"><CalendarDays size={15} />{new Date(match.match_date).toLocaleDateString()}</span></div>
            <div className="match-card__teams">
              <div>{match.home_team_logo ? <img src={match.home_team_logo} alt="" /> : <ShieldCheck />}<h2>{match.home_team}</h2></div>
              <span>VS</span>
              <div>{match.away_team_logo ? <img src={match.away_team_logo} alt="" /> : <ShieldCheck />}<h2>{match.away_team}</h2></div>
            </div>
            <p className="match-card__meta"><MapPin size={16} />{match.stadium_name} · {match.stadium_city}</p>
            <Link to={`/matches/${match.id}`} className="match-card__link">View Tickets <span>→</span></Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Matches;
