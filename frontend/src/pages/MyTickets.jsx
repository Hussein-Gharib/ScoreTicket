import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get("/orders/my-tickets", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTickets(response.data.tickets);
      } catch (error) {
        console.log("Failed to fetch tickets:", error);
        setPageError("Failed to load your tickets. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchTickets();
    } else {
      setLoading(false);
    }
  }, [token]);

  if (!token) {
    return (
      <section className="empty-state">
        <div>
          <h1>Please login first</h1>
          <p>You need an account to view your booked tickets.</p>
          <Link to="/login">Go to login</Link>
        </div>
      </section>
    );
  }

  if (loading) {
    return <div className="loading-state">Loading your tickets</div>;
  }

  if (pageError) {
    return (
      <section className="empty-state">
        <div>
          <h1>Something went wrong</h1>
          <p>{pageError}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="tickets-page">
      <div className="section-header">
        <span>Your bookings</span>
        <h1>My Tickets</h1>
        <p>All your booked football tickets in one place.</p>
      </div>

      {tickets.length === 0 && (
        <div className="empty-card">
          <h2>No tickets booked yet</h2>
          <p>Your booked tickets will appear here after your first order.</p>
        </div>
      )}

      <div className="tickets-grid">
        {tickets.map((ticket) => (
          <article className="user-ticket" key={ticket.id}>
            <div>
              <span className="user-ticket__status">{ticket.status}</span>
              <h2>
                {ticket.home_team} vs {ticket.away_team}
              </h2>
              <p>{ticket.league}</p>
            </div>

            <div className="user-ticket__meta">
              <p>{new Date(ticket.match_date).toLocaleString()}</p>
              <p>
                {ticket.stadium_name} · {ticket.stadium_city}
              </p>
            </div>

            <div className="user-ticket__code">{ticket.ticket_code}</div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default MyTickets;