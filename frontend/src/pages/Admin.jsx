import { useEffect, useState } from "react";
import api from "../api/axios";
import Button from "../components/common/Button";

function Admin() {
  const token = localStorage.getItem("token");

  const [teams, setTeams] = useState([]);
  const [stadiums, setStadiums] = useState([]);
  const [matches, setMatches] = useState([]);
  const [deletingMatchId, setDeletingMatchId] = useState(null);

  const [teamForm, setTeamForm] = useState({
    name: "",
    logo_url: "",
  });

  const [stadiumForm, setStadiumForm] = useState({
    name: "",
    city: "",
    capacity: "",
  });

  const [matchForm, setMatchForm] = useState({
    home_team_id: "",
    away_team_id: "",
    stadium_id: "",
    league: "",
    match_date: "",
  });

  const [ticketCategoryForm, setTicketCategoryForm] = useState({
    match_id: "",
    name: "",
    price: "",
    total_quantity: "",
    available_quantity: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchAdminData = async () => {
    try {
      const [teamsResponse, stadiumsResponse, matchesResponse] =
        await Promise.all([
          api.get("/teams"),
          api.get("/stadiums"),
          api.get("/matches"),
        ]);

      setTeams(teamsResponse.data.teams || []);
      setStadiums(stadiumsResponse.data.stadiums || []);
      setMatches(matchesResponse.data.matches || []);
    } catch (error) {
      console.log("Failed to fetch admin data:", error);

      setError(
        error.response?.data?.message || "Failed to load admin information"
      );
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleTeamChange = (event) => {
    setTeamForm({
      ...teamForm,
      [event.target.name]: event.target.value,
    });
  };

  const handleStadiumChange = (event) => {
    setStadiumForm({
      ...stadiumForm,
      [event.target.name]: event.target.value,
    });
  };

  const handleMatchChange = (event) => {
    setMatchForm({
      ...matchForm,
      [event.target.name]: event.target.value,
    });
  };

  const handleTicketCategoryChange = (event) => {
    setTicketCategoryForm({
      ...ticketCategoryForm,
      [event.target.name]: event.target.value,
    });
  };

  const handleCreateTeam = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      await api.post("/teams", teamForm, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Team created successfully");

      setTeamForm({
        name: "",
        logo_url: "",
      });

      await fetchAdminData();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create team");
    }
  };

  const handleCreateStadium = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      await api.post(
        "/stadiums",
        {
          ...stadiumForm,
          capacity: Number(stadiumForm.capacity),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Stadium created successfully");

      setStadiumForm({
        name: "",
        city: "",
        capacity: "",
      });

      await fetchAdminData();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create stadium");
    }
  };

  const handleCreateMatch = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      await api.post(
        "/matches",
        {
          home_team_id: Number(matchForm.home_team_id),
          away_team_id: Number(matchForm.away_team_id),
          stadium_id: Number(matchForm.stadium_id),
          league: matchForm.league,
          match_date: matchForm.match_date,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Match created successfully");

      setMatchForm({
        home_team_id: "",
        away_team_id: "",
        stadium_id: "",
        league: "",
        match_date: "",
      });

      await fetchAdminData();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create match");
    }
  };

  const handleCreateTicketCategory = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      await api.post(
        "/ticket-categories",
        {
          match_id: Number(ticketCategoryForm.match_id),
          name: ticketCategoryForm.name,
          price: Number(ticketCategoryForm.price),
          total_quantity: Number(ticketCategoryForm.total_quantity),
          available_quantity: Number(
            ticketCategoryForm.available_quantity
          ),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Ticket category created successfully");

      setTicketCategoryForm({
        match_id: "",
        name: "",
        price: "",
        total_quantity: "",
        available_quantity: "",
      });
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to create ticket category"
      );
    }
  };

  const handleDeleteMatch = async (match) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove ${match.home_team} vs ${match.away_team}?\n\nAll ticket categories and booked tickets connected to this match will also be removed.`
    );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setError("");
    setDeletingMatchId(match.id);

    try {
      const response = await api.delete(`/matches/${match.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMatches((currentMatches) =>
        currentMatches.filter(
          (currentMatch) => currentMatch.id !== match.id
        )
      );

      if (
        Number(ticketCategoryForm.match_id) === Number(match.id)
      ) {
        setTicketCategoryForm({
          match_id: "",
          name: "",
          price: "",
          total_quantity: "",
          available_quantity: "",
        });
      }

      setMessage(
        response.data.message ||
          "Match and its related tickets were removed successfully"
      );
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to remove match"
      );
    } finally {
      setDeletingMatchId(null);
    }
  };

  const formatMatchDate = (date) => {
    if (!date) {
      return "No date";
    }

    return new Date(date).toLocaleString();
  };

  return (
    <section className="admin-page">
      <div className="section-header">
        <span>Admin Panel</span>
        <h1>Manage ScoreTicket</h1>
        <p>
          Add teams, stadiums, matches, ticket categories, and remove
          matches.
        </p>
      </div>

      {message && <div className="form-success">{message}</div>}
      {error && <div className="form-error">{error}</div>}

      <div className="admin-grid">
        <div className="admin-card">
          <h2>Add Team</h2>
          <p>Create a football team with a name and logo URL.</p>

          <form className="admin-form" onSubmit={handleCreateTeam}>
            <label>
              Team Name
              <input
                type="text"
                name="name"
                placeholder="Chelsea"
                value={teamForm.name}
                onChange={handleTeamChange}
                required
              />
            </label>

            <label>
              Logo URL
              <input
                type="text"
                name="logo_url"
                placeholder="https://example.com/logo.svg"
                value={teamForm.logo_url}
                onChange={handleTeamChange}
              />
            </label>

            <Button type="submit">Add Team</Button>
          </form>
        </div>

        <div className="admin-card">
          <h2>Add Stadium</h2>
          <p>Add stadium information and capacity.</p>

          <form
            className="admin-form"
            onSubmit={handleCreateStadium}
          >
            <label>
              Stadium Name
              <input
                type="text"
                name="name"
                placeholder="Tottenham Hotspur Stadium"
                value={stadiumForm.name}
                onChange={handleStadiumChange}
                required
              />
            </label>

            <label>
              City
              <input
                type="text"
                name="city"
                placeholder="London"
                value={stadiumForm.city}
                onChange={handleStadiumChange}
                required
              />
            </label>

            <label>
              Capacity
              <input
                type="number"
                name="capacity"
                placeholder="62850"
                value={stadiumForm.capacity}
                onChange={handleStadiumChange}
                min="1"
                required
              />
            </label>

            <Button type="submit">Add Stadium</Button>
          </form>
        </div>

        <div className="admin-card">
          <h2>Add Match</h2>
          <p>Create upcoming football fixtures.</p>

          <form className="admin-form" onSubmit={handleCreateMatch}>
            <label>
              Home Team
              <select
                name="home_team_id"
                value={matchForm.home_team_id}
                onChange={handleMatchChange}
                required
              >
                <option value="">Select home team</option>

                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Away Team
              <select
                name="away_team_id"
                value={matchForm.away_team_id}
                onChange={handleMatchChange}
                required
              >
                <option value="">Select away team</option>

                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Stadium
              <select
                name="stadium_id"
                value={matchForm.stadium_id}
                onChange={handleMatchChange}
                required
              >
                <option value="">Select stadium</option>

                {stadiums.map((stadium) => (
                  <option key={stadium.id} value={stadium.id}>
                    {stadium.name} - {stadium.city}
                  </option>
                ))}
              </select>
            </label>

            <label>
              League
              <input
                type="text"
                name="league"
                placeholder="Premier League"
                value={matchForm.league}
                onChange={handleMatchChange}
                required
              />
            </label>

            <label>
              Match Date
              <input
                type="datetime-local"
                name="match_date"
                value={matchForm.match_date}
                onChange={handleMatchChange}
                required
              />
            </label>

            <Button type="submit">Add Match</Button>
          </form>
        </div>

        <div className="admin-card">
          <h2>Add Ticket Category</h2>
          <p>Add Standard, Premium, and VIP ticket options.</p>

          <form
            className="admin-form"
            onSubmit={handleCreateTicketCategory}
          >
            <label>
              Match
              <select
                name="match_id"
                value={ticketCategoryForm.match_id}
                onChange={handleTicketCategoryChange}
                required
              >
                <option value="">Select match</option>

                {matches.map((match) => (
                  <option key={match.id} value={match.id}>
                    {match.home_team} vs {match.away_team}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Category Name
              <select
                name="name"
                value={ticketCategoryForm.name}
                onChange={handleTicketCategoryChange}
                required
              >
                <option value="">Select category</option>
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
                <option value="VIP">VIP</option>
                <option value="Away Fans">Away Fans</option>
                <option value="Family">Family</option>
              </select>
            </label>

            <label>
              Price
              <input
                type="number"
                name="price"
                placeholder="120"
                value={ticketCategoryForm.price}
                onChange={handleTicketCategoryChange}
                min="0"
                step="0.01"
                required
              />
            </label>

            <label>
              Total Quantity
              <input
                type="number"
                name="total_quantity"
                placeholder="100"
                value={ticketCategoryForm.total_quantity}
                onChange={handleTicketCategoryChange}
                min="1"
                required
              />
            </label>

            <label>
              Available Quantity
              <input
                type="number"
                name="available_quantity"
                placeholder="100"
                value={ticketCategoryForm.available_quantity}
                onChange={handleTicketCategoryChange}
                min="0"
                required
              />
            </label>

            <Button type="submit">Add Ticket Category</Button>
          </form>
        </div>
      </div>

      <div className="admin-card admin-matches-manager">
        <div className="admin-matches-header">
          <div>
            <h2>Manage Matches</h2>
            <p>
              Remove a match and all ticket information connected to it.
            </p>
          </div>

          <span className="admin-match-count">
            {matches.length} {matches.length === 1 ? "match" : "matches"}
          </span>
        </div>

        {matches.length === 0 ? (
          <div className="admin-empty-state">
            No matches are currently available.
          </div>
        ) : (
          <div className="admin-match-list">
            {matches.map((match) => (
              <div className="admin-match-item" key={match.id}>
                <div className="admin-match-teams">
                  <strong>
                    {match.home_team} vs {match.away_team}
                  </strong>

                  <span>{match.league}</span>
                </div>

                <div className="admin-match-information">
                  <span>
                    {match.stadium_name}
                    {match.stadium_city
                      ? `, ${match.stadium_city}`
                      : ""}
                  </span>

                  <span>{formatMatchDate(match.match_date)}</span>
                </div>

                <button
                  className="admin-delete-match-button"
                  type="button"
                  onClick={() => handleDeleteMatch(match)}
                  disabled={deletingMatchId === match.id}
                >
                  {deletingMatchId === match.id
                    ? "Removing..."
                    : "Remove Match"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Admin;