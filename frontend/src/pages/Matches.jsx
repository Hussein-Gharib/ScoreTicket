import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await api.get("/matches");
        setMatches(response.data.matches);
      } catch (error) {
        console.log("Failed to fetch matches:", error);
        setError("Failed to load matches. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) {
    return <div className="loading-state">Loading matches</div>;
  }

  if (error) {
    return (
      <section className="empty-state">
        <div>
          <h1>Something went wrong</h1>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="matches-page">
      <div className="section-header">
        <span>Upcoming fixtures</span>
        <h1>Choose your next match</h1>
        <p>Browse football matches and book your ticket category.</p>
      </div>

      {matches.length === 0 && (
        <div className="empty-card">
          <h2>No matches available</h2>
          <p>Upcoming matches will appear here soon.</p>
        </div>
      )}

      <div className="matches-grid">
        {matches.map((match) => (
          <article className="match-card" key={match.id}>
            <div className="match-card__league">{match.league}</div>

            <div className="match-card__teams">
              <h2>{match.home_team}</h2>
              <span>vs</span>
              <h2>{match.away_team}</h2>
            </div>

            <p className="match-card__meta">
              {match.stadium_name} · {match.stadium_city}
            </p>

            <p className="match-card__date">
              {new Date(match.match_date).toLocaleString()}
            </p>

            <Link to={`/matches/${match.id}`} className="match-card__link">
              View Tickets
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Matches;