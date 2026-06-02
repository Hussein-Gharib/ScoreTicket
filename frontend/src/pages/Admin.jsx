import { useEffect, useState } from "react";
import api from "../api/axios";
import Button from "../components/common/Button";

function Admin() {
  const token = localStorage.getItem("token");

  const [teams, setTeams] = useState([]);
  const [stadiums, setStadiums] = useState([]);

  const [teamForm, setTeamForm] = useState({
    name: "",
    logo_url: "",
  });

  const [stadiumForm, setStadiumForm] = useState({
    name: "",
    city: "",
    capacity: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [teamsResponse, stadiumsResponse] = await Promise.all([
          api.get("/teams"),
          api.get("/stadiums"),
        ]);

        setTeams(teamsResponse.data.teams);
        setStadiums(stadiumsResponse.data.stadiums);
      } catch (error) {
        console.log("Failed to fetch admin data:", error);
      }
    };

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

      const response = await api.get("/teams");
      setTeams(response.data.teams);
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

      const response = await api.get("/stadiums");
      setStadiums(response.data.stadiums);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create stadium");
    }
  };

  return (
    <section className="admin-page">
      <div className="section-header">
        <span>Admin Panel</span>
        <h1>Manage ScoreTicket</h1>
        <p>Add teams, stadiums, matches, and ticket categories.</p>
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

          <form className="admin-form" onSubmit={handleCreateStadium}>
            <label>
              Stadium Name
              <input
                type="text"
                name="name"
                placeholder="Tottenham Hotspur Stadium"
                value={stadiumForm.name}
                onChange={handleStadiumChange}
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
              />
            </label>

            <Button type="submit">Add Stadium</Button>
          </form>
        </div>

        <div className="admin-card">
          <h2>Matches</h2>
          <p>Create upcoming football fixtures.</p>

          <div className="admin-preview">
            <p>Teams loaded: {teams.length}</p>
            <p>Stadiums loaded: {stadiums.length}</p>
          </div>
        </div>

        <div className="admin-card">
          <h2>Ticket Categories</h2>
          <p>Add Standard, Premium, and VIP ticket options.</p>
        </div>
      </div>
    </section>
  );
}

export default Admin;