import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import api from "../api/axios";

function Leagues() {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const response = await api.get("/leagues");
        setLeagues(response.data.leagues || []);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to load leagues"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLeagues();
  }, []);

  return (
    <main className="leagues-page">
      <section className="leagues-heading">
        <p className="leagues-eyebrow">COMPETITIONS</p>
        <h1>Leagues</h1>
        <p>Explore available football competitions and upcoming matches.</p>
      </section>

      <section className="leagues-content">
        {loading && (
          <div className="leagues-empty-state">
            <div className="leagues-empty-icon">
              <Trophy size={34} />
            </div>
            <h2>Loading leagues...</h2>
            <p>Please wait while we load the available competitions.</p>
          </div>
        )}

        {error && <div className="form-error">{error}</div>}

        {!loading && !error && leagues.length === 0 && (
          <div className="leagues-empty-state">
            <div className="leagues-empty-icon">
              <Trophy size={34} />
            </div>

            <h2>No leagues available yet</h2>
            <p>There are currently no leagues to display.</p>
          </div>
        )}

        {!loading && !error && leagues.length > 0 && (
          <div className="leagues-grid">
            {leagues.map((league) => (
              <article className="league-card" key={league.league}>
                <div className="league-card-icon">
                  <Trophy size={26} />
                </div>

                <div>
                  <h2>{league.league}</h2>
                  <p>
                    {league.match_count}{" "}
                    {league.match_count === 1 ? "match" : "matches"}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Leagues;